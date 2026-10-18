import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import ContactForm from "@/components/ContactForm";
import Timeline from "@/components/Timeline";
import { ArrowRightIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/Icons";
import { getExperience, getPosts, getProfile, getProjects, getSkills } from "@/lib/content";

export default async function Home() {
  const [profile, skills, projects, experience, allPosts] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperience(),
    getPosts(),
  ]);
  const posts = allPosts.slice(0, 3);
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => p !== featured);
  const [intro, ...moreAbout] = profile.about;

  return (
    <>
      <section className="grid items-center gap-12 py-16 sm:py-24 md:grid-cols-[1fr_auto]">
        <div className="max-w-2xl">
          {profile.title && (
            <p className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm text-dim">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              {profile.title}
            </p>
          )}
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
            Hi, I&apos;m {profile.name.split(" ")[0]}.
            {profile.tagline && <span className="block text-dim">{profile.tagline}</span>}
          </h1>
          {intro && <p className="mt-6 max-w-xl text-lg leading-relaxed text-dim">{intro}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#projects" className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-fg shadow-sm transition-opacity hover:opacity-90">
              View my work <ArrowRightIcon />
            </a>
            {profile.resume_url && (
              <a href={profile.resume_url} className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3 text-sm font-medium transition-colors hover:bg-muted">
                <DownloadIcon /> Résumé
              </a>
            )}
            <div className="flex gap-1 text-dim sm:ml-2">
              {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-md p-2.5 hover:bg-muted hover:text-fg"><GitHubIcon /></a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-md p-2.5 hover:bg-muted hover:text-fg"><LinkedInIcon /></a>}
              {profile.email && <a href={`mailto:${profile.email}`} aria-label="Email" className="rounded-md p-2.5 hover:bg-muted hover:text-fg"><MailIcon /></a>}
            </div>
          </div>
        </div>
        {profile.photo_url && (
          <Image
            src={profile.photo_url}
            alt={`Photo of ${profile.name}`}
            width={288}
            height={288}
            priority
            className="hidden size-72 rounded-3xl border border-line object-cover shadow-xl shadow-black/5 md:block"
          />
        )}
      </section>

      <Section id="about" eyebrow="About" title="A bit about me">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr]">
          <div className="space-y-4 text-lg leading-relaxed text-dim">
            {profile.photo_url && (
              <Image src={profile.photo_url} alt="" width={96} height={96} className="mb-6 size-24 rounded-2xl border border-line object-cover md:hidden" />
            )}
            {(moreAbout.length > 0 ? moreAbout : profile.about).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <dl className="space-y-6">
            {skills.map((g) => (
              <div key={g.id}>
                <dt className="text-sm font-medium">{g.name}</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span key={s} className="rounded-md border border-line bg-panel px-2.5 py-1 text-sm text-dim">{s}</span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {experience.length > 0 && (
        <Section id="experience" eyebrow="Experience" title="Where I've worked and studied">
          <Timeline items={experience} />
        </Section>
      )}

      <Section id="projects" eyebrow="Work" title="Selected projects" description="Things I've built recently, from side projects to production apps.">
        {featured && <ProjectCard p={featured} featured />}
        {rest.length > 0 && (
          <div className={`grid gap-5 sm:grid-cols-2 ${featured ? "mt-5" : "lg:grid-cols-3"}`}>
            {rest.map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>
        )}
      </Section>

      {posts.length > 0 && (
        <Section id="blog" eyebrow="Blog" title="Latest writing">
          <ul className="divide-y divide-line border-y border-line">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/blog/${p.slug}`} className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span>
                    <span className="font-medium group-hover:text-accent">{p.title}</span>
                    {p.summary && <span className="mt-1 block text-sm text-dim">{p.summary}</span>}
                  </span>
                  <time dateTime={p.date} className="shrink-0 text-sm tabular-nums text-dim">{p.date}</time>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/blog" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline hover:underline-offset-4">
            View all posts <ArrowRightIcon />
          </Link>
        </Section>
      )}

      <Section id="contact" eyebrow="Contact" title="Let's work together" description="Have a project, role or question in mind? Send a message and I'll get back to you.">
        <div className="grid gap-10 md:grid-cols-[1fr_1.5fr]">
          <div className="space-y-3 text-sm">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-3 rounded-xl border border-line p-4 transition-colors hover:bg-muted">
                <MailIcon className="size-5 text-accent" />
                <span className="min-w-0 truncate">{profile.email}</span>
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-line p-4 transition-colors hover:bg-muted">
                <LinkedInIcon className="size-5 text-accent" /> LinkedIn
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-line p-4 transition-colors hover:bg-muted">
                <GitHubIcon className="size-5 text-accent" /> GitHub
              </a>
            )}
          </div>
          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
