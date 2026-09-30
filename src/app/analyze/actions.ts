"use server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { one, query } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { getLang } from "@/lib/i18n";
import { analyze, detectLang, type Factors } from "@/lib/analysis";
import { FACTOR_TYPES } from "../../../db/seed-data";

export type AnalyzeOut =
  | { ok: false; error: "err_short" | "limit_guest" | "limit_user" | "err_generic" }
  | {
      ok: true; id: number; source: "CORPUS" | "AI" | "RULES";
      strategy: { code: string; nameUz: string; nameEn: string; parentUz?: string; parentEn?: string; descUz: string; descEn: string } | null;
      factors: { type: string; value: string; labelUz: string; labelEn: string }[];
      explanation: string; example: string; suggestion: string;
    };

const GUEST_LIMIT = 3;
const USER_LIMIT = 50;

const Input = z.object({
  text: z.string().trim().min(2).max(500),
  situation: z.string().trim().max(600).default(""),
  lang: z.enum(["auto", "en", "uz"]).default("auto"),
});

export async function runAnalysis(_: AnalyzeOut | null, fd: FormData): Promise<AnalyzeOut> {
  const parsed = Input.safeParse({
    text: fd.get("text"), situation: fd.get("situation") ?? "", lang: fd.get("lang") ?? "auto",
  });
  if (!parsed.success) return { ok: false, error: "err_short" };
  const { text, situation } = parsed.data;
  const lang = parsed.data.lang === "auto" ? detectLang(text) : parsed.data.lang;

  const given: Factors = {};
  for (const k of FACTOR_TYPES) {
    const v = String(fd.get(`f_${k}`) ?? "");
    if (v) given[k] = v;
  }

  const user = await getUser();
  const jar = await cookies();
  let guestKey = jar.get("gk")?.value;
  if (!user && !guestKey) {
    guestKey = randomUUID();
    jar.set("gk", guestKey, { path: "/", maxAge: 60 * 60 * 24 * 30, httpOnly: true, sameSite: "lax" });
  }

  const used = await one<{ n: number }>(
    `SELECT count(*)::int AS n FROM analyses
     WHERE created_at > now() - interval '1 day' AND ${user ? "user_id=$1" : "guest_key=$1"}`,
    [user ? user.id : guestKey],
  );
  if (user ? used!.n >= USER_LIMIT : used!.n >= GUEST_LIMIT) {
    return { ok: false, error: user ? "limit_user" : "limit_guest" };
  }

  try {
    const uiLang = await getLang();
    const r = await analyze({ text, lang, situation, given, uiLang });
    const saved = await one<{ id: number }>(
      `INSERT INTO analyses (user_id,guest_key,input_text,input_lang,situation,input_factors,strategy_code,factors,explanation,example,suggestion,source,matched_unit_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [user?.id ?? null, user ? null : guestKey, text, lang, situation, given, r.strategyCode, r.factors,
        r.explanation, r.example, r.suggestion, r.source, r.matchedUnitId],
    );

    const s = await one<{ code: string; name_uz: string; name_en: string; desc_uz: string; desc_en: string; p_uz: string | null; p_en: string | null }>(
      `SELECT s.code,s.name_uz,s.name_en,s.desc_uz,s.desc_en,p.name_uz AS p_uz,p.name_en AS p_en
       FROM strategies s LEFT JOIN strategies p ON p.id=s.parent_id WHERE s.code=$1`, [r.strategyCode]);
    const fRows = await query<{ type: string; value: string; label_uz: string; label_en: string }>(
      "SELECT type,value,label_uz,label_en FROM factors");
    const factors = Object.entries(r.factors)
      .map(([type, value]) => fRows.find((f) => f.type === type && f.value === value))
      .filter((f): f is NonNullable<typeof f> => !!f)
      .map((f) => ({ type: f.type, value: f.value, labelUz: f.label_uz, labelEn: f.label_en }));

    return {
      ok: true, id: saved!.id, source: r.source,
      strategy: s && { code: s.code, nameUz: s.name_uz, nameEn: s.name_en, parentUz: s.p_uz ?? undefined, parentEn: s.p_en ?? undefined, descUz: s.desc_uz, descEn: s.desc_en },
      factors, explanation: r.explanation, example: r.example, suggestion: r.suggestion,
    };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "err_generic" };
  }
}

export async function sendFeedback(id: number, value: 1 | -1) {
  const user = await getUser();
  const guestKey = (await cookies()).get("gk")?.value;
  await query(
    `UPDATE analyses SET feedback=$2 WHERE id=$1 AND (user_id=$3 OR guest_key=$4)`,
    [id, value === 1 ? 1 : -1, user?.id ?? null, guestKey ?? null],
  );
}
