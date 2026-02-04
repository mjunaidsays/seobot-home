## SEObot – Full Setup Guide (From Zero to Running)

This guide walks you through **every step** needed to get this project running, even if you are **not technical**.  
Follow the sections in order: create accounts, copy keys, paste them into the project, set up the database, and finally run the site.

---

### What this project is

- **SEObot landing & app shell** built with `Next.js 14` and `TypeScript`
- Uses **Supabase** for authentication and database
- Uses **OpenRouter (OpenAI-compatible)** for AI-powered SEO research and content planning
- Tracks marketing performance with:
  - **PostHog** (product analytics)
  - **Meta Pixel + Conversions API** (Facebook/Instagram ads)
  - **Google Ads conversions** (lead and complete-registration events)
- Includes optional plumbing for:
  - **Stripe** (subscriptions/billing)
  - **Resend** (transactional email)

You do **not** need to write code to follow this guide. You will mostly:
- Create a few online accounts (Supabase, PostHog, Meta, Google Ads, etc.)
- Copy keys from their dashboards
- Paste them into a `.env.local` file
- Run a couple of terminal commands

---

## 1. Prerequisites

- **Git** installed  
  - Download from `[https://git-scm.com](https://git-scm.com)` and follow the installer.

- **Node.js** (version **20.11.1 or higher** recommended)  
  - Download from `[https://nodejs.org](https://nodejs.org)` (LTS is fine).

- **npm** (comes with Node)  
  - You can check it by running `node -v` and `npm -v` in your terminal.

- A free account for each service (you can use the same email for all):
  - **Supabase**: `[https://supabase.com](https://supabase.com)`
  - **OpenRouter** (AI): `[https://openrouter.ai](https://openrouter.ai)`
  - **PostHog**: `[https://posthog.com](https://posthog.com)`
  - **Meta Business / Events Manager** (for Meta Pixel): `[https://business.facebook.com](https://business.facebook.com)`
  - **Google Ads**: `[https://ads.google.com](https://ads.google.com)`
  - (Optional) **Stripe**: `[https://dashboard.stripe.com](https://dashboard.stripe.com)`
  - (Optional) **Resend** (email): `[https://resend.com](https://resend.com)`

---

## 2. Get the code and install dependencies

1. **Clone the repository**

   Open a terminal (Command Prompt, PowerShell, or any terminal app), then run:

   ```bash
   git clone <YOUR_REPO_URL>
   cd seobot_landingpage
   ```

   Replace `<YOUR_REPO_URL>` with the actual Git URL of this repo (e.g. from GitHub).

2. **Install dependencies (packages)**

   In the project folder:

   ```bash
   npm install
   ```

   This may take a few minutes the first time. It downloads everything the app needs.

---

## 3. Configure environment variables (.env.local)

Environment variables are just **settings stored in a text file**.  
They tell the app “which keys to use” for Supabase, PostHog, Meta, Google Ads, etc.

1. **Create the file from the template**

   In the project root you already have a file called `.env.local.example`.

   - Make a copy and rename it to `.env.local` (exact name, no `.example` at the end).
   - On Windows you can do this from File Explorer:
     - Right-click `.env.local.example` → Copy → Paste
     - Rename the copy to `.env.local`

2. **Open `.env.local` in your editor**  
   You will see placeholders like:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=xxxx_xxxx
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx_xxxx
   SUPABASE_SERVICE_ROLE_KEY=xxxx_xxxx
   SUPABASE_PROJECT_REF=xxxx_xxxx
   SUPABASE_DB_PASSWORD=xxxx_xxxx
   ...
   ```

3. **You will fill these values in the next sections**:

- **Supabase** → all `SUPABASE_*` and `NEXT_PUBLIC_SUPABASE_*`
- **AI (OpenRouter)** → `NEXT_PUBLIC_OPENROUTER_API_KEY` (we’ll add this line)
- **PostHog** → `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- **Meta Pixel & Conversions API** → `NEXT_PUBLIC_FB_PIXEL_ID`, `FB_CONVERSIONS_API_TOKEN` (or `FB_CAPI_ACCESS_TOKEN`), and optional test code
- **Google Ads** → `GOOGLE_ADS_ID` and conversion labels
- **Stripe / Resend** → optional (used only if you later wire up payments/emails)
- **Site URL** → `NEXT_PUBLIC_SITE_URL`

Keep the `.env.local` file **private** – do not commit it to Git or share it publicly.

---

## 4. Supabase: project, keys, and database

SEObot uses **Supabase** for authentication and as the main database.

### 4.1 Create a Supabase project

1. Go to `[https://supabase.com](https://supabase.com)` and click **Sign in** or **Start project**.
2. Create a **new project**:
   - Choose an organization (or create one).
   - Set a **Project name** (e.g. “SEObot”).
   - Choose a **database password**.  
     - **Save this password** somewhere safe – you will need it for `SUPABASE_DB_PASSWORD`.
3. Wait for Supabase to finish creating the project (it may take a minute or two).

### 4.2 Get Supabase API keys

In the Supabase dashboard for your project:

1. Go to **Settings → API**.
2. Find the section **Project URL** and **Anon public key**, **Service role key**.
3. Copy and paste into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL            # e.g. https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY    # "anon" key
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY       # service_role key (keep secret)
```

4. Also get the **Project reference** from the same page and your **DB password** from when you created the project:

```env
SUPABASE_PROJECT_REF=your-project-ref     # e.g. abcd1234
SUPABASE_DB_PASSWORD=your_db_password    # the password you set when creating the project
```

> These last two are mainly used for **local Supabase CLI** commands; you can still run the app without them, but it’s best to set them correctly.

### 4.3 Run the Supabase SQL migrations (database tables)

Now we need to create the actual tables (users, projects, articles, guest_users, Stripe tables, etc.).

You can do this **entirely from the Supabase web UI**, no terminal needed:

1. In your Supabase project, go to **SQL Editor**.
2. For each of these files in the repo (`supabase/migrations/...`), do the following:

   - `supabase/migrations/20230530034630_init.sql`
   - `supabase/migrations/20250101000000_seobot_schema.sql`
   - `supabase/migrations/guest_user_schema.sql`

   Steps:
   - Open the file in your code editor.
   - Select **all** its contents and **copy**.
   - In Supabase SQL Editor, click **New query**, **paste** the SQL, then click **Run**.
   - Confirm it runs successfully (no red error messages).

Do this once per project. After that, your Supabase database is ready.

### 4.4 (Optional) Local Supabase via Docker / CLI

If you (or a developer) want a **local Supabase instance**:

1. Install Docker and the Supabase CLI (`npm install -g supabase` or follow Supabase docs).
2. Ensure `.env.local` has `SUPABASE_PROJECT_REF` and `SUPABASE_DB_PASSWORD` set.
3. Run:

   ```bash
   npm run supabase:link   # runs node supabase/link.js to link CLI to your project
   npm run supabase:start  # starts a local Supabase instance using Docker
   npm run supabase:migrate
   ```

For non-technical users, you can skip this and simply use the **hosted Supabase** as described above.

---

## 5. AI provider: OpenRouter API key

The app uses `utils/openai/client.ts`, which is configured to call **OpenRouter** (an OpenAI-compatible API gateway), not the raw `OPENAI_API_KEY`.

### 5.1 Create an OpenRouter account and API key

1. Go to `[https://openrouter.ai](https://openrouter.ai)` and sign up.
2. In your OpenRouter dashboard, go to **API Keys**.
3. Create a new **API key**.
4. Copy it.

### 5.2 Add it to `.env.local`

In `.env.local`, add (or update) this line:

```env
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key
```

> The older `OPENAI_API_KEY` variable from `.env.local.example` is **not used** by the current code.  
> The important variable is **`NEXT_PUBLIC_OPENROUTER_API_KEY`**.

---

## 6. PostHog analytics setup

PostHog is used for product analytics and event tracking (page views, events from the UI).

### 6.1 Create a PostHog project and get the key

1. Go to `[https://posthog.com](https://posthog.com)` and sign up.
2. Create a **new project** (e.g. “SEObot”).
3. In the PostHog UI, go to **Project Settings**.
4. Find **Project API key**.  
   - It will typically start with `phc_...` – **this is important**.

### 6.2 Configure environment variables

In `.env.local`:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com
```

- `NEXT_PUBLIC_POSTHOG_KEY` **must** be the **Project API key** (starting with `phc_`), not a personal API key.
- `NEXT_PUBLIC_POSTHOG_HOST` can usually stay as `https://us.posthog.com` (default cloud host).

The React code (`components/PostHogProvider.tsx` and `lib/posthog.ts`) will automatically:
- Initialize PostHog in the browser.
- Track page views and other events.

---

## 7. Meta Pixel & Conversions API (Facebook/Instagram ads)

This project uses:
- **Meta Pixel** (browser-side tracking via `fbq`)
- **Conversions API** (server-side tracking via `/api/meta-event`)

### 7.1 Create a Meta Business account and Pixel

1. Go to `[https://business.facebook.com](https://business.facebook.com)` and log in.
2. Create a **Business** if you don’t have one.
3. Open **Events Manager**.
4. Click **Connect Data Source** → **Web** → **Meta Pixel**.
5. Give your Pixel a name and follow the steps to create it.

You will see a **Pixel ID** (a numeric ID). Copy it.

### 7.2 Generate a Conversions API token

Still in **Events Manager**:

1. Select your Pixel.
2. Go to the **Settings** tab.
3. Scroll to **Conversions API** / **API access**.
4. Find the option to **Generate access token**.
5. Copy the **access token** – keep it secret.

### 7.3 (Optional) Test event code

For testing in development, Meta may provide a **Test Event Code** in Events Manager → **Test events**.  
This is optional but useful to verify events.

### 7.4 Fill in the environment variables

In `.env.local`:

```env
# Meta Pixel / Conversions API
NEXT_PUBLIC_FB_PIXEL_ID=your_meta_pixel_id
FB_CONVERSIONS_API_TOKEN=your_conversions_api_token
# Optional alternative name supported in code:
# FB_CAPI_ACCESS_TOKEN=your_conversions_api_token
# Optional test event code (development only):
# FB_TEST_EVENT_CODE=your_test_event_code
```

The app will:
- Inject the Pixel script in `app/layout.tsx` when `NEXT_PUBLIC_FB_PIXEL_ID` is set.
- Send server-side events via `app/api/meta-event/route.ts` using your token.
- Use `utils/trackMeta.ts` to send events like `ViewContent`, `Lead`, `CompleteRegistration` from the UI.

---

## 8. Google Ads conversions (lead & complete registration)

Google Ads is used to track:
- **Leads** (e.g. when someone submits a form)
- **Completed registrations** (e.g. after signup / thank-you page)

### 8.1 Create / access your Google Ads account

1. Go to `[https://ads.google.com](https://ads.google.com)` and sign in.
2. Create or open an Ads account.

### 8.2 Find your Google Ads ID

Your account will have an ID like `123-456-7890`.  
For the **global site tag / Google Ads tag**, you’ll see an ID like `AW-1234567890`.

Use this value for:

```env
GOOGLE_ADS_ID=AW-XXXXXXXXXX
```

### 8.3 Create conversion actions and get labels

In Google Ads:

1. Go to **Tools & Settings → Measurement → Conversions**.
2. Create (or edit) at least two **conversion actions**:
   - One for **Lead**
   - One for **Complete registration** (or similar)
3. When Google shows you the **tag installation instructions**, look for a snippet like:

   ```js
   gtag('event', 'conversion', {
     'send_to': 'AW-XXXXXXXXXX/ABCDEFGHIJKLMN',
     ...
   });
   ```

   - The part before the slash (`AW-XXXXXXXXXX`) is your **Google Ads ID**.
   - The part after the slash (`ABCDEFGHIJKLMN`) is the **conversion label**.

4. Put those labels into `.env.local`:

```env
GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_LEAD=lead_conversion_label_here
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_COMPLETE_REGISTRATION=complete_reg_label_here
```

The code in `lib/gtag.ts` uses these values to build the `send_to` parameter and fire events like:
- `trackGoogleAdsLeadConversion(...)`
- `trackGoogleAdsCompleteRegistrationConversion(...)`

---

## 9. Optional: Stripe (billing) & Resend (emails)

The codebase includes:
- Supabase tables for **Stripe products, prices, subscriptions** (in `20230530034630_init.sql`)
- A dependency on Stripe and Resend, but **this branch does not include active webhook routes or email flows out-of-the-box**.

You only need to configure these if you or a developer later wire up payments/emails.

### 9.1 Stripe (optional)

1. Go to `[https://dashboard.stripe.com](https://dashboard.stripe.com)` and create an account.
2. In the **Developers → API keys** section:
   - Copy the **Publishable key** (starts with `pk_...`)
   - Copy the **Secret key** (starts with `sk_...`)
3. If you later add webhook handling endpoints, Stripe will give you a **Webhook secret**.

Fill in `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # only if you create a webhook endpoint
```

### 9.2 Resend (optional)

If you later add transactional email:

1. Go to `[https://resend.com](https://resend.com)` and sign up.
2. Create an **API key**.
3. Set:

```env
RESEND_API_KEY=re_your_api_key_here
```

---

## 10. Site URLs (NEXT_PUBLIC_SITE_URL, Vercel, etc.)

The helper `getURL` in `utils/helpers.ts` uses:
- `NEXT_PUBLIC_SITE_URL` (if set)  
- Otherwise `NEXT_PUBLIC_VERCEL_URL` (set automatically by Vercel)

For local development, you can set:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production (on your actual domain), set:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

On Vercel, you normally don’t need to set `NEXT_PUBLIC_VERCEL_URL` yourself.

---

## 11. Run the app locally

Once `.env.local` is fully configured and your Supabase migrations are run:

1. In the project folder, start the dev server:

   ```bash
   npm run dev
   ```

2. Open your browser and go to:

   `http://localhost:3000`

You should see the **SEObot landing page**. From there you can:
- Use the main CTA to open the auth / “Try now” experience.
- After signup / flows, you’ll hit the thank-you and account routes under `app/(main)/...`.

If something crashes, check:
- The terminal where `npm run dev` is running (for clear error messages).
- Your `.env.local` values (missing or wrong keys are the most common cause).

---

## 12. Deploying to production (Vercel)

The project is **Vercel-ready**.

### 12.1 Connect repo to Vercel

1. Go to `[https://vercel.com](https://vercel.com)` and sign in.
2. Click **Add New → Project**.
3. Import your Git repo (e.g. from GitHub).
4. Vercel will detect it as a Next.js app automatically.

### 12.2 Add environment variables in Vercel

In your Vercel project settings → **Environment Variables**, add all the variables from `.env.local` that you want available in production, including:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (keep secret; used only server-side)
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`
- `NEXT_PUBLIC_OPENROUTER_API_KEY`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_FB_PIXEL_ID`
- `FB_CONVERSIONS_API_TOKEN` (or `FB_CAPI_ACCESS_TOKEN`)
- `FB_TEST_EVENT_CODE` (optional)
- `GOOGLE_ADS_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_LEAD`
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_COMPLETE_REGISTRATION`
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://yourdomain.com`)
- Optional: Stripe and Resend variables if you use them.

Make sure you add them at least for the **Production** environment.

### 12.3 Configure Supabase & OAuth redirect URLs

In Supabase Dashboard → **Authentication → URL Configuration**:
- Set:
  - **Site URL**: `https://yourdomain.com`
  - **Redirect URLs**: include `https://yourdomain.com/auth/callback`

If you use Google OAuth (or other providers) later, you will need to:
- Add matching redirect URLs in the provider console (e.g. Google Cloud Console).

### 12.4 Deploy

Once environment variables are configured:

1. Push your changes to the main branch on your repo.
2. Vercel will automatically build and deploy.
3. After deploy, open your Vercel URL (or custom domain) and verify:
   - Supabase auth works
   - AI calls work (no OpenRouter key errors)
   - Analytics and ad tracking scripts load without errors in the browser console.

---

## 13. Quick reference: environment variables

Here is a summary table of the important variables and where you find them.

| Variable name                                        | Service        | Where to get it                                                            | Required?                 |
| ---------------------------------------------------- | -------------- | -------------------------------------------------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                          | Supabase       | Supabase → Settings → API → Project URL                                   | **Yes**                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`                     | Supabase       | Supabase → Settings → API → anon public key                               | **Yes**                   |
| `SUPABASE_SERVICE_ROLE_KEY`                         | Supabase       | Supabase → Settings → API → service role key                              | Recommended (server only) |
| `SUPABASE_PROJECT_REF`                              | Supabase       | Supabase → Settings → API → Project reference                             | For CLI / local DB        |
| `SUPABASE_DB_PASSWORD`                              | Supabase       | The DB password you chose when creating the project                        | For CLI / local DB        |
| `NEXT_PUBLIC_OPENROUTER_API_KEY`                    | OpenRouter     | OpenRouter dashboard → API Keys                                            | **Yes (for AI)**          |
| `NEXT_PUBLIC_POSTHOG_KEY`                           | PostHog        | PostHog → Project Settings → Project API key (`phc_...`)                  | Yes (if you want analytics) |
| `NEXT_PUBLIC_POSTHOG_HOST`                          | PostHog        | Usually `https://us.posthog.com`                                          | Yes (if using PostHog)    |
| `NEXT_PUBLIC_FB_PIXEL_ID`                           | Meta           | Events Manager → your Pixel → Pixel ID                                    | Yes (if using Meta ads)   |
| `FB_CONVERSIONS_API_TOKEN` / `FB_CAPI_ACCESS_TOKEN` | Meta           | Events Manager → Settings → Conversions API / API access → Access token   | Yes (for server events)   |
| `FB_TEST_EVENT_CODE`                                | Meta           | Events Manager → Test events → Test event code                            | Optional (testing only)   |
| `GOOGLE_ADS_ID`                                     | Google Ads     | From Google Ads conversion tag snippet (`AW-XXXXXXXXXX`)                  | Yes (if tracking Ads)     |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_LEAD`      | Google Ads     | From “Lead” conversion tag snippet (string after `/` in `send_to`)        | Yes (for lead tracking)   |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_COMPLETE_REGISTRATION` | Google Ads | From “Complete registration” conversion tag label                         | Yes (for registration tracking) |
| `NEXT_PUBLIC_SITE_URL`                              | App            | Your app URL (local: `http://localhost:3000`, prod: `https://yourdomain.com`) | Highly recommended        |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`                | Stripe         | Stripe → Developers → API keys → Publishable key                          | Optional (billing)        |
| `STRIPE_SECRET_KEY`                                 | Stripe         | Stripe → Developers → API keys → Secret key                               | Optional (billing)        |
| `STRIPE_WEBHOOK_SECRET`                             | Stripe         | After creating a webhook endpoint in Stripe                               | Optional (billing)        |
| `RESEND_API_KEY`                                    | Resend         | Resend dashboard → API Keys                                               | Optional (email)          |

---

## 14. Troubleshooting basics

- **The site crashes immediately when running `npm run dev`**  
  - Check the terminal output; most often it will say a required env variable is missing (e.g. `NEXT_PUBLIC_OPENROUTER_API_KEY` or Supabase URL/key).

- **Supabase errors (401/403/connection)**  
  - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` exactly match the values in Supabase Settings → API.

- **PostHog not tracking**  
  - Make sure `NEXT_PUBLIC_POSTHOG_KEY` starts with `phc_` and `NEXT_PUBLIC_POSTHOG_HOST` is `https://us.posthog.com`.

- **Meta events not appearing**  
  - Check that `NEXT_PUBLIC_FB_PIXEL_ID` and `FB_CONVERSIONS_API_TOKEN` are set.
  - Use Meta **Test events** with `FB_TEST_EVENT_CODE` in development to confirm.

- **Google Ads conversions not showing up**  
  - Double-check that `GOOGLE_ADS_ID` and both conversion labels are correct and match your Ads account snippets.

If you get stuck, the fastest path is:
1. Re-check your `.env.local` values against this guide.
2. Re-run `npm run dev` and read any error message from the terminal.
3. Confirm your Supabase migrations ran without errors.

