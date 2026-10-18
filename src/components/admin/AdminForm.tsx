"use client";
import { useActionState, useRef, useState, startTransition, useEffect } from "react";
import type { ActionState } from "@/lib/admin";

type Action = (state: ActionState, form: FormData) => Promise<ActionState>;

const LEAVE_MESSAGE = "You have unsaved changes. Leave this page and lose them?";

// Submits through onSubmit rather than <form action> so React doesn't reset the
// fields afterwards: a failed save keeps everything the user typed.
export default function AdminForm({
  action,
  submitLabel = "Save changes",
  children,
  className = "space-y-6",
}: {
  action: Action;
  submitLabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, dispatch, pending] = useActionState(action, undefined);
  const [dirty, setDirty] = useState(false);
  const [lastState, setLastState] = useState(state);
  const ref = useRef<HTMLFormElement>(null);

  // A successful save clears the "unsaved" flag (adjusting state during render, not in an effect).
  if (state !== lastState) {
    setLastState(state);
    if (state?.ok) setDirty(false);
  }

  useEffect(() => {
    if (state?.ok) ref.current?.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach((i) => (i.value = ""));
  }, [state]);

  // Warn before closing/reloading the tab, or following an in-app link, with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const onUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link || link.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (!confirm(LEAVE_MESSAGE)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);

  return (
    <form
      ref={ref}
      className={className}
      onInput={() => setDirty(true)}
      onChange={() => setDirty(true)}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => dispatch(data));
      }}
    >
      {children}
      <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-4 border-t border-line bg-bg/90 px-1 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {!pending && state?.error && <span className="text-danger">{state.error}</span>}
          {!pending && !state?.error && dirty && <span className="text-dim">Unsaved changes</span>}
          {!pending && !state?.error && !dirty && state?.ok && <span className="text-success">{state.ok}</span>}
        </p>
      </div>
    </form>
  );
}
