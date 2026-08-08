"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import {
  EASE,
  MOTION_OK,
  MOTION_REDUCED,
  SplitText,
  gsap,
  useGSAP,
} from "@/lib/gsap";
import { useFontsReady } from "@/lib/use-fonts-ready";

type SplitHeadingProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** "load" fires immediately; "scroll" waits until the heading is in view. */
  trigger?: "load" | "scroll";
  delay?: number;
  /** Opt in to the cursor's circular colour-inversion reveal. */
  cursorReveal?: boolean;
};

/**
 * Masked, line-by-line heading reveal.
 *
 * SplitText measures real line boxes, so the split must wait for the web font
 * — splitting against fallback metrics breaks lines in the wrong places and
 * they visibly reflow. The heading is held at `visibility: hidden` until that
 * measurement is done, which costs a beat but never flashes.
 */
export function SplitHeading({
  children,
  className = "",
  as: Tag = "h2",
  trigger = "scroll",
  delay = 0,
  cursorReveal = false,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const content = useRef<HTMLSpanElement>(null);
  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !fontsReady) return;

      // With cursorReveal the heading also holds the reveal overlay, so the
      // split has to be scoped to the text span or SplitText would consume the
      // overlay into the line wrappers too.
      const split = SplitText.create(content.current ?? el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        // Keeps screen readers on the original sentence rather than a stack
        // of disconnected line fragments.
        aria: "auto",
      });

      // SplitText's mask wrappers clip at the line box, which is tighter than
      // the glyphs at this display size.
      el.querySelectorAll(".split-line").forEach((line) => {
        line.parentElement?.classList.add("split-line-mask");
      });

      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        gsap.set(el, { visibility: "visible" });
      });

      mm.add(MOTION_OK, () => {
        gsap.set(el, { visibility: "visible" });
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 1.15,
          ease: EASE,
          stagger: 0.085,
          delay: delay / 1000,
          scrollTrigger:
            trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
        });
      });

      return () => {
        mm.revert();
        split.revert();
      };
    },
    { scope: ref, dependencies: [fontsReady, trigger, delay] },
  );

  if (!cursorReveal) {
    return (
      <Tag ref={ref} className={`split-hold ${className}`}>
        {children}
      </Tag>
    );
  }

  // Margins stay on the heading itself, so `inset-0` matches the text box
  // exactly and the overlay lines up with the split copy underneath it.
  return (
    <Tag ref={ref} data-cursor="hero" className={`split-hold relative ${className}`}>
      <span ref={content} className="block">
        {children}
      </span>
      <span
        aria-hidden
        className="cursor-heading-mask pointer-events-none absolute inset-0 z-10 block text-brand opacity-0 [clip-path:circle(62px_at_var(--hero-mask-x,50%)_var(--hero-mask-y,50%))]"
      >
        {children}
      </span>
    </Tag>
  );
}
