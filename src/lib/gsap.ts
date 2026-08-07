"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Single registration point for GSAP. Every animated component imports the
 * instance from here so plugins are registered exactly once and the house
 * easing curve is available everywhere.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase);

  // The site's signature curve — a fast departure with a long, quiet settle.
  // Matches the cubic-bezier(0.16, 1, 0.3, 1) used for the CSS hover states,
  // so JS-driven and CSS-driven motion feel like one system.
  CustomEase.create("star", "M0,0 C0.16,1 0.3,1 1,1");
  gsap.defaults({ ease: "star" });

  // Mobile browsers fire resize when the URL bar collapses; recalculating
  // every trigger on that is wasted work and causes visible jumps.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** House ease, by name. */
export const EASE = "star";

/** Where scroll reveals begin, kept consistent across every section. */
export const REVEAL_START = "top 86%";

/**
 * matchMedia queries for motion preference. Every entrance animation is
 * registered under MOTION_OK with a MOTION_REDUCED counterpart that simply
 * puts the element in its final state — a visitor who has asked for less
 * motion gets the content, immediately, with nothing sliding or parallaxing.
 */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * SplitText measures line boxes, so it must not run against fallback metrics
 * or the lines break in the wrong places. Resolves early if fonts are already
 * in, and gives up after `timeout` so a slow font can never leave text hidden.
 */
export function fontsReady(timeout = 1500): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }
  return Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, timeout)),
  ]);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
