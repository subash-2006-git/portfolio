import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "src/content/blog");

export type Post = { slug: string; title: string; date: string; summary: string; content: string };

export function getPosts(): Post[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      return {
        slug: f.replace(/\.md$/, ""),
        title: String(data.title ?? f),
        date: String(data.date ?? ""),
        summary: String(data.summary ?? ""),
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}
