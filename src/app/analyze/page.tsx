import { getT } from "@/lib/i18n";
import { query } from "@/lib/db";
import { FACTOR_TYPE_LABELS } from "@/lib/labels";
import AnalyzeForm from "@/components/AnalyzeForm";
import { dictFor } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AnalyzePage() {
  const { lang, t } = await getT();
  const rows = await query<{ type: string; value: string; label_uz: string; label_en: string }>(
    "SELECT type,value,label_uz,label_en FROM factors ORDER BY id");
  const options = rows.map((r) => ({ type: r.type, value: r.value, label: lang === "uz" ? r.label_uz : r.label_en }));
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{t("analyze_title")}</h1>
      <AnalyzeForm lang={lang} t={dictFor(lang)} options={options} typeLabels={FACTOR_TYPE_LABELS[lang]} />
    </>
  );
}
