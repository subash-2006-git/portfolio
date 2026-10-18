// Plain form fields with visible labels. Uncontrolled, so they work inside AdminForm.

export const inputClass =
  "w-full rounded-lg border border-line bg-bg px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-dim/60 focus:border-accent focus:ring-4 focus:ring-accent/15";

function Label({ htmlFor, label, hint }: { htmlFor: string; label: string; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-dim">{hint}</p>}
    </div>
  );
}

type FieldProps = {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  className?: string;
};

export function Field({ name, label, hint, defaultValue, required, placeholder, type = "text", className }: FieldProps) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} hint={hint} />
      <input id={id} name={name} type={type} defaultValue={defaultValue} required={required} placeholder={placeholder} className={inputClass} />
    </div>
  );
}

export function TextArea({ name, label, hint, defaultValue, required, placeholder, rows = 4, className, mono }: FieldProps & { rows?: number; mono?: boolean }) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} hint={hint} />
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className={`${inputClass} leading-relaxed ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}

export function Checkbox({ name, label, hint, defaultChecked }: { name: string; label: string; hint?: string; defaultChecked?: boolean }) {
  const id = `f-${name}`;
  return (
    <div className="flex gap-3">
      <input id={id} name={name} type="checkbox" defaultChecked={defaultChecked} className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]" />
      <div>
        <label htmlFor={id} className="block text-sm font-medium">{label}</label>
        {hint && <p className="mt-0.5 text-xs text-dim">{hint}</p>}
      </div>
    </div>
  );
}

export function Select({ name, label, defaultValue, options }: { name: string; label: string; defaultValue?: string; options: { value: string; label: string }[] }) {
  const id = `f-${name}`;
  return (
    <div>
      <Label htmlFor={id} label={label} />
      <select id={id} name={name} defaultValue={defaultValue} className={inputClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <h2 className="font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-1 text-sm text-dim">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}
