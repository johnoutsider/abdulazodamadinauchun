import Link from "next/link";
import { query, one } from "@/lib/db";
import { BarBlock, PieBlock, StackedBlock } from "@/components/Charts";
import { FACTOR_TYPES } from "../../../db/seed-data";
import { FACTOR_TYPE_LABELS } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }: PageProps<"/admin">) {
  const sp = await searchParams;
  const by = (FACTOR_TYPES as readonly string[]).includes(String(sp.by)) ? String(sp.by) : "distance";

  const totals = await one<{ units: number; analyses: number; users: number; responses: number; up: number; down: number }>(
    `SELECT (SELECT count(*) FROM units)::int units, (SELECT count(*) FROM analyses)::int analyses,
            (SELECT count(*) FROM users)::int users, (SELECT count(*) FROM survey_responses)::int responses,
            (SELECT count(*) FROM analyses WHERE feedback=1)::int up, (SELECT count(*) FROM analyses WHERE feedback=-1)::int down`);
  const byStrategy = await query<{ name: string; value: number }>(
    `SELECT COALESCE(s.name_uz,'—') AS name, count(*)::int AS value FROM analyses a LEFT JOIN strategies s ON s.code=a.strategy_code GROUP BY 1 ORDER BY 2 DESC`);
  const corpusByStrategy = await query<{ name: string; value: number }>(
    `SELECT COALESCE(s.name_uz,'—') AS name, count(*)::int AS value FROM units u LEFT JOIN strategies s ON s.id=u.strategy_id GROUP BY 1 ORDER BY 2 DESC`);
  const bySource = await query<{ name: string; value: number }>(`SELECT source AS name, count(*)::int AS value FROM analyses GROUP BY 1`);
  const byLang = await query<{ name: string; value: number }>(`SELECT input_lang AS name, count(*)::int AS value FROM analyses GROUP BY 1`);

  const cross = await query<{ strat: string; val: string; n: number }>(
    `SELECT COALESCE(s.name_uz,'—') AS strat, COALESCE(a.factors->>$1,'aniqlanmagan') AS val, count(*)::int AS n
     FROM analyses a LEFT JOIN strategies s ON s.code=a.strategy_code GROUP BY 1,2`, [by]);
  const keys = [...new Set(cross.map((c) => c.val))];
  const stacked = [...new Set(cross.map((c) => c.strat))].map((name) => ({
    name, ...Object.fromEntries(keys.map((k) => [k, cross.find((c) => c.strat === name && c.val === k)?.n ?? 0])),
  }));

  const stat = (l: string, v: number | string) => (
    <div className="rounded-xl border bg-white p-4"><div className="text-sm text-slate-500">{l}</div><div className="text-2xl font-bold">{v}</div></div>
  );
  const rated = totals!.up + totals!.down;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {stat("Korpus birliklari", totals!.units)}{stat("Tahlillar", totals!.analyses)}{stat("Foydalanuvchilar", totals!.users)}
        {stat("So'rovnoma javoblari", totals!.responses)}{stat("Foydali deb baholangan", rated ? `${Math.round((totals!.up / rated) * 100)}%` : "—")}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span>Omil bo&apos;yicha taqsimot:</span>
        {FACTOR_TYPES.map((f) => (
          <Link key={f} href={`/admin?by=${f}`} className={`rounded px-3 py-1 ${f === by ? "bg-indigo-700 text-white" : "bg-white shadow-sm"}`}>{FACTOR_TYPE_LABELS.uz[f]}</Link>
        ))}
      </div>
      <StackedBlock title={`Strategiya × ${FACTOR_TYPE_LABELS.uz[by]} (tahlillar)`} data={stacked} keys={keys} />
      <div className="grid gap-4 lg:grid-cols-2">
        <BarBlock title="Tahlillar: strategiyalar bo'yicha" data={byStrategy} />
        <BarBlock title="Korpus: strategiyalar bo'yicha" data={corpusByStrategy} />
        <PieBlock title="Natija manbai" data={bySource} />
        <PieBlock title="Kiritilgan til" data={byLang} />
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        {["analyses", "units"].map((t) => ["csv", "xlsx"].map((f) => (
          <a key={t + f} href={`/api/export?type=${t}&format=${f}`} className="rounded-lg border bg-white px-4 py-2 hover:bg-slate-100">
            {t === "analyses" ? "Tahlillar" : "Korpus"} — {f.toUpperCase()} yuklab olish
          </a>)))}
      </div>
    </div>
  );
}
