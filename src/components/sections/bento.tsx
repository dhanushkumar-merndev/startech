import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";
import { capabilities } from "@/lib/site";

/** Attio-style capability grid: asymmetric spans, hairline borders, one red cell. */
export function Bento() {
  return (
    <section className="shell py-24 md:py-32">
      <div className="max-w-2xl">
        <Reveal>
          <span className="eyebrow text-brand">Built in</span>
        </Reveal>
        <SplitHeading className="d2 mt-5 font-display">
          Connected systems that make work easier.
        </SplitHeading>
      </div>

      <div className="mt-14 grid gap-4 lg:grid-cols-12">
        {capabilities.map((cap, i) => {
          const accent = i === 1; // the red cell
          return (
            <Reveal key={cap.title} delay={i * 80} className={cap.span}>
              <article
                className={`group relative h-full overflow-hidden rounded-[22px] border p-7 transition-colors duration-500 md:p-9 ${
                  accent
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-bone hover:border-ink/25"
                }`}
              >
                <span
                  aria-hidden
                  className={`font-mono text-xs ${accent ? "text-white/60" : "text-muted"}`}
                >
                  0{i + 1}
                </span>
                <h3
                  className={`mt-6 font-display text-[clamp(1.35rem,2.2vw,1.75rem)] leading-[1.05] tracking-[-0.035em] ${
                    accent ? "text-white" : "text-ink"
                  }`}
                >
                  {cap.title}
                </h3>
                <p
                  className={`mt-4 max-w-lg text-[0.9375rem] leading-relaxed ${
                    accent ? "text-white/80" : "text-muted"
                  }`}
                >
                  {cap.body}
                </p>

                {/* A quiet corner rule that extends on hover. */}
                <span
                  aria-hidden
                  className={`absolute bottom-0 left-0 h-px w-0 transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full ${
                    accent ? "bg-white/40" : "bg-brand"
                  }`}
                />
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
