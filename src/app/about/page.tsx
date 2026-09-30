import { getT } from "@/lib/i18n";
export default async function About() {
  const { t } = await getT();
  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">{t("about_title")}</h1>
      <p>{t("about_body")}</p>
      <p><b>{t("author")}:</b> Abdullazoda Madina Rasuljon qizi — O&apos;zbekiston davlat jahon tillari universiteti, PhD (10.00.13)</p>
      <p className="text-sm text-slate-600">{t("consent")}</p>
    </article>
  );
}
