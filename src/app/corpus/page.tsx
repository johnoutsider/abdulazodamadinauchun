import { getT } from "@/lib/i18n";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Corpus({ searchParams }: PageProps<"/corpus">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 100) : "";
  const l = sp.lang === "en" || sp.lang === "uz" ? sp.lang : "";
  const s = typeof sp.s === "string" ? sp.s.slice(0, 50) : "";
  const { lang, t } = await getT();
  const strategies = await query<{ code: string; name_uz: string; name_en: string }>("SELECT code,name_uz,name_en FROM strategies ORDER BY id");
  const rows = await query<{ id: number; text: string; lang: string; equivalent: string; situation: string; sname_uz: string | null; sname_en: string | null; main_uz: string | null; main_en: string | null }>(
    `SELECT u.id,u.text,u.lang,u.equivalent,u.situation,s.name_uz AS sname_uz,s.name_en AS sname_en,
            COALESCE(p.name_uz,s.name_uz) AS main_uz,COALESCE(p.name_en,s.name_en) AS main_en
     FROM units u LEFT JOIN strategies s ON s.id=u.strategy_id LEFT JOIN strategies p ON p.id=s.parent_id
     WHERE ($1='' OR u.text ILIKE '%'||$1||'%' OR u.equivalent ILIKE '%'||$1||'%')
       AND ($2='' OR u.lang=$2) AND ($3='' OR s.code=$3 OR s.parent_id=(SELECT id FROM strategies WHERE code=$3))
     ORDER BY u.id DESC LIMIT 200`, [q, l, s]);
  const input = "rounded-lg border px-3 py-2 text-sm";
  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{t("corpus_title")}</h1>
          <p className="mt-2 text-slate-600">{t("corpus_sub")}</p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800">{rows.length} {t("units_count")}</span>
      </header>
      <form className="card mb-6 flex flex-wrap gap-2 p-3">
        <input name="q" defaultValue={q} placeholder={t("search")} className={`${input} min-w-56 flex-1`} />
        <select name="lang" defaultValue={l} className={input}><option value="">{t("all")}</option><option value="en">English</option><option value="uz">O&apos;zbek</option></select>
        <select name="s" defaultValue={s} className={input}>
          <option value="">{t("all")}</option>
          {strategies.map((x) => <option key={x.code} value={x.code}>{lang === "uz" ? x.name_uz : x.name_en}</option>)}
        </select>
        <button className="rounded-lg bg-indigo-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-900">{t("filter")}</button>
      </form>
      {rows.length === 0 ? <p className="card p-8 text-center text-slate-500">{t("empty")}</p> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50"><tr>
              <th className="px-4 py-3">{t("unit")}</th><th className="px-4 py-3">{t("equivalent")}</th><th className="px-4 py-3">{t("col_devices")}</th><th className="px-4 py-3">{t("main_strategy")}</th><th className="px-4 py-3">{t("situation")}</th>
            </tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id} className="border-t align-top">
                <td className="px-4 py-3 font-medium text-slate-900"><span className={`mr-2 inline-block rounded px-1.5 py-0.5 align-middle text-[0.65rem] font-bold uppercase ${r.lang === "uz" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}>{r.lang}</span>{r.text}</td>
                <td className="px-4 py-3 italic text-slate-600">{r.equivalent}</td>
                <td className="px-4 py-3"><span className="whitespace-nowrap rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-800">{lang === "uz" ? r.sname_uz : r.sname_en}</span></td>
                <td className="px-4 py-3"><span className="whitespace-nowrap rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-accent-700">{lang === "uz" ? r.main_uz : r.main_en}</span></td>
                <td className="px-4 py-3 text-slate-600">{r.situation}</td>
              </tr>))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}
