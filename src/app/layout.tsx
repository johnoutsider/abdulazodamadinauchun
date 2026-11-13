import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { getT } from "@/lib/i18n";
import { getUser } from "@/lib/auth";
import { logout, setLang } from "./actions";

const inter = Inter({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-inter", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-serif-display", display: "swap" });

export const metadata: Metadata = {
  title: "PoliteLingua — xushmuomalalik tahlili",
  description: "Ingliz va o'zbek tillarida xushmuomalalik strategiyalari va ijtimoiy omillarni tahlil qilish platformasi.",
};

function Logo() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-800 text-white shadow-sm" aria-hidden>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v4A2.5 2.5 0 0 1 13.5 13H9l-3.5 3v-3H6.5" />
        <path d="M16 9h1.5A2.5 2.5 0 0 1 20 11.5v4a2.5 2.5 0 0 1-2.5 2.5H17v2.5L14 18h-3" />
      </svg>
    </span>
  );
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { lang, t } = await getT();
  const user = await getUser();
  const link = "rounded-md px-3 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900";
  return (
    <html lang={lang} className={`${inter.variable} ${serif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-3 text-sm sm:px-6">
            <Link href="/" className="mr-4 flex items-center gap-2.5">
              <Logo />
              <span className="leading-tight">
                <span className="block font-serif text-[1.05rem] font-semibold text-slate-900">{t("appName")}</span>
                <span className="block text-[0.7rem] uppercase tracking-wider text-slate-500">PhD · Sociopragmatics</span>
              </span>
            </Link>
            <div className="order-last -mx-3 flex w-full gap-1 overflow-x-auto pt-2 lg:order-none lg:mx-0 lg:w-auto lg:pt-0">
              <Link href="/analyze" className={link}>{t("nav_analyze")}</Link>
              <Link href="/corpus" className={link}>{t("nav_corpus")}</Link>
              <Link href="/survey" className={link}>{t("nav_survey")}</Link>
              <Link href="/about" className={`${link} whitespace-nowrap`}>{t("nav_about")}</Link>
            </div>
            <span className="flex-1" />
            {user?.role === "RESEARCHER" && <Link href="/admin" className={`${link} text-indigo-800`}>{t("nav_admin")}</Link>}
            {user ? (
              <>
                <Link href="/me" className={link}>{user.name}</Link>
                <form action={logout}><button className={link}>{t("nav_logout")}</button></form>
              </>
            ) : (
              <>
                <Link href="/login" className={link}>{t("nav_login")}</Link>
                <Link href="/register" className="rounded-lg bg-indigo-800 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-indigo-900">{t("nav_register")}</Link>
              </>
            )}
            <form action={setLang} className="ml-2 flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
              {(["uz", "en"] as const).map((l) => (
                <button key={l} name="lang" value={l}
                  className={`rounded-md px-2.5 py-1.5 transition-colors ${lang === l ? "bg-white text-indigo-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </form>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>© {new Date().getFullYear()} {t("appName")} · {t("footer_org")}</span>
            <span>{t("roles_note")}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
