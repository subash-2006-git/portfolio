import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import Nav from "@/components/Nav";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: `${site.name} | ${site.title}`,
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="min-h-screen antialiased">
        <Nav />
        <main className="mx-auto max-w-3xl px-5 pb-24 pt-10">{children}</main>
        <footer className="border-t border-line py-6 text-center text-xs text-dim">
          © {new Date().getFullYear()} {site.name}. Built with Next.js.
        </footer>
      </body>
    </html>
  );
}
