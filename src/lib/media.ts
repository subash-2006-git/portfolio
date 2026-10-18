import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { mediaPath } from "@/lib/admin";

type StoredFile = { path: string; size: number };

async function listFolder(supabase: SupabaseClient, folder: string): Promise<StoredFile[]> {
  const files: StoredFile[] = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.storage.from("media").list(folder, { limit: 1000, offset });
    if (error) throw new Error(error.message);
    for (const item of data) {
      const path = folder ? `${folder}/${item.name}` : item.name;
      // Folders come back without an id.
      if (item.id === null) files.push(...(await listFolder(supabase, path)));
      else if (item.name !== ".emptyFolderPlaceholder") files.push({ path, size: (item.metadata?.size as number | undefined) ?? 0 });
    }
    if (data.length < 1000) return files;
  }
}

/** Files in the media bucket that no profile, project or post refers to. */
export async function findUnusedMedia(supabase: SupabaseClient) {
  const [files, profile, projects, posts] = await Promise.all([
    listFolder(supabase, ""),
    supabase.from("profile").select("photo_url, resume_url").eq("id", 1).maybeSingle(),
    supabase.from("projects").select("image_url"),
    supabase.from("posts").select("content"),
  ]);

  const used = new Set(
    [profile.data?.photo_url, profile.data?.resume_url, ...(projects.data ?? []).map((p) => p.image_url)]
      .map((u) => (u ? mediaPath(u) : null))
      .filter(Boolean),
  );
  // Images pasted into posts as Markdown links count as used too.
  const postText = (posts.data ?? []).map((p) => p.content).join("\n");

  return files.filter((f) => !used.has(f.path) && !postText.includes(`/media/${f.path}`));
}
