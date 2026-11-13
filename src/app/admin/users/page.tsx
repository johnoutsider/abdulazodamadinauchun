import { query } from "@/lib/db";
import { setRole } from "../actions";

export const dynamic = "force-dynamic";

export default async function Users() {
  const rows = await query<{ id: number; email: string; name: string; role: string; age_group: string | null; gender: string | null; status: string | null; created_at: Date }>(
    "SELECT id,email,name,role,age_group,gender,status,created_at FROM users ORDER BY id DESC LIMIT 500");
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-slate-50"><tr><th className="p-3">Ism</th><th className="p-3">Email</th><th className="p-3">Yosh</th><th className="p-3">Gender</th><th className="p-3">Maqom</th><th className="p-3">Rol</th><th /></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.id} className="border-t"><td className="p-3">{r.name}</td><td className="p-3">{r.email}</td><td className="p-3">{r.age_group}</td><td className="p-3">{r.gender}</td><td className="p-3">{r.status}</td><td className="p-3">{r.role}</td>
            <td className="p-3"><form action={setRole}><input type="hidden" name="id" value={r.id} /><button className="text-indigo-700 hover:underline">Rolni almashtirish</button></form></td></tr>))}</tbody>
      </table>
    </div>
  );
}
