import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPost, getPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return { title: post?.title, description: post?.summary };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return (
    <article>
      <h1 className="text-3xl font-bold text-accent">{post.title}</h1>
      <p className="mt-1 text-xs text-dim">{post.date}</p>
      <div className="prose-terminal mt-8 space-y-4 leading-relaxed [&_a]:underline [&_code]:text-accent [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:text-accent [&_li]:ml-5 [&_li]:list-disc [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:border [&_pre]:border-line [&_pre]:bg-panel [&_pre]:p-4">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
