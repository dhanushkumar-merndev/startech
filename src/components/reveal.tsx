"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { EASE, MOTION_OK, MOTION_REDUCED, REVEAL_START, gsap, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
  as?: ElementType;
  /** Travel distance in px. */
  y?: number;
  /** Animate direct children in sequence instead of the block as a whole. */
  stagger?: number;
};

/**
 * Lifts a block into place as it enters the viewport.
 *
 * The resting state lives in CSS (`.reveal { opacity: 0 }`) so the
 * server-rendered paint already matches GSAP's `from` values — no flash of
 * finished layout before the animation takes over.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  y = 30,
  stagger,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = stagger ? Array.from(el.children) : el;

      // With a stagger the wrapper itself must be visible up front, otherwise
      // it would hide the children we are about to animate individually.
      if (stagger) gsap.set(el, { autoAlpha: 1 });

      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
      });

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          targets,
          { y, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: EASE,
            delay: delay / 1000,
            stagger: stagger ?? 0,
            scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [delay, y, stagger] },
  );

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
