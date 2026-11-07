import { query } from "@/lib/db";
import AdminForm from "@/components/AdminForm";
import { addUnit, deleteUnit, importUnits } from "../actions";
import { FACTOR_TYPES } from "../../../../db/seed-data";
import { FACTOR_TYPE_LABELS } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function Units() {
  const strategies = await query<{ code: string; name_uz: string }>("SELECT code,name_uz FROM strategies ORDER BY id");
  const factors = await query<{ type: string; value: string; label_uz: string }>("SELECT type,value,label_uz FROM factors ORDER BY id");
  const rows = await query<{ id: number; text: string; lang: string; equivalent: string; name_uz: string | null }>(
    `SELECT u.id,u.text,u.lang,u.equivalent,s.name_uz FROM units u LEFT JOIN strategies s ON s.id=u.strategy_id ORDER BY u.id DESC LIMIT 300`);
  const inp = "mt-1 w-full rounded-lg border p-2";
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminForm action={addUnit} submit="Qo'shish">
          <h2 className="font-semibold">Yangi til birligi</h2>
          <label className="block text-sm">Til birligi<textarea name="text" required rows={2} className={inp} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">Til<select name="lang" className={inp}><option value="en">English</option><option value="uz">O&apos;zbek</option></select></label>
            <label className="block text-sm">Strategiya<select name="strategy" className={inp}><option value="">—</option>{strategies.map((s) => <option key={s.code} value={s.code}>{s.name_uz}</option>)}</select></label>
          </div>
          <label className="block text-sm">Ekvivalent (boshqa tildagi)<input name="equivalent" className={inp} /></label>
          <label className="block text-sm">Vaziyat<input name="situation" className={inp} /></label>
          <label className="block text-sm">Misol<input name="example" className={inp} /></label>
          <label className="block text-sm">Manba<input name="source" className={inp} /></label>
          <div className="grid grid-cols-2 gap-3">
            {FACTOR_TYPES.map((f) => (
              <label key={f} className="block text-sm">{FACTOR_TYPE_LABELS.uz[f]}
                <select name={`f_${f}`} className={inp}><option value="">—</option>{factors.filter((x) => x.type === f).map((x) => <option key={x.value} value={x.value}>{x.label_uz}</option>)}</select>
              </label>))}
          </div>
        </AdminForm>
        <AdminForm action={importUnits} submit="Import qilish">
          <h2 className="font-semibold">CSV / Excel import</h2>
          <p className="text-sm text-slate-600">Birinchi qator sarlavha: <code>text, lang, equivalent, strategy, situation, example, source, age, gender, status, distance, formality</code>.
            <b> lang</b> = en yoki uz; <b>strategy</b> = «Tasnif» sahifasidagi kod (masalan neg_hedge); omillar — kod qiymatlari (masalan distance: close/neutral/distant).</p>
          <input type="file" name="file" accept=".csv,.xlsx,.xls" required />
        </AdminForm>
      </div>
      <div className="flex gap-3 text-sm">
        <a href="/api/export?type=units&format=csv" className="rounded-lg border bg-white px-4 py-2">CSV</a>
        <a href="/api/export?type=units&format=xlsx" className="rounded-lg border bg-white px-4 py-2">XLSX</a>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50"><tr><th className="p-3">Til</th><th className="p-3">Birlik</th><th className="p-3">Ekvivalent</th><th className="p-3">Strategiya</th><th /></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id} className="border-t"><td className="p-3 uppercase">{r.lang}</td><td className="p-3">{r.text}</td><td className="p-3">{r.equivalent}</td><td className="p-3">{r.name_uz}</td>
              <td className="p-3"><form action={deleteUnit}><input type="hidden" name="id" value={r.id} /><button className="text-red-700 hover:underline">O&apos;chirish</button></form></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
