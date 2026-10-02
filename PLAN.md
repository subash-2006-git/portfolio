# Portfolio plan

Stack: Next.js (App Router) + TypeScript + Tailwind v4. Theme: terminal / techy. Deploy: Vercel.

## Structure
- `src/data/site.ts`: ALL your content (name, bio, skills, links, projects). Edit this first.
- `src/content/blog/*.md`: blog posts (frontmatter: title, date, summary).
- `src/app/page.tsx`: single-page home (hero, about, projects, latest posts, contact).
- `src/app/blog/`: blog index + post pages (statically generated).
- `src/components/`: Nav, Section, ProjectCard, ContactForm.
- `public/resume.pdf`: add your resume here.

## Roadmap
1. **Content (day 1)**: fill in `site.ts`, add resume PDF, write 2-3 real project descriptions.
2. **Polish (day 2)**: add project screenshots (`next/image`), favicon, Open Graph image, tweak colors in `globals.css`.
3. **Contact**: create a free Formspree form, set `NEXT_PUBLIC_FORMSPREE_ID` in `.env.local` (falls back to mailto).
4. **Deploy**: push to GitHub, import the repo on vercel.com, add the env var, done. Add a custom domain later.
5. **Later ideas**: project detail pages, dark/light toggle, analytics, RSS feed, sitemap.

## Run it
```
npm install
npm run dev     # http://localhost:3000
npm run build   # production check before deploying
```
