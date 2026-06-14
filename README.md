# Secure Online Election Management System

A React + Vite semester project prototype for a secure online election platform. The app demonstrates the public election landing page, role-based dashboards, creator approval, voter registration, voter locking, secret ID voting, live results, audit logs, and a Supabase-ready database design.

## Live Deployment

🚀 **Live Link:** [https://secure-election-system.vercel.app](https://secure-election-system.vercel.app)

## Tech Stack

- React 19 with Vite
- Plain CSS responsive UI
- Supabase-ready schema in `supabase/schema.sql`
- Designed for Vercel deployment

## Implemented Frontend Modules

- Website-style pages using hash routes: `#/`, `#/auth`, `#/elections`, `#/results`, `#/admin`, `#/creator`, `#/voter`, `#/security`
- Authentication flow placeholders for Super Admin, Election Creator, and Voter roles
- Signup, login, forgot password, email verification, protected-session simulation
- Admin approval dashboard with approve/reject request actions
- Rejection reason capture and notification queue
- Election directory with upcoming, active, and completed filters
- Election creation form with category, dates, deadline, max voters, and publish/start/stop controls
- Candidate add/delete management with manifesto details
- Voter opt-in with consent and duplicate-join prevention
- Full-election waitlist simulation
- Locked voter list indicators
- Voter finalization and secret ID generation queue
- Secret voter ID validation and masked ID display per poll
- Anonymous single-vote flow
- Live candidate-wise results with turnout and winner summary
- Audit and transparency dashboard
- Email notification module for verification, approval, rejection, secret ID, reminders, and results
- Security checklist aligned with Supabase RLS
- Dark mode, QR invite link, waitlist, CSV downloads, result PDF print, and PWA support
- Supabase REST helper that activates when `.env` keys are configured
- Live Supabase Auth calls for signup, login, and password reset
- Creator request insert through Supabase REST after login

## Supabase Backend Plan

The database blueprint is available at:

```text
supabase/schema.sql
```

It includes:

- `profiles` with role-based access
- `creator_requests`
- `elections`
- `candidates`
- `voter_registrations`
- `votes`
- `audit_logs`
- `notifications`
- RLS policies for public results, admin review, creator ownership, voter registration, and single anonymous voting

## Documentation

- `docs/MODULE_REQUIREMENTS.md`: requirement-by-requirement coverage
- `docs/PROJECT_COMPLETION_CHECKLIST.md`: final completion checklist
- `docs/FINAL_REPORT.md`: report text for submission
- `docs/PRESENTATION_SCRIPT.md`: demo script
- `docs/DEPLOYMENT_GUIDE.md`: GitHub, Vercel, and Supabase setup

## Local Development

Install dependencies and run the app:

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

## Deployment Notes

For Vercel:

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Set environment variables for Supabase when backend integration is added:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy the Vite project.

## Suggested Production Enhancements

- Add Supabase Auth UI and protected routes
- Implement edge functions for secret ID generation and email notifications
- Store candidate photos in Supabase Storage
- Add CAPTCHA and request throttling
- Add Recharts or Chart.js for richer visual analytics
- Add PDF result export and QR invite links
