import { getT } from "@/lib/i18n";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Me() {
  const { lang, t } = await getT();
  const user = await requireUser();
  const rows = await query<{ id: number; input_text: string; situation: string; created_at: Date; source: string; name_uz: string | null; name_en: string | null }>(
    `SELECT a.id,a.input_text,a.situation,a.created_at,a.source,s.name_uz,s.name_en
     FROM analyses a LEFT JOIN strategies s ON s.code=a.strategy_code WHERE a.user_id=$1 ORDER BY a.id DESC LIMIT 100`, [user.id]);
  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold text-slate-900">{t("me_title")}</h1>
      {rows.length === 0 ? <p className="card p-8 text-center text-slate-500">{t("me_none")}</p> : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="card p-5">
              <div className="font-medium">{r.input_text}</div>
              {r.situation && <div className="text-sm text-slate-600">{r.situation}</div>}
              <div className="mt-1 text-sm text-indigo-800">{lang === "uz" ? r.name_uz : r.name_en} · <span className="text-slate-500">{t(`src_${r.source}` as "src_AI")} · {r.created_at.toLocaleString()}</span></div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
