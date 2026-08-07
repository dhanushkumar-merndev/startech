"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { stats } from "@/lib/site";

/**
 * Counters that run up as the band scrolls into view.
 *
 * GSAP tweens a plain object and writes the snapped value straight to the
 * DOM node — no React state, so counting to 140 costs zero re-renders.
 */
export function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // The figures are server-rendered at their true value, so a visitor who
      // has asked for less motion simply keeps them — nothing to animate down
      // from and nothing to restore.
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".stat-value", root.current).forEach((node) => {
          const target = Number(node.dataset.value ?? 0);
          const counter = { value: 0 };

          gsap.to(counter, {
            value: target,
            duration: 1.8,
            ease: "power3.out",
            snap: { value: 1 },
            onUpdate: () => {
              node.textContent = String(Math.round(counter.value));
            },
            scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
          });
        });

        gsap.from(".stat-block", {
          y: 34,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.09,
          scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell py-20 md:py-24">
      <div className="grid grid-cols-2 gap-y-12 border-y border-line py-14 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-block px-2 lg:border-l lg:border-line lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
          >
            <div className="font-display text-[clamp(2.6rem,5.5vw,4.25rem)] leading-none font-medium tracking-[-0.05em]">
              {/* Server-renders the real figure, so the number is present
                  for crawlers and with scripting off. */}
              <span className="stat-value" data-value={stat.value}>
                {stat.value}
              </span>
              <span className="text-brand">{stat.suffix}</span>
            </div>
            <div className="mt-3 text-[0.8125rem] text-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
