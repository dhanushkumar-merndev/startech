"use client";

import { useRef } from "react";
import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";
import { EASE, MOTION_OK, MOTION_REDUCED, gsap, useGSAP } from "@/lib/gsap";
import { processSteps } from "@/lib/site";

/** Sticky-column process with a rail that fills as you read down the steps. */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        gsap.set(".proc-rail-fill", { scaleY: 1 });
      });

      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".proc-step", root.current).forEach((step) => {
          gsap
            .timeline({ scrollTrigger: { trigger: step, start: "top 82%", once: true } })
            .from(step, { y: 44, autoAlpha: 0, duration: 1, ease: EASE })
            .from(
              step.querySelector(".proc-badge"),
              { scale: 0.5, autoAlpha: 0, duration: 0.7, ease: "back.out(2)" },
              0.12,
            );
        });

        // The rail is drawn in proportion to scroll progress through the list.
        gsap.fromTo(
          ".proc-rail-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: ".proc-steps",
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.4,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-bone py-24 md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <span className="eyebrow text-brand">How we work</span>
            </Reveal>
            <SplitHeading className="d2 mt-5 font-display">
              Four phases. No surprises.
            </SplitHeading>
            <Reveal delay={120}>
              <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
                Fixed-price discovery, then time-boxed sprints against a scope you signed.
                You see working software every two weeks — the first demo lands before the
                first large invoice.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="proc-steps relative lg:col-span-7 lg:col-start-6">
          {/* Rail sits behind the step badges on wide screens. */}
          <div
            aria-hidden
            className="absolute left-6 top-0 hidden h-full w-px bg-line md:left-7 md:block"
          >
            <div className="proc-rail-fill h-full w-full origin-top bg-brand" />
          </div>

          {processSteps.map((step) => (
            <div
              key={step.step}
              className="proc-step group relative flex gap-6 border-t border-line py-9 last:border-b md:gap-10"
            >
              <div className="shrink-0">
                <span className="proc-badge grid size-12 place-items-center rounded-full border border-ink bg-bone font-mono text-xs transition-colors duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-white md:size-14">
                  {step.step}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] tracking-[-0.035em]">
                    {step.title}
                  </h3>
                  <span className="tag border-line bg-paper text-muted">{step.duration}</span>
                </div>
                <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
