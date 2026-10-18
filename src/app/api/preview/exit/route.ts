import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

/** /api/preview/exit?path=/blog : turns draft mode off and returns to the page. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const raw = request.nextUrl.searchParams.get("path");
  redirect(raw && raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\") ? raw : "/");
}
