import Link from "next/link";
import PageHeader, { EmptyState, MoveButtons, PrimaryLink, StatusBadge } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/admin";
import { moveProject, toggleProjectPublished } from "@/app/admin/actions/projects";
import type { Project } from "@/lib/types";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("projects").select("*").order("position").order("id");
  const projects = (data ?? []) as Project[];

  return (
    <>
      <PageHeader
        title="Projects"
        description="Shown in the Work section, in this order. The featured project appears large at the top."
        actions={<PrimaryLink href="/admin/projects/new">Add project</PrimaryLink>}
      />
      {projects.length === 0 ? (
        <EmptyState title="No projects yet" body="Add your first project to show it in the Work section." action={<PrimaryLink href="/admin/projects/new">Add project</PrimaryLink>} />
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {projects.map((p, i) => (
            <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:px-5">
              <MoveButtons
                name={p.name}
                up={i > 0 ? moveProject.bind(null, p.id, "up") : undefined}
                down={i < projects.length - 1 ? moveProject.bind(null, p.id, "down") : undefined}
              />
              <div className="min-w-0 flex-1">
                <Link href={`/admin/projects/${p.id}`} className="font-medium hover:text-accent">{p.name}</Link>
                <p className="truncate text-sm text-dim">/projects/{p.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                {p.featured && <StatusBadge on onLabel="Featured" />}
                <form action={toggleProjectPublished.bind(null, p.id, !p.published)}>
                  <button
                    title={p.published ? "Click to hide from the site" : "Click to publish"}
                    aria-label={p.published ? `Published. Hide ${p.name} from the site` : `Hidden. Publish ${p.name}`}
                    className="rounded-full"
                  >
                    <StatusBadge on={p.published} offLabel="Hidden" />
                  </button>
                </form>
                <Link href={`/admin/projects/${p.id}`} className="rounded-md px-2.5 py-1.5 text-sm font-medium text-dim hover:bg-muted hover:text-fg">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
