"use client";
import { usePathname } from "next/navigation";

// Shown on the public site while an admin is previewing drafts.
export default function PreviewBar() {
  const path = usePathname();
  return (
    <div role="status" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-fg px-4 py-2 text-center text-sm text-bg">
      <span><strong className="font-semibold">Preview mode.</strong> You&apos;re seeing drafts and hidden items.</span>
      <a href={`/api/preview/exit?path=${encodeURIComponent(path)}`} className="font-medium underline underline-offset-4">
        Exit preview
      </a>
    </div>
  );
}
