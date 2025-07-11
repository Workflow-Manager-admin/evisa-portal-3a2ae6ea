-- PUBLIC_INTERFACE
-- Supabase schema for Fiji eVisa portal

-- User profiles (one-to-one with auth.users via user_id)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  nationality text,
  passport_number text unique,
  phone text,
  language_preference text default 'en',
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- eVisa applications table
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  application_status text not null default 'draft', -- e.g., draft, submitted, under_review, approved, rejected
  passport_number text, -- redundant for quick reference/lookup
  visa_type text not null, -- e.g., tourist, business, transit
  submission_date timestamp with time zone,
  last_updated timestamp with time zone default timezone('utc', now()),
  supporting_docs jsonb, -- URL list or metadata of uploaded docs
  payment_status text default 'unpaid',
  decision_reason text,
  qr_code_url text,
  -- Add more fields as necessary (arrival date, etc)
  constraint fk_user
    foreign key(user_id)
      references profiles(id)
      on delete set null
);

-- Indexes for quick lookup
create index if not exists idx_profiles_passport on profiles(passport_number);
create index if not exists idx_applications_user on applications(user_id);

-- PUBLIC_INTERFACE END
