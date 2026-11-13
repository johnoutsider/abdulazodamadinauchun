"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string; icon: string; group?: "admin" };

export default function SidebarNav({ items, adminTitle }: { items: NavItem[]; adminTitle: string }) {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));
  const main = items.filter((i) => !i.group);
  const admin = items.filter((i) => i.group === "admin");

  const render = (i: NavItem) => (
    <Link key={i.href} href={i.href} aria-current={active(i.href) ? "page" : undefined}
      className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active(i.href) ? "bg-indigo-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={i.icon} /></svg>
      <span className="whitespace-nowrap">{i.label}</span>
    </Link>
  );

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {main.map(render)}
      {admin.length > 0 && (
        <>
          <div className="hidden px-3 pb-1 pt-5 text-[0.68rem] font-semibold uppercase tracking-wider text-slate-400 lg:block">{adminTitle}</div>
          {admin.map(render)}
        </>
      )}
    </nav>
  );
}
