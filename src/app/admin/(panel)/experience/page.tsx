import Link from "next/link";
import PageHeader, { EmptyState, MoveButtons, PrimaryLink, StatusBadge } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/admin";
import { moveExperience } from "@/app/admin/actions/experience";
import type { Experience } from "@/lib/types";

export const metadata = { title: "Experience" };

export default async function ExperiencePage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("experience").select("*").order("position").order("id");
  const items = (data ?? []) as Experience[];

  return (
    <>
      <PageHeader
        title="Experience"
        description="Jobs, internships and education, shown as a timeline. Put the newest first."
        actions={<PrimaryLink href="/admin/experience/new">Add entry</PrimaryLink>}
      />
      {items.length === 0 ? (
        <EmptyState title="No experience yet" body="Add a job, internship or your degree to build your timeline." action={<PrimaryLink href="/admin/experience/new">Add entry</PrimaryLink>} />
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {items.map((e, i) => (
            <li key={e.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:px-5">
              <MoveButtons
                name={e.role}
                up={i > 0 ? moveExperience.bind(null, e.id, "up") : undefined}
                down={i < items.length - 1 ? moveExperience.bind(null, e.id, "down") : undefined}
              />
              <div className="min-w-0 flex-1">
                <Link href={`/admin/experience/${e.id}`} className="font-medium hover:text-accent">{e.role}</Link>
                <p className="truncate text-sm text-dim">
                  {e.org}
                  {e.period && ` · ${e.period}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize text-dim">{e.kind}</span>
                {!e.published && <StatusBadge on={false} offLabel="Hidden" />}
                <Link href={`/admin/experience/${e.id}`} className="rounded-md px-2.5 py-1.5 text-sm font-medium text-dim hover:bg-muted hover:text-fg">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
