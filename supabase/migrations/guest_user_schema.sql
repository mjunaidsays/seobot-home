/**
 * GUEST_USERS TABLE
 *
 * - Stores anonymous visitors with UTM attribution (no email/name required)
 * - Later upgraded with name + email when they submit the Try Now form
 * - Not Supabase Auth users (no row in auth.users required)
 */
create table if not exists public.guest_users (
  id uuid primary key default gen_random_uuid(),

  -- Optional identity fields (null for anonymous visitors)
  email text,
  full_name text,

  -- High-level source tag for internal use (e.g. 'anonymous_visit', 'try_now_modal_lead')
  source text,

  -- Optional link to a real Supabase auth user if/when the guest converts
  converted_user_id uuid references auth.users(id),

  -- Basic timestamps
  created_at timestamp with time zone
    default timezone('utc'::text, now()) not null,
  last_seen_at timestamp with time zone
    default timezone('utc'::text, now()) not null,

  -- Anonymous attribution fields (may be null if not available)
  utm_source text,
  utm_medium text,
  utm_campaign text,
  landing_page text,
  referrer text
);

-- Enable Row Level Security
alter table public.guest_users enable row level security;

-- Allow anonymous clients (anon key) to INSERT anonymous visitors
create policy "Allow anon insert on guest_users"
  on public.guest_users
  for insert
  to anon
  with check (true);

-- Allow anonymous clients to UPDATE existing guest rows
-- (used when an anonymous visitor later submits name/email)
create policy "Allow anon update on guest_users"
  on public.guest_users
  for update
  to anon
  using (true)
  with check (true);

comment on table public.guest_users is
  'Leads from Try Now modal and anonymous visitors with UTM attribution; not Supabase Auth users.';