-- Drop dead columns (never populated by application code)
ALTER TABLE public.guest_users DROP COLUMN IF EXISTS full_name;
ALTER TABLE public.guest_users DROP COLUMN IF EXISTS converted_user_id;

-- Add missing UTM fields (already captured in seobot_attr cookie but never written to DB)
ALTER TABLE public.guest_users ADD COLUMN IF NOT EXISTS utm_term text;
ALTER TABLE public.guest_users ADD COLUMN IF NOT EXISTS utm_content text;

-- Indexes for dashboard/reporting queries
CREATE INDEX IF NOT EXISTS idx_guest_users_email
  ON public.guest_users (email) WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_guest_users_created_at
  ON public.guest_users (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_guest_users_source_lead
  ON public.guest_users (source) WHERE source = 'landing_page_cta_lead';

CREATE INDEX IF NOT EXISTS idx_guest_users_utm
  ON public.guest_users (utm_source, utm_campaign) WHERE utm_source IS NOT NULL;
