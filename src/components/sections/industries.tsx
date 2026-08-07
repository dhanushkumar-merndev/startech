import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";

const industries = [
  {
    name: "Manufacturing",
    description: "Production, inventory and dealer systems that keep the shop floor and sales office in sync.",
    tags: ["ERP", "Dealer portals"],
  },
  {
    name: "Distribution",
    description: "Order capture, route planning and billing workflows designed around a moving field force.",
    tags: ["Field sales", "Logistics"],
  },
  {
    name: "Financial services",
    description: "Secure customer journeys and operations platforms for lending, collections and service teams.",
    tags: ["Loan origination", "KYC"],
  },
  {
    name: "Healthcare",
    description: "Patient-facing experiences and operational software that work across clinics and care teams.",
    tags: ["Patient apps", "Integrations"],
  },
  {
    name: "Retail",
    description: "Connected commerce, loyalty and stock visibility for teams serving customers in every channel.",
    tags: ["Commerce", "Loyalty"],
  },
  {
    name: "Infrastructure",
    description: "Project, asset and workforce systems that bring complex sites back into one source of truth.",
    tags: ["Operations", "Reporting"],
  },
];

/** Industry cards make the site's sector experience easy to scan at a glance. */
export function Industries() {
  return (
    <section className="bg-bone py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow text-brand">Where we work</span>
            </Reveal>
            <SplitHeading className="d2 mt-5 font-display">
              Built around the realities of your industry.
            </SplitHeading>
          </div>
          <Reveal delay={100} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[0.9375rem] leading-relaxed text-muted">
              We begin with your day-to-day operation, then shape the product around the
              people, regulations and systems already in place.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, index) => (
            <Reveal key={industry.name} delay={index * 60}>
              <article className="group flex min-h-[240px] flex-col rounded-[22px] border border-line bg-paper p-6 transition-colors duration-500 hover:border-ink/30 md:p-7">
                <span className="font-mono text-xs text-muted">0{index + 1}</span>
                <h3 className="mt-8 font-display text-[clamp(1.5rem,2.6vw,2rem)] tracking-[-0.035em]">
                  {industry.name}
                </h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                  {industry.description}
                </p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-7">
                  {industry.tags.map((tag) => (
                    <li key={tag} className="tag text-muted">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-10">
          <Link href="/contact" className="ul-link inline-flex items-center gap-2 text-sm font-medium">
            Tell us about your operation
            <Arrow />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
      <path
        d="M2 8h12M9 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
