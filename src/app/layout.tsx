import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getT } from "@/lib/i18n";
import { getUser } from "@/lib/auth";
import { logout, setLang } from "./actions";

export const metadata: Metadata = {
  title: "Xushmuomalalik tahlili — Politeness Analyzer",
  description: "Ingliz va o'zbek tillarida xushmuomalalik strategiyalari va ijtimoiy omillarni tahlil qilish platformasi.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { lang, t } = await getT();
  const user = await getUser();
  const link = "px-2 py-1 rounded hover:bg-indigo-100";
  return (
    <html lang={lang} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-3 text-sm">
            <Link href="/" className="mr-3 text-base font-bold text-indigo-800">{t("appName")}</Link>
            <Link href="/analyze" className={link}>{t("nav_analyze")}</Link>
            <Link href="/corpus" className={link}>{t("nav_corpus")}</Link>
            <Link href="/survey" className={link}>{t("nav_survey")}</Link>
            <Link href="/about" className={link}>{t("nav_about")}</Link>
            <span className="flex-1" />
            {user?.role === "RESEARCHER" && <Link href="/admin" className={`${link} font-semibold`}>{t("nav_admin")}</Link>}
            {user ? (
              <>
                <Link href="/me" className={link}>{user.name}</Link>
                <form action={logout}><button className={link}>{t("nav_logout")}</button></form>
              </>
            ) : (
              <>
                <Link href="/login" className={link}>{t("nav_login")}</Link>
                <Link href="/register" className="rounded bg-indigo-700 px-3 py-1 text-white hover:bg-indigo-800">{t("nav_register")}</Link>
              </>
            )}
            <form action={setLang} className="ml-2 flex overflow-hidden rounded border">
              <button name="lang" value="uz" className={`px-2 py-1 ${lang === "uz" ? "bg-indigo-700 text-white" : ""}`}>UZ</button>
              <button name="lang" value="en" className={`px-2 py-1 ${lang === "en" ? "bg-indigo-700 text-white" : ""}`}>EN</button>
            </form>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t bg-white py-4 text-center text-xs text-slate-500">{t("roles_note")}</footer>
      </body>
    </html>
  );
}
