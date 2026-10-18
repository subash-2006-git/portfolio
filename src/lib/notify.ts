import "server-only";

type Email = { to: string; subject: string; text: string; replyTo?: string };

// Sends through Resend when RESEND_API_KEY is set (production), otherwise to the
// local Mailpit inbox from `supabase start` (MAILPIT_URL). With neither, it's a no-op.
export async function sendEmail({ to, subject, text, replyTo }: Email) {
  const from = process.env.NOTIFY_FROM ?? "Portfolio <onboarding@resend.dev>";

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text, reply_to: replyTo }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
    return;
  }

  if (process.env.MAILPIT_URL) {
    const res = await fetch(`${process.env.MAILPIT_URL}/api/v1/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        From: { Email: "portfolio@localhost", Name: "Portfolio" },
        To: [{ Email: to }],
        ReplyTo: replyTo ? [{ Email: replyTo }] : [],
        Subject: subject,
        Text: text,
      }),
    });
    if (!res.ok) throw new Error(`Mailpit responded ${res.status}: ${await res.text()}`);
  }
}
