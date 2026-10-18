import type { Metadata } from "next";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowUpRightIcon } from "@/components/Icons";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "@/app/admin/actions/auth";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { supabase, email } = await requireAdmin();
  const { count } = await supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[15rem_1fr]">
      <aside className="border-b border-line bg-panel md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 md:px-5 md:pt-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-fg text-sm text-bg">A</span>
            Admin
          </Link>
          <ThemeToggle />
        </div>
        <div className="px-3 py-3 md:mt-4 md:flex-1 md:overflow-y-auto">
          <AdminNav unread={count ?? 0} />
        </div>
        <div className="hidden space-y-1 border-t border-line p-3 md:block">
          <Link href="/" target="_blank" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-dim hover:bg-muted hover:text-fg">
            View site <ArrowUpRightIcon />
          </Link>
          <a href="/api/preview?path=%2F" target="_blank" className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-dim hover:bg-muted hover:text-fg">
            Preview with drafts <ArrowUpRightIcon />
          </a>
          <p className="truncate px-3 pt-2 text-xs text-dim" title={email}>{email}</p>
          <form action={signOut}>
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-dim hover:bg-muted hover:text-fg">Sign out</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center justify-end gap-2 border-b border-line px-4 py-2 md:hidden">
          <Link href="/" target="_blank" className="rounded-md px-2.5 py-1.5 text-sm text-dim hover:bg-muted hover:text-fg">View site</Link>
          <form action={signOut}>
            <button className="rounded-md px-2.5 py-1.5 text-sm font-medium text-dim hover:bg-muted hover:text-fg">Sign out</button>
          </form>
        </div>
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
