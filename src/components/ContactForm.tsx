"use client";
import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/(site)/actions";

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div role="status" className="py-6 text-center">
        <p className="text-lg font-semibold">Message sent</p>
        <p className="mt-2 text-dim">Thanks for reaching out. I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  const field = "w-full rounded-lg border border-line bg-bg px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-dim/60 focus:border-accent focus:ring-4 focus:ring-accent/15";
  const label = "mb-1.5 block text-sm font-medium";
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>Name</label>
          <input id="cf-name" name="name" required maxLength={200} autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>Email</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="cf-message" className={label}>Message</label>
        <textarea id="cf-message" name="message" required maxLength={5000} rows={5} className={field} />
      </div>
      {/* Spam trap: hidden from people and screen readers */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button disabled={pending} className="rounded-lg bg-accent px-5 py-3 text-sm font-medium text-accent-fg shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50">
          {pending ? "Sending…" : "Send message"}
        </button>
        <p role="status" className="text-sm text-danger">{state.status === "error" && state.error}</p>
      </div>
    </form>
  );
}
