"use client";

import { Fragment, useRef } from "react";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

type MarqueeProps = {
  items: readonly string[];
  label?: string;
  /** Seconds for one full pass at rest. */
  duration?: number;
  invert?: boolean;
};

/**
 * Infinite word ticker.
 *
 * The list renders twice so the -50% loop point lands exactly on a seam.
 * Scrolling drives it: velocity is mapped onto the timeline's timeScale, so
 * the strip accelerates with the page and reverses when you scroll back up,
 * then eases home to its resting speed. Hovering brings it to a stop.
 */
export function Marquee({ items, label, duration = 38, invert = false }: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const trackEl = track.current;
      const rootEl = root.current;
      if (!trackEl || !rootEl) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.to(trackEl, {
          xPercent: -50,
          repeat: -1,
          duration,
          ease: "none",
        });

        let direction = 1;
        let hovering = false;
        let settle: ReturnType<typeof setTimeout>;

        const trigger = ScrollTrigger.create({
          onUpdate(self) {
            if (hovering) return;

            const velocity = self.getVelocity();
            if (velocity === 0) return;

            direction = velocity > 0 ? 1 : -1;
            // Cap the boost so a flick of the wheel cannot send it flying.
            const boost = Math.min(Math.abs(velocity) / 500, 4);

            gsap.to(loop, {
              timeScale: direction * (1 + boost),
              duration: 0.3,
              overwrite: true,
            });

            clearTimeout(settle);
            settle = setTimeout(() => {
              if (hovering) return;
              gsap.to(loop, { timeScale: direction, duration: 0.9, overwrite: true });
            }, 180);
          },
        });

        const onEnter = () => {
          hovering = true;
          clearTimeout(settle);
          gsap.to(loop, { timeScale: 0, duration: 0.5, overwrite: true });
        };

        const onLeave = () => {
          hovering = false;
          gsap.to(loop, { timeScale: direction, duration: 0.7, overwrite: true });
        };

        rootEl.addEventListener("pointerenter", onEnter);
        rootEl.addEventListener("pointerleave", onLeave);

        return () => {
          clearTimeout(settle);
          trigger.kill();
          rootEl.removeEventListener("pointerenter", onEnter);
          rootEl.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [duration] },
  );

  const run = (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <Fragment key={item}>
          <span
            className={`px-8 font-display text-[clamp(1rem,1.6vw,1.35rem)] font-medium tracking-[-0.02em] whitespace-nowrap ${
              invert ? "text-white/55" : "text-ink/45"
            }`}
          >
            {item}
          </span>
          <span aria-hidden className="text-brand">
            ✦
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div className={`py-6 md:py-8 ${invert ? "bg-ink text-white" : ""}`}>
      {label && (
        <div className="shell mb-4 text-center">
          <span className={`eyebrow text-[0.6875rem] uppercase tracking-[0.18em] ${invert ? "text-white/40" : "text-muted"}`}>
            {label}
          </span>
        </div>
      )}
      <div
        ref={root}
        className="marquee relative overflow-hidden py-2"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        <div ref={track} className="marquee-track" aria-hidden>
          {run}
          {run}
        </div>
        <span className="sr-only">
          {label ? `${label}: ` : "Clients include "}
          {items.join(", ")}.
        </span>
      </div>
    </div>
  );
}
