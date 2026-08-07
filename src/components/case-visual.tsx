import type { CaseStudy } from "@/lib/site";

/**
 * Stand-in artwork for each case study — generated geometry rather than
 * stock photography, so the grid stays on-brand with zero image weight.
 * Each slug gets a distinct construction.
 */
export function CaseVisual({ study }: { study: CaseStudy }) {
  const dark = study.tone === "ink" || study.tone === "red";
  const bg =
    study.tone === "ink" ? "bg-ink" : study.tone === "red" ? "bg-brand" : "bg-bone";
  const stroke = dark ? "rgba(255,255,255,0.32)" : "rgba(10,10,10,0.22)";
  const accent = study.tone === "red" ? "rgba(255,255,255,0.9)" : "#e10600";

  return (
    <div className={`relative h-full w-full overflow-hidden ${bg}`}>
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {study.slug === "meridian-distribution" && (
          <>
            {/* distribution: a scattered node network */}
            {[
              [70, 90], [150, 55], [230, 110], [310, 70], [110, 190], [200, 220], [290, 175],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="3.5" fill={i === 3 ? accent : stroke} />
                <circle cx={x} cy={y} r="16" fill="none" stroke={stroke} strokeWidth="0.75" />
              </g>
            ))}
            <path
              d="M70 90 L150 55 L230 110 L310 70 M150 55 L110 190 L200 220 L290 175 L230 110"
              fill="none"
              stroke={stroke}
              strokeWidth="1"
            />
          </>
        )}

        {study.slug === "arya-finserv" && (
          <>
            {/* lending: stepped growth bars */}
            {[40, 62, 88, 120, 165, 215].map((h, i) => (
              <rect
                key={i}
                x={48 + i * 52}
                y={250 - h}
                width="30"
                height={h}
                fill={i === 5 ? accent : "none"}
                stroke={stroke}
                strokeWidth="1"
              />
            ))}
            <line x1="30" y1="250" x2="370" y2="250" stroke={stroke} strokeWidth="1" />
          </>
        )}

        {study.slug === "kovai-logistics" && (
          <>
            {/* fleet: routes crossing a field */}
            <path d="M-10 230 C 90 200, 130 120, 200 110 S 330 90, 410 40" fill="none" stroke={stroke} strokeWidth="1.2" />
            <path d="M-10 270 C 110 250, 160 180, 250 165 S 350 140, 410 105" fill="none" stroke={stroke} strokeWidth="1.2" />
            <path d="M-10 190 C 80 150, 140 70, 230 60 S 340 40, 410 -5" fill="none" stroke={stroke} strokeWidth="1.2" strokeDasharray="4 5" />
            {[[200, 110], [250, 165], [230, 60]].map(([x, y], i) => (
              <rect key={i} x={x - 5} y={y - 5} width="10" height="10" fill={i === 0 ? accent : stroke} transform={`rotate(45 ${x} ${y})`} />
            ))}
          </>
        )}

        {study.slug === "sundar-healthcare" && (
          <>
            {/* clinics: concentric reach */}
            {[36, 72, 108, 144].map((r, i) => (
              <circle key={r} cx="200" cy="150" r={r} fill="none" stroke={stroke} strokeWidth={i === 0 ? 1.4 : 0.9} />
            ))}
            <path d="M200 118 v64 M168 150 h64" stroke={accent} strokeWidth="6" strokeLinecap="square" />
            {[[200, 42], [308, 150], [200, 258], [92, 150]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" fill={stroke} />
            ))}
          </>
        )}
      </svg>

      {/* year plate */}
      <span
        className={`absolute right-5 top-5 font-mono text-[0.6875rem] ${
          dark ? "text-white/50" : "text-muted"
        }`}
      >
        {study.year}
      </span>
    </div>
  );
}
