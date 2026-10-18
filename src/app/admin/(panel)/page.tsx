import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import { ArrowRightIcon } from "@/components/Icons";
import { requireAdmin } from "@/lib/admin";
import type { Message } from "@/lib/types";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { findUnusedMedia } from "@/lib/media";
import { deleteUnusedMedia } from "@/app/admin/actions/media";

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const count = (table: string) => supabase.from(table).select("id", { count: "exact", head: true });

  const [projects, posts, drafts, experience, unread, recent] = await Promise.all([
    count("projects"),
    count("posts").eq("published", true),
    count("posts").eq("published", false),
    count("experience"),
    count("messages").eq("read", false),
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Projects", value: projects.count ?? 0, href: "/admin/projects" },
    { label: "Published posts", value: posts.count ?? 0, href: "/admin/posts", note: drafts.count ? `${drafts.count} draft${drafts.count > 1 ? "s" : ""}` : undefined },
    { label: "Experience entries", value: experience.count ?? 0, href: "/admin/experience" },
    { label: "Unread messages", value: unread.count ?? 0, href: "/admin/messages" },
  ];
  const messages = (recent.data ?? []) as Message[];
  const unused = await findUnusedMedia(supabase).catch(() => []);
  const unusedSize = unused.reduce((sum, f) => sum + f.size, 0);

  return (
    <>
      <PageHeader title="Dashboard" description="Everything on your portfolio, in one place." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-accent/40">
            <p className="text-sm text-dim">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">{s.value}</p>
            {s.note && <p className="mt-1 text-xs text-dim">{s.note}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-line">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-semibold tracking-tight">Recent messages</h2>
            <Link href="/admin/messages" className="text-sm font-medium text-accent hover:underline hover:underline-offset-4">View all</Link>
          </div>
          {messages.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-dim">No messages yet. They&apos;ll appear here when someone uses your contact form.</p>
          ) : (
            <ul className="divide-y divide-line">
              {messages.map((m) => (
                <li key={m.id} className="px-5 py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-medium">
                      {!m.read && <span aria-hidden className="mr-2 inline-block size-2 rounded-full bg-accent" />}
                      {m.name}
                      {!m.read && <span className="sr-only"> (unread)</span>}
                    </p>
                    <time dateTime={m.created_at} className="shrink-0 text-xs tabular-nums text-dim">
                      {new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </time>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-dim">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
        <section className="rounded-2xl border border-line p-5">
          <h2 className="font-semibold tracking-tight">Quick actions</h2>
          <ul className="mt-4 space-y-1">
            {[
              { href: "/admin/posts/new", label: "Write a blog post" },
              { href: "/admin/projects/new", label: "Add a project" },
              { href: "/admin/experience/new", label: "Add experience" },
              { href: "/admin/profile", label: "Update profile and résumé" },
            ].map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-muted">
                  {a.label}
                  <ArrowRightIcon className="size-4 text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line p-5">
          <h2 className="font-semibold tracking-tight">Storage</h2>
          {unused.length === 0 ? (
            <p className="mt-2 text-sm text-dim">Every uploaded file is in use.</p>
          ) : (
            <>
              <p className="mt-2 text-sm text-dim">
                {unused.length} uploaded file{unused.length > 1 ? "s aren't" : " isn't"} used anywhere ({formatBytes(unusedSize)}).
              </p>
              <form action={deleteUnusedMedia} className="mt-4">
                <ConfirmButton
                  message={`Delete ${unused.length} unused file${unused.length > 1 ? "s" : ""}? Files still used by your profile, projects or posts are kept. This can't be undone.`}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-danger hover:bg-muted"
                >
                  Delete unused files
                </ConfirmButton>
              </form>
            </>
          )}
        </section>
        </div>
      </div>
    </>
  );
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
