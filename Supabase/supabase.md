# Supabase Integration Plan — EVISA PORTAL

## Usage

- **Database:** All applicant data, visa forms, status, documents, officer users
- **Auth:** Supabase Auth for users and officers (email/password, social possible)
- **Storage:** For uploaded passport/docs (replace with S3 in prod if required)

## Setup

1. In [Supabase dashboard](https://app.supabase.com):
    - Create "visa_applications", "users", "officers", "documents", "audit_logs" tables.
    - Enable Auth: email sign-up, email confirm required
    - Enable storage for "documents", "digital_visa" (PDF/QR)

2. Copy keys to `.env` per root example

3. From Next.js frontend, call `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()` for Auth, and use Supabase client for most CRUD.

4. Backend services read/write via service role.

5. Schema Example:

```sql
-- Table: visa_applications
CREATE TABLE visa_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  passport_number text,
  first_name text,
  last_name text,
  email text,
  country text,
  status text,
  doc_urls text[],
  payment_status text
);

-- Table: users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text,
  name text,
  role text
);

-- Storage: documents

-- Table: audit_logs
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  who text,
  what text,
  when timestamp with time zone
);

```
