export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-line py-20 sm:py-24">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium text-accent">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        {description && <p className="mt-4 text-lg leading-relaxed text-dim">{description}</p>}
      </div>
      {children}
    </section>
  );
}
