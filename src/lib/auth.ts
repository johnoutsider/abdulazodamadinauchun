import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { one } from "./db";

const COOKIE = "session";
const secret = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET kamida 32 belgi bo'lishi kerak");
  return new TextEncoder().encode(s);
};

export type SessionUser = { id: number; email: string; name: string; role: "USER" | "RESEARCHER" };

export async function createSession(userId: number) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "1",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return await one<SessionUser>("SELECT id,email,name,role FROM users WHERE id=$1", [payload.uid as number]);
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const u = await getUser();
  if (!u) redirect("/login");
  return u;
}

export async function requireResearcher(): Promise<SessionUser> {
  const u = await requireUser();
  if (u.role !== "RESEARCHER") redirect("/");
  return u;
}
