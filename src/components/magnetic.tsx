"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type MagneticProps = {
  children: ReactNode;
  href: string;
  className?: string;
  /** How far the element may chase the pointer, in px. */
  strength?: number;
};

/**
 * A link that leans toward the cursor while it is nearby, then springs back.
 *
 * quickTo keeps the chase on a single reused tween, and the release uses an
 * elastic ease so letting go feels sprung rather than merely reversed.
 */
export function MagneticLink({ children, href, className = "", strength = 14 }: MagneticProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo(((e.clientX - (r.left + r.width / 2)) / r.width) * strength * 2);
        yTo(((e.clientY - (r.top + r.height / 2)) / r.height) * strength * 2);
      };

      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => mm.revert();
  }, { scope: ref, dependencies: [strength] });

  return (
    <Link ref={ref} href={href} className={className}>
      {children}
    </Link>
  );
}
