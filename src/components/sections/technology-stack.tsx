import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";

const stack = [
  { label: "Web & platforms", tools: ["Next.js", "React", "Node.js", "PostgreSQL"] },
  { label: "Mobile", tools: ["React Native", "Flutter", "Offline sync", "Push notifications"] },
  { label: "Automation & integrations", tools: ["Workflows", "APIs", "Tally & GST", "WhatsApp"] },
  { label: "Connected systems", tools: ["Tally", "GST", "Payments", "WhatsApp"] },
];

/** A compact, reusable overview of the technologies behind each delivery. */
export function TechnologyStack() {
  return (
    <section className="grain relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 size-[460px] -translate-y-1/2 rounded-full bg-brand opacity-[0.14] blur-[120px]"
      />
      <div className="shell relative z-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal>
              <span className="eyebrow text-brand-hot">Technology, with a reason</span>
            </Reveal>
            <SplitHeading className="d2 mt-5 font-display">
              The right stack for the job, not a default answer.
            </SplitHeading>
          </div>
          <Reveal delay={100} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[0.9375rem] leading-relaxed text-white/60">
              We choose proven tools that suit your product, team and budget â€” then document
              the whole system so you are never locked in.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-[22px] border border-white/10 md:grid-cols-2">
          {stack.map((group, index) => (
            <Reveal key={group.label} delay={index * 75} className="border-b border-white/10 last:border-b-0 md:[&:nth-child(odd)]:border-r md:[&:nth-last-child(-n+2)]:border-b-0">
              <article className="h-full p-7 md:p-9">
                <span className="font-mono text-xs text-brand-hot">0{index + 1}</span>
                <h3 className="mt-6 font-display text-[1.5rem] tracking-[-0.035em]">{group.label}</h3>
                <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-white/65">
                  {group.tools.map((tool) => (
                    <li key={tool} className="flex items-center gap-2">
                      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-brand" />
                      {tool}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
