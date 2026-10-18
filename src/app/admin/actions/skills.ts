"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin, refreshSite, text, list, type ActionState } from "@/lib/admin";
import { moveRow, nextPosition } from "./reorder";

export async function saveSkillGroup(id: string | null, _prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const name = text(form, "name");
  if (!name) return { error: "Give the group a name, like \"Frontend\"." };
  const items = list(form, "items");

  const { error } = id
    ? await supabase.from("skill_groups").update({ name, items }).eq("id", id)
    : await supabase.from("skill_groups").insert({ name, items, position: await nextPosition(supabase, "skill_groups") });
  if (error) return { error: error.message };

  refreshSite();
  return { ok: id ? "Saved." : `Added "${name}".` };
}

export async function deleteSkillGroup(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("skill_groups").delete().eq("id", id);
  refreshSite();
}

export async function moveSkillGroup(id: string, dir: "up" | "down") {
  const { supabase } = await requireAdmin();
  await moveRow(supabase, "skill_groups", id, dir);
  refreshSite();
  revalidatePath("/admin/skills");
}
