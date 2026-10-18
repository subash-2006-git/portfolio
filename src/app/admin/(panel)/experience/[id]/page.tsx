import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/admin";
import { deleteExperience } from "@/app/admin/actions/experience";
import type { Experience } from "@/lib/types";
import ExperienceForm from "../ExperienceForm";

export const metadata = { title: "Edit experience" };

export default async function EditExperiencePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("experience").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const e = data as Experience;

  return (
    <>
      <PageHeader
        title={e.role}
        description={e.org}
        back={{ href: "/admin/experience", label: "Experience" }}
        actions={
          <form action={deleteExperience.bind(null, e.id)}>
            <ConfirmButton message={`Delete "${e.role}" at ${e.org}? This can't be undone.`}>Delete entry</ConfirmButton>
          </form>
        }
      />
      {created && <p role="status" className="mb-6 rounded-lg bg-accent-soft px-4 py-3 text-sm text-accent">Entry created.</p>}
      <ExperienceForm key={e.id} e={e} />
    </>
  );
}
