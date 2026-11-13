import { getT } from "@/lib/i18n";
export default async function About() {
  const { t } = await getT();
  return (
    <article className="card mx-auto max-w-3xl space-y-5 p-8 sm:p-10">
      <p className="eyebrow">PhD · 10.00.13</p>
      <h1 className="text-3xl font-semibold text-slate-900">{t("about_title")}</h1>
      <p className="font-serif text-lg leading-relaxed text-slate-700">{t("about_body")}</p>
      <p className="border-t pt-5 text-slate-700"><b>{t("author")}:</b> Abdullazoda Madina Rasuljon qizi — O&apos;zbekiston davlat jahon tillari universiteti, PhD (10.00.13)</p>
      <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">{t("consent")}</p>
    </article>
  );
}
