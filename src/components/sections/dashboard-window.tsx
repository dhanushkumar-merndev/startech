"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { LiveCounter, LiveGraph, TypewriterText } from "@/components/live-stats";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

const DASHBOARD_NAV = [
  { id: "overview", label: "Overview", icon: "⌘", count: null },
  { id: "leads", label: "Leads", icon: "◉", count: "12" },
  { id: "projects", label: "Projects", icon: "□", count: "3" },
  { id: "automation", label: "Automation", icon: "↗", count: null },
] as const;

type DashboardPanel = (typeof DASHBOARD_NAV)[number]["id"];

type Metric = {
  label: string;
  initial: number;
  variance: number;
  change: string;
  suffix?: string;
  decimals?: number;
};

const DASHBOARD_PANELS: Record<DashboardPanel, {
  eyebrow: string;
  title: string;
  action: string;
  period: string;
  metrics: Metric[];
  graphTitle: string;
  graphChange: string;
  graphHeights: number[];
  graphAccent: number;
  spotlightLabel: string;
  spotlightValue: number;
  spotlightVariance: number;
  spotlightProgress: string;
  spotlightCopy: string;
  activityTitle: string;
  activityPhrases: string[];
  responseTitle: string;
  responseValue: number;
  responseSuffix: string;
}> = {
  overview: {
    eyebrow: "Today’s activity",
    title: "Your business, in one view.",
    action: "+ New lead",
    period: "Last 30 days",
    metrics: [
      { label: "New leads", initial: 24, variance: 4, change: "+12%" },
      { label: "Follow-ups", initial: 16, variance: 3, change: "+8%" },
      { label: "Projects", initial: 8, variance: 1, change: "On track" },
      { label: "Conversion", initial: 38, variance: 3.5, suffix: "%", decimals: 1, change: "+4.2%" },
    ],
    graphTitle: "Lead pipeline",
    graphChange: "This month +18%",
    graphHeights: [34, 56, 42, 78, 62, 92, 68, 88],
    graphAccent: 5,
    spotlightLabel: "Automations running",
    spotlightValue: 12,
    spotlightVariance: 3,
    spotlightProgress: "72%",
    spotlightCopy: "of routine tasks covered",
    activityTitle: "Recent activity",
    activityPhrases: [
      "New website enquiry assigned to Priya (Asha Textiles)",
      "Follow-up WhatsApp reminder sent to Meridian Distribution",
      "GST E-invoice approval workflow completed in 18s",
    ],
    responseTitle: "Team response",
    responseValue: 18,
    responseSuffix: " min",
  },
  leads: {
    eyebrow: "Lead inbox",
    title: "Every enquiry, ready for action.",
    action: "+ Add lead",
    period: "This week",
    metrics: [
      { label: "New today", initial: 22, variance: 4, change: "+6%" },
      { label: "Qualified", initial: 14, variance: 2, change: "+3" },
      { label: "Needs follow-up", initial: 9, variance: 2, change: "Priority" },
      { label: "Win rate", initial: 42, variance: 2.5, suffix: "%", decimals: 1, change: "+2.8%" },
    ],
    graphTitle: "Lead sources",
    graphChange: "Website leads +24%",
    graphHeights: [48, 72, 54, 84, 66, 94, 58, 78],
    graphAccent: 5,
    spotlightLabel: "Leads needing a reply",
    spotlightValue: 9,
    spotlightVariance: 2,
    spotlightProgress: "81%",
    spotlightCopy: "responded to within 30 min",
    activityTitle: "Lead activity",
    activityPhrases: [
      "Asha Textiles opened your proposal",
      "Rahul from Meridian Distribution replied on WhatsApp",
      "New lead from the website: Alpine Foods",
    ],
    responseTitle: "Average first reply",
    responseValue: 12,
    responseSuffix: " min",
  },
  projects: {
    eyebrow: "Project studio",
    title: "Keep every delivery on track.",
    action: "+ New project",
    period: "This quarter",
    metrics: [
      { label: "Active projects", initial: 8, variance: 1, change: "On track" },
      { label: "Due this week", initial: 3, variance: 1, change: "Focus" },
      { label: "Completed", initial: 18, variance: 2, change: "+4" },
      { label: "On-time rate", initial: 96, variance: 1.2, suffix: "%", decimals: 1, change: "+1.2%" },
    ],
    graphTitle: "Delivery progress",
    graphChange: "Completed +4",
    graphHeights: [28, 45, 64, 52, 76, 90, 72, 96],
    graphAccent: 7,
    spotlightLabel: "Tasks completed today",
    spotlightValue: 15,
    spotlightVariance: 3,
    spotlightProgress: "86%",
    spotlightCopy: "of this week’s plan complete",
    activityTitle: "Project activity",
    activityPhrases: [
      "Website launch checklist approved by Asha Textiles",
      "Mobile app sprint moved to client review",
      "New design task assigned to the product team",
    ],
    responseTitle: "Average delivery",
    responseValue: 4,
    responseSuffix: " days",
  },
  automation: {
    eyebrow: "Automation centre",
    title: "Let routine work run itself.",
    action: "+ New automation",
    period: "Last 7 days",
    metrics: [
      { label: "Running now", initial: 12, variance: 3, change: "Live" },
      { label: "Tasks saved", initial: 148, variance: 14, change: "+18%" },
      { label: "Queued", initial: 7, variance: 2, change: "Healthy" },
      { label: "Success rate", initial: 99, variance: 0.5, suffix: "%", decimals: 1, change: "+0.4%" },
    ],
    graphTitle: "Automation activity",
    graphChange: "Tasks completed +18%",
    graphHeights: [40, 66, 48, 82, 58, 96, 76, 88],
    graphAccent: 5,
    spotlightLabel: "Workflows completed",
    spotlightValue: 148,
    spotlightVariance: 12,
    spotlightProgress: "99.4%",
    spotlightCopy: "completed without intervention",
    activityTitle: "Automation activity",
    activityPhrases: [
      "Lead follow-up sent to Asha Textiles",
      "Invoice approval workflow completed in 18 seconds",
      "New website enquiry assigned to Priya automatically",
    ],
    responseTitle: "Time saved",
    responseValue: 14.5,
    responseSuffix: " hrs",
  },
};

/** A responsive browser-window preview that gives the home page a product feel. */
export function DashboardWindow() {
  const stage = useRef<HTMLElement>(null);
  const [activePanel, setActivePanel] = useState<DashboardPanel>("overview");
  const [isVisible, setIsVisible] = useState(false);
  const [counterCycle, setCounterCycle] = useState(0);
  const panel = DASHBOARD_PANELS[activePanel];

  useEffect(() => {
    const element = stage.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        setCounterCycle((cycle) => cycle + 1);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const selectPanel = (nextPanel: DashboardPanel) => {
    if (nextPanel === activePanel) return;
    setActivePanel(nextPanel);
    if (isVisible) setCounterCycle((cycle) => cycle + 1);
  };

  useGSAP(
    () => {
      const preview = stage.current?.querySelector<HTMLElement>(".dashboard-preview");
      const enquiry = stage.current?.querySelector<HTMLElement>(".dashboard-enquiry");
      const automation = stage.current?.querySelector<HTMLElement>(".dashboard-automation");
      if (!preview || !enquiry || !automation) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(preview, { transformPerspective: 1500, transformOrigin: "50% 10%" });

        gsap.fromTo(
          preview,
          { y: 0, rotationX: 0, rotationZ: 0 },
          {
            y: -86,
            rotationX: 8,
            rotationZ: -1.4,
            ease: "none",
            scrollTrigger: {
              trigger: stage.current,
              start: "top 78%",
              end: "bottom 12%",
              scrub: 0.8,
            },
          },
        );
        gsap.fromTo(
          enquiry,
          { y: 18, x: 0, rotation: -2 },
          {
            y: -132,
            x: -20,
            rotation: -7,
            ease: "none",
            scrollTrigger: {
              trigger: stage.current,
              start: "top 78%",
              end: "bottom 12%",
              scrub: 0.7,
            },
          },
        );
        gsap.fromTo(
          automation,
          { y: 0, x: 0, rotation: 2 },
          {
            y: -152,
            x: 26,
            rotation: 7,
            ease: "none",
            scrollTrigger: {
              trigger: stage.current,
              start: "top 78%",
              end: "bottom 12%",
              scrub: 0.7,
            },
          },
        );

        // Infinite subtle floating levitation for floating card badges
        gsap.to(enquiry, {
          y: "-=8",
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(automation, {
          y: "+=10",
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5,
        });

        const extraFloatingCards = stage.current?.querySelectorAll(".dashboard-float-card");
        if (extraFloatingCards && extraFloatingCards.length > 0) {
          extraFloatingCards.forEach((card, index) => {
            gsap.to(card, {
              y: index % 2 === 0 ? "-=7" : "+=7",
              rotation: index % 2 === 0 ? -1.5 : 1.5,
              duration: 3 + index * 0.45,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: index * 0.35,
            });
          });
        }

        // Infinite light sweep across the preview glass window
        const sweep = stage.current?.querySelector(".dashboard-sweep");
        if (sweep) {
          gsap.fromTo(
            sweep,
            { xPercent: -120 },
            {
              xPercent: 240,
              duration: 2.2,
              ease: "power2.inOut",
              repeat: -1,
              repeatDelay: 4.5,
            },
          );
        }

        // Infinite breathing pulse for status dots
        const pulseDots = stage.current?.querySelectorAll(".live-pulse-dot");
        if (pulseDots && pulseDots.length > 0) {
          gsap.to(pulseDots, {
            scale: 1.4,
            opacity: 0.5,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        // Infinite "graph big small" wave animation for pipeline & response bars
        const graphBars = stage.current?.querySelectorAll(".dash-graph-bar");
        if (graphBars && graphBars.length > 0) {
          graphBars.forEach((bar, i) => {
            gsap.to(bar, {
              scaleY: i % 2 === 0 ? 1.22 : 0.82,
              transformOrigin: "bottom center",
              duration: 1.8 + (i % 3) * 0.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.1,
            });
          });
        }

        const responseBars = stage.current?.querySelectorAll(".dash-response-bar");
        if (responseBars && responseBars.length > 0) {
          responseBars.forEach((bar, i) => {
            gsap.to(bar, {
              scaleY: i % 2 === 0 ? 1.28 : 0.78,
              transformOrigin: "bottom center",
              duration: 1.6 + (i % 3) * 0.3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.15,
            });
          });
        }

        // Infinite progress bar expanding & shrinking
        const progressFill = stage.current?.querySelector(".dash-progress-fill");
        if (progressFill) {
          gsap.to(progressFill, {
            width: "84%",
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        // Infinite stat values pulse
        const statNums = stage.current?.querySelectorAll(".dash-stat-num");
        if (statNums && statNums.length > 0) {
          gsap.to(statNums, {
            scale: 1.05,
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.3,
          });
        }
      });

      return () => mm.revert();
    },
    { scope: stage },
  );

  return (
    <section ref={stage} className="shell mt-12 pb-4 md:mt-20 md:pb-10">
      <div className="relative mx-auto max-w-6xl">
        <div aria-hidden className="pointer-events-none absolute -left-10 top-16 hidden size-40 rounded-full border border-brand/25 lg:block" />
        <div aria-hidden className="pointer-events-none absolute -right-7 bottom-8 hidden size-24 rounded-[28px] border border-line bg-bone lg:block" />
        <Reveal className="relative z-10">
          <div className="dashboard-preview relative overflow-hidden rounded-[24px] border border-line bg-paper shadow-[0_40px_100px_-44px_rgba(0,0,0,0.38)]">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px] z-20">
            <div className="dashboard-sweep absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/[0.25] to-transparent" />
          </div>
          <div className="flex items-center justify-between border-b border-line bg-bone px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2" aria-hidden>
              <span className="live-pulse-dot size-2 rounded-full bg-brand" />
              <span className="size-2 rounded-full bg-ink/15" />
              <span className="size-2 rounded-full bg-ink/15" />
            </div>
            <span className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[0.625rem] text-muted">
              startech.in / workspace
            </span>
            <span className="hidden text-xs text-muted sm:block">Live overview</span>
          </div>

          <div className="grid min-h-[300px] grid-cols-[56px_1fr] sm:min-h-[410px] sm:grid-cols-[168px_1fr]">
            <aside className="border-r border-line bg-bone p-3 sm:p-4">
              <div className="hidden h-full flex-col sm:flex">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-ink font-display text-xs font-semibold text-white">S</span>
                  <div className="min-w-0">
                    <div className="truncate font-display text-sm tracking-[-0.03em]">Star workspace</div>
                    <div className="mt-0.5 text-[0.625rem] text-muted">Sales operations</div>
                  </div>
                </div>

                <div className="mt-7 space-y-1">
                  {DASHBOARD_NAV.map((item) => {
                    const isActive = item.id === activePanel;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectPanel(item.id)}
                        aria-pressed={isActive}
                        className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs transition-colors duration-200 ${
                          isActive ? "bg-paper font-medium text-ink shadow-sm" : "text-muted hover:bg-paper/70 hover:text-ink"
                        }`}
                      >
                        <span className={`grid size-5 place-items-center rounded text-[0.625rem] ${isActive ? "bg-brand text-white" : "bg-ink/8 text-muted"}`}>
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {item.count ? <span className="font-mono text-[0.625rem] text-muted">{item.count}</span> : null}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-auto space-y-3">
                  <div className="rounded-lg border border-line bg-paper p-3">
                    <div className="text-[0.625rem] uppercase tracking-[0.12em] text-muted">System health</div>
                    <div className="mt-2 flex items-center gap-2 text-xs font-medium">
                      <span className="live-pulse-dot size-2 rounded-full bg-emerald-500" />
                      All systems live
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-line pt-3">
                    <span className="grid size-7 place-items-center rounded-full bg-brand/15 text-[0.625rem] font-semibold text-brand">PM</span>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-medium">Priya Menon</div>
                      <div className="mt-0.5 text-[0.625rem] text-muted">Workspace admin</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 sm:hidden">
                {DASHBOARD_NAV.map((item) => {
                  const isActive = item.id === activePanel;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectPanel(item.id)}
                      aria-label={`Open ${item.label}`}
                      aria-pressed={isActive}
                      className={`mx-auto grid size-7 place-items-center rounded-md text-[0.625rem] transition-colors ${isActive ? "bg-brand text-white" : "bg-ink/12 text-muted"}`}
                    >
                      {item.icon}
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="p-4 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="eyebrow text-brand">{panel.eyebrow}</span>
                  <h2 className="mt-2 font-display text-[clamp(1.45rem,2.5vw,2rem)] tracking-[-0.04em]">
                    {panel.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden rounded-full border border-line px-3 py-2 text-[0.6875rem] text-muted sm:inline">{panel.period}</span>
                  <button type="button" className="rounded-full bg-ink px-3.5 py-2 text-xs font-medium text-white">
                    {panel.action}
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {panel.metrics.map((item) => (
                  <div key={item.label} className="rounded-xl border border-line bg-bone p-3.5">
                    <div className="flex items-center justify-between gap-2 text-[0.6875rem] text-muted">
                      <span>{item.label}</span>
                      <span className="text-brand">{item.change}</span>
                    </div>
                    <div className="dash-stat-num mt-2 font-display text-xl tracking-[-0.04em]">
                      <LiveCounter
                        initial={item.initial}
                        variance={item.variance}
                        suffix={item.suffix || ""}
                        decimals={item.decimals || 0}
                        startAtZero
                        active={isVisible}
                        cycle={counterCycle}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1.35fr_0.9fr]">
                <div className="rounded-xl border border-line p-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{panel.graphTitle}</span>
                    <span className="text-brand">{panel.graphChange}</span>
                  </div>
                  <div className="mt-7">
                    <LiveGraph key={activePanel} baseHeights={panel.graphHeights} accentIndex={panel.graphAccent} heightClass="h-20" />
                  </div>
                </div>
                <div className="rounded-xl bg-ink p-4 text-white">
                  <div className="text-xs text-white/50">{panel.spotlightLabel}</div>
                  <div className="dash-stat-num mt-4 font-display text-3xl tracking-[-0.04em]">
                    <LiveCounter initial={panel.spotlightValue} variance={panel.spotlightVariance} startAtZero active={isVisible} cycle={counterCycle} />
                  </div>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/15">
                    <div className="dash-progress-fill h-full rounded-full bg-brand" style={{ width: panel.spotlightProgress }} />
                  </div>
                  <div className="mt-2 text-[0.6875rem] text-white/45">{panel.spotlightProgress} {panel.spotlightCopy}</div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1.35fr_0.9fr]">
                <div className="rounded-xl border border-line p-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{panel.activityTitle}</span>
                    <span className="text-brand">Live feed</span>
                  </div>
                  <div className="mt-3 flex min-h-[50px] items-center gap-2.5 text-[0.6875rem] text-ink/80">
                    <span className="live-pulse-dot size-2 shrink-0 rounded-full bg-brand" />
                    <TypewriterText
                      key={activePanel}
                      phrases={panel.activityPhrases}
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="hidden rounded-xl border border-line bg-bone p-4 sm:block">
                  <div className="text-xs text-muted">{panel.responseTitle}</div>
                  <div className="mt-3">
                    <LiveGraph baseHeights={[36, 58, 44, 76, 62, 84]} accentIndex={5} heightClass="h-8" barColor="bg-ink/15" />
                  </div>
                  <div className="mt-2 text-[0.6875rem] text-muted">
                    Live average: <LiveCounter initial={panel.responseValue} variance={2} decimals={activePanel === "automation" ? 1 : 0} suffix={panel.responseSuffix} startAtZero active={isVisible} cycle={counterCycle} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </Reveal>
        <div className="dashboard-enquiry absolute -left-12 top-12 z-20 hidden w-40 rounded-xl border border-line bg-paper p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.4)] lg:block">
          <span className="eyebrow text-brand">New enquiry</span>
          <div className="mt-3 font-display text-lg tracking-[-0.04em]">Asha Textiles</div>
          <div className="mt-1 text-xs text-muted">Website · 2 min ago</div>
        </div>
        <div className="dashboard-automation absolute -right-12 bottom-14 z-20 hidden w-44 rounded-xl bg-ink p-4 text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)] lg:block">
          <span className="eyebrow text-brand-hot">Automation</span>
          <div className="mt-3 text-sm font-medium">Lead follow-up sent</div>
          <div className="mt-2 text-xs text-white/45">Just now · WhatsApp</div>
        </div>
        <div className="dashboard-float-card pointer-events-none absolute -left-8 bottom-20 z-20 hidden w-36 rounded-xl border border-line bg-paper p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.4)] lg:block">
          <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.13em] text-muted">
            <span>Lead score</span>
            <span className="text-brand">Hot</span>
          </div>
          <div className="mt-2 font-display text-2xl tracking-[-0.05em]">92</div>
          <div className="mt-1 text-[0.65rem] text-muted">Ready for sales</div>
        </div>
        <div className="dashboard-float-card pointer-events-none absolute -right-7 top-24 z-20 hidden w-36 rounded-xl border border-brand/25 bg-paper p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.42)] lg:block">
          <div className="eyebrow text-brand">Today</div>
          <div className="mt-2 text-sm font-medium">3 meetings booked</div>
          <div className="mt-2 flex items-center gap-1.5 text-[0.65rem] text-muted">
            <span className="live-pulse-dot size-1.5 rounded-full bg-emerald-500" /> Calendar synced
          </div>
        </div>
      </div>
    </section>
  );
}
