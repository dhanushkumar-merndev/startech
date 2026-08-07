"use client";

import { useEffect, useState } from "react";
import { fontsReady } from "./gsap";

/**
 * True once webfonts have settled.
 *
 * Feed this into a `useGSAP` dependency list rather than awaiting fonts
 * inside the GSAP callback: animations created in a promise callback are
 * built *after* useGSAP's context has closed, so they escape its bookkeeping
 * and get stranded half-played when React re-runs the effect. Gating on a
 * dependency keeps every tween synchronous and inside the context.
 */
export function useFontsReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    fontsReady().then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return ready;
}
