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
    <div className="grid gap-8 lg:grid-cols-2">
      <form action={action} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
        <label className="block">
          <span className="font-medium">{t.f_unit}</span>
          <textarea name="text" required maxLength={500} rows={3} placeholder={t.f_unit_ph} className="mt-1 w-full rounded-lg border p-2" />
        </label>
        <label className="block">
          <span className="font-medium">{t.f_situation}</span>
          <textarea name="situation" maxLength={600} rows={3} placeholder={t.f_situation_ph} className="mt-1 w-full rounded-lg border p-2" />
        </label>
        <label className="block">
          <span className="font-medium">{t.f_lang}</span>
          <select name="lang" className="mt-1 w-full rounded-lg border p-2">
            <option value="auto">{t.f_lang_auto}</option><option value="en">English</option><option value="uz">O&apos;zbek</option>
          </select>
        </label>
        <fieldset className="rounded-lg border p-3">
          <legend className="px-1 text-sm font-medium">{t.f_optional}</legend>
          <div className="grid grid-cols-2 gap-3">
            {types.map((ty) => (
              <label key={ty} className="text-sm">
                {typeLabels[ty]}
                <select name={`f_${ty}`} className="mt-1 w-full rounded-lg border p-1.5">
                  <option value="">—</option>
                  {options.filter((o) => o.type === ty).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            ))}
          </div>
        </fieldset>
        <button disabled={pending} className="w-full rounded-lg bg-indigo-700 px-4 py-2.5 font-semibold text-white hover:bg-indigo-800 disabled:opacity-60">
          {pending ? t.f_loading : t.f_submit}
        </button>
      </form>

      <div aria-live="polite">
        {state && !state.ok && <p className="rounded-lg bg-red-50 p-4 text-red-800">{t[state.error]}</p>}
        {state?.ok && (
          <div className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
            <div>
              <div className="text-sm text-slate-500">{t.r_strategy}</div>
              <div className="text-xl font-bold text-indigo-800">
                {state.strategy ? name(state.strategy.nameUz, state.strategy.nameEn) : "—"}
              </div>
              {state.strategy?.parentUz && (
                <div className="text-sm text-slate-500">↳ {name(state.strategy.parentUz, state.strategy.parentEn ?? "")}</div>
              )}
              {state.strategy && <p className="mt-1 text-sm text-slate-600">{name(state.strategy.descUz, state.strategy.descEn)}</p>}
            </div>
            {state.factors.length > 0 && (
              <div>
                <div className="text-sm text-slate-500">{t.r_factors}</div>
                <ul className="mt-1 flex flex-wrap gap-2">
                  {state.factors.map((f) => (
                    <li key={f.type + f.value} className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-900">
                      {typeLabels[f.type]}: {name(f.labelUz, f.labelEn)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {state.explanation && <Block title={t.r_explain} text={state.explanation} />}
            {state.example && <Block title={t.r_example} text={state.example} />}
            {state.suggestion && <Block title={t.r_suggest} text={state.suggestion} />}
            <div className="text-xs text-slate-500">
              {t.r_source}: {t[`src_${state.source}`]}
              {state.source !== "CORPUS" && <p className="mt-1">{t.r_ai_note}</p>}
            </div>
            <div className="flex items-center gap-2 border-t pt-3 text-sm">
              {voted === state.id ? <span>{t.r_thanks}</span> : (
                <>
                  <span>{t.r_helpful}</span>
                  <button onClick={() => { setVoted(state.id); sendFeedback(state.id, 1); }} className="rounded border px-2 py-0.5" aria-label="yes">👍</button>
                  <button onClick={() => { setVoted(state.id); sendFeedback(state.id, -1); }} className="rounded border px-2 py-0.5" aria-label="no">👎</button>
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
    <div>
      <div className="text-sm text-slate-500">{title}</div>
      <p className="mt-0.5 whitespace-pre-wrap">{text}</p>
    </div>
  );
}
