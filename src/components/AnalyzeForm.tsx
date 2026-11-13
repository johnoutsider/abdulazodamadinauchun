"use client";
import { useActionState, useState } from "react";
import { runAnalysis, sendFeedback, type AnalyzeOut } from "@/app/analyze/actions";

type Opt = { type: string; value: string; label: string };
type Labels = Record<string, string>;

export default function AnalyzeForm({ lang, t, options, typeLabels }: {
  lang: "uz" | "en"; t: Labels; options: Opt[]; typeLabels: Labels;
}) {
  const [state, action, pending] = useActionState<AnalyzeOut | null, FormData>(runAnalysis, null);
  const [voted, setVoted] = useState<number | null>(null);
  const types = [...new Set(options.map((o) => o.type))];
  const name = (uz: string, en: string) => (lang === "uz" ? uz : en);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2">
      <form action={action} className="card space-y-5 p-6">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t.f_unit}</span>
          <textarea name="text" required maxLength={500} rows={3} placeholder={t.f_unit_ph} className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t.f_situation}</span>
          <textarea name="situation" maxLength={600} rows={3} placeholder={t.f_situation_ph} className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t.f_lang}</span>
          <select name="lang" className="mt-1.5 w-full rounded-lg border px-3 py-2.5">
            <option value="auto">{t.f_lang_auto}</option><option value="en">English</option><option value="uz">O&apos;zbek</option>
          </select>
        </label>
        <fieldset className="rounded-xl border bg-slate-50/60 p-4">
          <legend className="px-1 text-sm font-medium text-slate-700">{t.f_optional}</legend>
          <div className="grid grid-cols-2 gap-3">
            {types.map((ty) => (
              <label key={ty} className="text-sm text-slate-600">
                {typeLabels[ty]}
                <select name={`f_${ty}`} className="mt-1 w-full rounded-lg border px-2.5 py-2">
                  <option value="">—</option>
                  {options.filter((o) => o.type === ty).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            ))}
          </div>
        </fieldset>
        <button disabled={pending} className="w-full rounded-lg bg-indigo-800 px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-indigo-900 disabled:opacity-60">
          {pending ? t.f_loading : t.f_submit}
        </button>
      </form>

      <div aria-live="polite" className="lg:sticky lg:top-24">
        {!state && !pending && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M9 17v-6M13 17V7M17 17v-3M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" /></svg>
            <p className="mt-3 text-sm">{t.r_empty}</p>
          </div>
        )}
        {pending && (
          <div className="card animate-pulse space-y-4 p-6">
            <div className="h-4 w-24 rounded bg-slate-200" /><div className="h-7 w-2/3 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" /><div className="h-4 w-5/6 rounded bg-slate-100" />
          </div>
        )}
        {!pending && state && !state.ok && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{t[state.error]}</p>}
        {!pending && state?.ok && (
          <div className="card space-y-5 overflow-hidden p-0">
            <div className="border-b bg-indigo-50/60 px-6 py-5">
              <div className="eyebrow">{t.r_strategy}</div>
              <div className="mt-1 font-serif text-2xl font-semibold text-indigo-900">
                {state.strategy ? name(state.strategy.nameUz, state.strategy.nameEn) : "—"}
              </div>
              {state.strategy && (
                <div className="mt-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-500">{t.main_strategy}:</span>{" "}
                  <span className="rounded-full bg-accent-50 px-2.5 py-0.5 font-medium text-accent-700">
                    {state.strategy.parentUz ? name(state.strategy.parentUz, state.strategy.parentEn ?? "") : name(state.strategy.nameUz, state.strategy.nameEn)}
                  </span>
                </div>
              )}
              {state.strategy && <p className="mt-1 text-sm text-slate-600">{name(state.strategy.descUz, state.strategy.descEn)}</p>}
            </div>
            {state.factors.length > 0 && (
              <div className="px-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.r_factors}</div>
                <ul className="mt-1 flex flex-wrap gap-2">
                  {state.factors.map((f) => (
                    <li key={f.type + f.value} className="rounded-full border border-indigo-100 bg-white px-3 py-1 text-sm text-indigo-900">
                      {typeLabels[f.type]}: {name(f.labelUz, f.labelEn)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {state.explanation && <Block title={t.r_explain} text={state.explanation} />}
            {state.example && <Block title={t.r_example} text={state.example} />}
            {state.suggestion && <Block title={t.r_suggest} text={state.suggestion} />}
            <div className="mx-6 text-xs text-slate-500">
              {t.r_source}: {t[`src_${state.source}`]}
              {state.source !== "CORPUS" && <p className="mt-1">{t.r_ai_note}</p>}
            </div>
            <div className="flex items-center gap-2 border-t bg-slate-50 px-6 py-3 text-sm text-slate-600">
              {voted === state.id ? <span>{t.r_thanks}</span> : (
                <>
                  <span>{t.r_helpful}</span>
                  <button onClick={() => { setVoted(state.id); sendFeedback(state.id, 1); }} className="rounded-md border bg-white px-2.5 py-1 transition hover:bg-slate-100" aria-label="yes">👍</button>
                  <button onClick={() => { setVoted(state.id); sendFeedback(state.id, -1); }} className="rounded-md border bg-white px-2.5 py-1 transition hover:bg-slate-100" aria-label="no">👎</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div className="px-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <p className="mt-1 whitespace-pre-wrap leading-relaxed text-slate-800">{text}</p>
    </div>
  );
}
