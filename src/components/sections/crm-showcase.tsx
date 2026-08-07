"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";
import { EASE, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

type Stage = "Qualified" | "Proposal" | "Negotiation" | "Won" | "At risk";

type Deal = {
  company: string;
  sector: string;
  owner: string;
  stage: Stage;
  value: string;
  updated: string;
};

const deals: Deal[] = [
  { company: "Velan Steel", sector: "Manufacturing", owner: "RM", stage: "Negotiation", value: "₹42.0L", updated: "12m ago" },
  { company: "Amber Retail", sector: "Retail chain", owner: "PN", stage: "Proposal", value: "₹18.5L", updated: "1h ago" },
  { company: "Triveni Agro", sector: "Agritech", owner: "AK", stage: "At risk", value: "₹64.2L", updated: "3h ago" },
  { company: "Northgate Infra", sector: "Construction", owner: "SD", stage: "Qualified", value: "₹27.8L", updated: "Yesterday" },
  { company: "Kovai Logistics", sector: "Transport", owner: "RM", stage: "Won", value: "₹1.12Cr", updated: "2d ago" },
];

const stageStyles: Record<Stage, string> = {
  Qualified: "border-white/15 bg-white/[0.06] text-white/70",
  Proposal: "border-white/15 bg-white/[0.06] text-white/70",
  Negotiation: "border-white/20 bg-white/10 text-white/90",
  Won: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300/90",
  "At risk": "border-brand/40 bg-brand/15 text-brand-hot",
};

const columns: { stage: Stage; deals: Deal[] }[] = [
  { stage: "Qualified", deals: deals.filter((d) => d.stage === "Qualified") },
  { stage: "Proposal", deals: deals.filter((d) => d.stage === "Proposal") },
  { stage: "Negotiation", deals: deals.filter((d) => d.stage === "Negotiation" || d.stage === "At risk") },
];

const highlights = [
  "Pipelines shaped to your sales motion, not a template",
  "Offline order capture for field teams",
  "GST e-invoicing and Tally sync out of the box",
  "Role-based access down to the field level",
];

export function CrmShowcase() {
  const [view, setView] = useState<"table" | "board">("table");
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const panel = root.current?.querySelector<HTMLElement>(".crm-panel");
      if (!panel) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // The product surface tilts up into place as it arrives — a slight
        // rotationX sells it as a physical screen rather than a flat card.
        gsap.from(panel, {
          y: 90,
          scale: 0.94,
          rotationX: 12,
          autoAlpha: 0,
          duration: 1.4,
          ease: EASE,
          transformPerspective: 1400,
          transformOrigin: "center bottom",
          scrollTrigger: { trigger: panel, start: "top 88%", once: true },
        });

        gsap.from(".crm-metric", {
          y: 22,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.08,
          scrollTrigger: { trigger: panel, start: "top 70%", once: true },
        });

        // The glass sweep, on a loop with a long pause between passes.
        gsap.fromTo(
          ".crm-sweep",
          { xPercent: -130 },
          { xPercent: 230, duration: 1.8, ease: "power2.inOut", repeat: -1, repeatDelay: 5 },
        );

        gsap.to(".crm-risk-dot", {
          opacity: 0.2,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Keep the product card visually separate from the page scroll. The
      // movement is intentionally small and runs only on larger screens so
      // the dashboard stays easy to read and mobile scrolling stays native.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(panel, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.65,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // Rows are re-animated whenever the view flips, so the swap reads as a
  // deliberate transition rather than a hard cut.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".crm-item",
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out", stagger: 0.045 },
        );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [view] },
  );

  return (
    <section
      ref={root}
      className="grain relative overflow-hidden bg-ink py-24 text-white md:py-32"
    >
      {/* A single red bloom, low opacity, top-right. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[680px] rounded-full opacity-[0.16] blur-[130px]"
        style={{ background: "radial-gradient(circle, #e10600 0%, transparent 68%)" }}
      />

      <div className="shell relative z-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow text-brand-hot">The Star Tech CRM</span>
            </Reveal>
            <SplitHeading className="d2 mt-5 font-display">
              Your pipeline, without the guesswork.
            </SplitHeading>
          </div>

          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <ul className="space-y-3">
              {highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[0.9375rem] leading-snug text-white/65">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-brand" />
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ------------------------- product surface ------------------------- */}
        <div className="mt-14">
          <div className="crm-panel relative rounded-[20px] border border-line-dark bg-ink-2 p-1.5 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
            {/* Light sweeps across the glass every few seconds. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]"
            >
              <div className="crm-sweep absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/[0.045] to-transparent" />
            </div>

            <div className="relative overflow-hidden rounded-[15px] border border-white/[0.06] bg-ink-3">
              {/* toolbar */}
              <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-brand/70" />
                  <span className="size-2.5 rounded-full bg-white/15" />
                  <span className="size-2.5 rounded-full bg-white/15" />
                </div>

                <div className="mx-1 hidden h-4 w-px bg-white/10 sm:block" />

                <div className="flex items-center gap-1.5 text-[0.8125rem] text-white/45">
                  <span className="text-white/80">Sales</span>
                  <span>/</span>
                  <span className="text-white">Q3 Pipeline</span>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <div className="hidden items-center gap-2 rounded-md border border-white/10 px-2.5 py-1.5 text-[0.75rem] text-white/40 sm:flex">
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
                      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    Search
                    <kbd className="rounded border border-white/10 px-1 font-sans text-[0.625rem]">⌘K</kbd>
                  </div>

                  <div className="flex rounded-md border border-white/10 p-0.5">
                    {(["table", "board"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setView(v)}
                        aria-pressed={view === v}
                        className={`rounded-[5px] px-2.5 py-1 text-[0.75rem] capitalize transition-colors duration-200 ${
                          view === v ? "bg-white text-ink" : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* metric strip */}
              <div className="grid grid-cols-2 divide-x divide-white/[0.07] border-b border-white/[0.07] md:grid-cols-4">
                {[
                  { k: "Open pipeline", v: "₹3.84 Cr" },
                  { k: "Weighted", v: "₹1.47 Cr" },
                  { k: "Avg. cycle", v: "38 days" },
                  { k: "Win rate", v: "34%" },
                ].map((m) => (
                  <div key={m.k} className="crm-metric px-4 py-4">
                    <div className="text-[0.6875rem] uppercase tracking-[0.12em] text-white/35">
                      {m.k}
                    </div>
                    <div className="mt-1.5 font-display text-xl tracking-[-0.03em]">{m.v}</div>
                  </div>
                ))}
              </div>

              {view === "table" ? <DealTable /> : <DealBoard />}
            </div>
          </div>
        </div>

        <Reveal delay={100} className="mt-12 flex flex-wrap items-center gap-5">
          <Link href="/contact" className="btn btn-on-dark">
            Book a walkthrough
          </Link>
          <p className="text-sm text-white/45">
            Live demo with your own data in under a week.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function DealTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/[0.07] text-[0.6875rem] uppercase tracking-[0.12em] text-white/35">
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Owner</th>
            <th className="px-4 py-3 font-medium">Stage</th>
            <th className="px-4 py-3 text-right font-medium">Value</th>
            <th className="px-4 py-3 text-right font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr
              key={deal.company}
              className="crm-item border-b border-white/[0.05] transition-colors duration-200 last:border-0 hover:bg-white/[0.03]"
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.06] font-display text-[0.6875rem] font-semibold">
                    {deal.company.slice(0, 2).toUpperCase()}
                  </span>
                  <span>
                    <span className="block text-[0.875rem] text-white/90">{deal.company}</span>
                    <span className="block text-[0.75rem] text-white/35">{deal.sector}</span>
                  </span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="grid size-6 place-items-center rounded-full bg-brand/85 text-[0.625rem] font-semibold text-white">
                  {deal.owner}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.75rem] ${stageStyles[deal.stage]}`}
                >
                  {deal.stage === "At risk" && (
                    <span className="crm-risk-dot size-1.5 rounded-full bg-brand-hot" />
                  )}
                  {deal.stage}
                </span>
              </td>
              <td className="px-4 py-3.5 text-right font-display text-[0.9375rem] tracking-[-0.02em]">
                {deal.value}
              </td>
              <td className="px-4 py-3.5 text-right text-[0.8125rem] text-white/35">
                {deal.updated}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DealBoard() {
  return (
    <div className="grid gap-px bg-white/[0.06] md:grid-cols-3">
      {columns.map((col) => (
        <div key={col.stage} className="bg-ink-3 p-4">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[0.75rem] font-medium text-white/70">{col.stage}</span>
            <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[0.6875rem] text-white/40">
              {col.deals.length}
            </span>
          </div>
          <div className="space-y-2.5">
            {col.deals.map((deal) => (
              <div
                key={deal.company}
                className="crm-item rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 transition-colors duration-200 hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[0.875rem] text-white/90">{deal.company}</span>
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand/85 text-[0.5625rem] font-semibold">
                    {deal.owner}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-[0.9375rem] tracking-[-0.02em]">
                    {deal.value}
                  </span>
                  <span className="text-[0.6875rem] text-white/30">{deal.updated}</span>
                </div>
                {deal.stage === "At risk" && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[0.6875rem] text-brand-hot">
                    <span className="crm-risk-dot size-1.5 rounded-full bg-brand-hot" />
                    No contact in 14 days
                  </div>
                )}
              </div>
            ))}
            {col.deals.length === 0 && (
              <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-[0.75rem] text-white/25">
                Nothing here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
