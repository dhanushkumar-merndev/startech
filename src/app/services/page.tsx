import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Cta } from "@/components/sections/cta";
import { Industries } from "@/components/sections/industries";
import { Process } from "@/components/sections/process";
import { Reveal } from "@/components/reveal";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites, CRM and lead management, mobile applications, business automation, custom software and integrations — built by one team in Chennai.",
};

const engagements = [
  {
    name: "Discovery sprint",
    price: "₹1.5L – ₹4L",
    body: "Two to three weeks. Process mapping, a clickable prototype and a costed build plan. Fully credited against the build if you go ahead.",
  },
  {
    name: "Fixed-scope build",
    price: "₹12L – ₹90L",
    body: "A defined product, a defined date, a defined number. Best when discovery has already settled the requirements.",
  },
  {
    name: "Embedded team",
    price: "From ₹6L / month",
    body: "Two to eight engineers working to your roadmap, in your stand-ups. Month to month after an initial quarter.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we build."
        lead="From your first website enquiry to the software that runs your operation, one delivery team builds the connected systems your business needs."
      />

      <section className="shell py-20 md:py-28">
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={(i % 2) * 80}>
              <article
                id={service.id}
                className="group h-full scroll-mt-28 rounded-[22px] border border-line p-7 transition-colors duration-500 hover:border-ink/30 md:p-9"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs text-brand">{service.index}</span>
                  <span className="text-xs text-muted">{service.deliverables.length} deliverables</span>
                </div>

                <h2 className="mt-7 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.02] tracking-[-0.035em]">
                  {service.title}
                </h2>

                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                  {service.summary}
                </p>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {service.deliverables.map((d) => (
                    <li key={d} className="tag text-muted">
                      {d}
                    </li>
                  ))}
                </ul>
                <Link href={`/services/${service.id}`} className="ul-link mt-8 inline-block text-sm text-brand">
                  View service details <span aria-hidden>→</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Industries />

      {/* ----------------------------- engagements ---------------------------- */}
      <section className="bg-ink py-24 text-white md:py-32">
        <div className="shell">
          <Reveal className="max-w-2xl">
            <span className="eyebrow text-brand-hot">Engagement models</span>
            <h2 className="d2 mt-5 font-display">Three ways to start.</h2>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-line-dark bg-line-dark md:grid-cols-3">
            {engagements.map((e, i) => (
              <Reveal key={e.name} delay={i * 90}>
                <div className="flex h-full flex-col bg-ink-2 p-8 transition-colors duration-500 hover:bg-ink-3">
                  <h3 className="font-display text-xl tracking-[-0.03em]">{e.name}</h3>
                  <div className="mt-4 font-display text-[clamp(1.6rem,3vw,2.2rem)] tracking-[-0.04em] text-brand-hot">
                    {e.price}
                  </div>
                  <p className="mt-5 flex-1 text-[0.9375rem] leading-relaxed text-white/55">
                    {e.body}
                  </p>
                  <Link href="/contact" className="ul-link mt-8 self-start text-sm">
                    Enquire →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="mt-8 text-sm text-white/40">
              Indicative ranges. Every quote follows a discovery conversation — we do not
              price software we have not scoped.
            </p>
          </Reveal>
        </div>
      </section>

      <Process />
      <Cta />
    </>
  );
}
