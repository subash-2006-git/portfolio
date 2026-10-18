"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

export async function setMessageRead(id: string, read: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("messages").update({ read }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function markAllRead() {
  const { supabase } = await requireAdmin();
  await supabase.from("messages").update({ read: true }).eq("read", false);
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("messages").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}
