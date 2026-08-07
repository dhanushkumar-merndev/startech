import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseVisual } from "@/components/case-visual";
import { Cta } from "@/components/sections/cta";
import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";
import { caseStudies, getCaseStudy } from "@/lib/site";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case study not found" };

  return {
    title: `${study.client} — ${study.title}`,
    description: study.result,
    openGraph: { title: study.title, description: study.result },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((c) => c.slug === slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <>
      <article>
        <header className="shell pb-14 pt-[132px] md:pt-[176px]">
          <Link href="/work" className="ul-link text-sm text-muted">
            ← All work
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-[0.8125rem] text-muted">
            <span>{study.client}</span>
            <span className="size-1 rounded-full bg-line" />
            <span>{study.sector}</span>
            <span className="size-1 rounded-full bg-line" />
            <span>{study.year}</span>
          </div>

          <SplitHeading as="h1" trigger="load" className="d2 mt-6 max-w-4xl font-display">
            {study.title}
          </SplitHeading>

          <ul className="mt-9 flex flex-wrap gap-2">
            {study.services.map((s) => (
              <li key={s} className="tag text-muted">
                {s}
              </li>
            ))}
          </ul>
        </header>

        <div className="shell">
          <div className="aspect-[16/8] overflow-hidden rounded-[22px] border border-line">
            <CaseVisual study={study} />
          </div>
        </div>

        {/* outcomes */}
        <section className="shell py-16 md:py-24">
          <div className="grid gap-10 border-y border-line py-12 sm:grid-cols-3">
            {study.outcomes.map((o, i) => (
              <Reveal key={o.label} delay={i * 90}>
                <div className="font-display text-[clamp(2.2rem,4.5vw,3.4rem)] leading-none tracking-[-0.045em] text-brand">
                  {o.value}
                </div>
                <div className="mt-3 text-[0.8125rem] text-muted">{o.label}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* narrative */}
        <section className="shell pb-16 md:pb-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="space-y-12">
                <div>
                  <h2 className="eyebrow text-brand">The problem</h2>
                  <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink/80">
                    {study.challenge}
                  </p>
                </div>
                <div>
                  <h2 className="eyebrow text-brand">What we did</h2>
                  <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink/80">
                    {study.approach}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
              <div className="rounded-[22px] border border-line bg-bone p-8">
                <h2 className="eyebrow text-muted">Stack</h2>
                <ul className="mt-6 space-y-3">
                  {study.stack.map((t) => (
                    <li
                      key={t}
                      className="flex items-center gap-3 border-b border-line pb-3 text-[0.9375rem] last:border-0 last:pb-0"
                    >
                      <span className="size-1 rounded-full bg-brand" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      </article>

      {/* next case */}
      <section className="border-t border-line">
        <Link
          href={`/work/${next.slug}`}
          className="group block py-16 transition-colors duration-500 hover:bg-bone md:py-24"
        >
          <div className="shell flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="eyebrow text-muted">Next case study</span>
              <h2 className="d3 mt-4 max-w-2xl font-display transition-colors duration-300 group-hover:text-brand">
                {next.title}
              </h2>
            </div>
            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line transition-colors duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
                <path
                  d="M2 8h12M9 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </Link>
      </section>

      <Cta />
    </>
  );
}
