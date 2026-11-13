import Link from "next/link";
import { getT } from "@/lib/i18n";

const icons = {
  strategy: "M4 6h16M4 12h10M4 18h6",
  factors: "M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8M21 20v-2a4 4 0 0 0-3-3.87M15 2.13a4 4 0 0 1 0 7.75",
  corpus: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5",
};

export default async function Home() {
  const { t } = await getT();
  const features = [
    { icon: icons.strategy, title: t("feat1_t"), body: t("feat1_d") },
    { icon: icons.factors, title: t("feat2_t"), body: t("feat2_d") },
    { icon: icons.corpus, title: t("feat3_t"), body: t("feat3_d") },
  ];
  const steps = [t("step1"), t("step2"), t("step3")];
  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden rounded-3xl bg-indigo-950 px-6 py-16 text-center text-white shadow-xl sm:px-12 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(184,137,43,0.35), transparent 70%), radial-gradient(40% 50% at 100% 100%, rgba(95,128,191,0.45), transparent 70%)" }} />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-100">{t("hero_eyebrow")}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{t("hero_title")}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-indigo-100">{t("hero_sub")}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/analyze" className="rounded-lg bg-white px-6 py-3 font-semibold text-indigo-900 shadow-sm transition hover:bg-indigo-50">
              {t("cta_analyze")} →
            </Link>
            <Link href="/corpus" className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              {t("cta_corpus")}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={f.icon} />
              </svg>
            </span>
            <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
          </div>
        ))}
      </section>

      <section>
        <p className="eyebrow text-center">{t("steps_title")}</p>
        <ol className="mx-auto mt-6 grid max-w-4xl gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-start gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 p-5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-800 text-sm font-semibold text-white">{i + 1}</span>
              <span className="text-sm leading-relaxed text-slate-700">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-3xl border-l-4 border-accent-500 pl-6">
        <p className="font-serif text-lg leading-relaxed text-slate-700">{t("about_body")}</p>
      </section>
    </div>
  );
}
