import { createClient } from "@supabase/supabase-js";

// Cookie-free client for public reads and anonymous inserts. Row level security
// limits it to published content, so it is safe in any server component.
export function publicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
