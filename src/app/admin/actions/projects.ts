"use server";
import { redirect } from "next/navigation";
import { requireAdmin, refreshSite, text, bool, lines, list, slugify, mediaUploads, removeMedia, dbError, type ActionState } from "@/lib/admin";
import { moveRow, nextPosition } from "./reorder";

export async function saveProject(id: string | null, _prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const name = text(form, "name");
  if (!name) return { error: "The project needs a name." };
  const slug = slugify(text(form, "slug") || name);
  if (!slug) return { error: "Add a slug using letters or numbers." };

  const media = mediaUploads(supabase);
  let newId = id;
  try {
    const featured = bool(form, "featured");
    const row = {
      name,
      slug,
      description: text(form, "description"),
      stack: list(form, "stack"),
      repo: text(form, "repo"),
      demo: text(form, "demo"),
      year: text(form, "year"),
      role: text(form, "role"),
      problem: text(form, "problem"),
      approach: lines(form, "approach"),
      outcome: lines(form, "outcome"),
      featured,
      published: bool(form, "published"),
      image_url: await media.field(form, "image", "projects"),
    };

    // Only one project can be featured: clear the flag elsewhere first.
    if (featured) {
      const clear = supabase.from("projects").update({ featured: false }).eq("featured", true);
      const { error } = id ? await clear.neq("id", id) : await clear;
      if (error) throw new Error(dbError(error.message));
    }

    if (id) {
      const { error } = await supabase.from("projects").update(row).eq("id", id);
      if (error) throw new Error(dbError(error.message));
    } else {
      const { data, error } = await supabase
        .from("projects")
        .insert({ ...row, position: await nextPosition(supabase, "projects") })
        .select("id")
        .single();
      if (error) throw new Error(dbError(error.message));
      newId = data.id;
    }
  } catch (e) {
    await media.rollback();
    return { error: (e as Error).message };
  }

  await media.commit();
  refreshSite();
  if (!id) redirect(`/admin/projects/${newId}?created=1`);
  return { ok: "Project saved." };
}

export async function deleteProject(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("projects").delete().eq("id", id).select("image_url").maybeSingle();
  if (data?.image_url) await removeMedia(supabase, [data.image_url]);
  refreshSite();
  redirect("/admin/projects");
}

export async function moveProject(id: string, dir: "up" | "down") {
  const { supabase } = await requireAdmin();
  await moveRow(supabase, "projects", id, dir);
  refreshSite();
}

export async function toggleProjectPublished(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("projects").update({ published }).eq("id", id);
  refreshSite();
}
