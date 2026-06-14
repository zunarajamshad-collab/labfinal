# Supabase Setup

This folder contains the database plan for the Secure Online Election Management System.

## Files

- `schema.sql`: tables, enums, indexes, and row-level security policies.
- `seed.sql`: sample data placeholders for demo setup.

## Setup Steps

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `schema.sql`.
4. Create users through Supabase Auth.
5. Insert demo data using `seed.sql` after replacing placeholder UUID values.
6. Add environment variables in `.env`:

```text
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Security Notes

- Enable email verification in Supabase Auth settings.
- Keep service role keys out of frontend code.
- Use Edge Functions for secret ID generation and emails.
- Store only hashed secret IDs in the database.
- Keep voter identity separate from anonymous vote display.
