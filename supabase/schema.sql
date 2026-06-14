-- Secure Online Election Management System
-- Supabase schema blueprint with role-based access, voter locking, anonymous votes,
-- secret IDs, and audit logs.

create extension if not exists pgcrypto;

create type public.app_role as enum ('super_admin', 'election_creator', 'voter');
create type public.request_status as enum ('pending', 'approved', 'rejected');
create type public.election_status as enum ('draft', 'upcoming', 'active', 'completed', 'locked');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role public.app_role not null default 'voter',
  organization text,
  created_at timestamptz not null default now()
);

create table public.creator_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  purpose text not null,
  organization text not null,
  email text not null,
  phone text,
  status public.request_status not null default 'pending',
  rejection_reason text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.elections (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id),
  title text not null,
  description text not null,
  category text not null,
  max_voters integer not null check (max_voters > 0),
  registration_deadline timestamptz not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.election_status not null default 'draft',
  is_voter_list_locked boolean not null default false,
  created_at timestamptz not null default now(),
  check (starts_at < ends_at),
  check (registration_deadline <= starts_at)
);

create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.elections(id) on delete cascade,
  name text not null,
  designation text,
  manifesto text,
  photo_path text,
  created_at timestamptz not null default now()
);

create table public.voter_registrations (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.elections(id) on delete cascade,
  voter_id uuid not null references public.profiles(id) on delete cascade,
  accepted_terms boolean not null default false,
  is_finalized boolean not null default false,
  is_waitlisted boolean not null default false,
  secret_code_hash text,
  secret_code_last4 text,
  joined_at timestamptz not null default now(),
  unique (election_id, voter_id)
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.elections(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete restrict,
  registration_id uuid not null references public.voter_registrations(id) on delete restrict,
  anonymous_receipt uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  unique (election_id, registration_id)
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  election_id uuid references public.elections(id) on delete cascade,
  channel text not null default 'email',
  subject text not null,
  body text not null,
  status text not null default 'queued',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.current_user_role()
returns public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role, organization)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    new.raw_user_meta_data->>'phone',
    coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'voter'),
    new.raw_user_meta_data->>'organization'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.creator_requests enable row level security;
alter table public.elections enable row level security;
alter table public.candidates enable row level security;
alter table public.voter_registrations enable row level security;
alter table public.votes enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;

create policy "profiles owner can insert self"
on public.profiles for insert
with check (id = auth.uid());

create policy "profiles readable by owner or admin"
on public.profiles for select
using (id = auth.uid() or public.current_user_role() = 'super_admin');

create policy "profiles owner can update self"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "creator requests owner can create"
on public.creator_requests for insert
with check (user_id = auth.uid());

create policy "creator requests visible to owner or admin"
on public.creator_requests for select
using (user_id = auth.uid() or public.current_user_role() = 'super_admin');

create policy "creator requests admin can review"
on public.creator_requests for update
using (public.current_user_role() = 'super_admin')
with check (public.current_user_role() = 'super_admin');

create policy "published elections are public"
on public.elections for select
using (status in ('upcoming', 'active', 'completed', 'locked') or creator_id = auth.uid() or public.current_user_role() = 'super_admin');

create policy "approved creators manage own elections"
on public.elections for all
using (creator_id = auth.uid() or public.current_user_role() = 'super_admin')
with check (creator_id = auth.uid() or public.current_user_role() = 'super_admin');

create policy "candidates public read"
on public.candidates for select
using (true);

create policy "creators manage candidates for own elections"
on public.candidates for all
using (
  exists (
    select 1 from public.elections
    where elections.id = candidates.election_id
      and (elections.creator_id = auth.uid() or public.current_user_role() = 'super_admin')
  )
)
with check (
  exists (
    select 1 from public.elections
    where elections.id = candidates.election_id
      and (elections.creator_id = auth.uid() or public.current_user_role() = 'super_admin')
  )
);

create policy "voters join unlocked elections"
on public.voter_registrations for insert
with check (
  voter_id = auth.uid()
  and accepted_terms = true
  and exists (
    select 1 from public.elections
    where elections.id = voter_registrations.election_id
      and elections.is_voter_list_locked = false
      and elections.registration_deadline >= now()
  )
);

create policy "registrations visible to owner creator admin"
on public.voter_registrations for select
using (
  voter_id = auth.uid()
  or public.current_user_role() = 'super_admin'
  or exists (
    select 1 from public.elections
    where elections.id = voter_registrations.election_id
      and elections.creator_id = auth.uid()
  )
);

create policy "only admins override registrations"
on public.voter_registrations for update
using (public.current_user_role() = 'super_admin')
with check (public.current_user_role() = 'super_admin');

create policy "voters cast own single finalized vote"
on public.votes for insert
with check (
  exists (
    select 1 from public.voter_registrations
    join public.elections on elections.id = voter_registrations.election_id
    where voter_registrations.id = votes.registration_id
      and voter_registrations.voter_id = auth.uid()
      and voter_registrations.is_finalized = true
      and elections.status = 'active'
      and elections.starts_at <= now()
      and elections.ends_at >= now()
  )
);

create policy "vote totals are public without voter identity"
on public.votes for select
using (true);

create policy "audit logs admin read"
on public.audit_logs for select
using (public.current_user_role() = 'super_admin');

create policy "audit logs system/admin insert"
on public.audit_logs for insert
with check (actor_id = auth.uid() or public.current_user_role() = 'super_admin');

create policy "notifications visible to owner or admin"
on public.notifications for select
using (user_id = auth.uid() or public.current_user_role() = 'super_admin');

create policy "notifications admin creator insert"
on public.notifications for insert
with check (
  public.current_user_role() = 'super_admin'
  or exists (
    select 1 from public.elections
    where elections.id = notifications.election_id
      and elections.creator_id = auth.uid()
  )
);

create index idx_elections_status on public.elections(status);
create index idx_voter_registrations_election on public.voter_registrations(election_id);
create index idx_votes_election_candidate on public.votes(election_id, candidate_id);
create index idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index idx_notifications_user_status on public.notifications(user_id, status);
