"use server";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { serviceClient } from "@/lib/supabase/service";
import { sendEmail } from "@/lib/notify";
import { getProfile } from "@/lib/content";

export type ContactState = { status: "idle" | "sent" | "error"; error?: string };

// Per sender, and a site-wide ceiling in case someone rotates IPs.
const PER_IP = { max: 3, minutes: 10 };
const SITE_WIDE = { max: 30, minutes: 60 };

async function senderHash() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return createHmac("sha256", process.env.SUPABASE_SECRET_KEY ?? "local").update(ip).digest("hex");
}

const since = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Bots fill every field; people never see this one.
  if (String(form.get("company") ?? "")) return { status: "sent" };

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (!name || !email || !message) return { status: "error", error: "Please fill in your name, email and message." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: "error", error: "That email address doesn't look right. Check it and try again." };
  if (message.length > 5000) return { status: "error", error: "Messages can be up to 5,000 characters. Try shortening it." };

  const db = serviceClient();
  const ipHash = await senderHash();

  const [mine, all] = await Promise.all([
    db.from("messages").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since(PER_IP.minutes)),
    db.from("messages").select("id", { count: "exact", head: true }).gte("created_at", since(SITE_WIDE.minutes)),
  ]);
  if ((mine.count ?? 0) >= PER_IP.max) {
    return { status: "error", error: `You've sent a few messages already. Please wait ${PER_IP.minutes} minutes and try again, or email me directly.` };
  }
  if ((all.count ?? 0) >= SITE_WIDE.max) {
    return { status: "error", error: "The form is busy right now. Please try again later, or email me directly." };
  }

  const row = { name: name.slice(0, 200), email, message, ip_hash: ipHash };
  const { error } = await db.from("messages").insert(row);
  if (error) return { status: "error", error: "Your message couldn't be sent right now. Please try again, or email me directly." };

  // Email the owner after the response is sent, so a slow or failing mail service never blocks the visitor.
  after(async () => {
    try {
      const to = process.env.NOTIFY_EMAIL || (await getProfile()).email;
      if (!to) return;
      await sendEmail({
        to,
        replyTo: email,
        subject: `New message from ${row.name}`,
        text: `${row.message}\n\n— ${row.name} <${email}>\n\nReply to this email to answer, or manage messages at /admin/messages.`,
      });
    } catch (e) {
      console.error("Message saved, but the notification email failed:", e);
    }
  });

  return { status: "sent" };
}
