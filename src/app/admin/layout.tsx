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
      <nav className="mb-6 flex flex-wrap gap-2 border-b pb-3 text-sm">
        {items.map(([href, label]) => <Link key={href} href={href} className="rounded bg-white px-3 py-1.5 shadow-sm hover:bg-indigo-100">{label}</Link>)}
      </nav>
      {children}
    </div>
  );
}
