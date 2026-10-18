import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-panel px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span aria-hidden className="mx-auto grid size-11 place-items-center rounded-xl bg-fg font-semibold text-bg">A</span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Sign in to admin</h1>
          <p className="mt-2 text-sm text-dim">Manage your portfolio content.</p>
        </div>
        <div className="rounded-2xl border border-line bg-bg p-6 shadow-sm">
          {error === "not-admin" && (
            <p role="alert" className="mb-5 rounded-lg border border-line bg-muted px-3.5 py-2.5 text-sm">
              That account doesn&apos;t have admin access.
            </p>
          )}
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
