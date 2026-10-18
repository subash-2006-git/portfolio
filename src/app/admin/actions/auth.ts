"use server";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/admin";

export async function signIn(_prev: ActionState, form: FormData): Promise<ActionState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await serverClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "That email and password don't match an admin account. Check them and try again." };

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have admin access. Ask the site owner to add it with npm run admin:create." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await serverClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
