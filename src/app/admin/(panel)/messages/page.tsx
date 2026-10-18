import PageHeader, { EmptyState } from "@/components/admin/PageHeader";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/admin";
import { deleteMessage, markAllRead, setMessageRead } from "@/app/admin/actions/messages";
import type { Message } from "@/lib/types";

export const metadata = { title: "Messages" };

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

export default async function MessagesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  const messages = (data ?? []) as Message[];
  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader
        title="Messages"
        description={unread ? `${unread} unread, from your contact form.` : "From your contact form."}
        actions={
          unread > 0 && (
            <form action={markAllRead}>
              <button className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium hover:bg-muted">Mark all as read</button>
            </form>
          )
        }
      />
      {messages.length === 0 ? (
        <EmptyState title="No messages yet" body="When someone fills in the contact form on your site, their message shows up here." />
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={`rounded-2xl border p-5 ${m.read ? "border-line" : "border-accent/40 bg-accent-soft/40"}`}>
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <p className="font-medium">
                    {!m.read && <span aria-hidden className="mr-2 inline-block size-2 rounded-full bg-accent align-middle" />}
                    {m.name}
                    {!m.read && <span className="sr-only"> (unread)</span>}
                  </p>
                  <a href={`mailto:${m.email}`} className="break-all text-sm text-dim hover:text-accent">{m.email}</a>
                </div>
                <time dateTime={m.created_at} className="text-xs tabular-nums text-dim">{fmt.format(new Date(m.created_at))}</time>
              </div>
              <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed">{m.message}</p>
              <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-line pt-3">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-accent hover:bg-muted"
                >
                  Reply by email
                </a>
                <form action={setMessageRead.bind(null, m.id, !m.read)}>
                  <button className="rounded-md px-2.5 py-1.5 text-sm font-medium text-dim hover:bg-muted hover:text-fg">
                    {m.read ? "Mark as unread" : "Mark as read"}
                  </button>
                </form>
                <form action={deleteMessage.bind(null, m.id)} className="ml-auto">
                  <ConfirmButton message={`Delete the message from ${m.name}? This can't be undone.`}>Delete</ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
