# Portfolio plan

Stack: Next.js 16 (App Router) + TypeScript + Tailwind v4 + Supabase (Postgres, Auth, Storage). Deploy: Vercel.

All content lives in Supabase and is edited from the admin panel at `/admin`.

## Ports
Other local projects use 3000/3001 and Supabase's 553xx range, so this project uses:

| Service | URL |
| --- | --- |
| Next.js app | http://localhost:3100 |
| Supabase API | http://127.0.0.1:56321 |
| Postgres | postgresql://postgres:postgres@127.0.0.1:56322/postgres |
| Supabase Studio | http://127.0.0.1:56323 |
| Mailpit (test email) | http://127.0.0.1:56324 |

Change them in `supabase/config.toml` and `package.json` (`-p 3100`), then update `.env.local`.

## Run it
Needs Docker running.
```
npm install
npm run db:start                     # start local Supabase (first run downloads images)
npm run db:env                       # write the Supabase URL and keys into .env.local
npm run admin:create -- you@example.com "a-strong-password"
npm run dev                          # http://localhost:3100, admin at /admin
```
`npm run db:env` only touches the three Supabase variables in `.env.local` (see `.env.example`) and keeps anything else you've added. Re-run it if you change ports.

Other commands: `npm run db:stop`, `npm run db:reset` (wipes data and re-runs migrations + `supabase/seed.sql`), `npm run build`.

## Structure
- `supabase/migrations/`: schema, row level security and the `media` storage bucket.
- `supabase/seed.sql`: starting content loaded on `db:reset`.
- `src/app/(site)/`: public site (home, blog, project case studies). Pre-rendered and refreshed whenever the admin saves.
- `src/app/admin/`: admin panel (profile, skills, experience, projects, blog posts, messages) and its server actions.
- `src/lib/content.ts`: public data reads. `src/lib/admin.ts`: admin auth guard and form helpers.
- `src/proxy.ts`: keeps the admin session fresh and redirects signed-out visitors to `/admin/login`.

## Security model
- Visitors can read published content, nothing else. They cannot write to any table directly.
- Contact messages go through the site's server action, which rate-limits (3 per IP per 10 min, 30 site-wide per hour)
  and inserts with `SUPABASE_SECRET_KEY`. So that key is required on the server in production too (never in the browser).
- Writes require a signed-in user listed in `public.admins` (`is_admin()` in RLS policies).
- Public signups are disabled; admins are created with `npm run admin:create`.

## Email notifications
Each new contact message emails you (to `NOTIFY_EMAIL`, or the email on your profile), with Reply-To set to the sender.
- Local: lands in Mailpit at http://127.0.0.1:56324 (`MAILPIT_URL`, written by `npm run db:env`).
- Production: set `RESEND_API_KEY` and `NOTIFY_FROM` (a sender on a domain verified in Resend). See `.env.example`.
A failing email never blocks the visitor; the message is still saved and the error is logged.

## Drafts and previews
Unpublished posts and hidden projects/experience only appear in preview mode. Use "Preview draft" on an edit page
or "Preview with drafts" in the admin sidebar. A black bar on the site shows you're in preview, with an Exit link.

## Uploads
Replacing or removing an image or résumé deletes the old file after the save succeeds. Deleting a project deletes its
screenshot. The dashboard's Storage card finds files nothing uses any more and can delete them.

## Roadmap
1. **Content**: sign in to `/admin` and replace the TODO placeholders, upload a photo, résumé and project screenshots.
2. **Polish**: favicon, Open Graph images, sitemap, syntax highlighting for blog code.
3. **Deploy**: create a hosted Supabase project, `supabase link` + `supabase db push`, set the three env vars on Vercel, create your admin against the hosted project.
4. **Later ideas**: email notification for new messages, analytics, RSS feed.
