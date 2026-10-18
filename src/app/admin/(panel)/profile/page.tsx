import PageHeader from "@/components/admin/PageHeader";
import AdminForm from "@/components/admin/AdminForm";
import MediaInput from "@/components/admin/MediaInput";
import { Card, Field, TextArea } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin";
import { saveProfile } from "@/app/admin/actions/profile";
import type { Profile } from "@/lib/types";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();
  const p = (data ?? {}) as Partial<Profile>;

  return (
    <>
      <PageHeader title="Profile" description="Your name, intro, links, photo and résumé." />
      <AdminForm action={saveProfile}>
        <Card title="Basics" description="Shown in the hero at the top of your homepage.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Full name" defaultValue={p.name} required />
            <Field name="handle" label="Handle" hint="Short username, e.g. subash." defaultValue={p.handle} />
            <Field name="title" label="Job title" defaultValue={p.title} placeholder="Software Developer" />
            <Field name="tagline" label="Tagline" defaultValue={p.tagline} placeholder="I build things for the web." />
          </div>
          <TextArea
            name="about"
            label="About"
            hint="Leave a blank line between paragraphs. The first paragraph appears in the hero, the rest in the About section."
            rows={8}
            defaultValue={(p.about ?? []).join("\n\n")}
          />
        </Card>

        <Card title="Links" description="Shown in the hero, contact section and footer. Leave any blank to hide it.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="email" label="Email" type="email" defaultValue={p.email} />
            <Field name="github" label="GitHub URL" type="url" defaultValue={p.github} placeholder="https://github.com/…" />
            <Field name="linkedin" label="LinkedIn URL" type="url" defaultValue={p.linkedin} placeholder="https://linkedin.com/in/…" />
          </div>
        </Card>

        <Card title="Photo and résumé">
          <MediaInput name="photo" label="Profile photo" hint="Square image, at least 600×600 px." current={p.photo_url ?? ""} />
          <MediaInput name="resume" label="Résumé" hint="PDF, up to 10 MB." current={p.resume_url ?? ""} accept="application/pdf" kind="file" />
        </Card>
      </AdminForm>
    </>
  );
}
