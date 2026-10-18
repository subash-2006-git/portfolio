import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/#about", label: "About", mobile: false },
  { href: "/#experience", label: "Experience", mobile: false },
  { href: "/#projects", label: "Work", mobile: true },
  { href: "/blog", label: "Blog", mobile: true },
];

export default function Nav({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight">
          <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-fg text-sm text-bg">
            {name.charAt(0)}
          </span>
          <span className="hidden sm:inline">{name}</span>
        </Link>
        <ul className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <li key={l.href} className={l.mobile ? "" : "hidden md:block"}>
              <Link href={l.href} className="rounded-md px-2.5 py-2 text-dim transition-colors hover:bg-muted hover:text-fg sm:px-3">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li className="ml-1">
            <Link href="/#contact" className="rounded-md bg-fg px-3.5 py-2 font-medium text-bg transition-opacity hover:opacity-85">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
