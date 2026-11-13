import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { getT } from "@/lib/i18n";
import { getUser } from "@/lib/auth";
import SidebarNav, { type NavItem } from "@/components/SidebarNav";
import { logout, setLang } from "./actions";

const inter = Inter({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-inter", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-serif-display", display: "swap" });

export const metadata: Metadata = {
  title: "PoliteLingua — xushmuomalalik tahlili",
  description: "Ingliz va o'zbek tillarida xushmuomalalik strategiyalari va ijtimoiy omillarni tahlil qilish platformasi.",
};

const ICONS = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  analyze: "M9 17v-6M13 17V7M17 17v-3M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z",
  corpus: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5",
  survey: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  about: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01",
  ai: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z",
  admin: "M3 3v18h18M7 15l4-4 3 3 5-6",
  me: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

function Logo() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-800 text-white shadow-sm" aria-hidden>
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
  const researcher = user?.role === "RESEARCHER";

  const items: NavItem[] = [
    { href: "/", label: t("nav_home"), icon: ICONS.home },
    { href: "/analyze", label: t("nav_analyze"), icon: ICONS.analyze },
    { href: "/corpus", label: t("nav_corpus"), icon: ICONS.corpus },
    { href: "/survey", label: t("nav_survey"), icon: ICONS.survey },
    { href: "/about", label: t("nav_about"), icon: ICONS.about },
    ...(user ? [{ href: "/me", label: t("nav_me"), icon: ICONS.me }] : []),
    ...(researcher
      ? [
          { href: "/ai-instructions", label: t("nav_ai"), icon: ICONS.ai, group: "admin" as const },
          { href: "/admin", label: t("nav_admin"), icon: ICONS.admin, group: "admin" as const },
        ]
      : []),
  ];

  const btn = "rounded-lg px-3 py-2 text-sm font-medium transition-colors";
  return (
    <html lang={lang} className={`${inter.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900 lg:flex">
        <aside className="sticky top-0 z-30 border-b border-slate-200 bg-white lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2.5 px-4 pt-4 pb-3 lg:px-5 lg:pt-6 lg:pb-6">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo />
              <span className="leading-tight">
                <span className="block font-serif text-[1.05rem] font-semibold text-slate-900">{t("appName")}</span>
                <span className="block text-[0.68rem] uppercase tracking-wider text-slate-500">PhD · Sociopragmatics</span>
              </span>
            </Link>
          </div>
          <div className="px-3 pb-3 lg:flex-1 lg:overflow-y-auto lg:pb-0">
            <SidebarNav items={items} adminTitle={t("nav_section_research")} />
          </div>
          <div className="hidden border-t border-slate-200 p-4 lg:block">
            {user ? (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-900">{user.name}</div>
                  <div className="truncate text-xs text-slate-500">{researcher ? t("role_researcher") : t("role_user")}</div>
                </div>
                <form action={logout}><button className={`${btn} text-slate-600 hover:bg-slate-100`}>{t("nav_logout")}</button></form>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className={`${btn} border text-center text-slate-700 hover:bg-slate-50`}>{t("nav_login")}</Link>
                <Link href="/register" className={`${btn} bg-indigo-800 text-center text-white hover:bg-indigo-900`}>{t("nav_register")}</Link>
              </div>
            )}
            <form action={setLang} className="mt-3 flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
              {(["uz", "en"] as const).map((l) => (
                <button key={l} name="lang" value={l}
                  className={`flex-1 rounded-md py-1.5 transition-colors ${lang === l ? "bg-white text-indigo-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Kichik ekranda: kirish va til tugmalari */}
          <div className="flex items-center justify-end gap-2 px-4 pt-3 lg:hidden">
            {user ? (
              <form action={logout}><button className={`${btn} text-slate-600`}>{t("nav_logout")}</button></form>
            ) : (
              <>
                <Link href="/login" className={`${btn} text-slate-700`}>{t("nav_login")}</Link>
                <Link href="/register" className={`${btn} bg-indigo-800 text-white`}>{t("nav_register")}</Link>
              </>
            )}
            <form action={setLang} className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
              {(["uz", "en"] as const).map((l) => (
                <button key={l} name="lang" value={l} className={`rounded-md px-2.5 py-1.5 ${lang === l ? "bg-white text-indigo-800 shadow-sm" : "text-slate-500"}`}>{l.toUpperCase()}</button>
              ))}
            </form>
          </div>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 lg:py-10">{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <span>© {new Date().getFullYear()} {t("appName")} · {t("footer_org")}</span>
              <span>{t("roles_note")}</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
