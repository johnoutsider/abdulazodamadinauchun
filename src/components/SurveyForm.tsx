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
        <fieldset key={q.id} className="rounded-xl border bg-white p-4">
          <legend className="px-1 font-medium">{i + 1}. {q.text}</legend>
          {q.options.length ? q.options.map((o) => (
            <label key={o} className="mt-1 flex items-center gap-2"><input type="radio" name={`q_${q.id}`} value={o} required />{o}</label>
          )) : <textarea name={`q_${q.id}`} required rows={2} className="mt-1 w-full rounded-lg border p-2" />}
        </fieldset>
      ))}
      <button className="rounded-lg bg-indigo-700 px-6 py-2.5 font-semibold text-white hover:bg-indigo-800">{send}</button>
    </form>
  );
}
