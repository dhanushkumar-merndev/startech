"use client";

import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";
import { services } from "@/lib/site";

/**
 * A stable service index. Details stay visible, so hovering never changes a
 * row's height or pushes the rest of the section around.
 */
export function ServicesList() {
  return (
    <section id="services" className="shell scroll-mt-24 py-24 md:py-36">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <Reveal>
            <span className="eyebrow text-brand">What we do</span>
          </Reveal>
          <SplitHeading className="d2 mt-5 font-display">
            Everything your business needs to grow online.
          </SplitHeading>
        </div>
        <Reveal delay={100} className="md:col-span-4 md:col-start-9">
          <p className="text-[0.9375rem] leading-relaxed text-muted">
            From your website and lead capture to CRM, mobile apps and automation, one team
            builds systems that work together from day one.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.id} delay={index * 65}>
            <RepelServiceCard service={service} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

type Service = (typeof services)[number];

/**
 * The card only reacts when a pointer is close to one of its edges. The
 * movement is intentionally capped, so it feels responsive without making
 * the card hard to click.
 */
function RepelServiceCard({ service }: { service: Service }) {
  const card = useRef<HTMLAnchorElement>(null);

  const reset = () => {
    const element = card.current;
    if (!element) return;
    element.style.setProperty("--repel-x", "0px");
    element.style.setProperty("--repel-y", "0px");
    element.style.setProperty("--repel-scale-x", "1");
    element.style.setProperty("--repel-scale-y", "1");
  };

  const repelFromEdge = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const element = card.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    const distances = [
      { edge: "left", value: event.clientX - bounds.left },
      { edge: "right", value: bounds.right - event.clientX },
      { edge: "top", value: event.clientY - bounds.top },
      { edge: "bottom", value: bounds.bottom - event.clientY },
    ] as const;
    const closest = distances.reduce((near, edge) => (edge.value < near.value ? edge : near));
    const threshold = 92;

    if (closest.value >= threshold) {
      reset();
      return;
    }

    const strength = Math.max(0, 1 - closest.value / threshold);
    const distance = 11 * strength;
    const x = closest.edge === "left" ? distance : closest.edge === "right" ? -distance : 0;
    const y = closest.edge === "top" ? distance : closest.edge === "bottom" ? -distance : 0;
    const squash = 0.018 * strength;

    element.style.setProperty("--repel-x", `${x.toFixed(2)}px`);
    element.style.setProperty("--repel-y", `${y.toFixed(2)}px`);
    element.style.setProperty("--repel-scale-x", String(1 - (x ? squash : -squash * 0.45)));
    element.style.setProperty("--repel-scale-y", String(1 - (y ? squash : -squash * 0.45)));
  };

  return (
    <Link
      ref={card}
      href={`/services/${service.id}`}
      onPointerMove={repelFromEdge}
      onPointerLeave={reset}
      onBlur={reset}
      className="group flex h-full min-h-[270px] transform-gpu flex-col rounded-[22px] border border-line bg-paper p-6 transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] [transform:translate3d(var(--repel-x,0px),var(--repel-y,0px),0)_scaleX(var(--repel-scale-x,1))_scaleY(var(--repel-scale-y,1))] hover:border-ink hover:bg-ink md:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs text-muted transition-colors duration-300 group-hover:text-brand-hot">{service.index}</span>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
          <Arrow />
        </span>
      </div>

      <h3 className="mt-10 font-display text-[clamp(1.65rem,2.6vw,2.15rem)] leading-[1.02] tracking-[-0.04em] transition-colors duration-300 group-hover:text-white">
        {service.title}
      </h3>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted transition-colors duration-300 group-hover:text-white/65">{service.summary}</p>

      <ul className="mt-auto flex flex-wrap gap-2 pt-7">
        {service.deliverables.map((deliverable) => (
          <li key={deliverable} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/75">
            {deliverable}
          </li>
        ))}
      </ul>
    </Link>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 transition-transform duration-300 group-hover:rotate-45" fill="none" aria-hidden>
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
