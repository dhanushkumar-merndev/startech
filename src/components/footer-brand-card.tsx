"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Footer links intentionally perform a full document navigation. */
import Image from "next/image";
import { useRef } from "react";
import { EASE, MOTION_REDUCED, gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";

const TILE_COLUMNS = 6;
const TILE_ROWS = 3;
const TILES = Array.from({ length: TILE_COLUMNS * TILE_ROWS }, (_, index) => ({
  index,
  column: index % TILE_COLUMNS,
  row: Math.floor(index / TILE_COLUMNS),
}));

export function FooterBrandCard() {
  const card = useRef<HTMLDivElement>(null);
  const baseLogo = useRef<HTMLImageElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = card.current;
      const logo = root?.querySelector<HTMLElement>(".footer-logo-trigger");
      const tiles = card.current?.querySelectorAll<HTMLElement>(".footer-logo-tile");
      const base = baseLogo.current;
      if (!root || !logo || !tiles?.length || !base || !contextSafe) return;

      let restoreDelay: gsap.core.Tween | null = null;
      let broken = false;

      gsap.set(tiles, { autoAlpha: 0 });

      const restoreLogo = contextSafe(() => {
        gsap.killTweensOf(tiles);
        gsap.to(tiles, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.9,
          stagger: { amount: 0.24, from: "end" },
          ease: EASE,
          onComplete: () => {
            gsap.set(base, { autoAlpha: 1 });
            gsap.set(tiles, { autoAlpha: 0 });
            broken = false;
          },
        });
      });

      const breakLogo = contextSafe(() => {
        if (broken || window.matchMedia(MOTION_REDUCED).matches) return;

        restoreDelay?.kill();
        restoreDelay = null;
        broken = true;

        gsap.killTweensOf(tiles);
        gsap.set(base, { autoAlpha: 0 });
        gsap.set(tiles, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1 });
        gsap.to(tiles, {
          x: (index) => {
            const column = index % TILE_COLUMNS;
            return (column - (TILE_COLUMNS - 1) / 2) * 5 + (index % 2 ? 4 : -4);
          },
          y: (index, tile: HTMLElement) => {
            const cardBottom = root.getBoundingClientRect().bottom;
            const tileBottom = tile.getBoundingClientRect().bottom;
            const pileOffset = 10 + (index % 3) * 5;
            return cardBottom - tileBottom - pileOffset;
          },
          rotation: (index) => (index % 2 ? 1 : -1) * (7 + (index % 4) * 4),
          scale: (index) => 0.92 - (index % 3) * 0.035,
          autoAlpha: 0.18,
          duration: (index) => 0.82 + Math.floor(index / TILE_COLUMNS) * 0.11,
          delay: (index) => Math.floor(index / TILE_COLUMNS) * 0.055 + (index % TILE_COLUMNS) * 0.018,
          ease: "power3.in",
        });
      });

      const cancelRestore = contextSafe(() => {
        restoreDelay?.kill();
        restoreDelay = null;
      });

      const queueRestore = contextSafe(() => {
        if (!broken) return;
        restoreDelay?.kill();
        restoreDelay = gsap.delayedCall(2, restoreLogo);
      });

      logo.addEventListener("pointerenter", breakLogo);
      root.addEventListener("pointerenter", cancelRestore);
      root.addEventListener("pointerleave", queueRestore);

      return () => {
        restoreDelay?.kill();
        logo.removeEventListener("pointerenter", breakLogo);
        root.removeEventListener("pointerenter", cancelRestore);
        root.removeEventListener("pointerleave", queueRestore);
      };
    },
    { scope: card },
  );

  return (
    <div
      ref={card}
      className="relative overflow-hidden rounded-[24px] border border-white/10 bg-paper p-7 text-ink shadow-[0_24px_70px_-32px_rgba(0,0,0,0.8)] sm:p-9 lg:col-span-5 lg:p-10"
    >
      <a
        href="/"
        aria-label={`${site.name} — home`}
        className="footer-logo-trigger inline-flex"
      >
        <span className="relative block aspect-[749/226] w-[150px] sm:w-[180px]">
          <Image
            ref={baseLogo}
            src="/logo.png"
            alt=""
            width={749}
            height={226}
            sizes="180px"
            className="absolute inset-0 h-full w-full"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 grid grid-cols-6 grid-rows-3"
          >
            {TILES.map(({ index, column, row }) => (
              <span
                key={index}
                className="footer-logo-tile will-change-transform"
                style={{
                  backgroundImage: 'url("/logo.png")',
                  backgroundPosition: `${(column / (TILE_COLUMNS - 1)) * 100}% ${(row / (TILE_ROWS - 1)) * 100}%`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${TILE_COLUMNS * 100}% ${TILE_ROWS * 100}%`,
                }}
              />
            ))}
          </span>
        </span>
      </a>

      <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
        {site.tagline}
      </p>
      <a
        href={`mailto:${site.email}`}
        className="ul-link mt-8 block max-w-full break-words font-display text-[clamp(1.4rem,2.6vw,2rem)] tracking-[-0.035em] text-ink transition-colors duration-300 hover:text-brand"
      >
        {site.email}
      </a>
    </div>
  );
}
