import Link from "next/link";
import PageHeader, { EmptyState, PrimaryLink, StatusBadge } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/admin";
import type { Post } from "@/lib/types";

export const metadata = { title: "Blog posts" };

export default async function PostsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("posts").select("id, slug, title, date, summary, published, updated_at").order("date", { ascending: false });
  const posts = (data ?? []) as Post[];

  return (
    <>
      <PageHeader title="Blog posts" description="Write in Markdown. Drafts stay hidden until you publish them." actions={<PrimaryLink href="/admin/posts/new">Write a post</PrimaryLink>} />
      {posts.length === 0 ? (
        <EmptyState title="No posts yet" body="Share what you're building or learning. Your first post can be short." action={<PrimaryLink href="/admin/posts/new">Write a post</PrimaryLink>} />
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/posts/${p.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-4 hover:bg-panel sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{p.title}</p>
                  {p.summary && <p className="truncate text-sm text-dim">{p.summary}</p>}
                </div>
                <time dateTime={p.date} className="text-sm tabular-nums text-dim">{p.date}</time>
                <StatusBadge on={p.published} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
