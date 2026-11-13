import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Analyses() {
  const rows = await query<{ id: number; input_text: string; situation: string; input_lang: string; source: string; feedback: number | null; created_at: Date; email: string | null; name_uz: string | null }>(
    `SELECT a.id,a.input_text,a.situation,a.input_lang,a.source,a.feedback,a.created_at,u.email,s.name_uz
     FROM analyses a LEFT JOIN users u ON u.id=a.user_id LEFT JOIN strategies s ON s.code=a.strategy_code ORDER BY a.id DESC LIMIT 300`);
  return (
    <>
      <div className="mb-4 flex gap-3 text-sm">
        <a href="/api/export?type=analyses&format=csv" className="rounded-lg border bg-white px-4 py-2">CSV</a>
        <a href="/api/export?type=analyses&format=xlsx" className="rounded-lg border bg-white px-4 py-2">XLSX (SPSS uchun)</a>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50"><tr><th className="p-3">Sana</th><th className="p-3">Foydalanuvchi</th><th className="p-3">Kiritilgan</th><th className="p-3">Vaziyat</th><th className="p-3">Strategiya</th><th className="p-3">Manba</th><th className="p-3">Baho</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id} className="border-t align-top">
              <td className="p-3 whitespace-nowrap">{r.created_at.toLocaleString()}</td><td className="p-3">{r.email ?? "mehmon"}</td>
              <td className="p-3"><span className="mr-1 rounded bg-slate-200 px-1 text-xs uppercase">{r.input_lang}</span>{r.input_text}</td>
              <td className="p-3 text-slate-600">{r.situation}</td><td className="p-3">{r.name_uz}</td><td className="p-3">{r.source}</td>
              <td className="p-3">{r.feedback === 1 ? "👍" : r.feedback === -1 ? "👎" : ""}</td></tr>))}</tbody>
        </table>
      </div>
    </>
  );
}
