"use client";

import { useEffect, useRef, useState } from "react";
import { FitToWidth } from "@/components/fit-to-width";
import { Reveal } from "@/components/reveal";
import { LiveCounter, LiveGraph, TypewriterText } from "@/components/live-stats";
import { EASE, MOTION_OK, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

/**
 * The window is laid out once at this width and scaled to whatever room it
 * has, so a phone gets the same composition as a desktop instead of a
 * re-stacked version of it. Matches the `max-w-6xl` column it sits in.
 */
const DASHBOARD_WIDTH = 1152;

const DESKTOP_MOTION = `${MOTION_OK} and (min-width: 768px)`;
/** The callout cards and their tethers only exist from `lg` up. */
const CALLOUT_MOTION = `${MOTION_OK} and (min-width: 1024px)`;

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
      const stageEl = stage.current;
      const preview = stageEl?.querySelector<HTMLElement>(".dashboard-preview");
      const enquiry = stageEl?.querySelector<HTMLElement>(".dashboard-enquiry");
      const automation = stageEl?.querySelector<HTMLElement>(".dashboard-automation");
      if (!stageEl || !preview || !enquiry || !automation) return;

      // Every looping animation registers here so it can be parked while the
      // section is off screen. Three dozen tweens ticking behind the fold is
      // work spent on nothing, and it lands as dropped frames in whatever the
      // visitor is actually scrolling through.
      const idle: gsap.core.Animation[] = [];
      const keepAlive = <T extends gsap.core.Animation>(animation: T) => {
        idle.push(animation);
        return animation;
      };

      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        gsap.set(preview, { transformPerspective: 1500, transformOrigin: "50% 10%" });
        // Keep the moving layers on their own compositor layer rather than
        // letting the browser promote and demote them on every tween.
        gsap.set([preview, enquiry, automation], { willChange: "transform" });

        // One trigger, one scrub, three layers. Three separate ScrollTriggers
        // meant three independent interpolations racing on the same tick.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stageEl,
              start: "top 78%",
              end: "bottom 12%",
              scrub: 0.8,
            },
          })
          .fromTo(preview, { y: 0, rotationX: 0, rotationZ: 0 }, { y: -86, rotationX: 8, rotationZ: -1.4 }, 0)
          .fromTo(enquiry, { y: 18, x: 0, rotation: -2 }, { y: -132, x: -20, rotation: -7 }, 0)
          .fromTo(automation, { y: 0, x: 0, rotation: 2 }, { y: -152, x: 26, rotation: 7 }, 0);

        // Infinite light sweep across the preview glass window
        const sweep = stageEl.querySelector(".dashboard-sweep");
        if (sweep) {
          keepAlive(
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
            ),
          );
        }

        // Infinite breathing pulse for status dots
        const pulseDots = stageEl.querySelectorAll(".live-pulse-dot");
        if (pulseDots.length > 0) {
          keepAlive(
            gsap.to(pulseDots, {
              scale: 1.4,
              opacity: 0.5,
              duration: 1.2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            }),
          );
        }

        // The window leans a few degrees towards the pointer. rotationY and x
        // are untouched by the scrub above, so the two never fight.
        //
        // The stage's horizontal geometry only moves on resize, so the rect is
        // measured then — reading it inside the handler forced a synchronous
        // layout on every pointer event, including all the ones fired during a
        // scroll.
        let bounds = stageEl.getBoundingClientRect();
        const remeasure = () => {
          bounds = stageEl.getBoundingClientRect();
        };

        const leanTo = gsap.quickTo(preview, "rotationY", { duration: 0.9, ease: "power3.out" });
        const slideTo = gsap.quickTo(preview, "x", { duration: 0.9, ease: "power3.out" });

        const onPointerMove = (event: PointerEvent) => {
          // Touch drags would otherwise leave the window stuck mid-lean.
          if (event.pointerType !== "mouse") return;
          const offset = (event.clientX - bounds.left) / bounds.width - 0.5;
          leanTo(offset * 6);
          slideTo(offset * 12);
        };

        const onPointerLeave = () => {
          leanTo(0);
          slideTo(0);
        };

        stageEl.addEventListener("pointermove", onPointerMove, { passive: true });
        stageEl.addEventListener("pointerleave", onPointerLeave);
        window.addEventListener("resize", remeasure);

        return () => {
          stageEl.removeEventListener("pointermove", onPointerMove);
          stageEl.removeEventListener("pointerleave", onPointerLeave);
          window.removeEventListener("resize", remeasure);
        };
      });

      mm.add(CALLOUT_MOTION, () => {
        // The idle drift runs on an inner layer of each callout. Sharing an
        // element with the scrub above put two tweens on the same `y` every
        // frame — the scroll value and the float value took turns writing it,
        // which is exactly the stutter that showed up mid-scroll.
        stageEl.querySelectorAll<HTMLElement>(".dashboard-drift").forEach((layer, i) => {
          gsap.set(layer, { willChange: "transform" });
          keepAlive(
            gsap.to(layer, {
              y: i % 2 === 0 ? -8 : 9,
              rotation: i % 2 === 0 ? -1.2 : 1.4,
              duration: 3.2 + i * 0.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.35,
            }),
          );
        });

        // The cards arrive after the window has settled, one after the other.
        const faces = stageEl.querySelectorAll(".dashboard-card-face");
        if (faces.length > 0) {
          gsap.from(faces, {
            autoAlpha: 0,
            y: 20,
            scale: 0.94,
            duration: 0.9,
            ease: EASE,
            stagger: 0.14,
            scrollTrigger: { trigger: stageEl, start: "top 80%", once: true },
          });
        }

        // Each tether draws itself once, then runs a signal down the wire to
        // the anchor point, which pings like a radar sweep.
        stageEl.querySelectorAll<SVGSVGElement>(".dashboard-link").forEach((tether, i) => {
          const line = tether.querySelector<SVGPathElement>(".dashboard-link-path");
          const signal = tether.querySelector<SVGPathElement>(".dashboard-link-pulse");
          const dot = tether.querySelector<SVGCircleElement>(".dashboard-link-dot");
          const halo = tether.querySelector<SVGCircleElement>(".dashboard-link-halo");
          const length = line?.getTotalLength() ?? 0;
          if (!line || !signal || !length) return;

          gsap.fromTo(
            line,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              duration: 1.1,
              ease: EASE,
              delay: 0.2 + i * 0.16,
              scrollTrigger: { trigger: stageEl, start: "top 80%", once: true },
            },
          );

          gsap.set(signal, { strokeDasharray: `12 ${length + 24}` });
          keepAlive(
            gsap.fromTo(
              signal,
              { strokeDashoffset: 12 },
              {
                strokeDashoffset: -length,
                duration: 1.9,
                ease: "power1.inOut",
                repeat: -1,
                repeatDelay: 2.2,
                delay: 1.2 + i * 0.7,
              },
            ),
          );

          // Scale the rendered circles rather than animating `r`: changing the
          // radius re-generates the shape's geometry every frame, where a
          // transform is handed straight to the compositor.
          if (!dot || !halo) return;
          const origin = `${dot.getAttribute("cx")} ${dot.getAttribute("cy")}`;

          keepAlive(
            gsap.to(dot, {
              scale: 1.45,
              svgOrigin: origin,
              duration: 1.15,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.2,
            }),
          );

          keepAlive(
            gsap.fromTo(
              halo,
              { scale: 1, opacity: 0.55 },
              {
                scale: 4.3,
                opacity: 0,
                svgOrigin: origin,
                duration: 2,
                repeat: -1,
                repeatDelay: 0.7,
                ease: "power2.out",
                delay: i * 0.4,
              },
            ),
          );
        });
      });

      // Created last, so every loop above is already registered: nothing in
      // this section ticks while it is out of view.
      const parked = ScrollTrigger.create({
        trigger: stageEl,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          idle.forEach((animation) => (self.isActive ? animation.resume() : animation.pause()));
        },
      });

      return () => {
        parked.kill();
        mm.revert();
      };
    },
    { scope: stage },
  );

  // Switching panels replaces this markup, so the live motion inside the
  // window is bound per panel rather than once on mount — otherwise every
  // chart goes still the first time someone uses the sidebar.
  useGSAP(
    () => {
      const stageEl = stage.current;
      if (!stageEl) return;

      const idle: gsap.core.Animation[] = [];
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const metricCards = stageEl.querySelectorAll(".dash-metric-card");
        if (metricCards.length > 0) {
          gsap.fromTo(
            metricCards,
            { y: 12, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5, ease: EASE, stagger: 0.06 },
          );
        }

        // Columns breathe against the baseline while their heights morph.
        stageEl.querySelectorAll(".dash-graph-bar, .dash-response-bar").forEach((bar, i) => {
          idle.push(
            gsap.to(bar, {
              scaleY: i % 2 === 0 ? 1.16 : 0.86,
              transformOrigin: "bottom center",
              duration: 1.8 + (i % 3) * 0.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.1,
            }),
          );
        });

        // scaleX, not width: width is a layout property, so animating it put
        // the whole panel through layout on every one of these frames.
        const progressFill = stageEl.querySelector(".dash-progress-fill");
        if (progressFill) {
          idle.push(
            gsap.to(progressFill, {
              scaleX: 1.16,
              transformOrigin: "left center",
              duration: 2.8,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            }),
          );
        }

        const statNums = stageEl.querySelectorAll(".dash-stat-num");
        if (statNums.length > 0) {
          idle.push(
            gsap.to(statNums, {
              scale: 1.05,
              duration: 2.2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              stagger: 0.3,
            }),
          );
        }

        const parked = ScrollTrigger.create({
          trigger: stageEl,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            idle.forEach((animation) => (self.isActive ? animation.resume() : animation.pause()));
          },
        });

        return () => parked.kill();
      });

      return () => mm.revert();
    },
    { scope: stage, dependencies: [activePanel] },
  );

  return (
    <section ref={stage} className="shell mt-3 pb-2 md:mt-20 md:pb-10">
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="relative z-10">
          {/* Composed once at desktop proportions, then scaled to fit. */}
          <FitToWidth width={DASHBOARD_WIDTH}>
          <div className="dashboard-preview relative overflow-hidden rounded-[24px] border border-line bg-paper shadow-[0_40px_100px_-44px_rgba(0,0,0,0.38)]">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px] z-20">
            <div className="dashboard-sweep absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/[0.25] to-transparent" />
          </div>
          <div className="flex items-center justify-between border-b border-line bg-bone px-5 py-3">
            <div className="flex items-center gap-2" aria-hidden>
              <span className="live-pulse-dot size-2 rounded-full bg-brand" />
              <span className="size-2 rounded-full bg-ink/15" />
              <span className="size-2 rounded-full bg-ink/15" />
            </div>
            <span className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-[0.625rem] text-muted">
              startech.in / workspace
            </span>
            <span className="text-xs text-muted">Live overview</span>
          </div>

          <div className="grid min-h-[410px] grid-cols-[168px_1fr]">
            <aside className="border-r border-line bg-bone p-4">
              <div className="flex h-full flex-col">
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
            </aside>

            <div className="p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="eyebrow text-brand">{panel.eyebrow}</span>
                  <h2 className="mt-2 font-display text-[2rem] tracking-[-0.04em]">
                    {panel.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-line px-3 py-2 text-[0.6875rem] text-muted">{panel.period}</span>
                  <button type="button" className="rounded-full bg-ink px-3.5 py-2 text-xs font-medium text-white">
                    {panel.action}
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-3">
                {panel.metrics.map((item) => (
                  <div
                    key={item.label}
                    className="dash-metric-card rounded-xl border border-line bg-bone p-3.5 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-brand/35"
                  >
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

              <div className="mt-4 grid grid-cols-[1.35fr_0.9fr] gap-3">
                <div className="rounded-xl border border-line p-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{panel.graphTitle}</span>
                    <span className="text-brand">{panel.graphChange}</span>
                  </div>
                  <div className="mt-7">
                    <LiveGraph key={activePanel} baseHeights={panel.graphHeights} accentIndex={panel.graphAccent} heightClass="h-20" barClass="dash-graph-bar" />
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
              <div className="mt-4 grid grid-cols-[1.35fr_0.9fr] gap-3">
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
                <div className="rounded-xl border border-line bg-bone p-4">
                  <div className="text-xs text-muted">{panel.responseTitle}</div>
                  <div className="mt-3">
                    <LiveGraph baseHeights={[36, 58, 44, 76, 62, 84]} accentIndex={5} heightClass="h-8" barColor="bg-ink/15" barClass="dash-response-bar" />
                  </div>
                  <div className="mt-2 text-[0.6875rem] text-muted">
                    Live average: <LiveCounter initial={panel.responseValue} variance={2} decimals={activePanel === "automation" ? 1 : 0} suffix={panel.responseSuffix} startAtZero active={isVisible} cycle={counterCycle} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          </FitToWidth>
        </Reveal>
        {/* Each callout is tethered to the surface it is reporting on. The
            wrapper carries the drift, so the tether travels with its card. */}
        <div className="dashboard-enquiry absolute -left-12 top-12 z-20 hidden w-40 lg:block">
          <div className="dashboard-drift relative">
            <div className="dashboard-card-face rounded-xl border border-line bg-paper p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.4)]">
              <span className="eyebrow text-brand">New enquiry</span>
              <div className="mt-3 font-display text-lg tracking-[-0.04em]">Asha Textiles</div>
              <div className="mt-1 text-xs text-muted">Website · 2 min ago</div>
            </div>
            <CardTether className="left-full top-1/2 -translate-y-6" d="M2 24C40 24 58 44 104 70" x={104} y={70} />
          </div>
        </div>
        <div className="dashboard-automation absolute -right-12 bottom-14 z-20 hidden w-44 lg:block">
          <div className="dashboard-drift relative">
            <div className="dashboard-card-face rounded-xl bg-ink p-4 text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]">
              <span className="eyebrow text-brand-hot">Automation</span>
              <div className="mt-3 text-sm font-medium">Lead follow-up sent</div>
              <div className="mt-2 text-xs text-white/45">Just now · WhatsApp</div>
            </div>
            <CardTether className="right-full top-1/2 -translate-y-6" d="M110 24C76 24 58 8 10 -16" x={10} y={-16} />
          </div>
        </div>
        <div className="dashboard-float-card pointer-events-none absolute -right-7 top-24 z-20 hidden w-36 lg:block">
          <div className="dashboard-drift relative">
            <div className="dashboard-card-face rounded-xl border border-brand/25 bg-paper p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.42)]">
              <div className="eyebrow text-brand">Today</div>
              <div className="mt-2 text-sm font-medium">3 meetings booked</div>
              <div className="mt-2 flex items-center gap-1.5 text-[0.65rem] text-muted">
                <span className="live-pulse-dot size-1.5 rounded-full bg-emerald-500" /> Calendar synced
              </div>
            </div>
            <CardTether className="right-full top-1/2 -translate-y-6" d="M110 24C74 24 58 46 12 68" x={12} y={68} />
          </div>
        </div>
      </div>
    </section>
  );
}

type CardTetherProps = {
  /** Placement against the card it belongs to. */
  className: string;
  /** Path from the card edge to the anchor point on the window. */
  d: string;
  x: number;
  y: number;
};

/**
 * The hairline tying a floating callout back to the workspace underneath it.
 *
 * The same path is drawn twice: the first copy draws itself in as the section
 * arrives, the second carries a short dash along the wire like a signal. The
 * box is deliberately `overflow-visible` so an anchor can sit outside the
 * viewBox — that is how the bottom-right callout reaches up into the panel.
 * Without JS the line simply renders at rest, already drawn.
 */
function CardTether({ className, d, x, y }: CardTetherProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 112 80"
      fill="none"
      className={`dashboard-link pointer-events-none absolute h-20 w-28 overflow-visible text-brand ${className}`}
    >
      <path
        className="dashboard-link-path"
        d={d}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.42"
      />
      <path
        className="dashboard-link-pulse"
        d={d}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeDasharray="12 9999"
        strokeDashoffset="12"
      />
      <circle className="dashboard-link-halo" cx={x} cy={y} r="3" stroke="currentColor" strokeWidth="1" opacity="0" />
      <circle className="dashboard-link-dot" cx={x} cy={y} r="3" fill="currentColor" />
    </svg>
  );
}
