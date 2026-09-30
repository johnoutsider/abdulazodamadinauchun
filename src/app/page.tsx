import Link from "next/link";
import { getT } from "@/lib/i18n";

export default async function Home() {
  const { t } = await getT();
  return (
    <section className="mx-auto max-w-3xl py-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-indigo-900">{t("hero_title")}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{t("hero_sub")}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/analyze" className="rounded-lg bg-indigo-700 px-6 py-3 font-semibold text-white hover:bg-indigo-800">{t("cta_analyze")}</Link>
        <Link href="/corpus" className="rounded-lg border bg-white px-6 py-3 font-semibold hover:bg-slate-100">{t("cta_corpus")}</Link>
      </div>
      <p className="mt-12 text-sm text-slate-500">{t("about_body")}</p>
    </section>
  );
}
