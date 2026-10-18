import Link from "next/link";
import { ArrowLeftIcon } from "@/components/Icons";

export default function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      {back && (
        <Link href={back.href} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-dim hover:text-fg">
          <ArrowLeftIcon /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 text-dim">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg shadow-sm transition-opacity hover:opacity-90">
      {children}
    </Link>
  );
}

export function StatusBadge({ on, onLabel = "Published", offLabel = "Draft" }: { on: boolean; onLabel?: string; offLabel?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${on ? "bg-accent-soft text-accent" : "bg-muted text-dim"}`}>
      <span aria-hidden className={`size-1.5 rounded-full ${on ? "bg-accent" : "bg-dim"}`} />
      {on ? onLabel : offLabel}
    </span>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-dim">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Up/down arrow buttons; each sits in its own form bound to a server action. */
export function MoveButtons({ up, down, name }: { up?: () => Promise<void>; down?: () => Promise<void>; name: string }) {
  const btn = "grid size-8 place-items-center rounded-md text-dim hover:bg-muted hover:text-fg disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div className="flex">
      <form action={up}>
        <button disabled={!up} aria-label={`Move ${name} up`} title="Move up" className={btn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4"><path d="m6 15 6-6 6 6" /></svg>
        </button>
      </form>
      <form action={down}>
        <button disabled={!down} aria-label={`Move ${name} down`} title="Move down" className={btn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </form>
    </div>
  );
}
