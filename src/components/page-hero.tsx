"use client";

import { useRef, type ReactNode } from "react";
import { SplitHeading } from "@/components/split-heading";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
};

/** Shared masthead for the inner pages. */
export function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline()
          .from(".ph-dot", { scale: 0, duration: 0.6, ease: "back.out(2)" })
          .from(".ph-eyebrow", { y: 16, autoAlpha: 0, duration: 0.7 }, 0.05)
          .from(".ph-lead", { y: 22, autoAlpha: 0, duration: 0.9 }, 0.45)
          .from(".ph-extra", { y: 20, autoAlpha: 0, duration: 0.8 }, 0.6);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-b border-line pb-16 pt-[132px] md:pb-24 md:pt-[184px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage: "url('/y-so-serious-white.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "240px 240px",
          maskImage: "radial-gradient(110% 80% at 15% 0%, #000 10%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(110% 80% at 15% 0%, #000 10%, transparent 72%)",
        }}
      />

      <div className="shell relative">
        <div className="flex items-center gap-3">
          <span className="ph-dot size-1.5 rounded-full bg-brand" />
          <span className="ph-eyebrow eyebrow text-muted">{eyebrow}</span>
        </div>

        <SplitHeading as="h1" trigger="load" className="d2 mt-6 max-w-4xl font-display">
          {title}
        </SplitHeading>

        {lead && (
          <p className="ph-lead mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-muted">
            {lead}
          </p>
        )}

        {children && <div className="ph-extra mt-10">{children}</div>}
      </div>
    </section>
  );
}
