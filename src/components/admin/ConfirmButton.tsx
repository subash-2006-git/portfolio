"use client";

// Submit button that asks before a destructive action, naming what will be removed.
export default function ConfirmButton({
  message,
  children,
  className = "rounded-md px-2.5 py-1.5 text-sm font-medium text-danger hover:bg-muted",
  label,
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="submit"
      aria-label={label}
      title={label}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
