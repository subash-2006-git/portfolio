import type { Project } from "@/data/site";

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="rounded border border-line bg-panel p-4 transition hover:border-accent">
      <h3 className="text-accent">{p.name}</h3>
      <p className="mt-1 text-sm">{p.description}</p>
      <ul className="mt-3 flex flex-wrap gap-2 text-xs text-dim">
        {p.stack.map((s) => (
          <li key={s} className="rounded border border-line px-2 py-0.5">{s}</li>
        ))}
      </ul>
      <div className="mt-3 flex gap-4 text-sm">
        {p.repo && <a href={p.repo} target="_blank" rel="noreferrer" className="underline hover:text-accent">repo</a>}
        {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" className="underline hover:text-accent">live</a>}
      </div>
    </article>
  );
}
