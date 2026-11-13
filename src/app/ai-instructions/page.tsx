import { requireResearcher } from "@/lib/auth";
import { dictFor, getT } from "@/lib/i18n";
import { AI_INSTRUCTIONS_KEY, DEFAULT_AI_INSTRUCTIONS, getSetting } from "@/lib/settings";
import AiInstructionsForm from "@/components/AiInstructionsForm";

export const dynamic = "force-dynamic";

export default async function AiInstructionsPage() {
  await requireResearcher();
  const { lang, t } = await getT();
  const saved = await getSetting(AI_INSTRUCTIONS_KEY);
  const model = process.env.OPENAI_MODEL || "gpt-5-mini";
  const aiOn = Boolean(process.env.OPENAI_API_KEY);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">{t("ai_title")}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{t("ai_sub")}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className={`rounded-full px-2.5 py-1 font-medium ${aiOn ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            OpenAI: {aiOn ? model : "—"}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            {saved
              ? `${t("ai_status_custom")} ${saved.updated_at.toLocaleString(lang === "uz" ? "uz-UZ" : "en-GB")}${saved.updated_by_name ? ` · ${saved.updated_by_name}` : ""}`
              : t("ai_status_default")}
          </span>
        </div>
      </header>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <AiInstructionsForm initial={saved?.value ?? DEFAULT_AI_INSTRUCTIONS} defaultText={DEFAULT_AI_INSTRUCTIONS} t={dictFor(lang)} />
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="font-sans text-sm font-semibold text-slate-900">{t("ai_fixed_title")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t("ai_fixed_body")}</p>
          </div>
          <div className="card p-5">
            <h2 className="font-sans text-sm font-semibold text-slate-900">{t("ai_tips_title")}</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-slate-600">
              <li>{t("ai_tip1")}</li><li>{t("ai_tip2")}</li><li>{t("ai_tip3")}</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
