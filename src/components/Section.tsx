export default function Section({ id, cmd, children }: { id: string; cmd: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 pt-16">
      <h2 className="mb-5 text-sm text-dim">
        <span className="text-accent">$</span> {cmd}
      </h2>
      {children}
    </section>
  );
}
