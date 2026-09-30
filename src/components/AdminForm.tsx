"use client";
import { useActionState } from "react";
import type { Msg } from "@/app/admin/actions";

// Umumiy admin formasi: server action + natija xabari
export default function AdminForm({ action, children, submit, className = "" }: {
  action: (s: Msg, fd: FormData) => Promise<Msg>; children: React.ReactNode; submit: string; className?: string;
}) {
  const [state, act, pending] = useActionState(action, undefined);
  return (
    <form action={act} className={`space-y-3 rounded-xl border bg-white p-4 ${className}`}>
      {children}
      {state?.error && <p className="rounded bg-red-50 p-2 text-sm text-red-800">{state.error}</p>}
      {state?.ok && <p className="rounded bg-green-50 p-2 text-sm text-green-800">{state.ok}</p>}
      <button disabled={pending} className="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white hover:bg-indigo-800 disabled:opacity-60">{submit}</button>
    </form>
  );
}
