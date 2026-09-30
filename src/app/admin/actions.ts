"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { one, query, pool } from "@/lib/db";
import { requireResearcher } from "@/lib/auth";
import { parseTable } from "@/lib/table";
import { FACTOR_TYPES } from "../../../db/seed-data";

export type Msg = { ok?: string; error?: string } | undefined;

const UnitSchema = z.object({
  text: z.string().trim().min(1).max(500),
  lang: z.enum(["en", "uz"]),
  equivalent: z.string().trim().max(500).default(""),
  strategy: z.string().trim().max(50).default(""),
  situation: z.string().trim().max(600).default(""),
  example: z.string().trim().max(800).default(""),
  source: z.string().trim().max(200).default(""),
});

async function insertUnit(client: { query: typeof pool.query }, u: z.infer<typeof UnitSchema>, factors: Record<string, string>) {
  const r = await client.query(
    `INSERT INTO units (text,lang,equivalent,strategy_id,situation,example,source)
     VALUES ($1,$2,$3,(SELECT id FROM strategies WHERE code=$4),$5,$6,$7) RETURNING id`,
    [u.text, u.lang, u.equivalent, u.strategy || null, u.situation, u.example, u.source]);
  for (const [type, value] of Object.entries(factors)) {
    if (!value) continue;
    await client.query(
      `INSERT INTO unit_factors (unit_id,factor_id) SELECT $1,id FROM factors WHERE type=$2 AND value=$3 ON CONFLICT DO NOTHING`,
      [r.rows[0].id, type, value]);
  }
}

export async function addUnit(_: Msg, fd: FormData): Promise<Msg> {
  await requireResearcher();
  const p = UnitSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: "Maydonlarni tekshiring (matn va til majburiy)." };
  const factors = Object.fromEntries(FACTOR_TYPES.map((k) => [k, String(fd.get(`f_${k}`) ?? "")]));
  await insertUnit(pool, p.data, factors);
  revalidatePath("/admin/units");
  return { ok: "Qo'shildi." };
}

export async function deleteUnit(fd: FormData) {
  await requireResearcher();
  await query("DELETE FROM units WHERE id=$1", [Number(fd.get("id"))]);
  revalidatePath("/admin/units");
}

export async function importUnits(_: Msg, fd: FormData): Promise<Msg> {
  await requireResearcher();
  const file = fd.get("file");
  if (!(file instanceof File) || !file.size) return { error: "Fayl tanlang." };
  let rows;
  try { rows = await parseTable(file); } catch (e) { return { error: (e as Error).message }; }
  if (rows.length > 5000) return { error: "Bir martada 5000 qatordan ko'p emas." };
  const client = await pool.connect();
  let n = 0, skipped = 0;
  try {
    await client.query("BEGIN");
    for (const r of rows) {
      const p = UnitSchema.safeParse({
        text: r.text ?? r.unit ?? "", lang: (r.lang ?? "").toLowerCase(), equivalent: r.equivalent ?? "",
        strategy: r.strategy ?? "", situation: r.situation ?? "", example: r.example ?? "", source: r.source ?? "import",
      });
      if (!p.success) { skipped++; continue; }
      await insertUnit(client as never, p.data, Object.fromEntries(FACTOR_TYPES.map((k) => [k, (r[k] ?? "").toLowerCase()])));
      n++;
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { error: "Import xatosi: " + (e as Error).message };
  } finally { client.release(); }
  revalidatePath("/admin/units");
  return { ok: `${n} ta qo'shildi, ${skipped} ta o'tkazib yuborildi.` };
}

export async function addStrategy(_: Msg, fd: FormData): Promise<Msg> {
  await requireResearcher();
  const p = z.object({
    code: z.string().trim().regex(/^[a-z0-9_]{2,40}$/), name_uz: z.string().trim().min(1).max(200), name_en: z.string().trim().min(1).max(200),
    desc_uz: z.string().max(600).default(""), desc_en: z.string().max(600).default(""), parent: z.string().max(40).default(""),
  }).safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: "Kod faqat kichik lotin harflari, raqam va _ dan iborat bo'lsin." };
  const d = p.data;
  if (await one("SELECT 1 FROM strategies WHERE code=$1", [d.code])) return { error: "Bu kod mavjud." };
  await query(
    `INSERT INTO strategies (code,name_uz,name_en,desc_uz,desc_en,parent_id) VALUES ($1,$2,$3,$4,$5,(SELECT id FROM strategies WHERE code=$6))`,
    [d.code, d.name_uz, d.name_en, d.desc_uz, d.desc_en, d.parent || null]);
  revalidatePath("/admin/strategies");
  return { ok: "Qo'shildi." };
}

export async function createSurvey(_: Msg, fd: FormData): Promise<Msg> {
  await requireResearcher();
  const title = String(fd.get("title") ?? "").trim().slice(0, 200);
  const lines = String(fd.get("questions") ?? "").split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 100);
  if (!title || !lines.length) return { error: "Sarlavha va kamida bitta savol kerak." };
  const s = await one<{ id: number }>("INSERT INTO surveys (title) VALUES ($1) RETURNING id", [title]);
  let i = 0;
  for (const l of lines) {
    const [text, opts = ""] = l.split("|");
    await query("INSERT INTO survey_questions (survey_id,text,options,position) VALUES ($1,$2,$3,$4)",
      [s!.id, text.trim(), opts.split(";").map((o) => o.trim()).filter(Boolean), i++]);
  }
  revalidatePath("/admin/surveys");
  return { ok: "So'rovnoma yaratildi." };
}

export async function toggleSurvey(fd: FormData) {
  await requireResearcher();
  await query("UPDATE surveys SET is_active = NOT is_active WHERE id=$1", [Number(fd.get("id"))]);
  revalidatePath("/admin/surveys");
}

export async function deleteSurvey(fd: FormData) {
  await requireResearcher();
  await query("DELETE FROM surveys WHERE id=$1", [Number(fd.get("id"))]);
  revalidatePath("/admin/surveys");
}

// Google Sheet'dan yuklab olingan CSV/XLSX: har bir qator — bitta respondent, ustun sarlavhasi — savol
export async function importResponses(_: Msg, fd: FormData): Promise<Msg> {
  await requireResearcher();
  const id = Number(fd.get("survey_id"));
  const file = fd.get("file");
  if (!Number.isInteger(id) || !(file instanceof File) || !file.size) return { error: "So'rovnoma va fayl tanlang." };
  let rows;
  try { rows = await parseTable(file); } catch (e) { return { error: (e as Error).message }; }
  if (rows.length > 20000) return { error: "Juda katta fayl." };
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const r of rows) {
      await client.query("INSERT INTO survey_responses (survey_id,answers,imported) VALUES ($1,$2,TRUE)", [id, r]);
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    return { error: "Import xatosi: " + (e as Error).message };
  } finally { client.release(); }
  revalidatePath("/admin/surveys");
  return { ok: `${rows.length} ta javob import qilindi.` };
}

export async function setRole(fd: FormData) {
  const me = await requireResearcher();
  const id = Number(fd.get("id"));
  if (id === me.id) return;
  await query("UPDATE users SET role = CASE WHEN role='USER' THEN 'RESEARCHER' ELSE 'USER' END WHERE id=$1", [id]);
  revalidatePath("/admin/users");
}
