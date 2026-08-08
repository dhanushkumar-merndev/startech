import type { ReactNode, SVGProps } from "react";

/**
 * Line marks for the client ticker.
 *
 * These are drawn in-house rather than loaded from artwork: they share one
 * stroke weight and one 24-unit grid, so the strip reads as a single set
 * instead of a jumble of mismatched brand assets. Swap a client's entry for
 * their real logo when it is supplied — everything else keeps working.
 */
const MARKS: Record<string, ReactNode> = {
  // Globe with a meridian running through it.
  meridian: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M3.75 12h16.5" />
      <path d="M12 3.75c2.9 4.1 2.9 12.4 0 16.5-2.9-4.1-2.9-12.4 0-16.5Z" />
    </>
  ),
  // Growth bars sitting on a baseline.
  arya: (
    <>
      <path d="M4 19.5h16" />
      <path d="M7.5 16V11M12 16V6.5M16.5 16V9" />
    </>
  ),
  // Freight cube.
  kovai: (
    <>
      <path d="m3.75 8.25 8.25-4.5 8.25 4.5v7.5L12 20.25l-8.25-4.5z" />
      <path d="m3.75 8.25 8.25 4.5 8.25-4.5M12 12.75v7.5" />
    </>
  ),
  // Care cross.
  sundar: (
    <>
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="5" />
      <path d="M12 8.25v7.5M8.25 12h7.5" />
    </>
  ),
  // Hex nut.
  velan: (
    <>
      <path d="M12 3.5l7.4 4.25v8.5L12 20.5l-7.4-4.25v-8.5z" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  // Gate arch.
  northgate: (
    <>
      <path d="M4.25 20.25V11.5a7.75 7.75 0 0 1 15.5 0v8.75" />
      <path d="M12 20.25v-8.5" />
    </>
  ),
  // Retail bag.
  amber: (
    <>
      <path d="M5 7.75h14l-1.15 12.5H6.15z" />
      <path d="M9 7.75V6.4a3 3 0 0 1 6 0v1.35" />
    </>
  ),
  // Two leaves off a shared stem — a confluence.
  triveni: (
    <>
      <path d="M12 20.5V9" />
      <path d="M12 15.5c0-4.4 2.6-7 7-7.6-.5 4.7-3.1 7.3-7 7.6Z" />
      <path d="M12 17.5c0-3.8-2.2-6.1-6-6.6.4 4 2.6 6.3 6 6.6Z" />
    </>
  ),
};

/** Falls back to a neutral monogram badge so an unmapped name still renders. */
const FALLBACK = (
  <>
    <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="5" />
    <path d="M8.5 15.5 12 8.5l3.5 7" />
  </>
);

function markKey(name: string) {
  return name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
}

type ClientMarkProps = SVGProps<SVGSVGElement> & { name: string };

export function ClientMark({ name, className = "", ...rest }: ClientMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...rest}
    >
      {MARKS[markKey(name)] ?? FALLBACK}
    </svg>
  );
}
