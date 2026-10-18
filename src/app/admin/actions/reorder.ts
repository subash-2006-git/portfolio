import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

type Table = "skill_groups" | "projects" | "experience";

/** Moves one row up or down and rewrites positions as 0..n so ties never stick. */
export async function moveRow(supabase: SupabaseClient, table: Table, id: string, dir: "up" | "down") {
  const { data, error } = await supabase.from(table).select("id").order("position").order("id");
  if (error) throw new Error(error.message);

  const ids = data.map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];

  const results = await Promise.all(ids.map((rowId, position) => supabase.from(table).update({ position }).eq("id", rowId)));
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);
}

/** Position for a new row: after everything else. */
export async function nextPosition(supabase: SupabaseClient, table: Table) {
  const { data } = await supabase.from(table).select("position").order("position", { ascending: false }).limit(1);
  return data?.length ? (data[0].position as number) + 1 : 0;
}
