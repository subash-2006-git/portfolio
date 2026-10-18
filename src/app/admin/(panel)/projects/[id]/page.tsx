import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { ArrowUpRightIcon } from "@/components/Icons";
import { requireAdmin } from "@/lib/admin";
import { deleteProject } from "@/app/admin/actions/projects";
import type { Project } from "@/lib/types";
import ProjectForm from "../ProjectForm";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const p = data as Project;

  return (
    <>
      <PageHeader
        title={p.name}
        back={{ href: "/admin/projects", label: "Projects" }}
        actions={
          <>
            <a
              href={`/api/preview?path=${encodeURIComponent(`/projects/${p.slug}`)}`}
              target="_blank"
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-dim hover:bg-muted hover:text-fg"
            >
              {p.published ? "View" : "Preview"} <ArrowUpRightIcon />
            </a>
            <form action={deleteProject.bind(null, p.id)}>
              <ConfirmButton message={`Delete "${p.name}"? This removes it from your site and can't be undone.`}>Delete project</ConfirmButton>
            </form>
          </>
        }
      />
      {created && <p role="status" className="mb-6 rounded-lg bg-accent-soft px-4 py-3 text-sm text-accent">Project created.</p>}
      <ProjectForm key={p.id} p={p} />
    </>
  );
}
