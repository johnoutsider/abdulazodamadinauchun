"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { one } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";

export async function setLang(formData: FormData) {
  const lang = formData.get("lang") === "en" ? "en" : "uz";
  (await cookies()).set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  revalidatePath("/", "layout");
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export type AuthState = { error?: string } | undefined;

const RegSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(8).max(200),
  name: z.string().trim().min(1).max(100),
  age_group: z.string().max(20).optional(),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  status: z.string().trim().max(100).optional(),
  native_lang: z.string().trim().max(50).optional(),
  consent: z.literal("on"),
});

export async function register(_: AuthState, fd: FormData): Promise<AuthState> {
  const parsed = RegSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) {
    const pw = parsed.error.issues.some((i) => i.path[0] === "password");
    return { error: pw ? "weak_pw" : "err_generic" };
  }
  const d = parsed.data;
  const exists = await one("SELECT 1 FROM users WHERE email=$1", [d.email]);
  if (exists) return { error: "email_taken" };
  const row = await one<{ id: number }>(
    `INSERT INTO users (email,password_hash,name,age_group,gender,status,native_lang)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [d.email, await bcrypt.hash(d.password, 10), d.name, d.age_group || null, d.gender || null, d.status || null, d.native_lang || null],
  );
  await createSession(row!.id);
  redirect("/analyze");
}

export async function login(_: AuthState, fd: FormData): Promise<AuthState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const u = await one<{ id: number; password_hash: string }>(
    "SELECT id,password_hash FROM users WHERE email=$1", [email]);
  // vaqt farqini kamaytirish uchun har doim hash solishtiriladi
  const ok = await bcrypt.compare(password, u?.password_hash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvali");
  if (!u || !ok) return { error: "bad_login" };
  await createSession(u.id);
  redirect("/analyze");
}
