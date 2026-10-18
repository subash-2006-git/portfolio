import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { ArrowUpRightIcon } from "@/components/Icons";
import { requireAdmin } from "@/lib/admin";
import { deletePost } from "@/app/admin/actions/posts";
import type { Post } from "@/lib/types";
import PostForm from "../PostForm";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const post = data as Post;

  return (
    <>
      <PageHeader
        title={post.title}
        back={{ href: "/admin/posts", label: "Blog posts" }}
        actions={
          <>
            <a
              href={`/api/preview?path=${encodeURIComponent(`/blog/${post.slug}`)}`}
              target="_blank"
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-dim hover:bg-muted hover:text-fg"
            >
              {post.published ? "View" : "Preview draft"} <ArrowUpRightIcon />
            </a>
            <form action={deletePost.bind(null, post.id)}>
              <ConfirmButton message={`Delete "${post.title}"? This can't be undone.`}>Delete post</ConfirmButton>
            </form>
          </>
        }
      />
      {created && <p role="status" className="mb-6 rounded-lg bg-accent-soft px-4 py-3 text-sm text-accent">Post created.</p>}
      <PostForm key={post.id} post={post} />
    </>
  );
}
