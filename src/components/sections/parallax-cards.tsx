"use client";

import Link from "next/link";
import { useRef } from "react";
import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";
import { gsap, useGSAP } from "@/lib/gsap";

const cards = [
  {
    number: "01",
    label: "Website development",
    title: "Turn visits into real enquiries.",
    body: "A clear, fast website gives every marketing campaign and referral somewhere convincing to land.",
    tone: "bg-paper text-ink border-line",
    offset: 34,
    visual: "website",
  },
  {
    number: "02",
    label: "CRM & lead management",
    title: "Never lose a lead in the follow-up.",
    body: "Bring calls, forms, WhatsApp enquiries and sales activity into one pipeline your team can act on.",
    tone: "bg-brand text-white border-brand",
    offset: -26,
    visual: "crm",
  },
  {
    number: "03",
    label: "Automation & apps",
    title: "Make the next step happen automatically.",
    body: "Connect your team, customers and existing tools with mobile apps and workflows that remove repeat work.",
    tone: "bg-ink text-white border-ink",
    offset: 42,
    visual: "automation",
  },
] as const;

/**
 * A self-contained desktop parallax treatment. It deliberately uses short
 * transforms and is disabled below 768px to keep mobile scrolling smooth.
 */
export function ParallaxCards() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".parallax-card", root.current).forEach((card) => {
          const offset = Number(card.dataset.offset ?? 0);
          gsap.fromTo(
            card,
            { y: offset },
            {
              y: -offset,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.65,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="overflow-hidden bg-bone py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow text-brand">Connected by design</span>
            </Reveal>
            <SplitHeading className="d2 mt-5 font-display">
              One journey, from first click to daily work.
            </SplitHeading>
          </div>
          <Reveal delay={100} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[0.9375rem] leading-relaxed text-muted">
              Each part of your business should support the next. We design the website,
              lead flow, software and automation as one connected system.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3 md:items-start">
          {cards.map((card, index) => (
            <article
              key={card.number}
              data-offset={card.offset}
              className={`parallax-card relative min-h-[360px] overflow-hidden rounded-[24px] border p-6 will-change-transform md:min-h-[430px] md:p-7 ${
                index === 1 ? "md:mt-14" : index === 2 ? "md:mt-7" : ""
              } ${card.tone}`}
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-mono text-xs ${index === 0 ? "text-muted" : "text-white/60"}`}>
                    {card.number}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-[0.6875rem] font-medium ${
                      index === 0 ? "border-line text-muted" : "border-white/20 text-white/75"
                    }`}
                  >
                    {card.label}
                  </span>
                </div>

                <h3 className="mt-9 max-w-xs font-display text-[clamp(1.8rem,3vw,2.55rem)] leading-[0.98] tracking-[-0.045em]">
                  {card.title}
                </h3>
                <p className={`mt-5 max-w-sm text-[0.9375rem] leading-relaxed ${index === 0 ? "text-muted" : "text-white/70"}`}>
                  {card.body}
                </p>

                <div className="mt-auto pt-8" aria-hidden>
                  <CardVisual kind={card.visual} light={index === 0} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <Reveal delay={150} className="mt-12 text-center">
          <Link href="/contact" className="btn btn-primary">
            Plan your connected system
            <Arrow />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function CardVisual({ kind, light }: { kind: (typeof cards)[number]["visual"]; light: boolean }) {
  const line = light ? "bg-line" : "bg-white/15";
  const soft = light ? "bg-bone" : "bg-white/10";

  if (kind === "website") {
    return (
      <div className="rounded-xl border border-line bg-bone p-3">
        <div className={`h-2 w-12 rounded-full ${line}`} />
        <div className={`mt-4 h-16 rounded-lg ${soft}`} />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className={`h-9 rounded-md ${line}`} />
          <div className="h-9 rounded-md bg-brand/85" />
        </div>
      </div>
    );
  }

  if (kind === "crm") {
    return (
      <div className="grid grid-cols-3 gap-2">
        {["New", "Follow-up", "Won"].map((stage, index) => (
          <div key={stage} className="rounded-lg border border-white/15 bg-white/[0.08] p-2.5">
            <div className="text-[0.625rem] text-white/60">{stage}</div>
            <div className={`mt-3 h-10 rounded-md ${index === 1 ? "bg-white/25" : "bg-white/15"}`} />
            <div className="mt-2 h-2 w-2/3 rounded-full bg-white/20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {["New enquiry", "CRM follow-up", "Message sent"].map((step, index) => (
        <div key={step} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5">
          <span className={`size-2 shrink-0 rounded-full ${index === 2 ? "bg-brand-hot" : "bg-white/40"}`} />
          <span className="text-xs text-white/70">{step}</span>
          {index < 2 && <span className="ml-auto text-xs text-white/30">→</span>}
        </div>
      ))}
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
      <path
        d="M2 8h12M9 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
