"use client";

import Link from "next/link";
import { useRef } from "react";
import { EASE, MOTION_OK, MOTION_REDUCED, SplitText, gsap, useGSAP } from "@/lib/gsap";
import { useFontsReady } from "@/lib/use-fonts-ready";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      const scope = root.current;
      const heading = scope?.querySelector<HTMLElement>(".hero-title");
      if (!scope || !heading || !fontsReady) return;

      const split = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        aria: "auto",
      });

      heading.querySelectorAll(".split-line").forEach((line) => {
        line.parentElement?.classList.add("split-line-mask");
      });

      // Resolve the targets once, here: GSAP warns on an empty target list, and
      // the split can hand back no lines if it runs before the heading has a
      // layout box.
      const cta = Array.from(scope.querySelectorAll<HTMLElement>(".hero-cta > *"));

      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        gsap.set(heading, { visibility: "visible" });
        if (cta.length) gsap.set(cta, { autoAlpha: 1, y: 0 });
      });

      mm.add(MOTION_OK, () => {
        gsap.set(heading, { visibility: "visible" });

        // One timeline for the whole entrance so the pieces stay in step.
        const tl = gsap.timeline({ defaults: { ease: EASE } });

        if (split.lines.length) {
          tl.from(split.lines, { yPercent: 115, duration: 1.25, stagger: 0.09 });
        }

        if (cta.length) {
          tl.fromTo(
            cta,
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.09 },
            0.6,
          );
        }
      });

      return () => {
        mm.revert();
        split.revert();
      };
    },
    { scope: root, dependencies: [fontsReady] },
  );

  return (
    <section ref={root} className="relative overflow-hidden pb-6 pt-32 sm:pb-16 sm:pt-[150px] md:pb-24 md:pt-[224px]">
      <div
        aria-hidden
        className="hero-pattern pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage: "url('/y-so-serious-white.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "240px 240px",
          maskImage: "radial-gradient(120% 70% at 50% 0%, #000 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(120% 70% at 50% 0%, #000 20%, transparent 78%)",
        }}
      />

      <div className="shell relative">
        <div className="grid items-end gap-4 sm:gap-8 lg:grid-cols-12">
          <h1
            className="hero-title split-hold d1 relative z-10 mb-8 text-[clamp(2.2rem,7.5vw,6.5rem)] font-display font-medium sm:mb-0 lg:col-span-8"
          >
            <span data-cursor="hero">
              software for your{" "}
              <span className="hero-business relative inline-block text-brand">
                business
                <span aria-hidden className="hero-business-white pointer-events-none absolute inset-0 text-white opacity-0 [clip-path:circle(62px_at_var(--hero-mask-x,50%)_var(--hero-mask-y,50%))]">
                  business
                </span>
              </span>
            </span>
          </h1>

          <div className="hero-cta flex w-full flex-col flex-wrap items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4 lg:col-span-4 lg:justify-end lg:pb-1">
            <Link href="/contact" className="btn btn-primary group w-full !gap-3 !py-2.5 !pl-5 !pr-2.5 justify-center sm:w-auto">
              <span>Start a project</span>
              <span className="grid size-9 place-items-center rounded-full bg-white/10 transition-colors duration-500 group-hover:bg-white group-hover:text-ink">
                <Arrow />
              </span>
            </Link>
            <Link href="/work" className="btn btn-outline mb-1 w-full !py-3 justify-center sm:mb-0 sm:w-auto">
              See our work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden fill="none">
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
