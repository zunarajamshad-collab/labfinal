# Presentation Script

## 1. Introduction

Assalam o Alaikum. Our project is SecureVote, a Secure Online Election Management System. It is designed for universities, societies, organizations, and communities that need transparent and controlled online elections.

## 2. Problem Statement

Manual elections can be slow, difficult to audit, and vulnerable to duplicate voting. Our system solves this by using authenticated users, approved election creators, locked voter lists, secret voter IDs, anonymous voting, live counting, and audit logs.

## 3. Technology Stack

The frontend is built with React and Vite. The backend design uses Supabase for authentication, database, row-level security, and storage. The project is ready for deployment on Vercel.

## 4. Main Roles

There are three main roles:

- Super Admin
- Election Creator
- Voter

The Super Admin approves creators and monitors logs. The Election Creator creates elections and manages candidates. The Voter joins elections and votes using a secret ID.

## 5. Demo Flow

First, we show the public landing page. It lists active, upcoming, and completed elections. Users can search and filter elections.

Next, we show authentication. Users can sign up, log in, reset password, and select their role.

Then, we show the Admin Dashboard. The admin can approve or reject election creator requests and provide rejection reasons.

After that, we show the Creator Dashboard. The creator can create an election, set voter limits, set deadlines, add candidates, publish the election, finalize voters, and start or stop voting.

Then, we show the Voter flow. A voter accepts terms, joins an election, receives a secret voter ID, and casts a single anonymous vote.

Finally, we show live results, turnout percentage, winner summary, notification queue, and audit logs.

## 6. Security

The security design includes Supabase Auth, email verification, role-based access control, RLS policies, duplicate-vote prevention, audit logs, and anonymous voting. Secret IDs should be generated on the backend and stored as hashes.

## 7. Conclusion

SecureVote demonstrates frontend development, backend design, authentication, database security, and deployment readiness. It is a complete academic project foundation for a real-world online election system.
