import PageHeader, { MoveButtons } from "@/components/admin/PageHeader";
import AdminForm from "@/components/admin/AdminForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { inputClass } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin";
import { saveSkillGroup, deleteSkillGroup, moveSkillGroup } from "@/app/admin/actions/skills";
import type { SkillGroup } from "@/lib/types";

export const metadata = { title: "Skills" };

function GroupFields({ g }: { g?: SkillGroup }) {
  const key = g?.id ?? "new";
  return (
    <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
      <div>
        <label htmlFor={`name-${key}`} className="mb-1.5 block text-sm font-medium">Group name</label>
        <input id={`name-${key}`} name="name" required defaultValue={g?.name} placeholder="Frontend" className={inputClass} />
      </div>
      <div>
        <label htmlFor={`items-${key}`} className="mb-1.5 block text-sm font-medium">Skills</label>
        <input id={`items-${key}`} name="items" defaultValue={g?.items.join(", ")} placeholder="React, Next.js, Tailwind CSS" className={inputClass} />
      </div>
    </div>
  );
}

export default async function SkillsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("skill_groups").select("*").order("position").order("id");
  const groups = (data ?? []) as SkillGroup[];

  return (
    <>
      <PageHeader title="Skills" description="Grouped skills shown in the About section. Separate skills with commas." />

      <div className="space-y-4">
        {groups.map((g, i) => (
          <section key={g.id} className="rounded-2xl border border-line bg-panel px-5 pt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="truncate font-semibold tracking-tight">{g.name}</h2>
              <div className="flex items-center gap-1">
                <MoveButtons
                  name={g.name}
                  up={i > 0 ? moveSkillGroup.bind(null, g.id, "up") : undefined}
                  down={i < groups.length - 1 ? moveSkillGroup.bind(null, g.id, "down") : undefined}
                />
                <form action={deleteSkillGroup.bind(null, g.id)}>
                  <ConfirmButton message={`Delete the "${g.name}" skill group? This can't be undone.`}>Delete</ConfirmButton>
                </form>
              </div>
            </div>
            <AdminForm action={saveSkillGroup.bind(null, g.id)} submitLabel="Save group" className="space-y-2">
              <GroupFields g={g} />
            </AdminForm>
          </section>
        ))}

        <section className="rounded-2xl border border-dashed border-line px-5 pt-5">
          <h2 className="mb-3 font-semibold tracking-tight">Add a group</h2>
          {/* Re-keyed on count so the inputs clear after a group is added */}
          <AdminForm key={groups.length} action={saveSkillGroup.bind(null, null)} submitLabel="Add group" className="space-y-2">
            <GroupFields />
          </AdminForm>
        </section>
      </div>
    </>
  );
}
