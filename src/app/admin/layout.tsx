import Link from "next/link";
import { requireResearcher } from "@/lib/auth";

const items = [
  ["/admin", "Statistika"], ["/admin/units", "Korpus"], ["/admin/strategies", "Tasnif"],
  ["/admin/analyses", "Tahlillar"], ["/admin/surveys", "So'rovnomalar"], ["/admin/users", "Foydalanuvchilar"],
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireResearcher();
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold text-slate-900">Boshqaruv paneli</h1>
      <nav className="mb-8 flex flex-wrap gap-1 rounded-xl border bg-white p-1 text-sm shadow-sm">
        {items.map(([href, label]) => <Link key={href} href={href} className="rounded-lg px-3.5 py-2 font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-900">{label}</Link>)}
      </nav>
      {children}
    </div>
  );
}
