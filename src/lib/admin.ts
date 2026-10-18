import "server-only";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { serverClient } from "@/lib/supabase/server";

// Verifies the session with the auth server and checks the admins table.
// Call at the top of every admin page and server action.
export async function requireAdmin() {
  const supabase = await serverClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims) redirect("/admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", claims.claims.sub).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-admin");
  }
  return { supabase, email: (claims.claims.email as string | undefined) ?? "" };
}

export type ActionState = { ok?: string; error?: string } | undefined;

// The public site is rendered ahead of time; refresh every page after content changes.
export function refreshSite() {
  revalidatePath("/", "layout");
}

export const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
export const bool = (form: FormData, key: string) => form.get(key) === "on";

/** One item per line, blank lines dropped. */
export const lines = (form: FormData, key: string) =>
  text(form, key)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

/** Comma-separated list. */
export const list = (form: FormData, key: string) =>
  text(form, key)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const MAX_UPLOAD = 10 * 1024 * 1024;
const BUCKET_MARKER = "/storage/v1/object/public/media/";

/** Storage path for a URL in our media bucket, or null for anything else (e.g. /profile.jpg in /public). */
export function mediaPath(url: string) {
  const i = url.indexOf(BUCKET_MARKER);
  return i === -1 ? null : decodeURIComponent(url.slice(i + BUCKET_MARKER.length).split("?")[0]);
}

export async function removeMedia(supabase: SupabaseClient, urls: string[]) {
  const paths = urls.map(mediaPath).filter((p): p is string => !!p);
  if (paths.length) await supabase.storage.from("media").remove(paths);
}

/**
 * Handles file inputs (plus their "current URL" hidden field and "remove" checkbox) for one save.
 * Old files are deleted only after the database write succeeds (commit); if the save fails,
 * rollback deletes the files that were just uploaded. Either way nothing is left orphaned.
 */
export function mediaUploads(supabase: SupabaseClient) {
  const uploaded: string[] = [];
  const replaced: string[] = [];

  return {
    /** Returns the URL to store: the new upload, the existing one, or "" if removed. */
    async field(form: FormData, key: string, folder: string) {
      const current = text(form, `${key}_current`);
      const file = form.get(key);
      const hasFile = file instanceof File && file.size > 0;

      if (!hasFile) {
        if (bool(form, `${key}_remove`)) {
          if (current) replaced.push(current);
          return "";
        }
        return current;
      }
      if (file.size > MAX_UPLOAD) throw new Error("Files must be 10 MB or smaller.");

      const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "bin";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw new Error(`Upload failed: ${error.message}`);

      const url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
      uploaded.push(url);
      if (current) replaced.push(current);
      return url;
    },
    commit: () => removeMedia(supabase, replaced),
    rollback: () => removeMedia(supabase, uploaded),
  };
}

/** Friendlier wording for the database errors an editor is likely to hit. */
export function dbError(message: string) {
  if (message.includes("duplicate key") && message.includes("slug")) return "That slug is already used. Pick a different one.";
  if (message.includes("projects_single_featured")) return "Only one project can be featured.";
  if (message.includes("slug_check")) return "Slugs can only use lowercase letters, numbers and single hyphens.";
  return message;
}
