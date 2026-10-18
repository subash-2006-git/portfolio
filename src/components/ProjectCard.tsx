import Link from "next/link";
import type { Project } from "@/lib/types";
import ProjectVisual from "@/components/ProjectVisual";
import { ArrowRightIcon, ArrowUpRightIcon, GitHubIcon } from "@/components/Icons";

// The title link stretches over the whole card; external links sit above it so both stay clickable.
export default function ProjectCard({ p, featured = false }: { p: Project; featured?: boolean }) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-black/5 ${
        featured ? "md:grid md:grid-cols-[1.15fr_1fr]" : ""
      }`}
    >
      <div className={featured ? "border-b border-line md:order-2 md:border-b-0 md:border-l" : "border-b border-line"}>
        <ProjectVisual
          p={p}
          priority={featured}
          sizes={featured ? "(min-width: 768px) 480px, 100vw" : "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"}
        />
      </div>
      <div className={`flex flex-1 flex-col ${featured ? "p-6 sm:p-8 md:justify-center" : "p-6"}`}>
        <div className="flex items-center gap-2 text-sm text-dim">
          {featured && <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">Featured</span>}
          {p.year && <span className="tabular-nums">{p.year}</span>}
        </div>
        <h3 className={`mt-3 font-semibold tracking-tight ${featured ? "text-2xl sm:text-3xl" : "text-lg"}`}>
          <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {p.name}
          </Link>
        </h3>
        <p className={`mt-2 leading-relaxed text-dim ${featured ? "text-lg" : ""}`}>{p.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <li key={s} className="rounded-full border border-line bg-bg px-2.5 py-0.5 text-xs font-medium text-dim">{s}</li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-5 pt-6 text-sm font-medium">
          <span className="inline-flex items-center gap-1.5 text-accent">
            Read case study <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noreferrer" className="relative z-10 inline-flex items-center gap-1.5 text-dim hover:text-fg">
              <GitHubIcon className="size-4" /> Source
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer" className="relative z-10 inline-flex items-center gap-1 text-dim hover:text-fg">
              Live <ArrowUpRightIcon />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
