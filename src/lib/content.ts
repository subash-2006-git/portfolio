import { cache } from "react";
import { draftMode } from "next/headers";
import { publicClient } from "@/lib/supabase/public";
import { serverClient } from "@/lib/supabase/server";
import type { Experience, Post, Profile, Project, SkillGroup } from "@/lib/types";

// Public reads. Errors throw so a broken connection never gets cached as an empty page.
function must<T>({ data, error }: { data: T | null; error: { message: string } | null }, what: string): T {
  if (error) throw new Error(`Failed to load ${what}: ${error.message}`);
  return data as T;
}

/**
 * In preview (draft mode, turned on by an admin from /admin) reads go through the admin's
 * session, so row level security also returns unpublished rows. Anyone else holding the
 * draft cookie still gets published content only, because RLS checks is_admin().
 */
const source = cache(async () => {
  const { isEnabled } = await draftMode();
  return { db: isEnabled ? await serverClient() : publicClient(), preview: isEnabled };
});

export const isPreview = async () => (await source()).preview;

export const getProfile = cache(async (): Promise<Profile> => {
  const { db } = await source();
  const profile = must<Profile | null>(await db.from("profile").select("*").eq("id", 1).maybeSingle(), "profile");
  if (!profile) throw new Error("No profile row found. Run `npm run db:reset` to seed the database.");
  return profile;
});

export const getSkills = cache(async () => {
  const { db } = await source();
  return must<SkillGroup[]>(await db.from("skill_groups").select("*").order("position"), "skills");
});

export const getProjects = cache(async () => {
  const { db, preview } = await source();
  let q = db.from("projects").select("*");
  if (!preview) q = q.eq("published", true);
  return must<Project[]>(await q.order("position").order("created_at"), "projects");
});

export const getExperience = cache(async () => {
  const { db, preview } = await source();
  let q = db.from("experience").select("*");
  if (!preview) q = q.eq("published", true);
  return must<Experience[]>(await q.order("position"), "experience");
});

export const getPosts = cache(async () => {
  const { db, preview } = await source();
  let q = db.from("posts").select("*");
  if (!preview) q = q.eq("published", true);
  return must<Post[]>(await q.order("date", { ascending: false }), "posts");
});

/** Published slugs for generateStaticParams, which runs at build time with no request (so no draft mode). */
export async function getPublishedSlugs(table: "projects" | "posts") {
  const res = await publicClient().from(table).select("slug").eq("published", true);
  return must<{ slug: string }[]>(res, table);
}

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug);
}
