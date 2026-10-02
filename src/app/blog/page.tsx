import Link from "next/link";
import { getPosts } from "@/lib/posts";

export const metadata = { title: "Blog" };

export default function Blog() {
  const posts = getPosts();
  return (
    <>
      <h1 className="text-sm text-dim"><span className="text-accent">$</span> ls blog/</h1>
      <ul className="mt-6 space-y-6">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="text-lg text-accent hover:underline">{p.title}</Link>
            <p className="text-xs text-dim">{p.date}</p>
            <p className="mt-1 text-sm">{p.summary}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
