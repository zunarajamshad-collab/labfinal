-- Demo seed template.
-- Replace UUIDs with real auth user IDs from Supabase Auth before running.

insert into public.profiles (id, full_name, phone, role, organization)
values
  ('00000000-0000-0000-0000-000000000001', 'Super Admin', '+1 555 0100', 'super_admin', 'SecureVote Platform'),
  ('00000000-0000-0000-0000-000000000002', 'Election Creator', '+1 555 0101', 'election_creator', 'North Valley University'),
  ('00000000-0000-0000-0000-000000000003', 'Demo Voter', '+1 555 0102', 'voter', 'North Valley University');

insert into public.creator_requests (
  user_id,
  purpose,
  organization,
  email,
  phone,
  status,
  reviewed_by,
  reviewed_at
)
values (
  '00000000-0000-0000-0000-000000000002',
  'Run secure student senate elections for verified university students.',
  'North Valley University',
  'creator@nvuni.edu',
  '+1 555 0101',
  'approved',
  '00000000-0000-0000-0000-000000000001',
  now()
);

insert into public.elections (
  id,
  creator_id,
  title,
  description,
  category,
  max_voters,
  registration_deadline,
  starts_at,
  ends_at,
  status,
  is_voter_list_locked
)
values (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'Student Senate Election 2026',
  'Choose student representatives for academic affairs, clubs, and welfare initiatives.',
  'Campus',
  1000,
  now() + interval '2 days',
  now() + interval '3 days',
  now() + interval '3 days 8 hours',
  'upcoming',
  false
);

insert into public.candidates (election_id, name, designation, manifesto)
values
  ('10000000-0000-0000-0000-000000000001', 'Amina Shah', 'Computer Science', 'Transparent budgeting and better lab access.'),
  ('10000000-0000-0000-0000-000000000001', 'Daniel Reed', 'Business School', 'More student events and mental health support.');

insert into public.audit_logs (actor_id, action, entity_type, entity_id)
values
  ('00000000-0000-0000-0000-000000000001', 'Approved creator request', 'creator_request', null),
  ('00000000-0000-0000-0000-000000000002', 'Created demo election', 'election', '10000000-0000-0000-0000-000000000001');
