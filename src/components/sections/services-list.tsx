"use client";

import Link from "next/link";
import { useRef } from "react";
import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";
import { services } from "@/lib/site";
import { gsap, useGSAP } from "@/lib/gsap";

/** Service index with separate cards that respond softly near their edges. */
export function ServicesList() {
  return (
    <section id="services" className="shell scroll-mt-24 py-16 sm:py-24 md:py-36">
      <div className="grid gap-6 sm:gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <Reveal>
            <span className="eyebrow text-brand">What we do</span>
          </Reveal>
          <SplitHeading className="d2 mt-4 sm:mt-5 font-display">
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

      <div className="mt-10 sm:mt-16 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.id} delay={index * 65} className="w-full h-full min-w-0">
            <RepelServiceCard service={service} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

type Service = (typeof services)[number];

/** Separate service cards with a small edge-based squish and repel response. */
function RepelServiceCard({ service }: { service: Service }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;

      const mm = gsap.matchMedia();
      mm.add("(pointer: fine) and (min-width: 640px) and (prefers-reduced-motion: no-preference)", () => {
        const xTo = gsap.quickTo(card, "x", { duration: 0.28, ease: "power2.out" });
        const yTo = gsap.quickTo(card, "y", { duration: 0.28, ease: "power2.out" });
        const scaleXTo = gsap.quickTo(card, "scaleX", { duration: 0.24, ease: "power2.out" });
        const scaleYTo = gsap.quickTo(card, "scaleY", { duration: 0.24, ease: "power2.out" });

        let bounds: DOMRect | null = null;

        const updateBounds = () => {
          if (card) {
            bounds = card.getBoundingClientRect();
          }
        };

        const reset = () => {
          xTo(0);
          yTo(0);
          scaleXTo(1);
          scaleYTo(1);
        };

        const onPointerMove = (event: PointerEvent) => {
          if (!bounds) {
            bounds = card.getBoundingClientRect();
          }

          const inside =
            event.clientX >= bounds.left &&
            event.clientX <= bounds.right &&
            event.clientY >= bounds.top &&
            event.clientY <= bounds.bottom;

          let directionX = 0;
          let directionY = 0;
          let edgeDistance = 0;

          if (inside) {
            const fromCenter = Math.max(
              Math.abs(event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2),
              Math.abs(event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2),
            );

            // The central zone is calm.
            if (fromCenter <= 0.05) {
              reset();
              return;
            }

            const edges = [
              { edge: "left", value: event.clientX - bounds.left },
              { edge: "right", value: bounds.right - event.clientX },
              { edge: "top", value: event.clientY - bounds.top },
              { edge: "bottom", value: bounds.bottom - event.clientY },
            ] as const;
            const closest = edges.reduce((near, edge) => (edge.value < near.value ? edge : near));
            edgeDistance = closest.value;
            directionX = closest.edge === "left" ? 1 : closest.edge === "right" ? -1 : 0;
            directionY = closest.edge === "top" ? 1 : closest.edge === "bottom" ? -1 : 0;
          } else {
            const nearestX = Math.min(Math.max(event.clientX, bounds.left), bounds.right);
            const nearestY = Math.min(Math.max(event.clientY, bounds.top), bounds.bottom);
            const vectorX = nearestX - event.clientX;
            const vectorY = nearestY - event.clientY;
            edgeDistance = Math.hypot(vectorX, vectorY);
            if (edgeDistance > 0) {
              directionX = vectorX / edgeDistance;
              directionY = vectorY / edgeDistance;
            }
          }

          const threshold = 160;
          if (edgeDistance >= threshold) {
            reset();
            return;
          }

          const strength = (1 - edgeDistance / threshold) ** 1.15;
          const movement = 14 * strength;
          xTo(directionX * movement);
          yTo(directionY * movement);
          scaleXTo(1 - (Math.abs(directionX) > Math.abs(directionY) ? 0.08 : -0.025) * strength);
          scaleYTo(1 - (Math.abs(directionY) > Math.abs(directionX) ? 0.08 : -0.025) * strength);
        };

        const onPointerEnter = () => {
          updateBounds();
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerleave", reset);
        window.addEventListener("scroll", updateBounds, { passive: true });
        window.addEventListener("resize", updateBounds, { passive: true });
        card.addEventListener("pointerenter", onPointerEnter, { passive: true });

        return () => {
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerleave", reset);
          window.removeEventListener("scroll", updateBounds);
          window.removeEventListener("resize", updateBounds);
          card.removeEventListener("pointerenter", onPointerEnter);
        };
      });

      return () => mm.revert();
    },
    { scope: cardRef },
  );

  return (
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

