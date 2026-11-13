import { getT } from "@/lib/i18n";
import { query } from "@/lib/db";
import SurveyForm from "@/components/SurveyForm";

export const dynamic = "force-dynamic";

export default async function Survey() {
  const { t } = await getT();
  const surveys = await query<{ id: number; title: string }>("SELECT id,title FROM surveys WHERE is_active ORDER BY id DESC");
  const withQs = await Promise.all(surveys.map(async (s) => ({
    ...s,
    qs: (await query<{ id: number; text: string; options: string[] }>(
      "SELECT id,text,options FROM survey_questions WHERE survey_id=$1 ORDER BY position,id", [s.id])),
  })));
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-semibold text-slate-900">{t("survey_title")}</h1>
      {withQs.length === 0 && <p className="card p-8 text-center text-slate-500">{t("survey_none")}</p>}
      {withQs.map((s) => (
        <section key={s.id} className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">{s.title}</h2>
          <SurveyForm surveyId={s.id} questions={s.qs} send={t("survey_send")} done={t("survey_done")} />
        </section>
      ))}
    </div>
  );
}
