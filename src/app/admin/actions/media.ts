"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { findUnusedMedia } from "@/lib/media";

export async function deleteUnusedMedia() {
  const { supabase } = await requireAdmin();
  // Recomputed here rather than trusting a list from the page, so a file used since then is never deleted.
  const unused = await findUnusedMedia(supabase);
  if (unused.length) await supabase.storage.from("media").remove(unused.map((f) => f.path));
  revalidatePath("/admin");
}
