"use client";

import { useEffect, useState } from "react";

const SHOWCASE_MOTION_QUERY = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";
const canAnimateShowcase = () => window.matchMedia(SHOWCASE_MOTION_QUERY).matches;

type LiveCounterProps = {
  initial: number;
  variance?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  /** Start at zero once the surrounding preview enters the viewport. */
  startAtZero?: boolean;
  /** Allows a parent preview to pause counters until it is visible. */
  active?: boolean;
  /** Restart the count-up animation when the active dashboard view changes. */
  cycle?: number;
};

/** Ticks values up and down randomly over time to mimic real live system activity. */
export function LiveCounter({
  initial,
  variance = 3,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  startAtZero = false,
  active = true,
  cycle = 0,
}: LiveCounterProps) {
  const [val, setVal] = useState(startAtZero ? 0 : initial);

  useEffect(() => {
    if (!active) {
      const frame = requestAnimationFrame(() => setVal(startAtZero ? 0 : initial));
      return () => cancelAnimationFrame(frame);
    }

    if (!canAnimateShowcase()) {
      const frame = requestAnimationFrame(() => setVal(initial));
      return () => cancelAnimationFrame(frame);
    }

    let animationFrame = 0;
    let liveTimer: ReturnType<typeof setInterval> | undefined;

    const startLiveUpdates = () => {
      liveTimer = setInterval(() => {
        const delta = (Math.random() * 2 - 1) * variance;
        setVal(Number(Math.max(0, initial + delta).toFixed(decimals)));
      }, 2800 + Math.random() * 1500);
    };

    if (startAtZero) {
      const duration = 900;
      let startedAt = 0;
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - (1 - progress) ** 3;
        setVal(Number((initial * eased).toFixed(decimals)));
        if (progress < 1) {
          animationFrame = requestAnimationFrame(tick);
        } else {
          startLiveUpdates();
        }
      };
      animationFrame = requestAnimationFrame((now) => {
        setVal(0);
        startedAt = now;
        animationFrame = requestAnimationFrame(tick);
      });
    } else {
      startLiveUpdates();
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      if (liveTimer) clearInterval(liveTimer);
    };
  }, [active, cycle, decimals, initial, startAtZero, variance]);

  return (
    <span className={`transition-all duration-500 tabular-nums ${className}`}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

type TypewriterProps = {
  phrases: string[];
  className?: string;
};

/** Cycles through phrases with a character-by-character typing & erasing effect. */
export function TypewriterText({ phrases, className = "" }: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blink cursor
  useEffect(() => {
    if (!canAnimateShowcase()) return;
    const cursorTimer = setInterval(() => setBlink((v) => !v), 500);
    return () => clearInterval(cursorTimer);
  }, []);

  useEffect(() => {
    if (!canAnimateShowcase()) return;
    if (phrases.length === 0) return;

    if (subIndex === phrases[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      const timeout = setTimeout(() => {
        setReverse(false);
        setIndex((prev) => (prev + 1) % phrases.length);
      }, 0);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 35 : 65);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases]);

  return (
    <span className={className}>
      <span className="sm:hidden">{phrases[0]}</span>
      <span className="hidden sm:inline">
        {phrases[index].substring(0, subIndex)}
        <span className={`ml-0.5 inline-block font-bold text-brand ${blink ? "opacity-100" : "opacity-0"}`}>|</span>
      </span>
    </span>
  );
}

type LiveGraphProps = {
  baseHeights: number[];
  accentIndex?: number;
  heightClass?: string;
  barColor?: string;
  accentColor?: string;
  /** Hook for the caller to animate individual columns. */
  barClass?: string;
};

/** Live bar chart that continuously morphs column heights randomly. */
export function LiveGraph({
  baseHeights,
  accentIndex = 5,
  heightClass = "h-20",
  barColor = "bg-ink/12",
  accentColor = "bg-brand",
  barClass = "",
}: LiveGraphProps) {
  const [heights, setHeights] = useState<number[]>(baseHeights);

  useEffect(() => {
    if (!canAnimateShowcase()) return;
    const timer = setInterval(() => {
      setHeights(
        baseHeights.map((h) => {
          const delta = (Math.random() * 2 - 1) * 18;
          return Math.min(98, Math.max(18, Math.round(h + delta)));
        })
      );
    }, 2200);

    return () => clearInterval(timer);
  }, [baseHeights]);

  return (
    <div className={`flex items-end gap-2 ${heightClass}`} aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={`${barClass} flex-1 rounded-t-sm transition-[height] duration-700 ease-out ${
            i === accentIndex ? accentColor : barColor
          }`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}
