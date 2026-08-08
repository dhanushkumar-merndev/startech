"use client";

import { useEffect, useRef, type ReactNode } from "react";

type FitToWidthProps = {
  /** The width the children are composed at, in px. */
  width: number;
  className?: string;
  children: ReactNode;
};

/**
 * Lays its children out at one fixed width and scales them down to whatever
 * room is available.
 *
 * This is for the product canvases: a phone should get the same picture as a
 * desktop, only smaller, rather than a re-stacked second design. Breakpoint
 * variants cannot do that — they read the viewport, so the composition would
 * change shape rather than size. Anything inside here should therefore be
 * written for the fixed width and left alone.
 *
 * Scaling is a transform, so the layout box stays at full size: the frame is
 * given the scaled height explicitly, or the page would reserve room for the
 * unscaled content.
 */
export function FitToWidth({ width, className = "", children }: FitToWidthProps) {
  const frame = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frameEl = frame.current;
    const contentEl = content.current;
    if (!frameEl || !contentEl) return;

    let appliedHeight = -1;

    const apply = () => {
      const scale = Math.min(1, frameEl.clientWidth / width);
      contentEl.style.transform = scale === 1 ? "" : `scale(${scale})`;
      // Ships clipped so the unscaled content cannot spill sideways before
      // hydration; at full size it has to open back up, or the drop shadow
      // underneath the canvas gets cut off.
      frameEl.style.overflow = scale === 1 ? "visible" : "hidden";

      // Writing the same height back would wake the observer for nothing.
      const height = Math.round(contentEl.offsetHeight * scale);
      if (height !== appliedHeight) {
        appliedHeight = height;
        frameEl.style.height = `${height}px`;
      }
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(frameEl);
    observer.observe(contentEl);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={frame} className={`overflow-hidden ${className}`}>
      <div ref={content} style={{ width }} className="origin-top-left">
        {children}
      </div>
    </div>
  );
}
