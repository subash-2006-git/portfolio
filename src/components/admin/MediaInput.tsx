"use client";
import { useState } from "react";

// File picker with a preview of the current upload. Pairs with mediaField() in lib/admin.ts,
// which reads `${name}`, `${name}_current` and `${name}_remove`.
export default function MediaInput({
  name,
  label,
  hint,
  current,
  accept = "image/*",
  kind = "image",
}: {
  name: string;
  label: string;
  hint?: string;
  current: string;
  accept?: string;
  kind?: "image" | "file";
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);
  const shown = remove ? "" : preview ?? current;
  const id = `f-${name}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-dim">{hint}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-4">
        {kind === "image" ? (
          <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob previews can't go through next/image */}
            {shown ? <img src={shown} alt="" className="size-full object-cover" /> : <span className="text-xs text-dim">None</span>}
          </div>
        ) : (
          <p className="min-w-0 max-w-full truncate text-sm">
            {shown ? (
              <a href={shown} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">
                {preview ? "New file selected" : "View current file"}
              </a>
            ) : (
              <span className="text-dim">No file uploaded</span>
            )}
          </p>
        )}
        <div className="space-y-2">
          <input
            id={id}
            name={name}
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
              if (file) setRemove(false);
            }}
            className="block max-w-full text-sm text-dim file:mr-3 file:rounded-md file:border file:border-line file:bg-bg file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-fg hover:file:bg-muted"
          />
          {current && (
            <label className="flex items-center gap-2 text-sm text-dim">
              <input type="checkbox" name={`${name}_remove`} checked={remove} onChange={(e) => setRemove(e.target.checked)} className="size-4 accent-[var(--accent)]" />
              Remove current {kind === "image" ? "image" : "file"}
            </label>
          )}
        </div>
      </div>
      <input type="hidden" name={`${name}_current`} value={current} />
    </div>
  );
}
