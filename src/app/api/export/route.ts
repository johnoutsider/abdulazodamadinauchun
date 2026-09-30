import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { toCsv, toXlsx } from "@/lib/table";

export const dynamic = "force-dynamic";

// Formula in'ektsiyasidan himoya: =,+,-,@ bilan boshlanuvchi matn oldiga ' qo'yiladi
const safe = (rows: Record<string, unknown>[]) =>
  rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) =>
    [k, typeof v === "string" && /^[=+\-@\t\r]/.test(v) ? "'" + v : v])));

export async function GET(req: Request) {
  const user = await getUser();
  if (user?.role !== "RESEARCHER") return new NextResponse("Forbidden", { status: 403 });
  const p = new URL(req.url).searchParams;
  const type = p.get("type");
  const format = p.get("format") === "xlsx" ? "xlsx" : "csv";

  let rows: Record<string, unknown>[] = [];
  if (type === "analyses") {
    rows = await query(
      `SELECT a.id, a.created_at, u.email AS user_email, u.age_group AS user_age_group, u.gender AS user_gender,
              u.status AS user_status, u.native_lang AS user_native_lang, a.input_lang, a.input_text, a.situation,
              a.input_factors->>'age' AS in_age, a.input_factors->>'gender' AS in_gender, a.input_factors->>'status' AS in_status,
              a.input_factors->>'distance' AS in_distance, a.input_factors->>'formality' AS in_formality,
              a.strategy_code, a.factors->>'age' AS age, a.factors->>'gender' AS gender, a.factors->>'status' AS status,
              a.factors->>'distance' AS distance, a.factors->>'formality' AS formality,
              a.source, a.feedback, a.explanation, a.example, a.suggestion
       FROM analyses a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.id`);
  } else if (type === "units") {
    rows = await query(
      `SELECT u.id, u.lang, u.text, u.equivalent, s.code AS strategy, u.situation, u.example, u.source,
              (SELECT f.value FROM unit_factors uf JOIN factors f ON f.id=uf.factor_id WHERE uf.unit_id=u.id AND f.type='age' LIMIT 1) AS age,
              (SELECT f.value FROM unit_factors uf JOIN factors f ON f.id=uf.factor_id WHERE uf.unit_id=u.id AND f.type='gender' LIMIT 1) AS gender,
              (SELECT f.value FROM unit_factors uf JOIN factors f ON f.id=uf.factor_id WHERE uf.unit_id=u.id AND f.type='status' LIMIT 1) AS status,
              (SELECT f.value FROM unit_factors uf JOIN factors f ON f.id=uf.factor_id WHERE uf.unit_id=u.id AND f.type='distance' LIMIT 1) AS distance,
              (SELECT f.value FROM unit_factors uf JOIN factors f ON f.id=uf.factor_id WHERE uf.unit_id=u.id AND f.type='formality' LIMIT 1) AS formality
       FROM units u LEFT JOIN strategies s ON s.id=u.strategy_id ORDER BY u.id`);
  } else if (type === "survey") {
    const id = Number(p.get("id"));
    if (!Number.isInteger(id)) return new NextResponse("Bad request", { status: 400 });
    const resp = await query<{ id: number; created_at: string; imported: boolean; answers: Record<string, string>; email: string | null }>(
      `SELECT r.id,r.created_at,r.imported,r.answers,u.email FROM survey_responses r LEFT JOIN users u ON u.id=r.user_id
       WHERE r.survey_id=$1 ORDER BY r.id`, [id]);
    rows = resp.map((r) => ({ id: r.id, created_at: r.created_at, imported: r.imported, user_email: r.email, ...r.answers }));
  } else {
    return new NextResponse("Bad request", { status: 400 });
  }

  rows = safe(rows);
  const stamp = new Date().toISOString().slice(0, 10);
  const fname = `${type}-${stamp}.${format}`;
  if (format === "xlsx") {
    return new NextResponse(new Uint8Array(toXlsx(rows, String(type))), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fname}"`,
      },
    });
  }
  return new NextResponse(toCsv(rows), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${fname}"` },
  });
}
