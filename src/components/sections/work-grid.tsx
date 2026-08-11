"use client";

import Link from "next/link";
import { useRef } from "react";
import { CaseVisual } from "@/components/case-visual";
import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";
import { EASE, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { caseStudies } from "@/lib/site";

type WorkGridProps = {
  limit?: number;
  /** Hides the section heading when the page supplies its own. */
  bare?: boolean;
};

export function WorkGrid({ limit, bare = false }: WorkGridProps) {
  const items = limit ? caseStudies.slice(0, limit) : caseStudies;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // React may briefly disconnect the outgoing route while running its
        // development effect checks. A media-query callback can fire during
        // that window, so do not create triggers for the detached section.
        if (!el.isConnected) return;

        gsap.utils.toArray<HTMLElement>(".work-card", el).forEach((card, i) => {
          gsap.from(card, {
            y: 60,
            autoAlpha: 0,
            duration: 1.1,
            ease: EASE,
            // Cards sitting side by side deal in one after the other.
            delay: (i % 2) * 0.09,
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          });
        });

        // The artwork drifts inside its frame as the card crosses the
        // viewport, which gives the grid depth without moving the layout.
        gsap.utils.toArray<HTMLElement>(".work-art", el).forEach((art) => {
          gsap.fromTo(
            art,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: art,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [limit, bare] },
  );

  return (
    <section ref={root} className="shell py-16 sm:py-24 md:py-32">
      {!bare && (
        <div className="mb-10 sm:mb-14 flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <div>
            <Reveal>
              <span className="eyebrow text-brand">Selected work</span>
            </Reveal>
            <SplitHeading className="d2 mt-4 sm:mt-5 font-display">
              Shipped, and still running.
            </SplitHeading>
          </div>
          <Reveal delay={100}>
            <Link href="/work" className="btn btn-outline text-xs sm:text-sm !py-2.5 !px-5">
              All case studies
            </Link>
          </Reveal>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((study, i) => (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            data-cursor="view"
            data-cursor-label="View"
            // First card runs full width for a stronger entry into the grid.
            className={`work-card group block overflow-hidden rounded-[20px] sm:rounded-[22px] border border-line transition-colors duration-500 hover:border-ink/30 ${
              i === 0 && !bare ? "md:col-span-2" : ""
            }`}
          >
            <div
              className={`relative overflow-hidden ${
                i === 0 && !bare ? "aspect-[4/3] sm:aspect-[16/7]" : "aspect-[4/3] sm:aspect-[16/10]"
              }`}
            >
              <div className="work-art absolute -inset-y-[10%] inset-x-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]">
                <CaseVisual study={study} />
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5 sm:p-6 md:flex-row md:items-end md:justify-between md:p-8">
              <div>
                <div className="flex items-center gap-3 text-[0.75rem] sm:text-[0.8125rem] text-muted">
                  <span>{study.client}</span>
                  <span className="size-1 rounded-full bg-line" />
                  <span>{study.sector}</span>
                </div>
                <h3 className="mt-2.5 sm:mt-3 max-w-lg font-display text-[clamp(1.25rem,2.4vw,1.9rem)] leading-[1.05] tracking-[-0.035em]">
                  {study.title}
                </h3>
                <p className="mt-2 sm:mt-3 max-w-lg text-[0.875rem] sm:text-[0.9375rem] leading-relaxed text-muted">
                  {study.result}
                </p>
              </div>

              <div className="shrink-0 text-left md:text-right">
                <div className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-none tracking-[-0.045em] text-brand">
                  {study.metric.value}
                </div>
                <div className="mt-1.5 sm:mt-2 text-[0.7rem] sm:text-xs text-muted">{study.metric.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
