"use client";
import { useState } from "react";
import { submitSurvey } from "@/app/survey/actions";

type Q = { id: number; text: string; options: string[] };

export default function SurveyForm({ surveyId, questions, send, done }: { surveyId: number; questions: Q[]; send: string; done: string }) {
  const [sent, setSent] = useState(false);
  if (sent) return <p className="rounded-lg bg-green-50 p-4 text-green-800">{done}</p>;
  return (
    <form action={async (fd) => { await submitSurvey(surveyId, fd); setSent(true); }} className="space-y-5">
      {questions.map((q, i) => (
        <fieldset key={q.id} className="card p-5">
          <legend className="float-left mb-3 w-full font-medium text-slate-900">{i + 1}. {q.text}</legend>
          {q.options.length ? q.options.map((o) => (
            <label key={o} className="mt-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 transition hover:bg-slate-50"><input type="radio" name={`q_${q.id}`} value={o} required />{o}</label>
          )) : <textarea name={`q_${q.id}`} required rows={2} className="mt-1 w-full rounded-lg border p-2" />}
        </fieldset>
      ))}
      <button className="rounded-lg bg-indigo-800 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-indigo-900">{send}</button>
    </form>
  );
}
