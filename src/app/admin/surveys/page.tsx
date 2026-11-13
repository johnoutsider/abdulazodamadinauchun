import { query } from "@/lib/db";
import AdminForm from "@/components/AdminForm";
import { createSurvey, deleteSurvey, importResponses, toggleSurvey } from "../actions";

export const dynamic = "force-dynamic";

export default async function Surveys() {
  const rows = await query<{ id: number; title: string; is_active: boolean; q: number; r: number }>(
    `SELECT s.id,s.title,s.is_active,(SELECT count(*)::int FROM survey_questions WHERE survey_id=s.id) q,
            (SELECT count(*)::int FROM survey_responses WHERE survey_id=s.id) r FROM surveys s ORDER BY s.id DESC`);
  const inp = "mt-1 w-full rounded-lg border p-2";
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminForm action={createSurvey} submit="Yaratish">
          <h2 className="font-semibold">Yangi so&apos;rovnoma</h2>
          <label className="block text-sm">Sarlavha<input name="title" required className={inp} /></label>
          <label className="block text-sm">Savollar (har bir qatorda bittadan; variantlar <code>|</code> dan keyin <code>;</code> bilan ajratiladi, variantsiz bo&apos;lsa erkin javob)
            <textarea name="questions" rows={6} required className={inp} placeholder={"Professorga murojaat qilganda qaysi ibora mosroq? | Iltimos, ... | Menga ... kerak\nBu vaziyatda nima deysiz?"} />
          </label>
        </AdminForm>
        <AdminForm action={importResponses} submit="Javoblarni import qilish">
          <h2 className="font-semibold">Google Sheet natijalarini import qilish</h2>
          <p className="text-sm text-slate-600">Google Sheet&apos;da Fayl → Yuklab olish → CSV (yoki XLSX). Har bir qator bitta respondent, ustun sarlavhasi savol sifatida saqlanadi.</p>
          <label className="block text-sm">So&apos;rovnoma
            <select name="survey_id" required className={inp}>{rows.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}</select></label>
          <input type="file" name="file" accept=".csv,.xlsx,.xls" required />
        </AdminForm>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50"><tr><th className="p-3">Sarlavha</th><th className="p-3">Savollar</th><th className="p-3">Javoblar</th><th className="p-3">Holat</th><th className="p-3">Amallar</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.title}</td><td className="p-3">{r.q}</td><td className="p-3">{r.r}</td><td className="p-3">{r.is_active ? "Faol" : "O'chiq"}</td>
              <td className="flex flex-wrap gap-3 p-3">
                <form action={toggleSurvey}><input type="hidden" name="id" value={r.id} /><button className="text-indigo-700 hover:underline">{r.is_active ? "O'chirish" : "Yoqish"}</button></form>
                <a href={`/api/export?type=survey&id=${r.id}&format=csv`} className="text-indigo-700 hover:underline">CSV</a>
                <a href={`/api/export?type=survey&id=${r.id}&format=xlsx`} className="text-indigo-700 hover:underline">XLSX</a>
                <form action={deleteSurvey}><input type="hidden" name="id" value={r.id} /><button className="text-red-700 hover:underline">Yo&apos;q qilish</button></form>
              </td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
