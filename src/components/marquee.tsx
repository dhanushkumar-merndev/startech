"use client";

import { Fragment, useRef } from "react";
import { ClientMark } from "@/components/client-mark";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

type MarqueeProps = {
  items: readonly string[];
  label?: string;
  /** Seconds for one full pass at rest. */
  duration?: number;
  invert?: boolean;
  /** Pair each word with its client mark. Only meaningful for client lists. */
  logos?: boolean;
};

/**
 * Infinite word ticker.
 *
 * The list renders twice so the -50% loop point lands exactly on a seam.
 * Scrolling drives it: velocity is mapped onto the timeline's timeScale, so
 * the strip accelerates with the page and reverses when you scroll back up,
 * then eases home to its resting speed. Hovering brings it to a stop.
 */
export function Marquee({ items, label, duration = 38, invert = false, logos = false }: MarqueeProps) {
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
        let requested = 1;
        let settle: ReturnType<typeof setTimeout>;

        const driveTo = (value: number, duration: number) => {
          requested = value;
          gsap.to(loop, { timeScale: value, duration, overwrite: true });
        };

        const trigger = ScrollTrigger.create({
          onUpdate(self) {
            if (hovering) return;

            const velocity = self.getVelocity();
            if (velocity === 0) return;

            direction = velocity > 0 ? 1 : -1;
            // Cap the boost so a flick of the wheel cannot send it flying.
            const boost = Math.min(Math.abs(velocity) / 500, 4);
            const next = direction * (1 + boost);

            // Lenis reports a fresh velocity every frame. Without this guard
            // the strip allocated a new tween sixty times a second for the
            // whole length of the page — the ramp is far too coarse to notice
            // the difference, and the allocation is not free.
            if (Math.abs(next - requested) > 0.06) driveTo(next, 0.3);

            clearTimeout(settle);
            settle = setTimeout(() => {
              if (hovering) return;
              driveTo(direction, 0.9);
            }, 180);
          },
        });

        // Nothing to look at when the strip is off screen; a paused tween
        // costs nothing per frame.
        const visibility = ScrollTrigger.create({
          trigger: rootEl,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()),
        });

        const onEnter = () => {
          hovering = true;
          clearTimeout(settle);
          driveTo(0, 0.5);
        };

        const onLeave = () => {
          hovering = false;
          driveTo(direction, 0.7);
        };

        rootEl.addEventListener("pointerenter", onEnter);
        rootEl.addEventListener("pointerleave", onLeave);

        return () => {
          clearTimeout(settle);
          trigger.kill();
          visibility.kill();
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
            className={`marquee-item group flex shrink-0 items-center gap-2.5 px-4 sm:gap-3.5 sm:px-8 ${
              invert ? "text-white/55" : "text-ink/45"
            }`}
          >
            {logos && (
              <ClientMark
                name={item}
                className={`marquee-mark size-5 shrink-0 transition-[color,transform] duration-500 group-hover:scale-110 sm:size-6 ${
                  invert ? "text-white/35 group-hover:text-brand-hot" : "text-ink/30 group-hover:text-brand"
                }`}
              />
            )}
            <span
              className={`font-display text-[clamp(0.95rem,1.6vw,1.35rem)] font-medium tracking-[-0.02em] whitespace-nowrap transition-colors duration-500 ${
                invert ? "group-hover:text-white" : "group-hover:text-ink"
              }`}
            >
              {item}
            </span>
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
