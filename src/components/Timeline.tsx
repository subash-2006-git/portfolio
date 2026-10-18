import type { Experience } from "@/lib/types";

function KindIcon({ kind }: { kind: Experience["kind"] }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4">
      {kind === "work" ? (
        <>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
        </>
      ) : (
        <path d="m2 9 10-5 10 5-10 5L2 9Zm4 2.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9v6" />
      )}
    </svg>
  );
}

export default function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="max-w-3xl">
      {items.map((e, i) => (
        <li key={e.id} className="flex gap-5">
          <div aria-hidden className="flex flex-col items-center">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-panel text-accent">
              <KindIcon kind={e.kind} />
            </span>
            {i < items.length - 1 && <span className="my-2 w-px flex-1 bg-line" />}
          </div>
          <div className={i < items.length - 1 ? "pb-12" : ""}>
            <p className="pt-1.5 text-sm tabular-nums text-dim">
              {e.period}
              <span className="sr-only">, {e.kind === "work" ? "work" : "education"}</span>
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">{e.role}</h3>
            <p className="mt-0.5 text-dim">
              {e.org}
              {e.location && <span> · {e.location}</span>}
            </p>
            {e.summary && <p className="mt-3 leading-relaxed text-dim">{e.summary}</p>}
            {e.highlights.length > 0 && (
              <ul className="mt-3 space-y-2">
                {e.highlights.map((h) => (
                  <li key={h} className="flex gap-3 leading-relaxed">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
