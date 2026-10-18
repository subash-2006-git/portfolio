import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeftIcon } from "@/components/Icons";
import { getPost, getPublishedSlugs } from "@/lib/content";

export async function generateStaticParams() {
  return getPublishedSlugs("posts");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  return { title: post?.title, description: post?.summary };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-2xl py-16 sm:py-24">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-dim hover:text-fg">
        <ArrowLeftIcon /> All posts
      </Link>
      <p className="mt-10 flex items-center gap-3 text-sm text-dim">
        <time dateTime={post.date} className="tabular-nums">{post.date}</time>
        {!post.published && <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">Draft</span>}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
      {post.summary && <p className="mt-4 text-xl leading-relaxed text-dim">{post.summary}</p>}
      <div className="mt-10 space-y-5 border-t border-line pt-10 text-lg leading-relaxed [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:text-dim [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-6 [&_li]:list-disc [&_li]:marker:text-dim [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-line [&_pre]:bg-panel [&_pre]:p-5 [&_pre]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
