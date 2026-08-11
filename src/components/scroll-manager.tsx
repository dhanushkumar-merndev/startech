"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LENIS_LOCK_EVENT = "startech:lenis-lock";

/**
 * Drops ScrollTriggers whose element has left the document.
 *
 * When a component's scope ref is detached, GSAP resolves its scoped selectors
 * against a throwaway `<div>` (it warns "Invalid scope") and still builds the
 * tween's ScrollTrigger — now pointing at an element no layout can measure, so
 * its `end` never resolves. That matters because refresh() walks every
 * registered trigger and recursively refreshes any with a falsy `end`
 * (ScrollTrigger.js: `curTrigger.end || curTrigger.refresh(0, 1)`). Those
 * nested calls mutate the same array the outer loop is indexing, which reads
 * back `undefined` — the "Cannot read properties of undefined (reading 'end')"
 * — and once enough of them pile up the recursion overflows the stack and
 * takes the tab down with it.
 *
 * Sweeping them before each refresh keeps that array to triggers that can
 * actually resolve.
 */
/** Layout timing on the client, without the server-render warning. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function killOrphanedTriggers() {
  for (const trigger of ScrollTrigger.getAll()) {
    const el = trigger.trigger ?? trigger.pin;
    if (el instanceof Element && !el.isConnected) {
      trigger.kill();
      continue;
    }
    // A trigger driving an animation that has no targets left can never resolve
    // an end either. Checked via the animation rather than a missing `trigger`
    // element, so listener-style triggers created with only an onUpdate — the
    // marquee's, for instance — are left alone.
    // Timelines have no targets() and are skipped; only tweens are checked.
    const animation = trigger.animation;
    const targets =
      animation && typeof (animation as gsap.core.Tween).targets === "function"
        ? (animation as gsap.core.Tween).targets()
        : null;
    if (targets && !targets.length) trigger.kill();
  }
}

/**
 * App Router keeps the layout mounted across navigations, so ScrollTrigger's
 * cached start/end positions survive into a page with completely different
 * content. Refreshing after each route commit re-measures them.
 *
 * The double rAF waits for the new tree to have been painted — refreshing any
 * earlier measures the outgoing page.
 */
export function ScrollManager() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis owns the scroll interpolation while GSAP's ticker supplies the
  // animation frame. Sending every Lenis update to ScrollTrigger keeps pinned
  // elements, progress indicators and reveal timings on the same scroll clock.
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      anchors: { offset: -96 },
      prevent: (node) => Boolean(node.closest("[data-lenis-prevent]")),
    });
    lenisRef.current = lenis;
    const onTick = (time: number) => lenis.raf(time * 1000);
    const onLockChange = (event: Event) => {
      if ((event as CustomEvent<boolean>).detail) lenis.stop();
      else lenis.start();
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener(LENIS_LOCK_EVENT, onLockChange);
    // Fires immediately before refresh() walks the trigger list, which is the
    // only point that catches orphans created during the very same commit —
    // a route-change sweep runs too early for those, since the incoming page's
    // layout effects build their triggers afterwards.
    ScrollTrigger.addEventListener("refreshInit", killOrphanedTriggers);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", killOrphanedTriggers);
      window.removeEventListener(LENIS_LOCK_EVENT, onLockChange);
      gsap.ticker.remove(onTick);
      if (lenisRef.current === lenis) lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  // Must be a layout effect, and must sit above <main> in the layout tree: the
  // incoming page's useGSAP hooks are layout effects too, so they build their
  // ScrollTriggers before any passive effect here could run. Creating a trigger
  // walks the global list, so the sweep has to happen first or the new page
  // still trips over the previous one's orphans on the way in.
  useIsomorphicLayoutEffect(() => {
    killOrphanedTriggers();
  }, [pathname]);

  useEffect(() => {
    let painted = 0;
    const frame = requestAnimationFrame(() => {
      // Route changes should never inherit a locked menu state or the old
      // scroll position. Reset both before measuring the incoming page.
      document.body.style.overflow = "";
      setSmoothScrollLocked(false);
      lenisRef.current?.start();

      // A link carrying a hash owns where the page lands. Resetting to the top
      // regardless is what made the footer's /services#crm style links all
      // arrive at the page header instead of their section.
      const id = decodeURIComponent(window.location.hash.slice(1));
      const anchor = id ? document.getElementById(id) : null;

      if (!anchor) {
        lenisRef.current?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }

      painted = requestAnimationFrame(() => {
        killOrphanedTriggers();
        // Measure before moving: the reveal triggers on the incoming page fix
        // their start positions during refresh, so jumping to an anchor first
        // would settle them against a layout that is about to change.
        ScrollTrigger.refresh();
        if (anchor) {
          lenisRef.current?.scrollTo(anchor, { immediate: true, force: true, offset: -96 });
        } else {
          // Lenis has a virtual scroll position; make a second immediate reset
          // after the incoming route has painted so it cannot restore the old one.
          lenisRef.current?.scrollTo(0, { immediate: true, force: true });
        }
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(painted);
    };
  }, [pathname]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  // Late-arriving webfonts change line boxes and therefore every trigger
  // position below the fold.
  useEffect(() => {
    if (!("fonts" in document)) return;
    let stale = false;
    document.fonts.ready.then(() => {
      if (!stale) ScrollTrigger.refresh();
    });
    return () => {
      stale = true;
    };
  }, []);

  return null;
}

export function setSmoothScrollLocked(locked: boolean) {
  window.dispatchEvent(new CustomEvent<boolean>(LENIS_LOCK_EVENT, { detail: locked }));
}
