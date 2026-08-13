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
 *
 * `cursorReveal` opts out of the split (see the effect body for why) and
 * falls back to a plain fade/lift, so it skips the font-metrics wait too.
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
  const overlay = useRef<HTMLSpanElement>(null);
  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      if (cursorReveal) {
        // The cursor's colour-inversion reveal needs the overlay's glyphs to
        // land exactly on the content span's glyphs. SplitText's per-line
        // mask wrappers rebuild the content span into a stack of block-level
        // line boxes; anything short of giving the overlay that exact same
        // treatment — including a byte-for-byte clone of it — still drifts a
        // few px, because the mask wrappers' padding/margin trick doesn't
        // measure identically twice. Skipping the split keeps both spans
        // plain, unrestructured text, so the browser's own line-wrapping
        // (deterministic for identical text/width/font) is what lines them
        // up — the same reason ProductHeading's reveal stays pixel-perfect.
        mm.add(MOTION_REDUCED, () => {
          gsap.set(el, { autoAlpha: 1, y: 0 });
        });

        mm.add(MOTION_OK, () => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: EASE,
              delay: delay / 1000,
              scrollTrigger:
                trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
            },
          );
        });

        return () => mm.revert();
      }

      if (!fontsReady) return;

      const split = SplitText.create(el, {
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

      mm.add(MOTION_REDUCED, () => {
        gsap.set(el, { visibility: "visible" });
      });

      mm.add(MOTION_OK, () => {
        gsap.set(el, { visibility: "visible" });
        // An empty line list means the split ran against nothing — GSAP would
        // still attach the ScrollTrigger below, and a trigger with no element
        // can never resolve an end. refresh() recurses into exactly those,
        // which is what overflows the stack once a few have accumulated.
        if (!split.lines.length) return;

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
    { scope: ref, dependencies: [fontsReady, trigger, delay, cursorReveal] },
  );

  if (!cursorReveal) {
    return (
      <Tag ref={ref} className={`split-hold ${className}`}>
        {children}
      </Tag>
    );
  }

  // Margins stay on the heading itself, so `inset-0` matches the text box
  // exactly and the overlay lines up with the plain copy underneath it. Both
  // spans render `{children}` as ordinary flowing text — see the effect above
  // for why neither gets split into lines.
  return (
    <Tag ref={ref} data-cursor="hero" className={`reveal relative ${className}`}>
      <span ref={content} className="block">
        {children}
      </span>
      <span
        ref={overlay}
        aria-hidden
        className="cursor-heading-mask pointer-events-none absolute inset-0 z-10 block text-brand opacity-0 [clip-path:circle(62px_at_var(--hero-mask-x,50%)_var(--hero-mask-y,50%))]"
      >
        {children}
      </span>
    </Tag>
  );
}
