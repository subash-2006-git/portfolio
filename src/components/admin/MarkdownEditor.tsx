"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { inputClass } from "@/components/admin/fields";

// Write / Preview tabs. The textarea stays mounted (just hidden) so its value is always submitted.
export default function MarkdownEditor({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const tabClass = (t: string) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${tab === t ? "bg-bg text-fg shadow-sm" : "text-dim hover:text-fg"}`;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={`f-${name}`} className="text-sm font-medium">Content</label>
        <div role="tablist" aria-label="Editor mode" className="flex gap-1 rounded-lg bg-muted p-1">
          <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")} className={tabClass("write")}>Write</button>
          <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")} className={tabClass("preview")}>Preview</button>
        </div>
      </div>
      <textarea
        id={`f-${name}`}
        name={name}
        rows={20}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={"Write in Markdown.\n\n## A heading\n\nSome text with **bold**, a [link](https://example.com) and `code`."}
        className={`${inputClass} font-mono leading-relaxed ${tab === "preview" ? "hidden" : ""}`}
      />
      {tab === "preview" && (
        <div className="min-h-[24rem] space-y-4 rounded-lg border border-line bg-bg p-5 leading-relaxed [&_a]:text-accent [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:text-dim [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em] [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:font-semibold [&_li]:ml-6 [&_li]:list-disc [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-line [&_pre]:bg-panel [&_pre]:p-4 [&_pre]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0">
          {value.trim() ? <ReactMarkdown>{value}</ReactMarkdown> : <p className="text-dim">Nothing to preview yet.</p>}
        </div>
      )}
      <p className="mt-1.5 text-xs text-dim">Markdown: ## headings, **bold**, *italic*, [links](url), - lists, ``` code blocks.</p>
    </div>
  );
}
