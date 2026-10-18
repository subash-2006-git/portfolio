import "server-only";
import { createClient } from "@supabase/supabase-js";

// Bypasses row level security. Server-only, and only for narrow jobs the public
// key can't do (saving contact messages after the rate-limit check).
export function serviceClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY is not set. Run `npm run db:env`.");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
