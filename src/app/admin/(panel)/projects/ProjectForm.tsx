import AdminForm from "@/components/admin/AdminForm";
import MediaInput from "@/components/admin/MediaInput";
import { Card, Checkbox, Field, TextArea } from "@/components/admin/fields";
import { saveProject } from "@/app/admin/actions/projects";
import type { Project } from "@/lib/types";

export default function ProjectForm({ p }: { p?: Project }) {
  return (
    <AdminForm action={saveProject.bind(null, p?.id ?? null)} submitLabel={p ? "Save changes" : "Create project"}>
      <Card title="Card details" description="What visitors see in the project grid.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="name" label="Name" defaultValue={p?.name} required />
          <Field name="slug" label="URL slug" hint="Leave blank to generate from the name." defaultValue={p?.slug} placeholder="expense-tracker" />
        </div>
        <TextArea name="description" label="One-line description" rows={2} defaultValue={p?.description} />
        <Field name="stack" label="Tech stack" hint="Separate with commas." defaultValue={p?.stack.join(", ")} placeholder="Next.js, TypeScript, Tailwind" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="repo" label="Source code URL" type="url" defaultValue={p?.repo} placeholder="https://github.com/…" />
          <Field name="demo" label="Live demo URL" type="url" defaultValue={p?.demo} placeholder="https://…" />
        </div>
        <MediaInput name="image" label="Screenshot" hint="16:10 works best, e.g. 1600×1000 px." current={p?.image_url ?? ""} />
      </Card>

      <Card title="Case study" description="Shown on the project's own page. Leave sections blank to hide them.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="role" label="Your role" defaultValue={p?.role} placeholder="Solo developer" />
          <Field name="year" label="Year" defaultValue={p?.year} placeholder="2026" />
        </div>
        <TextArea name="problem" label="The problem" hint="What were you solving, and for whom?" rows={3} defaultValue={p?.problem} />
        <TextArea name="approach" label="Approach" hint="One point per line." rows={5} defaultValue={p?.approach.join("\n")} />
        <TextArea name="outcome" label="Outcome" hint="One point per line. Numbers make results stick." rows={4} defaultValue={p?.outcome.join("\n")} />
      </Card>

      <Card title="Visibility">
        <Checkbox name="published" label="Published" hint="Show this project on the site." defaultChecked={p?.published ?? true} />
        <Checkbox name="featured" label="Featured" hint="Show it large at the top of the Work section. Only one project can be featured." defaultChecked={p?.featured} />
      </Card>
    </AdminForm>
  );
}
