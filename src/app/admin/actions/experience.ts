"use server";
import { redirect } from "next/navigation";
import { requireAdmin, refreshSite, text, bool, lines, type ActionState } from "@/lib/admin";
import { moveRow, nextPosition } from "./reorder";

export async function saveExperience(id: string | null, _prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const role = text(form, "role");
  const org = text(form, "org");
  if (!role || !org) return { error: "Add both a role (or degree) and an organisation." };

  const row = {
    kind: text(form, "kind") === "education" ? "education" : "work",
    role,
    org,
    period: text(form, "period"),
    location: text(form, "location"),
    summary: text(form, "summary"),
    highlights: lines(form, "highlights"),
    published: bool(form, "published"),
  };

  let newId = id;
  if (id) {
    const { error } = await supabase.from("experience").update(row).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase
      .from("experience")
      .insert({ ...row, position: await nextPosition(supabase, "experience") })
      .select("id")
      .single();
    if (error) return { error: error.message };
    newId = data.id;
  }

  refreshSite();
  if (!id) redirect(`/admin/experience/${newId}?created=1`);
  return { ok: "Entry saved." };
}

export async function deleteExperience(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("experience").delete().eq("id", id);
  refreshSite();
  redirect("/admin/experience");
}

export async function moveExperience(id: string, dir: "up" | "down") {
  const { supabase } = await requireAdmin();
  await moveRow(supabase, "experience", id, dir);
  refreshSite();
}
