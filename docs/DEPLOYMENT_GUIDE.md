# Deployment Guide

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

Main pages:

- `/#/` Home
- `/#/auth` Login, signup, reset password, creator approval request
- `/#/elections` Public election directory
- `/#/results` Live results
- `/#/admin` Super Admin dashboard
- `/#/creator` Election Creator dashboard
- `/#/voter` Voter dashboard and voting
- `/#/security` Security and audit dashboard

## Build

```bash
npm run build
```

The production output is created in `dist`.

## GitHub Upload

```bash
git init
git add .
git commit -m "Complete secure election management system"
git branch -M main
git remote add origin https://github.com/your-username/secure-election-system.git
git push -u origin main
```

## Vercel Deployment

1. Go to Vercel.
2. Import the GitHub repository.
3. Select Vite as the framework.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

7. Click Deploy.

## Supabase Setup

1. Create Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Enable email verification.
4. Configure Auth redirect URL to your Vercel domain.
5. Create storage bucket for candidate photos.
6. Use Edge Functions for secret ID generation and email notifications.

## Current Supabase Integration

The frontend reads Supabase credentials from `.env.local` or Vercel environment variables.

Implemented live calls:

- Signup through Supabase Auth
- Login through Supabase Auth
- Forgot password through Supabase Auth
- Creator request insert through Supabase REST when a user is logged in

The remaining election demo data still works locally, so the website runs even while Supabase tables or Auth settings are being configured.
