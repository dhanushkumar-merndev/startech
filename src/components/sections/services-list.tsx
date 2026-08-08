"use client";

import Link from "next/link";
import { useRef } from "react";
import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";
import { services } from "@/lib/site";
import { gsap, useGSAP } from "@/lib/gsap";

/** Service index whose cards deform under the pointer. */
export function ServicesList() {
  return (
    <section id="services" className="shell scroll-mt-24 py-16 sm:py-24 md:py-36">
      <div className="grid gap-6 sm:gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <Reveal>
            <span className="eyebrow text-brand">What we do</span>
          </Reveal>
          <SplitHeading cursorReveal className="d2 mt-4 sm:mt-5 font-display">
            Everything your business needs to grow online.
          </SplitHeading>
        </div>
        <Reveal delay={100} className="md:col-span-4 md:col-start-9">
          <p className="text-[0.875rem] sm:text-[0.9375rem] leading-relaxed text-muted">
            From your website and lead capture to CRM, mobile apps and automation, one team
            builds systems that work together from day one.
          </p>
        </Reveal>
      </div>

      {/* hover:z-10 — a card stretching past its grid cell must not slip
          underneath the one that comes after it. */}
      <div className="mt-10 sm:mt-16 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.id} delay={index * 65} className="relative w-full h-full min-w-0 hover:z-10">
            <SquishServiceCard service={service} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

type Service = (typeof services)[number];

/** How far outside the card the pointer still bends it, in px. */
const REACH = 150;
/** Peak compression along the axis the pointer is pressing from. */
const SQUASH = 0.21;
/**
 * How much of that compression comes back out on the other axis. Squashing
 * one way and stretching the other is what makes a shape read as soft — a card
 * that only ever gets smaller reads as scaled, not squeezed.
 */
const COUNTER_STRETCH = 0.55;
/** Degrees of lean towards the pointer, on top of the tilt. */
const SKEW = 3;
/** Degrees of tilt towards the pointer. */
const TILT = 13;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * A card that deforms under the pointer.
 *
 * The card is not pushed around as a rigid block. Its perspective origin
 * tracks the pointer, so the corner you are nearest is the pivot the rest of
 * the card bends away from — the deformation is strongest right under the
 * cursor and blends out across the far edges. Squash rides on top of the tilt
 * with an overshoot ease, which is what makes it read as soft rather than
 * mechanical.
 */
function SquishServiceCard({ service }: { service: Service }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const card = cardRef.current;
      if (!stage || !card) return;

      const mm = gsap.matchMedia();
      mm.add("(pointer: fine) and (min-width: 640px) and (prefers-reduced-motion: no-preference)", () => {
        // Short durations keep it responsive; the overshoot on the squash is
        // what gives the card its give.
        const tiltX = gsap.quickTo(card, "rotationX", { duration: 0.3, ease: "power3.out" });
        const tiltY = gsap.quickTo(card, "rotationY", { duration: 0.3, ease: "power3.out" });
        const squashX = gsap.quickTo(card, "scaleX", { duration: 0.55, ease: "back.out(3)" });
        const squashY = gsap.quickTo(card, "scaleY", { duration: 0.55, ease: "back.out(3)" });
        const leanTo = gsap.quickTo(card, "skewX", { duration: 0.5, ease: "back.out(2.6)" });
        const pressTo = gsap.quickTo(card, "z", { duration: 0.32, ease: "power3.out" });

        // The pivot the bend is measured from. GSAP never touches the stage's
        // own transform, so writing this property directly cannot desync its
        // transform cache.
        const focus = { x: 50, y: 50 };
        const applyFocus = () => {
          stage.style.perspectiveOrigin = `${focus.x}% ${focus.y}%`;
        };
        const focusX = gsap.quickTo(focus, "x", { duration: 0.45, ease: "power3.out", onUpdate: applyFocus });
        const focusY = gsap.quickTo(focus, "y", { duration: 0.45, ease: "power3.out" });

        // Measured lazily and invalidated rather than re-read on scroll:
        // measuring here on every scroll event forced a layout per card per
        // frame, which is felt as stutter the whole way down the page.
        let bounds: DOMRect | null = null;
        const invalidate = () => {
          bounds = null;
        };

        let resting = true;

        const rest = () => {
          if (resting) return;
          resting = true;
          tiltX(0);
          tiltY(0);
          squashX(1);
          squashY(1);
          leanTo(0);
          pressTo(0);
          focusX(50);
          focusY(50);
        };

        const onPointerMove = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          if (!bounds) bounds = card.getBoundingClientRect();

          const nearestX = clamp(event.clientX, bounds.left, bounds.right);
          const nearestY = clamp(event.clientY, bounds.top, bounds.bottom);
          const distance = Math.hypot(event.clientX - nearestX, event.clientY - nearestY);

          if (distance >= REACH) {
            rest();
            return;
          }

          resting = false;

          // Anchor the bend where the pointer is closest to the card.
          focusX(((nearestX - bounds.left) / bounds.width) * 100);
          focusY(((nearestY - bounds.top) / bounds.height) * 100);

          // Full strength while the pointer is over the card, tapering to
          // nothing at the edge of its reach.
          const strength = (1 - distance / REACH) ** 1.15;
          const offsetX = clamp((event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2), -1, 1);
          const offsetY = clamp((event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2), -1, 1);

          // Squash along the axis the pointer is pressing from and let the
          // other axis swell to take up the difference, the way a soft body
          // conserves its volume.
          const pressX = Math.abs(offsetX) * strength;
          const pressY = Math.abs(offsetY) * strength;

          tiltY(offsetX * TILT * strength);
          tiltX(-offsetY * TILT * strength);
          squashX(1 - pressX * SQUASH + pressY * SQUASH * COUNTER_STRETCH);
          squashY(1 - pressY * SQUASH + pressX * SQUASH * COUNTER_STRETCH);
          leanTo(offsetX * SKEW * strength);
          pressTo(-30 * Math.max(pressX, pressY));
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerleave", rest);
        window.addEventListener("scroll", invalidate, { passive: true });
        window.addEventListener("resize", invalidate, { passive: true });

        return () => {
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerleave", rest);
          window.removeEventListener("scroll", invalidate);
          window.removeEventListener("resize", invalidate);
          stage.style.perspectiveOrigin = "";
        };
      });

      return () => mm.revert();
    },
    { scope: stageRef },
  );

  return (
    <div ref={stageRef} className="h-full [perspective:1100px]">
    <Link
      ref={cardRef}
      href={`/services/${service.id}`}
      className="group flex h-full min-h-[260px] sm:min-h-[290px] w-full min-w-0 transform-gpu flex-col rounded-[20px] sm:rounded-[22px] border border-line bg-paper p-5 sm:p-7 md:p-9 text-ink shadow-[0_10px_28px_-26px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:border-ink hover:bg-ink"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs text-muted transition-colors duration-300 group-hover:text-brand-hot">{service.index}</span>
        <span className="grid size-9 sm:size-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
          <Arrow />
        </span>
      </div>

      <h3 className="mt-6 sm:mt-8 font-display text-[clamp(1.45rem,2.4vw,2.15rem)] leading-[1.05] tracking-[-0.04em] transition-colors duration-300 group-hover:text-white">{service.title}</h3>
      <p className="mt-3 sm:mt-4 text-[0.875rem] sm:text-[0.9375rem] leading-relaxed text-muted transition-colors duration-300 group-hover:text-white/65">{service.summary}</p>

      <ul className="mt-auto flex flex-wrap gap-1.5 sm:gap-2 pt-5 sm:pt-7">
        {service.deliverables.map((deliverable) => (
          <li key={deliverable} className="rounded-full border border-line px-2.5 py-1 text-[0.7rem] sm:px-3 sm:py-1.5 sm:text-xs text-muted transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/75">
            {deliverable}
          </li>
        ))}
      </ul>
    </Link>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4 transition-transform duration-300 group-hover:rotate-45"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 12L12 4M12 4H5.5M12 4v6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

