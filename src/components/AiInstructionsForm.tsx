"use client";
import { useActionState, useState } from "react";
import { saveAiInstructions, type AiMsg } from "@/app/ai-instructions/actions";

export default function AiInstructionsForm({ initial, defaultText, t }: {
  initial: string; defaultText: string; t: Record<string, string>;
}) {
  const [state, action, pending] = useActionState<AiMsg, FormData>(saveAiInstructions, undefined);
  const [text, setText] = useState(initial);

  return (
    <form action={action} className="card space-y-4 p-6">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">{t.ai_label}</span>
        <textarea name="instructions" value={text} onChange={(e) => setText(e.target.value)} rows={16} maxLength={8000}
          className="mt-1.5 w-full rounded-lg border px-3 py-2.5 font-mono text-sm leading-relaxed" />
      </label>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{text.length} / 8000</span>
        {text.trim() !== defaultText.trim() && (
          <button type="button" onClick={() => setText(defaultText)} className="text-indigo-700 hover:underline">
            {t.ai_reset}
          </button>
        )}
      </div>
      {state?.ok && <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{t[state.ok]}</p>}
      {state?.error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{t[state.error]}</p>}
      <div className="flex flex-wrap gap-3">
        <button name="intent" value="save" disabled={pending}
          className="rounded-lg bg-indigo-800 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-indigo-900 disabled:opacity-60">
          {t.ai_save}
        </button>
      </div>
    </form>
  );
}
