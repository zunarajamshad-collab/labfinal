# Module-wise Requirement Coverage

## 1. Authentication Module

- Signup form with name, email, phone, password, and role.
- Login form.
- Forgot/reset password simulation.
- Email verification notification simulation.
- Role-based dashboard switching for Super Admin, Election Creator, and Voter.
- Protected-route behavior represented through separated dashboard sections.
- Optional 2FA listed as bonus-ready security card.
- Optional 2FA checkbox is included in the signup form.

## 2. Admin Approval Module

- Admin can view creator requests.
- Admin can review purpose, email, phone, and organization.
- Admin can approve or reject.
- Rejection reason input is included.
- Approval/rejection notifications are queued.
- Activity logs are shown in the audit dashboard.
- Audit CSV download button is implemented.

## 3. Election Creation Module

- Creator can create a new election.
- Title, description, category, start date/time, end date/time, registration deadline, and max voters are included.
- Publish, start, stop, and finalization controls are available.
- Multiple elections are displayed on the public landing page.

## 4. Candidate Management Module

- Creator can add candidate/member name, designation, and manifesto.
- Candidate list is visible.
- Candidate delete action is included.
- Candidate photo path is supported in Supabase schema through `photo_path`.

## 5. Public Landing Page Module

- Shows upcoming, active, and completed elections.
- Shows details, remaining dates, voter count, and vote count.
- Search and status filters are included.
- Responsive CSS supports desktop and mobile screens.

## 6. Voter Registration Module

- Voter can join an election.
- "I Want to Participate" button exists.
- Terms acceptance checkbox exists.
- Duplicate registration is prevented in the UI state.
- Waitlist simulation exists when an election is full or locked.

## 7. Voter Locking / Finalization Module

- Election cards show locked state.
- Creator can finalize voters.
- Final voter list lock is represented by `locked` and schema field `is_voter_list_locked`.
- Admin override is represented in admin panels and audit logs.

## 8. Secret ID Generation Module

- Secret ID is shown as a per-poll code in the demo.
- UI masks secret ID as `****7821`.
- Finalization queues secret ID email notifications.
- Supabase schema stores `secret_code_hash` and `secret_code_last4`.

## 9. Voting Module

- Voting is enabled for active elections.
- Secret ID validation is required.
- One voter equals one vote in UI state.
- Supabase schema enforces unique vote per registration.
- Vote confirmation message is shown.

## 10. Live Results Module

- Candidate-wise live results are displayed.
- Progress bars are included.
- Winner summary and turnout percentage are included.
- Final result lock is represented for completed elections.
- Result CSV download and PDF print are implemented.

## 11. Audit & Transparency Module

- Login, vote, approval, edit, security, lock, and registration actions are logged.
- Logs include actor, action, type, and time.
- Admin override logging is included in the dashboard concept.
- Download logs are listed as a dashboard capability.
- Audit CSV download is implemented.

## 12. Notification Module

- Email verification notification.
- Approval/rejection emails.
- Secret ID email queue.
- Election start reminder.
- Election end notification.
- Winner/result notification is documented for backend integration.

## 13. Security Module

- Supabase RLS schema is included.
- Duplicate-vote prevention through unique constraints.
- Separate voter registration and vote tables support anonymous voting.
- Input validation, CAPTCHA, rate limiting, encrypted secrets, and secure APIs are documented.
- CAPTCHA/rate-limit demo check is implemented before voter registration.

## 14. Dashboard Module

- Admin Dashboard: total elections, active elections, pending requests, approval management.
- Creator Dashboard: my elections, election creation, candidate management, start/stop/finalize controls.
- Voter Dashboard: joined polls, secret ID mask, status, waitlist, receipt.

## 15. Deployment Module

- Vite build is configured.
- `vercel.json` is included.
- `.env.example` is included.
- README includes GitHub and Vercel deployment steps.
- PWA manifest and service worker are included.

## Bonus Features

- Dark mode toggle.
- QR invite link preview and copy action.
- Download result CSV.
- Print result PDF.
- Waitlist system.
- PWA/mobile support through manifest and service worker.
