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
  const rows = await query<{ id: number; text: string; lang: string; equivalent: string; situation: string; sname_uz: string | null; sname_en: string | null }>(
    `SELECT u.id,u.text,u.lang,u.equivalent,u.situation,s.name_uz AS sname_uz,s.name_en AS sname_en
     FROM units u LEFT JOIN strategies s ON s.id=u.strategy_id
     WHERE ($1='' OR u.text ILIKE '%'||$1||'%' OR u.equivalent ILIKE '%'||$1||'%')
       AND ($2='' OR u.lang=$2) AND ($3='' OR s.code=$3 OR s.parent_id=(SELECT id FROM strategies WHERE code=$3))
     ORDER BY u.id DESC LIMIT 200`, [q, l, s]);
  const input = "rounded-lg border p-2";
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">{t("corpus_title")}</h1>
      <form className="mb-6 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder={t("search")} className={input} />
        <select name="lang" defaultValue={l} className={input}><option value="">{t("all")}</option><option value="en">English</option><option value="uz">O&apos;zbek</option></select>
        <select name="s" defaultValue={s} className={input}>
          <option value="">{t("all")}</option>
          {strategies.map((x) => <option key={x.code} value={x.code}>{lang === "uz" ? x.name_uz : x.name_en}</option>)}
        </select>
        <button className="rounded-lg bg-indigo-700 px-4 text-white">{t("filter")}</button>
      </form>
      {rows.length === 0 ? <p>{t("empty")}</p> : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100"><tr>
              <th className="p-3">{t("unit")}</th><th className="p-3">{t("equivalent")}</th><th className="p-3">{t("r_strategy")}</th><th className="p-3">{t("situation")}</th>
            </tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id} className="border-t align-top">
                <td className="p-3"><span className="mr-1 rounded bg-slate-200 px-1 text-xs uppercase">{r.lang}</span>{r.text}</td>
                <td className="p-3">{r.equivalent}</td>
                <td className="p-3">{lang === "uz" ? r.sname_uz : r.sname_en}</td>
                <td className="p-3 text-slate-600">{r.situation}</td>
              </tr>))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}
