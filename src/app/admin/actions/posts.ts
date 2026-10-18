"use server";
import { redirect } from "next/navigation";
import { requireAdmin, refreshSite, text, bool, slugify, dbError, type ActionState } from "@/lib/admin";

export async function savePost(id: string | null, _prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const title = text(form, "title");
  if (!title) return { error: "The post needs a title." };
  const slug = slugify(text(form, "slug") || title);
  if (!slug) return { error: "Add a slug using letters or numbers." };
  const date = text(form, "date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Pick a publish date." };

  const row = {
    title,
    slug,
    date,
    summary: text(form, "summary"),
    content: String(form.get("content") ?? ""),
    published: bool(form, "published"),
  };

  let newId = id;
  if (id) {
    const { error } = await supabase.from("posts").update(row).eq("id", id);
    if (error) return { error: dbError(error.message) };
  } else {
    const { data, error } = await supabase.from("posts").insert(row).select("id").single();
    if (error) return { error: dbError(error.message) };
    newId = data.id;
  }

  refreshSite();
  if (!id) redirect(`/admin/posts/${newId}?created=1`);
  return { ok: row.published ? "Post saved and published." : "Draft saved." };
}

export async function deletePost(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("posts").delete().eq("id", id);
  refreshSite();
  redirect("/admin/posts");
}
