import Link from "next/link";
import { getPosts } from "@/lib/content";

export const metadata = { title: "Blog" };

export default async function Blog() {
  const posts = await getPosts();
  return (
    <div className="py-16 sm:py-24">
      <p className="text-sm font-medium text-accent">Blog</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Writing</h1>
      <p className="mt-4 max-w-2xl text-lg text-dim">Notes on what I&apos;m building and learning.</p>
      {posts.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-line p-10 text-center text-dim">No posts yet. Check back soon.</p>
      ) : (
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/blog/${p.slug}`} className="group grid gap-1 py-6 sm:grid-cols-[8rem_1fr] sm:gap-8">
                <time dateTime={p.date} className="pt-0.5 text-sm tabular-nums text-dim">{p.date}</time>
                <span>
                  <span className="text-lg font-medium group-hover:text-accent">{p.title}</span>
                  {p.summary && <span className="mt-1 block leading-relaxed text-dim">{p.summary}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
