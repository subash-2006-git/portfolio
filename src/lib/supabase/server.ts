import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Session-aware client for the admin area. Create one per request.
export async function serverClient() {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a server component, where cookies are read-only. proxy.ts refreshes the session instead.
        }
      },
    },
  });
}
