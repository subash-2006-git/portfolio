import AdminForm from "@/components/admin/AdminForm";
import { Card, Checkbox, Field, Select, TextArea } from "@/components/admin/fields";
import { saveExperience } from "@/app/admin/actions/experience";
import type { Experience } from "@/lib/types";

export default function ExperienceForm({ e }: { e?: Experience }) {
  return (
    <AdminForm action={saveExperience.bind(null, e?.id ?? null)} submitLabel={e ? "Save changes" : "Create entry"}>
      <Card title="Details">
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            name="kind"
            label="Type"
            defaultValue={e?.kind ?? "work"}
            options={[
              { value: "work", label: "Work" },
              { value: "education", label: "Education" },
            ]}
          />
          <Field name="period" label="Dates" defaultValue={e?.period} placeholder="Jun 2026 – Present" />
          <Field name="role" label="Role or degree" defaultValue={e?.role} required placeholder="Web Development Intern" />
          <Field name="org" label="Company or school" defaultValue={e?.org} required />
          <Field name="location" label="Location" defaultValue={e?.location} placeholder="Remote" />
        </div>
        <TextArea name="summary" label="Summary" hint="One or two sentences on what you did there." rows={3} defaultValue={e?.summary} />
        <TextArea name="highlights" label="Highlights" hint="One achievement per line. Start with a verb and include a result." rows={5} defaultValue={e?.highlights.join("\n")} />
      </Card>
      <Card title="Visibility">
        <Checkbox name="published" label="Published" hint="Show this entry on the site." defaultChecked={e?.published ?? true} />
      </Card>
    </AdminForm>
  );
}
