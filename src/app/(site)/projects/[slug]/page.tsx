import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectVisual from "@/components/ProjectVisual";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, GitHubIcon } from "@/components/Icons";
import { getProject, getProjects, getPublishedSlugs } from "@/lib/content";


export async function generateStaticParams() {
  return getPublishedSlugs("projects");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProject((await params).slug);
  return { title: p?.name, description: p?.description };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 border-t border-line py-10 md:grid-cols-[12rem_1fr] md:gap-10">
      <h2 className="text-sm font-medium text-accent">{title}</h2>
      <div className="text-lg leading-relaxed">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <span aria-hidden className="mt-3 size-1.5 shrink-0 rounded-full bg-accent" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProject((await params).slug);
  if (!p) notFound();
  const projects = await getProjects();
  const next = projects[(projects.findIndex((x) => x.id === p.id) + 1) % projects.length];

  const meta = [
    p.role && { label: "Role", value: p.role },
    p.year && { label: "Year", value: p.year },
    { label: "Stack", value: p.stack.join(", ") },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="py-16 sm:py-20">
      <Link href="/#projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-dim hover:text-fg">
        <ArrowLeftIcon /> All projects
      </Link>

      <header className="mt-10 max-w-3xl">
        <p className="flex items-center gap-3 text-sm font-medium text-accent">
          Case study
          {!p.published && <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-dim">Hidden</span>}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{p.name}</h1>
        <p className="mt-4 text-xl leading-relaxed text-dim">{p.description}</p>
        {(p.repo || p.demo) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-fg shadow-sm transition-opacity hover:opacity-90">
                Visit live site <ArrowUpRightIcon />
              </a>
            )}
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3 text-sm font-medium transition-colors hover:bg-muted">
                <GitHubIcon className="size-4" /> View source
              </a>
            )}
          </div>
        )}
      </header>

      <dl className="mt-12 grid gap-6 border-y border-line py-6 sm:grid-cols-3">
        {meta.map((m) => (
          <div key={m.label}>
            <dt className="text-sm text-dim">{m.label}</dt>
            <dd className="mt-1 font-medium">{m.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 overflow-hidden rounded-2xl border border-line shadow-xl shadow-black/5">
        <ProjectVisual p={p} priority sizes="(min-width: 1024px) 960px, 100vw" />
      </div>

      <div className="mt-12">
        {p.problem && <Block title="The problem"><p>{p.problem}</p></Block>}
        {p.approach.length > 0 && <Block title="Approach"><Bullets items={p.approach} /></Block>}
        {p.outcome.length > 0 && <Block title="Outcome"><Bullets items={p.outcome} /></Block>}
        {!p.problem && p.approach.length === 0 && p.outcome.length === 0 && (
          <Block title="Overview">
            <p className="text-dim">A full write-up for this project is coming soon.</p>
          </Block>
        )}
      </div>

      {next.id !== p.id && (
        <Link href={`/projects/${next.slug}`} className="group mt-8 flex items-center justify-between gap-6 rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-accent/40 sm:p-8">
          <span>
            <span className="block text-sm text-dim">Next project</span>
            <span className="mt-1 block text-xl font-semibold tracking-tight group-hover:text-accent">{next.name}</span>
          </span>
          <ArrowRightIcon className="size-5 text-dim transition-transform group-hover:translate-x-1 group-hover:text-accent" />
        </Link>
      )}
    </article>
  );
}
