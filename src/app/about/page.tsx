import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Cta } from "@/components/sections/cta";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Star Tech India builds websites, CRM and lead-management systems, mobile apps, automation and custom software for businesses in Chennai and beyond.",
};

const principles = [
  {
    title: "Sit with the work first",
    body: "Every project starts on your floor, not in a boardroom. If we have not watched someone do the job by hand, we are not ready to automate it.",
  },
  {
    title: "Say no to scope we do not believe in",
    body: "We have talked clients out of features that would have been billable. A system nobody uses is a worse outcome for us than a smaller invoice.",
  },
  {
    title: "One team, start to finish",
    body: "No pre-sales engineers who vanish after signing. The people who scope the work build it and support it.",
  },
  {
    title: "Leave it maintainable",
    body: "Documented, tested and handed over properly. You should be able to hire someone else to work on it — even if we would rather you did not.",
  },
];

const timeline = [
  { year: "2014", body: "Founded in Chennai by four engineers out of a shared office in Guindy." },
  { year: "2017", body: "First CRM platform shipped for a distribution client with 40 field reps." },
  { year: "2020", body: "Remote delivery model formalised; the Bengaluru studio opens." },
  { year: "2023", body: "Business automation and integrations became a dedicated offering after growing client demand." },
  { year: "2026", body: "62 engineers, 140+ products shipped, and still no sales department." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Engineers who ask questions first."
        lead="Star Tech India builds websites, CRM and lead-management systems, mobile apps, automation and custom software for businesses. One team takes your idea from first conversation to launch and support."
      />

      <Stats />

      <section className="shell pb-24 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow text-brand">How we think</span>
            <h2 className="d3 mt-5 font-display">Four things we hold to.</h2>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="h-full rounded-[22px] border border-line bg-bone p-7 transition-colors duration-500 hover:border-ink/25">
                  <span className="font-mono text-xs text-brand">0{i + 1}</span>
                  <h3 className="mt-5 font-display text-xl leading-tight tracking-[-0.03em]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 text-white md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow text-brand-hot">Timeline</span>
            <h2 className="d3 mt-5 font-display">Twelve years, no pivots.</h2>
          </Reveal>

          <div className="lg:col-span-7 lg:col-start-6">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 70}>
                <div className="flex gap-8 border-t border-line-dark py-6 last:border-b">
                  <span className="w-14 shrink-0 font-mono text-xs text-brand-hot">{t.year}</span>
                  <p className="text-[0.9375rem] leading-relaxed text-white/65">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <Cta />
    </>
  );
}
