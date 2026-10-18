"use client";
import { useActionState } from "react";
import { signIn } from "@/app/admin/actions/auth";
import { inputClass } from "@/components/admin/fields";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-danger">{state.error}</p>
      )}
      <button disabled={pending} className="w-full rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
