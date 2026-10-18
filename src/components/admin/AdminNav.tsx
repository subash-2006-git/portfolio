"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/posts", label: "Blog posts" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminNav({ unread }: { unread: number }) {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-col md:overflow-visible md:p-0">
      {items.map((item) => {
        const active = item.href === "/admin" ? path === "/admin" : path.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-muted text-fg" : "text-dim hover:bg-muted hover:text-fg"
            }`}
          >
            {item.label}
            {item.href === "/admin/messages" && unread > 0 && (
              <span className="rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-semibold leading-none tabular-nums text-accent-fg">
                {unread}
                <span className="sr-only"> unread</span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
