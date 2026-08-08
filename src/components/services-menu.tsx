"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { getSubServiceSlug, services } from "@/lib/site";
import { ServiceThumb } from "./service-thumb";

type ServicesMenuProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Two-panel services mega-menu.
 *
 * Left rail lists the practices as plain text — no thumbnails, so the eye
 * goes straight to the labels. The artwork lives entirely on the sub-service
 * cards on the right, which are a uniform grid: every tile is the same size
 * and aspect regardless of how long its label runs.
 */
export function ServicesMenu({ open, onClose }: ServicesMenuProps) {
  const [activeId, setActiveId] = useState(services[0].id);
  const panel = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(
    services.findIndex((s) => s.id === activeId),
    0,
  );
  const active = services[activeIndex];

  // Panel open/close. Built once, played and reversed — rebuilding it per
  // toggle would let a killed tween's leftover inline styles become the next
  // tween's destination.
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;

      tl.current = gsap
        .timeline({ paused: true })
        .fromTo(
          el,
          { autoAlpha: 0, y: -14 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" },
        );

      return () => {
        tl.current?.kill();
        tl.current = null;
      };
    },
    { scope: panel },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) t.play();
    else t.reverse();
  }, [open]);

  // Re-deal the cards whenever the active practice changes.
  useGSAP(
    () => {
      if (!open) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".sm-card",
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.42, ease: "power3.out", stagger: 0.025 },
        );
      });
      return () => mm.revert();
    },
    { scope: panel, dependencies: [activeId, open] },
  );

  // Escape closes, and focus is returned by the header's trigger button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={panel}
      // Hidden from AT and from the pointer until opened, so a closed menu
      // never traps a tab stop.
      inert={!open ? true : undefined}
      aria-hidden={!open}
      data-lenis-prevent
      className="invisible absolute inset-x-0 top-full hidden opacity-0 xl:block"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      <div className="shell pb-6 pt-3">
        <div className="overflow-hidden rounded-[20px] border border-line bg-paper shadow-[0_30px_80px_-30px_rgba(0,0,0,0.28)]">
          <div className="grid grid-cols-12">
            {/* ------------------------- practice rail ------------------------ */}
            <div className="col-span-4 border-r border-line bg-bone p-3 lg:col-span-3">
              <ul className="max-h-[440px] space-y-0.5 overflow-y-auto">
                {services.map((service) => {
                  const isActive = service.id === activeId;
                  return (
                    <li key={service.id}>
                      <Link
                        href={`/services/${service.id}`}
                        onClick={onClose}
                        onPointerEnter={() => setActiveId(service.id)}
                        onFocus={() => setActiveId(service.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={`group/rail flex items-center gap-3 rounded-xl px-3.5 py-3 transition-colors duration-300 ${
                          isActive
                            ? "bg-paper shadow-[0_6px_20px_-10px_rgba(0,0,0,0.35)]"
                            : "hover:bg-paper/60"
                        }`}
                      >
                        <span
                          className={`flex-1 text-[0.9375rem] font-medium leading-snug transition-colors duration-300 ${
                            isActive ? "text-ink" : "text-muted"
                          }`}
                        >
                          {service.title}
                        </span>

                        <svg
                          viewBox="0 0 16 16"
                          aria-hidden
                          fill="none"
                          className={`size-3.5 transition-all duration-300 ${
                            isActive ? "translate-x-0 text-brand" : "-translate-x-1 text-muted/50"
                          }`}
                        >
                          <path
                            d="M6 3l5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ------------------------ sub-service grid ---------------------- */}
            <div className="col-span-8 p-6 lg:col-span-9 lg:p-7">
              <div className="flex items-center justify-between gap-4 pb-5">
                <h2 className="font-display text-[1.375rem] tracking-[-0.035em]">
                  {active.title}
                </h2>
                <Link
                  href={`/services/${active.id}`}
                  onClick={onClose}
                  className="ul-link inline-flex items-center gap-2 text-[0.8125rem] text-muted"
                >
                  Practice overview
                  <svg viewBox="0 0 16 16" aria-hidden fill="none" className="size-3.5">
                    <path
                      d="M2 8h12M9 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              <div className="border-t border-line pt-5">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-3 xl:grid-cols-4">
                  {active.children.map((child, i) => (
                    <li key={child.name} className="sm-card">
                      <Link
                        href={`/services/${active.id}/${getSubServiceSlug(child.name)}`}
                        onClick={onClose}
                        className="group/card block"
                      >
                        {/* Fixed aspect keeps every tile identical no matter
                            how long the label below it wraps. */}
                        <span className="block aspect-[16/10] overflow-hidden rounded-lg border border-line">
                          <span className="block size-full transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.06]">
                            <ServiceThumb
                              childIndex={i}
                              category={active.id}
                              image={child.image}
                              alt={child.name}
                            />
                          </span>
                        </span>
                        <span className="mt-2.5 block text-[0.8125rem] leading-snug text-ink transition-colors duration-300 group-hover/card:text-brand">
                          {child.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
