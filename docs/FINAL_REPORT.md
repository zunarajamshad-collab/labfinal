# Secure Online Election Management System - Final Report

## Project Overview

SecureVote is a full-stack-ready online election management system built with React and designed for Supabase. It allows election creators to request approval, create polls, manage candidates, finalize voters, generate secret IDs, and run anonymous one-vote elections. Voters can register for elections, receive masked secret IDs, cast a vote during the active window, and view transparent live results.

## Objectives

- Build a responsive election platform using React.
- Design a Supabase database with authentication, roles, and row-level security.
- Prevent duplicate registrations and duplicate voting.
- Support anonymous voting while keeping auditability.
- Provide admin, creator, and voter dashboards.
- Prepare the project for GitHub and Vercel deployment.

## User Roles

### Super Admin

- Reviews election creator requests.
- Approves or rejects creators.
- Adds rejection reasons.
- Monitors activity logs.
- Reviews platform-wide election analytics.

### Election Creator

- Creates elections.
- Sets category, schedule, registration deadline, and voter limit.
- Adds and removes candidates.
- Publishes elections.
- Finalizes voters and starts/stops elections.

### Voter

- Registers or logs in.
- Joins elections during registration windows.
- Accepts terms and eligibility.
- Receives a masked secret voter ID.
- Casts one anonymous vote.
- Views live and final results.

## Core Features

- Role-based dashboard experience.
- Election directory with active, upcoming, and completed filters.
- Voter capacity tracking.
- Waitlist handling for full elections.
- Secret ID validation.
- Anonymous voting.
- Live vote counting and turnout.
- Audit logs.
- Notification queue.
- Supabase RLS schema.

## Security Design

- Supabase Auth handles login, signup, verification, and password reset.
- `profiles.role` controls dashboard access.
- RLS policies restrict reads and writes by role.
- Votes are linked to finalized registrations but public display does not expose voter identity.
- Unique constraints prevent duplicate registration and duplicate voting.
- Secret IDs should be generated in backend functions and stored only as hashes.
- Admin overrides are recorded in audit logs.

## Database Tables

- `profiles`
- `creator_requests`
- `elections`
- `candidates`
- `voter_registrations`
- `votes`
- `audit_logs`
- `notifications`

## Deployment

The frontend is a Vite React app and can be deployed to Vercel. The repository includes `vercel.json` and `.env.example`. Supabase credentials should be configured as Vercel environment variables.

## Conclusion

This project demonstrates modern frontend development, election workflow design, authentication planning, database modeling, RLS security, auditability, and deployment readiness for a real-world secure election management platform.
