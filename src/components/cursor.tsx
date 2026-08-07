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
  const heroOutline = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const arrowEl = arrow.current;
    const ringEl = ring.current;
    const heroOutlineEl = heroOutline.current;
    if (!arrowEl || !ringEl || !heroOutlineEl) return;

    const mm = gsap.matchMedia();

    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      document.body.dataset.cursor = "on";

      gsap.set(arrowEl, { x: -100, y: -100 });
      gsap.set(ringEl, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
      gsap.set(heroOutlineEl, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

      const arrowX = gsap.quickTo(arrowEl, "x", { duration: 0.12, ease: "power3" });
      const arrowY = gsap.quickTo(arrowEl, "y", { duration: 0.12, ease: "power3" });
      const heroRingX = gsap.quickTo(ringEl, "x", { duration: 0.14, ease: "power3.out" });
      const heroRingY = gsap.quickTo(ringEl, "y", { duration: 0.14, ease: "power3.out" });
      const heroOutlineX = gsap.quickTo(heroOutlineEl, "x", { duration: 0.14, ease: "power3.out" });
      const heroOutlineY = gsap.quickTo(heroOutlineEl, "y", { duration: 0.14, ease: "power3.out" });
      // CSS zoom scales fixed-position cursor elements, while pointer client
      // coordinates remain in the unscaled viewport. Keep their coordinate
      // systems in sync on the 125% desktop presentation.
      let pageZoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const syncZoom = () => {
        pageZoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      };

      let shown = false;
      let overNavigation = false;
      let ringHidden = false;
      let arrowHidden = false;
      let heroActive = false;
      const setHeroCirclePosition = (x: number, y: number) => {
        gsap.set([ringEl, heroOutlineEl], { x, y });
      };
      const moveHeroCircle = (x: number, y: number) => {
        heroRingX(x);
        heroRingY(y);
        heroOutlineX(x);
        heroOutlineY(y);
      };
      const showArrow = () => {
        arrowHidden = false;
        if (shown) gsap.to(arrowEl, { autoAlpha: 1, duration: 0.16, overwrite: "auto" });
      };
      const hideArrow = () => {
        arrowHidden = true;
        gsap.to(arrowEl, { autoAlpha: 0, duration: 0.16, overwrite: "auto" });
      };
      const setArrowColor = (color: string) =>
        gsap.to(arrowEl, { color, duration: 0.15, ease: "power2.out", overwrite: "auto" });
      const showHeroOutline = () =>
        gsap.fromTo(
          heroOutlineEl,
          { autoAlpha: 0, scale: 0.94 },
          { autoAlpha: 1, scale: 1, duration: 0.12, ease: "power3.out", overwrite: "auto" },
        );
      const hideHeroOutline = () =>
        gsap.to(heroOutlineEl, { autoAlpha: 0, scale: 0.94, duration: 0.12, ease: "power3.out", overwrite: "auto" });
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
        ringEl.textContent = "";
        hideHeroOutline();
        gsap.to(ringEl, { autoAlpha: 0, scale: 0.72, duration: 0.12, ease: "power3.out", overwrite: "auto" });
      };
      const onMove = (e: PointerEvent) => {
        const x = e.clientX / pageZoom;
        const y = e.clientY / pageZoom;
        arrowX(x);
        arrowY(y);
        if (heroActive) moveHeroCircle(x, y);
        else gsap.set(ringEl, { x, y });
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
        hideHeroOutline();
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
        if (!target) {
          setArrowColor("#e10600");
          showArrow();
          return;
        }
        const mode = target.getAttribute("data-cursor");
        ringEl.textContent = target.getAttribute("data-cursor-label") ?? "";

        if (mode === "hero") {
          heroActive = true;
          ringHidden = false;
          setHeroCirclePosition(e.clientX / pageZoom, e.clientY / pageZoom);
          hideArrow();
          showHeroOutline();
          setState({
            width: 124,
            height: 124,
            backgroundColor: "#e10600",
            borderColor: "rgba(225,6,0,0)",
            color: "rgba(255,255,255,0)",
            zIndex: 9997,
            mixBlendMode: "screen",
          });
          return;
        }

        if (ringHidden && shown) {
          showRing();
        }

        if (mode === "view") {
          hideHeroOutline();
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
          hideHeroOutline();
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
        ringEl.textContent = "";
        setArrowColor("#e10600");
        showArrow();
        idle();
        if (shown) showRing();
      };

      const onDown = () => gsap.to(ringEl, { scale: 0.72, duration: 0.25, ease: "power3.out" });
      const onUp = () => gsap.to(ringEl, { scale: 1, duration: 0.45, ease: "elastic.out(1, 0.5)" });
      const onLeave = () => {
        shown = false;
        ringHidden = false;
        arrowHidden = false;
        heroActive = false;
        gsap.to([arrowEl, ringEl, heroOutlineEl], { autoAlpha: 0, duration: 0.18, overwrite: "auto" });
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
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.documentElement.addEventListener("pointerenter", onEnter);

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        window.removeEventListener("pointerout", onOut);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("mouseout", onWindowOut);
        window.removeEventListener("blur", onLeave);
        window.removeEventListener("resize", syncZoom);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        document.documentElement.removeEventListener("pointerenter", onEnter);
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
      <div
        ref={heroOutline}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] size-[124px] rounded-full border border-brand opacity-0"
      />
    </>
  );
}
