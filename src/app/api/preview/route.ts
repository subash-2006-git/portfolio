import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin";

// Only same-site paths, so this can't be used as an open redirect.
function safePath(raw: string | null) {
  return raw && raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\") ? raw : "/";
}

/** /api/preview?path=/blog/my-draft : admin-only, turns on draft mode and opens the page. */
export async function GET(request: NextRequest) {
  await requireAdmin();
  (await draftMode()).enable();
  redirect(safePath(request.nextUrl.searchParams.get("path")));
}
