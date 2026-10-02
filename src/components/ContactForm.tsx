"use client";
import { useState } from "react";
import { site } from "@/data/site";

// Set NEXT_PUBLIC_FORMSPREE_ID to send via Formspree; otherwise falls back to mailto.
const formspree = process.env.NEXT_PUBLIC_FORMSPREE_ID;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!formspree) {
      const body = encodeURIComponent(`${data.get("message")}\n\n- ${data.get("name")}`);
      window.location.href = `mailto:${site.email}?subject=Portfolio%20message&body=${body}`;
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${formspree}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const field = "w-full rounded border border-line bg-panel px-3 py-2 text-sm outline-none focus:border-accent";
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input name="name" required placeholder="name" aria-label="Name" className={field} />
      <input name="email" type="email" required placeholder="email" aria-label="Email" className={field} />
      <textarea name="message" required rows={5} placeholder="message" aria-label="Message" className={field} />
      <button disabled={status === "sending"} className="rounded border border-accent px-4 py-2 text-sm text-accent hover:bg-accent hover:text-bg disabled:opacity-50">
        {status === "sending" ? "sending..." : "./send.sh"}
      </button>
      {status === "sent" && <p className="text-sm text-accent">Message sent. Thanks!</p>}
      {status === "error" && <p className="text-sm text-red-400">Something went wrong. Try emailing directly.</p>}
    </form>
  );
}
