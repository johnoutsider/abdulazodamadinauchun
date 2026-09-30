import { query } from "@/lib/db";
import AdminForm from "@/components/AdminForm";
import { addStrategy } from "../actions";

export const dynamic = "force-dynamic";

export default async function Strategies() {
  const rows = await query<{ code: string; name_uz: string; name_en: string; desc_uz: string; parent: string | null }>(
    `SELECT s.code,s.name_uz,s.name_en,s.desc_uz,p.code AS parent FROM strategies s LEFT JOIN strategies p ON p.id=s.parent_id ORDER BY COALESCE(p.id,s.id), s.parent_id NULLS FIRST, s.id`);
  const top = rows.filter((r) => !r.parent);
  const inp = "mt-1 w-full rounded-lg border p-2";
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100"><tr><th className="p-3">Kod</th><th className="p-3">Nomi</th><th className="p-3">Ta&apos;rif</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.code} className="border-t"><td className="p-3 font-mono text-xs">{r.code}</td>
              <td className={`p-3 ${r.parent ? "pl-8" : "font-semibold"}`}>{r.name_uz}<div className="text-xs text-slate-500">{r.name_en}</div></td>
              <td className="p-3 text-slate-600">{r.desc_uz}</td></tr>))}</tbody>
        </table>
      </div>
      <AdminForm action={addStrategy} submit="Qo'shish">
        <h2 className="font-semibold">Yangi strategiya / sub-strategiya</h2>
        <label className="block text-sm">Kod (a-z, 0-9, _)<input name="code" required pattern="[a-z0-9_]{2,40}" className={inp} /></label>
        <label className="block text-sm">Nomi (o&apos;zbekcha)<input name="name_uz" required className={inp} /></label>
        <label className="block text-sm">Nomi (inglizcha)<input name="name_en" required className={inp} /></label>
        <label className="block text-sm">Ta&apos;rif (o&apos;zbekcha)<textarea name="desc_uz" rows={2} className={inp} /></label>
        <label className="block text-sm">Ta&apos;rif (inglizcha)<textarea name="desc_en" rows={2} className={inp} /></label>
        <label className="block text-sm">Ota strategiya<select name="parent" className={inp}><option value="">— (asosiy)</option>{top.map((t) => <option key={t.code} value={t.code}>{t.name_uz}</option>)}</select></label>
      </AdminForm>
    </div>
  );
}
