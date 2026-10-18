"use server";
import { requireAdmin, refreshSite, text, mediaUploads, type ActionState } from "@/lib/admin";

export async function saveProfile(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const name = text(form, "name");
  if (!name) return { error: "Your name is required." };

  const media = mediaUploads(supabase);
  try {
    const row = {
      id: 1,
      name,
      handle: text(form, "handle"),
      title: text(form, "title"),
      tagline: text(form, "tagline"),
      email: text(form, "email"),
      github: text(form, "github"),
      linkedin: text(form, "linkedin"),
      // Paragraphs are separated by a blank line.
      about: text(form, "about")
        .split(/\r?\n\s*\r?\n/)
        .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
        .filter(Boolean),
      photo_url: await media.field(form, "photo", "profile"),
      resume_url: await media.field(form, "resume", "resume"),
    };
    const { error } = await supabase.from("profile").upsert(row);
    if (error) throw new Error(error.message);
  } catch (e) {
    await media.rollback();
    return { error: (e as Error).message };
  }
  await media.commit();
  refreshSite();
  return { ok: "Profile saved." };
}
