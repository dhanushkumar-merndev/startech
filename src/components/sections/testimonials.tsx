"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { MOTION_OK, MOTION_REDUCED, SplitText, gsap, useGSAP } from "@/lib/gsap";
import { useFontsReady } from "@/lib/use-fonts-ready";
import { testimonials } from "@/lib/site";

/** Single-quote carousel. Advances on its own, pauses once touched. */
export function Testimonials() {
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const root = useRef<HTMLElement>(null);
  const fontsReady = useFontsReady();

  const go = useCallback((next: number) => {
    setI((next + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (held) return;
    const t = setInterval(() => setI((v) => (v + 1) % testimonials.length), 7000);
    return () => clearInterval(t);
  }, [held]);

  // Re-splits and re-plays whenever the active quote changes. Splitting by
  // word rather than line keeps the cadence readable at this size.
  useGSAP(
    () => {
      const quote = root.current?.querySelector<HTMLElement>(".quote-text");
      if (!quote || !fontsReady) return;

      const split = SplitText.create(quote, { type: "words", aria: "auto" });
      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        gsap.set(quote, { visibility: "visible" });
      });

      mm.add(MOTION_OK, () => {
        gsap.set(quote, { visibility: "visible" });
        gsap.from(split.words, {
          yPercent: 60,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.014,
        });
        gsap.from(".quote-attrib", { y: 12, autoAlpha: 0, duration: 0.6, delay: 0.25 });
      });

      return () => {
        mm.revert();
        split.revert();
      };
    },
    { scope: root, dependencies: [i, fontsReady] },
  );

  const active = testimonials[i];

  return (
    <section
      ref={root}
      className="bg-bone py-24 md:py-32"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
    >
      <div className="shell">
        <Reveal>
          <span className="eyebrow text-brand">Clients</span>
        </Reveal>

        <blockquote className="mt-10 max-w-4xl">
          <p className="quote-text split-hold font-display text-[clamp(1.5rem,3.6vw,2.9rem)] leading-[1.12] tracking-[-0.035em]">
            <span className="text-brand">“</span>
            {active.quote}
            <span className="text-brand">”</span>
          </p>
          <footer className="quote-attrib mt-9 text-[0.9375rem]">
            <span className="font-medium">{active.name}</span>
            <span className="text-muted"> — {active.role}</span>
          </footer>
        </blockquote>

        <div className="mt-12 flex items-center gap-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(i - 1)}
              aria-label="Previous testimonial"
              className="grid size-11 place-items-center rounded-full border border-line transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
            >
              <svg viewBox="0 0 16 16" className="size-4 rotate-180" fill="none" aria-hidden>
                <path
                  d="M2 8h12M9 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              aria-label="Next testimonial"
              className="grid size-11 place-items-center rounded-full border border-line transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
                <path
                  d="M2 8h12M9 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex gap-1.5">
            {testimonials.map((t, idx) => (
              <button
                key={t.name}
                type="button"
                onClick={() => go(idx)}
                aria-label={`Testimonial ${idx + 1}`}
                aria-current={idx === i}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  idx === i ? "w-10 bg-brand" : "w-5 bg-line hover:bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
