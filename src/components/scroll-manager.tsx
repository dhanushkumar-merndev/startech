"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LENIS_LOCK_EVENT = "startech:lenis-lock";

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

    return () => {
      window.removeEventListener(LENIS_LOCK_EVENT, onLockChange);
      gsap.ticker.remove(onTick);
      if (lenisRef.current === lenis) lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      // Route changes should never inherit a locked menu state or the old
      // scroll position. Reset both before measuring the incoming page.
      document.body.style.overflow = "";
      setSmoothScrollLocked(false);
      lenisRef.current?.start();
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      requestAnimationFrame(() => {
        // Lenis has a virtual scroll position; make a second immediate reset
        // after the incoming route has painted so it cannot restore the old one.
        lenisRef.current?.scrollTo(0, { immediate: true, force: true });
        ScrollTrigger.refresh();
      });
    });
    return () => cancelAnimationFrame(frame);
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
