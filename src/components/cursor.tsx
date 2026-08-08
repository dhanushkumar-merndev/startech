"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], [data-cursor]';
const BUTTON = 'button, a.btn, [role="button"]';
const WHITE_CURSOR_BUTTON = ".btn-primary, .btn-red";

/**
 * A red arrow pinned to the cursor with a ring that trails it.
 *
 * The trail uses gsap.quickTo — a pre-compiled setter that reuses one tween
 * per axis instead of allocating a new one per mousemove, so it stays smooth
 * under a firehose of pointer events. The arrow gets a much shorter duration
 * than the ring; that difference in lag is the whole effect.
 */
export function Cursor() {
  const arrow = useRef<SVGSVGElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const arrowEl = arrow.current;
    const ringEl = ring.current;
    if (!arrowEl || !ringEl) return;
    const heroTarget = document.querySelector<HTMLElement>('[data-cursor="hero"]');

    const mm = gsap.matchMedia();

    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      document.body.dataset.cursor = "on";

      gsap.set(arrowEl, { x: -100, y: -100 });
      gsap.set(ringEl, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

      const arrowX = gsap.quickTo(arrowEl, "x", { duration: 0.12, ease: "power3" });
      const arrowY = gsap.quickTo(arrowEl, "y", { duration: 0.12, ease: "power3" });
      // CSS zoom scales fixed-position cursor elements, while pointer client
      // coordinates remain in the unscaled viewport. Keep their coordinate
      // systems in sync on the 125% desktop presentation.
      let pageZoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const syncZoom = () => {
        pageZoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        if (!heroActive && !headingActive) return;
        // Crossing the 1280px breakpoint changes pageZoom, invalidating both the
        // cached bounds and the reveal position derived from the old factor.
        measureHeroMask();
        if (lastPointer) setHeroRevealPosition(lastPointer.x, lastPointer.y);
        else renderHeroReveal();
      };

      let shown = false;
      let overNavigation = false;
      let ringHidden = false;
      let arrowHidden = false;
      let heroActive = false;
      let headingActive = false;
      let activeRevealTarget: Element | null = null;
      let lastPointer: { x: number; y: number } | null = null;
      let scrollFrame = 0;
      let activeHeadingMask: HTMLElement | null = null;
      let heroMaskBounds: DOMRect | null = null;
      // Seeded to match the initial gsap.set on ringEl so the first pointer move
      // eases from offscreen rather than from the top-left corner.
      const revealPosition = { x: -100, y: -100 };
      const renderHeroReveal = () => {
        gsap.set(ringEl, { x: revealPosition.x, y: revealPosition.y });
        if (!activeHeadingMask || !heroMaskBounds) return;
        // getBoundingClientRect reports client px (zoom applied), but the
        // clip-path reads these as lengths inside the zoomed subtree, where
        // 1px renders as `pageZoom` client px. Convert the offset back down,
        // or the reveal drifts by (zoom - 1) x its distance from the corner.
        activeHeadingMask.style.setProperty("--hero-mask-x", `${revealPosition.x - heroMaskBounds.left / pageZoom}px`);
        activeHeadingMask.style.setProperty("--hero-mask-y", `${revealPosition.y - heroMaskBounds.top / pageZoom}px`);
      };
      const measureHeroMask = () => {
        heroMaskBounds = activeHeadingMask?.getBoundingClientRect() ?? null;
      };
      const revealX = gsap.quickTo(revealPosition, "x", {
        duration: 0.36,
        ease: "power2.out",
        onUpdate: renderHeroReveal,
      });
      const revealY = gsap.quickTo(revealPosition, "y", {
        duration: 0.36,
        ease: "power2.out",
        onUpdate: renderHeroReveal,
      });
      const setHeroRevealPosition = (clientX: number, clientY: number) => {
        revealPosition.x = clientX / pageZoom;
        revealPosition.y = clientY / pageZoom;
        renderHeroReveal();
      };
      const moveHeroReveal = (clientX: number, clientY: number) => {
        revealX(clientX / pageZoom);
        revealY(clientY / pageZoom);
      };
      const showHeroMask = () => {
        if (!activeHeadingMask) return;
        // On a fast leave then re-enter, hideHeroMask's fade-out is still
        // running. gsap.set does not overwrite a tween, so it has to be killed
        // explicitly or the layer keeps easing back to 0 while hero is active.
        gsap.killTweensOf(activeHeadingMask);
        // No fade in: the clip-path already gates what is visible, so fading the
        // layer only makes a disc of inverted text ghost in at the boundary
        // instead of letting the circle sweep across the letters.
        gsap.set(activeHeadingMask, { autoAlpha: 1 });
      };
      const hideHeroMask = () => {
        if (activeHeadingMask) gsap.to(activeHeadingMask, { autoAlpha: 0, duration: 0.16, overwrite: "auto" });
        activeHeadingMask = null;
        activeRevealTarget = null;
        heroMaskBounds = null;
      };
      const selectHeadingMask = (target: Element) => {
        const nextMask = target.querySelector<HTMLElement>(".cursor-heading-mask");
        if (activeHeadingMask && activeHeadingMask !== nextMask) {
          gsap.set(activeHeadingMask, { autoAlpha: 0 });
        }
        activeHeadingMask = nextMask;
        heroMaskBounds = null;
      };
      const showArrow = () => {
        arrowHidden = false;
        if (shown) gsap.to(arrowEl, { autoAlpha: 1, duration: 0.16, overwrite: "auto" });
      };
      const hideArrow = (immediate = false) => {
        arrowHidden = true;
        if (immediate) {
          gsap.set(arrowEl, { autoAlpha: 0 });
        } else {
          gsap.to(arrowEl, { autoAlpha: 0, duration: 0.16, overwrite: "auto" });
        }
      };
      const setArrowColor = (color: string) =>
        gsap.to(arrowEl, { color, duration: 0.15, ease: "power2.out", overwrite: "auto" });
      const showRing = () => {
        ringHidden = false;
        gsap.fromTo(
          ringEl,
          { autoAlpha: 0, scale: 0.72 },
          { autoAlpha: 1, scale: 1, duration: 0.15, ease: "power3.out", overwrite: "auto" },
        );
      };
      const hideRing = () => {
        ringHidden = true;
        heroActive = false;
        headingActive = false;
        ringEl.textContent = "";
        hideHeroMask();
        gsap.to(ringEl, { autoAlpha: 0, scale: 0.72, duration: 0.12, ease: "power3.out", overwrite: "auto" });
      };
      const onMove = (e: PointerEvent) => {
        lastPointer = { x: e.clientX, y: e.clientY };
        const x = e.clientX / pageZoom;
        const y = e.clientY / pageZoom;
        arrowX(x);
        arrowY(y);
        // Single source of truth for the ring's position. A second quickTo pair
        // swapped in on hero/heading would keep writing the same x/y for its
        // remaining 0.36s, so the two would fight every frame through the
        // transition — which is what made growing and shrinking judder.
        moveHeroReveal(e.clientX, e.clientY);
        if (!shown) {
          shown = true;
          if (!arrowHidden) gsap.to(arrowEl, { autoAlpha: 1, duration: 0.3 });
          if (!ringHidden) showRing();
        }
      };

      // One reusable tween per visual state keeps hover changes from
      // stacking up when the pointer skims across a row of links.
      const setState = (vars: gsap.TweenVars) =>
        gsap.to(ringEl, { duration: 0.45, ease: "power3.out", overwrite: "auto", ...vars });

      const idle = () => {
        heroActive = false;
        headingActive = false;
        hideHeroMask();
        return setState({
          width: 38,
          height: 38,
          backgroundColor: "rgba(225,6,0,0)",
          borderColor: "rgba(10,10,10,0.35)",
          color: "rgba(255,255,255,0)",
          zIndex: 9998,
          mixBlendMode: "normal",
        });
      };

      // `pointerenter` and `pointerleave` do not bubble through every nested
      // word span, unlike the global over/out handlers. That keeps the hero
      // circle in one stable state each time the pointer enters the heading.
      const leaveHero = () => {
        if (!heroActive) return;
        resetCursor();
      };
      const resetCursor = () => {
        ringEl.textContent = "";
        setArrowColor("#e10600");
        showArrow();
        idle();
        if (shown) showRing();
      };
      const activateHero = (target: Element) => {
        if (heroActive && activeRevealTarget === target) return;
        heroActive = true;
        headingActive = false;
        activeRevealTarget = target;
        ringHidden = false;
        selectHeadingMask(target);
        measureHeroMask();
        // Paint the clip at the ring's current trailing position rather than
        // snapping it to the pointer. The reveal is still outside the heading
        // at this instant, so it eases in across the text like a lens.
        renderHeroReveal();
        hideArrow();
        showHeroMask();
        setState({
          width: 124,
          height: 124,
          backgroundColor: "rgba(225,6,0,0)",
          borderColor: "#e10600",
          color: "rgba(255,255,255,0)",
          zIndex: 9997,
          mixBlendMode: "normal",
        });
      };
      const activateHeading = (target: Element) => {
        if (headingActive && activeRevealTarget === target) return;
        heroActive = false;
        headingActive = true;
        activeRevealTarget = target;
        ringHidden = false;
        selectHeadingMask(target);
        measureHeroMask();
        renderHeroReveal();
        hideArrow(true);
        showHeroMask();
        setState({
          width: 124,
          height: 124,
          backgroundColor: "rgba(225,6,0,0)",
          borderColor: "#e10600",
          color: "rgba(255,255,255,0)",
          zIndex: 9997,
          mixBlendMode: "normal",
        });
      };

      const onOver = (e: PointerEvent) => {
        const element = e.target as Element | null;
        if (element?.closest?.("header")) {
          overNavigation = true;
          setArrowColor("#e10600");
          showArrow();
          hideRing();
          return;
        }

        if (overNavigation) {
          overNavigation = false;
          if (shown) showRing();
        }

        if (element?.closest?.(BUTTON)) {
          setArrowColor(element.closest(WHITE_CURSOR_BUTTON) ? "#ffffff" : "#e10600");
          showArrow();
          hideRing();
          return;
        }

        const target = element?.closest?.("[data-cursor]") ?? element?.closest?.(INTERACTIVE);
        // Several branches below only restyle the ring, and onOut returns early
        // when both sides of the crossing are INTERACTIVE. Without an explicit
        // teardown here, stepping off a heading onto a plain link leaves
        // heroActive set, so a full-size reveal keeps tracking the pointer
        // underneath a small hover ring.
        if (activeRevealTarget && target !== activeRevealTarget) {
          heroActive = false;
          headingActive = false;
          hideHeroMask();
        }
        if (!target) {
          setArrowColor("#e10600");
          showArrow();
          return;
        }
        const mode = target.getAttribute("data-cursor");
        ringEl.textContent = target.getAttribute("data-cursor-label") ?? "";

        if (mode === "hero") {
          activateHero(target);
          return;
        }

        if (mode === "local-heading") {
          hideArrow(true);
          hideRing();
          return;
        }

        if (mode === "heading") {
          activateHeading(target);
          return;
        }

        if (ringHidden && shown) {
          showRing();
        }

        if (mode === "view") {
          setState({
            width: 96,
            height: 96,
            backgroundColor: "#e10600",
            borderColor: "#e10600",
            color: "#ffffff",
            zIndex: 9998,
            mixBlendMode: "normal",
          });
        } else {
          setArrowColor("#e10600");
          showArrow();
          setState({
            width: 62,
            height: 62,
            backgroundColor: "rgba(225,6,0,0.12)",
            borderColor: "#e10600",
            color: "rgba(255,255,255,0)",
            zIndex: 9998,
            mixBlendMode: "normal",
          });
        }
      };

      const onOut = (e: PointerEvent) => {
        const fromNavigation = (e.target as Element | null)?.closest?.("header");
        const toNavigation = (e.relatedTarget as Element | null)?.closest?.("header");
        if (fromNavigation && !toNavigation) {
          overNavigation = false;
          idle();
          if (shown) showRing();
          return;
        }

        const fromButton = (e.target as Element | null)?.closest?.(BUTTON);
        const toButton = (e.relatedTarget as Element | null)?.closest?.(BUTTON);
        if (fromButton && !toButton) {
          setArrowColor("#e10600");
          showArrow();
          idle();
          if (shown) showRing();
          return;
        }

        if (!(e.target as Element | null)?.closest?.(INTERACTIVE)) return;
        if ((e.relatedTarget as Element | null)?.closest?.(INTERACTIVE)) return;
        resetCursor();
      };

      const onHeroEnter = (e: PointerEvent) => onOver(e);
      const syncRevealOnScroll = () => {
        scrollFrame = 0;
        if (!lastPointer) return;
        const element = document.elementFromPoint(lastPointer.x, lastPointer.y);
        const target = element?.closest?.("[data-cursor]");
        const mode = target?.getAttribute("data-cursor");
        // Scrolling moves the heading under a stationary pointer, so the cached
        // bounds — and with them the mask's local origin — go stale. Re-entering
        // activate* would early-return on the same target and never re-measure.
        if (target && (heroActive || headingActive) && activeRevealTarget === target) {
          measureHeroMask();
          renderHeroReveal();
        } else if (target && mode === "hero") {
          activateHero(target);
        } else if (target && mode === "heading") {
          activateHeading(target);
        } else if (heroActive || headingActive) {
          resetCursor();
        }
      };
      const onScroll = () => {
        if (!scrollFrame) scrollFrame = requestAnimationFrame(syncRevealOnScroll);
      };

      const onDown = () => gsap.to(ringEl, { scale: 0.72, duration: 0.25, ease: "power3.out" });
      const onUp = () => gsap.to(ringEl, { scale: 1, duration: 0.45, ease: "elastic.out(1, 0.5)" });
      const onLeave = () => {
        shown = false;
        ringHidden = false;
        arrowHidden = false;
        heroActive = false;
        hideHeroMask();
        gsap.to([arrowEl, ringEl], { autoAlpha: 0, duration: 0.18, overwrite: "auto" });
      };
      // Do not reveal the cursor at its old coordinates when re-entering the
      // browser window. The next pointer move sets the new coordinates first.
      const onEnter = () => {
        shown = false;
        overNavigation = false;
        ringHidden = false;
        arrowHidden = false;
        heroActive = false;
      };
      const onWindowOut = (e: MouseEvent) => {
        // A null relatedTarget means the pointer left the browser viewport,
        // including through its left or right edge.
        if (!e.relatedTarget) onLeave();
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("pointerout", onOut, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("mouseout", onWindowOut, { passive: true });
      window.addEventListener("blur", onLeave);
      window.addEventListener("resize", syncZoom, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.documentElement.addEventListener("pointerenter", onEnter);
      heroTarget?.addEventListener("pointerenter", onHeroEnter, { passive: true });
      heroTarget?.addEventListener("pointerleave", leaveHero, { passive: true });

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        window.removeEventListener("pointerout", onOut);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("mouseout", onWindowOut);
        window.removeEventListener("blur", onLeave);
        window.removeEventListener("resize", syncZoom);
        window.removeEventListener("scroll", onScroll);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        document.documentElement.removeEventListener("pointerenter", onEnter);
        heroTarget?.removeEventListener("pointerenter", onHeroEnter);
        heroTarget?.removeEventListener("pointerleave", leaveHero);
        if (scrollFrame) cancelAnimationFrame(scrollFrame);
        delete document.body.dataset.cursor;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <svg
        ref={arrow}
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none fixed left-0 top-0 z-[9999] size-7 text-brand opacity-0"
      >
        <path d="M4 2.5 20.5 12l-7.65 1.7L9.1 21.5 4 2.5Z" fill="currentColor" />
      </svg>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex size-[38px] items-center justify-center rounded-full border border-ink/35 text-[10px] font-medium uppercase tracking-[0.14em] opacity-0"
      />
    </>
  );
}
