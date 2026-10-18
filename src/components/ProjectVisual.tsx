import Image from "next/image";
import type { Project } from "@/lib/types";

// Screenshot if the project has one, otherwise a branded placeholder at the same aspect ratio.
export default function ProjectVisual({ p, priority = false, sizes }: { p: Project; priority?: boolean; sizes: string }) {
  if (p.image_url) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image src={p.image_url} alt={`Screenshot of ${p.name}`} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-accent-soft"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 15%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 55%), radial-gradient(circle at 85% 90%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 50%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <span className="relative grid size-16 place-items-center rounded-2xl border border-line bg-bg text-2xl font-semibold text-accent shadow-sm">
        {p.name.charAt(0)}
      </span>
    </div>
  );
}
