"use server";
import { one, query } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function submitSurvey(surveyId: number, fd: FormData) {
  const qs = await query<{ id: number; text: string }>(
    "SELECT id,text FROM survey_questions WHERE survey_id=$1 ORDER BY position,id", [surveyId]);
  const active = await one("SELECT 1 FROM surveys WHERE id=$1 AND is_active", [surveyId]);
  if (!active) return;
  const answers: Record<string, string> = {};
  for (const q of qs) answers[q.text] = String(fd.get(`q_${q.id}`) ?? "").slice(0, 2000);
  const user = await getUser();
  await query("INSERT INTO survey_responses (survey_id,user_id,answers) VALUES ($1,$2,$3)", [surveyId, user?.id ?? null, answers]);
}
