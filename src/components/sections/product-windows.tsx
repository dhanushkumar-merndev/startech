"use client";

import { useRef } from "react";
import { FitToWidth } from "@/components/fit-to-width";
import { LiveCounter, TypewriterText } from "@/components/live-stats";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * Both canvases are composed at this width and scaled down to fit their
 * column, so a phone gets the same picture as a desktop. Nothing inside them
 * should carry breakpoint variants.
 */
const CANVAS_WIDTH = 760;

const DESKTOP_MOTION = `${MOTION_OK} and (min-width: 768px)`;
const MOBILE_MOTION = `${MOTION_OK} and (max-width: 767px)`;

const pipeline = [
  {
    stage: "New enquiries",
    total: "18",
    accent: "bg-brand",
    cards: [["Asha Textiles", "Website + CRM", "92"]],
  },
  {
    stage: "Qualified",
    total: "09",
    accent: "bg-amber-400",
    cards: [["Kovai Logistics", "Operations suite", "84"]],
  },
  {
    stage: "Proposal sent",
    total: "06",
    accent: "bg-sky-400",
    cards: [["Meridian", "Custom ERP", "68"]],
  },
  {
    stage: "Won this month",
    total: "12",
    accent: "bg-emerald-400",
    cards: [["Velan Steel", "Automation", "100"]],
  },
];

const nodes = [
  { label: "New lead", x: "left-[6%] top-[45%]", color: "border-brand bg-brand text-white" },
  { label: "Enrich data", x: "left-[28%] top-[18%]", color: "border-white/20 bg-[#262626] text-white" },
  { label: "Assign owner", x: "left-[47%] top-[60%]", color: "border-white/20 bg-[#262626] text-white" },
  { label: "WhatsApp", x: "right-[8%] top-[22%]", color: "border-brand/50 bg-brand/15 text-white" },
  { label: "Create task", x: "right-[11%] bottom-[10%]", color: "border-white/20 bg-[#262626] text-white" },
];

/**
 * Two intentionally different product canvases. They follow the hero preview
 * with richer examples of the CRM and automation work the studio ships.
 */
export function ProductWindows() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const crmWindow = root.current?.querySelector<HTMLElement>(".product-window-crm");
      const automationWindow = root.current?.querySelector<HTMLElement>(".product-window-automation");
      if (!crmWindow || !automationWindow) return;

      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        [
          {
            element: crmWindow,
            origin: "50% 0%",
            from: { y: 26, rotationX: 3, rotationZ: -0.7 },
            to: { y: -48, rotationX: 8, rotationZ: 1.1 },
          },
          {
            element: automationWindow,
            origin: "50% 0%",
            from: { y: 26, rotationX: 3, rotationZ: 0.7 },
            to: { y: -48, rotationX: 8, rotationZ: -1.1 },
          },
        ].forEach(({ element, origin, from, to }) => {
          gsap.set(element, {
            transformPerspective: 1500,
            transformOrigin: origin,
          });
          gsap.fromTo(
            element,
            from,
            {
              ...to,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
            },
          );
        });

        // Infinite floating levitation for nodes on Automation Canvas
        const nodesEl = root.current?.querySelectorAll(".automation-node");
        if (nodesEl && nodesEl.length > 0) {
          nodesEl.forEach((node, i) => {
            gsap.to(node, {
              y: i % 2 === 0 ? "-=6" : "+=6",
              duration: 2.8 + i * 0.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });
        }

        // Infinite subtle floating for CRM opportunity cards
        const cardsEl = root.current?.querySelectorAll(".crm-card");
        if (cardsEl && cardsEl.length > 0) {
          cardsEl.forEach((card, i) => {
            gsap.to(card, {
              y: i % 2 === 0 ? "-=4" : "+=4",
              duration: 3 + i * 0.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });
        }

        // Infinite glass reflection sweep across Component 2 (CRM window) only
        const crmSweep = root.current?.querySelector(".crm-window-sweep");
        if (crmSweep) {
          gsap.fromTo(
            crmSweep,
            { xPercent: -120 },
            {
              xPercent: 240,
              duration: 2.4,
              ease: "power2.inOut",
              repeat: -1,
              repeatDelay: 5,
            },
          );
        }

        // Infinite status pulse for health badges and live indicators
        const windowPulses = root.current?.querySelectorAll(".window-pulse");
        if (windowPulses && windowPulses.length > 0) {
          gsap.to(windowPulses, {
            scale: 1.35,
            opacity: 0.5,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        // Component 2: Infinite opportunity card progress bar fills.
        // scaleX rather than width — width is a layout property, so animating
        // it put the card through layout on every frame, forever.
        const crmBarFills = root.current?.querySelectorAll(".crm-bar-fill");
        if (crmBarFills && crmBarFills.length > 0) {
          crmBarFills.forEach((bar, i) => {
            gsap.to(bar, {
              scaleX: i % 2 === 0 ? 1.22 : 0.8,
              transformOrigin: "left center",
              duration: 2.2 + i * 0.3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });
        }

        // Component 2: Infinite stat numbers pulse
        const crmStatValues = root.current?.querySelectorAll(".crm-stat-value");
        if (crmStatValues && crmStatValues.length > 0) {
          gsap.to(crmStatValues, {
            scale: 1.06,
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.25,
          });
        }

        // Component 3: Infinite execution health progress bar fill (no shine effect)
        const autoHealthFill = root.current?.querySelector(".auto-health-fill");
        if (autoHealthFill) {
          gsap.fromTo(
            autoHealthFill,
            { scaleX: 0.94, transformOrigin: "left center" },
            { scaleX: 1, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" },
          );
        }

        // Component 3: Infinite time saved metric pulse
        const autoTimeNum = root.current?.querySelectorAll(".auto-time-num");
        if (autoTimeNum && autoTimeNum.length > 0) {
          gsap.to(autoTimeNum, {
            scale: 1.08,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.3,
          });
        }

        const floatingCards = root.current?.querySelectorAll(".product-float-card");
        if (floatingCards && floatingCards.length > 0) {
          floatingCards.forEach((card, index) => {
            gsap.to(card, {
              y: index % 2 === 0 ? "-=8" : "+=8",
              rotation: index % 2 === 0 ? -1.4 : 1.4,
              duration: 3.1 + index * 0.35,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: index * 0.25,
            });
          });
        }
      });

      // Mobile uses the same scroll-driven depth as the Selected Work cards,
      // while the square canvas itself keeps the layout compact.
      mm.add(MOBILE_MOTION, () => {
        gsap.fromTo(
          crmWindow,
          { y: 16 },
          {
            y: -16,
            ease: "none",
            scrollTrigger: {
              trigger: crmWindow,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="shell space-y-16 py-14 md:space-y-32 md:py-24">
      <article className="relative grid items-center gap-6 lg:gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <span className="eyebrow text-brand">01 — lead command centre</span>
          <h2 className="mt-3 sm:mt-4 font-display text-[clamp(2.1rem,4.5vw,4.8rem)] leading-[0.92] tracking-[-0.055em]">
            Every opportunity, moving forward.
          </h2>
          <p className="mt-4 sm:mt-6 max-w-sm text-[0.875rem] sm:text-[0.95rem] leading-relaxed text-muted">
            A sales workspace that turns incoming enquiries into focused next actions for your
            team—without spreadsheets or chasing updates.
          </p>
          <div className="mt-5 sm:mt-7 flex items-center gap-3 text-sm font-medium">
            <span className="grid size-8 place-items-center rounded-full bg-brand text-white">↗</span>
            CRM & lead management
          </div>
        </div>

        <FitToWidth width={CANVAS_WIDTH} className="w-full max-w-[760px] justify-self-center lg:col-span-8">
        <div className="product-window product-window-crm relative overflow-hidden rounded-[24px] border border-line bg-[#f7f6f3] shadow-[0_42px_100px_-48px_rgba(0,0,0,0.45)]">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px] z-20">
            <div className="crm-window-sweep absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/[0.3] to-transparent" />
          </div>

          <div>
            <div className="flex items-center justify-between border-b border-line px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="window-pulse size-2 rounded-full bg-brand" />
              <span className="size-2 rounded-full bg-ink/15" />
              <span className="size-2 rounded-full bg-ink/15" />
            </div>
            <div className="rounded-full border border-line bg-white px-4 py-1 font-mono text-[0.625rem] text-muted">
              pipeline / q3
            </div>
            <span className="text-xs text-muted">18 active opportunities</span>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow text-brand">Sales workspace</span>
                <h3 className="mt-2 font-display text-[2.2rem] tracking-[-0.05em]">
                  Your pipeline, at a glance.
                </h3>
              </div>
              <div className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-white">+ Add opportunity</div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Pipeline value", initial: 12.4, variance: 0.5, prefix: "₹", suffix: "L", decimals: 1, detail: "+18.6%" },
                { label: "Weighted forecast", initial: 8.9, variance: 0.4, prefix: "₹", suffix: "L", decimals: 1, detail: "76% confidence" },
                { label: "Average response", initial: 18, variance: 3, suffix: " min", decimals: 0, detail: "↓ 6 min" },
              ].map((item, index) => (
                <div key={item.label} className="rounded-xl border border-line bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-[0.7rem] text-muted">{item.label}</span>
                    <span className={`window-pulse size-1.5 rounded-full ${index === 1 ? "bg-amber-400" : "bg-brand"}`} />
                  </div>
                  <div className="crm-stat-value mt-1.5 font-display text-2xl tracking-[-0.05em]">
                    <LiveCounter
                      initial={item.initial}
                      variance={item.variance}
                      prefix={item.prefix || ""}
                      suffix={item.suffix || ""}
                      decimals={item.decimals}
                    />
                  </div>
                  <div className="mt-0.5 text-[0.65rem] text-brand">{item.detail}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {pipeline.map((column) => (
                <div key={column.stage} className="min-w-0 rounded-xl border border-line bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.7rem] font-medium text-muted">{column.stage}</span>
                    <span className="font-display text-lg tracking-[-0.04em]">{column.total}</span>
                  </div>
                  <span className={`mt-3 block h-1 w-10 rounded-full ${column.accent}`} />
                  <div className="mt-4 space-y-3">
                    {column.cards.map(([name, type, score]) => (
                      <div key={name} className="crm-card rounded-lg border border-line bg-bone p-3 shadow-[0_8px_18px_-16px_rgba(0,0,0,0.6)]">
                        <div className="flex items-start justify-between gap-2">
                          <span className="truncate text-xs font-medium">{name}</span>
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink text-[0.55rem] text-white">{score}</span>
                        </div>
                        <div className="mt-2 text-[0.62rem] text-muted">{type}</div>
                        <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink/10">
                          <span className="crm-bar-fill block h-full w-[72%] rounded-full bg-brand" />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[0.58rem] text-muted">
                          <span className="grid size-4 place-items-center rounded-full bg-white font-medium text-ink">
                            {name.slice(0, 1)}
                          </span>
                          <span>Follow up today</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
        </FitToWidth>
        <div className="product-float-card pointer-events-none absolute right-5 top-16 z-30 hidden w-36 rounded-xl border border-line bg-white p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] lg:block">
          <div className="eyebrow text-brand">New lead</div>
          <div className="mt-2 text-sm font-medium">Riviera Homes</div>
          <div className="mt-1 text-[0.65rem] text-muted">Score 76 · Website</div>
        </div>
        <div className="product-float-card pointer-events-none absolute bottom-[-28px] right-[12%] z-30 hidden w-40 rounded-xl border border-line bg-white p-3 text-ink shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] lg:block">
          <div className="eyebrow text-brand">Pipeline</div>
          <div className="mt-2 text-sm font-medium">₹2.4L moved forward</div>
          <div className="mt-1 text-[0.65rem] text-muted">Just updated</div>
        </div>
      </article>

      <article className="relative grid items-center gap-6 lg:gap-8 lg:grid-cols-12">
        <div className="order-1 lg:order-2 lg:col-span-4">
          <span className="eyebrow text-brand">02 — automation studio</span>
          <h2 className="mt-3 sm:mt-4 font-display text-[clamp(2.1rem,4.5vw,4.8rem)] leading-[0.92] tracking-[-0.055em]">
            Build the work that runs itself.
          </h2>
          <p className="mt-4 sm:mt-6 max-w-sm text-[0.875rem] sm:text-[0.95rem] leading-relaxed text-muted">
            Connect the tools your business already uses, then make follow-ups, approvals and
            notifications happen at exactly the right moment.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Lead routing", "WhatsApp", "Approvals"].map((label) => (
              <span key={label} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
                {label}
              </span>
            ))}
          </div>
        </div>

        <FitToWidth width={CANVAS_WIDTH} className="order-2 w-full max-w-[760px] justify-self-center lg:order-1 lg:col-span-8">
        <div className="product-window product-window-automation relative overflow-hidden rounded-[24px] border border-white/10 bg-[#111] text-white shadow-[0_42px_100px_-48px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="window-pulse size-2 rounded-full bg-brand" />
              <span className="size-2 rounded-full bg-white/15" />
              <span className="size-2 rounded-full bg-white/15" />
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1 font-mono text-[0.625rem] text-white/50">
              automation / lead follow-up
            </div>
            <span className="text-xs text-emerald-300">● Active</span>
          </div>

          <div className="grid min-h-[420px] grid-cols-[1fr_170px]">
            <div className="relative overflow-hidden p-7">
              <div aria-hidden className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="relative flex items-start justify-between">
                <div>
                  <span className="eyebrow text-brand-hot">Automation canvas</span>
                  <h3 className="mt-2 font-display text-[2.1rem] tracking-[-0.05em]">New lead response</h3>
                </div>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.65rem] text-white/60">Last edited today</span>
              </div>

              <div aria-hidden className="absolute left-[15%] top-[52%] h-px w-[70%] -rotate-[18deg] bg-gradient-to-r from-brand via-white/30 to-brand" />
              <div aria-hidden className="absolute left-[30%] top-[30%] h-[42%] w-px rotate-[35deg] bg-white/20" />
              <div aria-hidden className="absolute right-[21%] top-[34%] h-[46%] w-px -rotate-[40deg] bg-white/20" />

              {nodes.map((node) => (
                <div
                  key={node.label}
                  className={`automation-node absolute z-10 rounded-xl border px-3 py-2.5 text-[0.7rem] font-medium shadow-[0_12px_28px_-18px_rgba(0,0,0,0.9)] ${node.x} ${node.color}`}
                >
                  <span className="window-pulse mr-2 inline-block size-1.5 rounded-full bg-current align-middle opacity-70" />
                  {node.label}
                </div>
              ))}
              <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-lg border border-white/10 bg-black/35 p-2.5 text-[0.65rem] text-white/55">
                <span className="window-pulse size-2 rounded-full bg-emerald-400" />
                <span className="auto-time-num">
                  <LiveCounter initial={26} variance={4} suffix=" leads processed this week" />
                </span>
              </div>
              <div className="absolute bottom-6 right-6 min-w-[190px] rounded-lg border border-white/10 bg-black/35 p-2.5 text-[0.65rem] text-white/55">
                <TypewriterText
                  phrases={[
                    "Rule: score > 70 → notify sales",
                    "Rule: lead captured → auto enrich",
                    "Rule: proposal sent → schedule ping",
                  ]}
                  className="font-mono"
                />
              </div>
            </div>

            <aside className="border-l border-white/10 bg-white/[0.035] p-5">
              <span className="eyebrow text-white/40">Run history</span>
              <div className="mt-6 space-y-5">
                {[["Today, 11:42", "Lead assigned", "success"], ["Today, 11:41", "WhatsApp sent", "brand"], ["Today, 11:39", "Trigger received", "muted"]].map(([time, label, tone]) => (
                  <div key={label} className="relative pl-4 text-xs">
                    <span className={`window-pulse absolute left-0 top-1.5 size-1.5 rounded-full ${tone === "success" ? "bg-emerald-400" : tone === "brand" ? "bg-brand" : "bg-white/30"}`} />
                    <div className="text-white/85">{label}</div>
                    <div className="mt-1 text-[0.65rem] text-white/40">{time}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-white/10 pt-5">
                <div className="text-[0.62rem] uppercase tracking-[0.14em] text-white/40">Connected tools</div>
                <div className="mt-3 flex gap-2">
                  {[
                    ["W", "WhatsApp"],
                    ["C", "CRM"],
                    ["G", "Gmail"],
                  ].map(([initial, label]) => (
                    <div key={label} className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-[0.65rem] font-medium">
                      {initial}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-[0.65rem] text-white/45">
                  <span>Execution health</span>
                  <span className="auto-time-num text-emerald-300">
                    <LiveCounter initial={99.8} variance={0.3} suffix="%" decimals={1} />
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="auto-health-fill h-full w-[99%] rounded-full bg-emerald-400" />
                </div>
              </div>
              <div className="mt-7 rounded-xl border border-brand/30 bg-brand/10 p-3">
                <div className="text-[0.65rem] text-brand-hot">TIME SAVED</div>
                <div className="auto-time-num mt-2 font-display text-3xl tracking-[-0.05em]">
                  <LiveCounter initial={14.5} variance={0.6} suffix="h" decimals={1} />
                </div>
                <div className="mt-1 text-[0.65rem] text-white/45">this week</div>
              </div>
            </aside>
          </div>
        </div>
        </FitToWidth>
        <div className="product-float-card pointer-events-none absolute left-4 top-20 z-30 hidden w-36 rounded-xl border border-white/10 bg-[#1d1d1d] p-3 text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.75)] lg:block">
          <div className="eyebrow text-brand-hot">WhatsApp</div>
          <div className="mt-2 text-sm font-medium">Follow-up sent</div>
          <div className="mt-1 text-[0.65rem] text-white/45">2 seconds ago</div>
        </div>
        <div className="product-float-card pointer-events-none absolute bottom-[-24px] left-[30%] z-30 hidden w-40 rounded-xl border border-emerald-400/25 bg-[#17201d] p-3 text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.75)] lg:block">
          <div className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.13em] text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Workflow live
          </div>
          <div className="mt-2 text-sm font-medium">99.8% execution health</div>
        </div>
      </article>
    </section>
  );
}
