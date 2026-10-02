import Link from "next/link";
import { site } from "@/data/site";

const links = [
  { href: "/#about", label: "about" },
  { href: "/#projects", label: "projects" },
  { href: "/blog", label: "blog" },
  { href: "/#contact", label: "contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3 text-sm">
        <Link href="/" className="text-accent">
          {site.handle}@portfolio:~$
        </Link>
        <ul className="flex gap-4">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-dim hover:text-accent">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
