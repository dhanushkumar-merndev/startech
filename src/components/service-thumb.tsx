import Image from "next/image";

type ServiceThumbProps = {
  /** Index of the child within its parent category (0–7). */
  childIndex?: number;
  seed?: number;
  category: "website" | "crm" | "mobile" | "automation" | "software" | "integrations" | string;
  /** Real artwork from /public, if it exists. */
  image?: string;
  alt: string;
};

/**
 * Content-relevant artwork for each sub-service card.
 *
 * Every tile shows an illustration that represents what the sub-service
 * actually does — a browser for websites, a phone for mobile, a funnel for
 * CRM pipelines, etc. — rather than generic geometric patterns.
 */
export function ServiceThumb({ childIndex, seed, category, image, alt }: ServiceThumbProps) {
  if (image) {
    return <Image src={image} alt={alt} width={160} height={100} className="size-full object-cover" />;
  }

  const index = Math.abs((childIndex ?? seed ?? 0) % 8);

  // Every third tile picks up the brand red for rhythm.
  const hot = index % 3 === 1;
  const ink = "rgba(10,10,10,0.32)";
  const accent = hot ? "#e10600" : "rgba(10,10,10,0.6)";
  const faint = "rgba(10,10,10,0.12)";

  return (
    <svg
      viewBox="0 0 160 100"
      preserveAspectRatio="xMidYMid slice"
      className="size-full bg-bone"
      role="img"
      aria-label={alt}
    >
      {category === "website" && <WebsiteIllustration index={index} ink={ink} accent={accent} faint={faint} />}
      {category === "crm" && <CrmIllustration index={index} ink={ink} accent={accent} faint={faint} />}
      {category === "mobile" && <MobileIllustration index={index} ink={ink} accent={accent} faint={faint} />}
      {category === "automation" && <AutomationIllustration index={index} ink={ink} accent={accent} faint={faint} />}
      {category === "software" && <SoftwareIllustration index={index} ink={ink} accent={accent} faint={faint} />}
      {category === "integrations" && <IntegrationIllustration index={index} ink={ink} accent={accent} faint={faint} />}
    </svg>
  );
}

type IllustrationProps = { index: number; ink: string; accent: string; faint: string };

/* ═══════════════════════════════════════════════════════════════════════════
   WEBSITE DEVELOPMENT
   0 Corporate Websites   │ 1 Business Landing Pages │ 2 E-commerce Websites
   3 Product Portals       │ 4 Customer Portals       │ 5 CMS Development
   6 Website Redesign      │ 7 SEO-Ready Builds
   ═══════════════════════════════════════════════════════════════════════════ */

function WebsiteIllustration({ index, ink, accent, faint }: IllustrationProps) {
  if (index === 0) {
    // Corporate Website — browser window with header, nav & content blocks
    return (
      <>
        <rect x="16" y="14" width="128" height="72" rx="4" fill="none" stroke={ink} />
        <rect x="16" y="14" width="128" height="12" rx="4" fill={faint} />
        <circle cx="24" cy="20" r="2" fill={accent} />
        <circle cx="31" cy="20" r="2" fill={ink} />
        <circle cx="38" cy="20" r="2" fill={ink} />
        {/* Nav bar */}
        <rect x="60" y="18" width="8" height="3" rx="1" fill={ink} />
        <rect x="72" y="18" width="8" height="3" rx="1" fill={ink} />
        <rect x="84" y="18" width="8" height="3" rx="1" fill={ink} />
        {/* Hero area */}
        <rect x="24" y="34" width="52" height="6" rx="1" fill={ink} />
        <rect x="24" y="43" width="36" height="3" rx="1" fill={faint} />
        <rect x="24" y="49" width="28" height="8" rx="4" fill={accent} />
        {/* Image placeholder */}
        <rect x="92" y="32" width="44" height="30" rx="3" fill={faint} stroke={ink} strokeWidth="0.5" />
        {/* Footer columns */}
        <rect x="24" y="68" width="18" height="3" rx="1" fill={faint} />
        <rect x="50" y="68" width="18" height="3" rx="1" fill={faint} />
        <rect x="76" y="68" width="18" height="3" rx="1" fill={faint} />
      </>
    );
  }
  if (index === 1) {
    // Landing Page — hero section with headline, subtext & CTA
    return (
      <>
        <rect x="16" y="14" width="128" height="72" rx="4" fill="none" stroke={ink} />
        {/* Big headline */}
        <rect x="36" y="24" width="88" height="8" rx="1" fill={ink} />
        <rect x="48" y="36" width="64" height="4" rx="1" fill={faint} />
        <rect x="52" y="43" width="56" height="4" rx="1" fill={faint} />
        {/* CTA Button */}
        <rect x="56" y="52" width="48" height="12" rx="6" fill={accent} />
        <rect x="64" y="56" width="32" height="4" rx="1" fill="white" opacity="0.9" />
        {/* Trust badges */}
        <circle cx="56" cy="74" r="4" fill={faint} stroke={ink} strokeWidth="0.5" />
        <circle cx="72" cy="74" r="4" fill={faint} stroke={ink} strokeWidth="0.5" />
        <circle cx="88" cy="74" r="4" fill={faint} stroke={ink} strokeWidth="0.5" />
        <circle cx="104" cy="74" r="4" fill={faint} stroke={ink} strokeWidth="0.5" />
      </>
    );
  }
  if (index === 2) {
    // E-commerce — product grid with shopping cart
    return (
      <>
        {/* Product grid */}
        {[0, 1, 2].map((col) => (
          <g key={col}>
            <rect x={20 + col * 38} y={18} width="32" height="28" rx="3" fill={faint} stroke={ink} strokeWidth="0.5" />
            <rect x={22 + col * 38} y={50} width="20" height="3" rx="1" fill={ink} />
            <rect x={22 + col * 38} y={56} width="14" height="3" rx="1" fill={accent} />
          </g>
        ))}
        {/* Cart icon */}
        <path d="M118 22 L122 22 L128 40 L112 40 Z" fill="none" stroke={accent} strokeWidth="1.2" />
        <circle cx="115" cy="44" r="2" fill={accent} />
        <circle cx="126" cy="44" r="2" fill={accent} />
        {/* Bottom row items */}
        <rect x="20" y="68" width="32" height="16" rx="3" fill={faint} stroke={ink} strokeWidth="0.5" />
        <rect x="58" y="68" width="32" height="16" rx="3" fill={faint} stroke={ink} strokeWidth="0.5" />
        <rect x="96" y="68" width="32" height="16" rx="3" fill={faint} stroke={ink} strokeWidth="0.5" />
      </>
    );
  }
  if (index === 3) {
    // Product & Service Portals — dashboard with sidebar
    return (
      <>
        <rect x="16" y="14" width="128" height="72" rx="4" fill="none" stroke={ink} />
        {/* Sidebar */}
        <rect x="16" y="14" width="32" height="72" rx="4" fill={faint} />
        <rect x="22" y="22" width="20" height="3" rx="1" fill={ink} />
        <rect x="22" y="30" width="16" height="2" rx="1" fill={ink} />
        <rect x="22" y="36" width="18" height="2" rx="1" fill={accent} />
        <rect x="22" y="42" width="14" height="2" rx="1" fill={ink} />
        <rect x="22" y="48" width="16" height="2" rx="1" fill={ink} />
        {/* Main content area */}
        <rect x="54" y="20" width="42" height="6" rx="1" fill={ink} />
        <rect x="54" y="32" width="82" height="22" rx="3" fill={faint} stroke={ink} strokeWidth="0.5" />
        <rect x="54" y="60" width="38" height="18" rx="3" fill={faint} stroke={ink} strokeWidth="0.5" />
        <rect x="98" y="60" width="38" height="18" rx="3" fill={faint} stroke={ink} strokeWidth="0.5" />
      </>
    );
  }
  if (index === 4) {
    // Customer Portals — user avatar with account panels
    return (
      <>
        {/* User avatar */}
        <circle cx="80" cy="22" r="10" fill={faint} stroke={ink} />
        <circle cx="80" cy="19" r="4" fill={ink} />
        <path d="M72 28 Q80 34 88 28" fill={ink} opacity="0.5" />
        {/* Account panels */}
        <rect x="20" y="40" width="54" height="20" rx="4" fill="none" stroke={ink} />
        <rect x="24" y="44" width="24" height="3" rx="1" fill={ink} />
        <rect x="24" y="50" width="18" height="3" rx="1" fill={faint} />
        <rect x="86" y="40" width="54" height="20" rx="4" fill="none" stroke={accent} />
        <rect x="90" y="44" width="24" height="3" rx="1" fill={accent} />
        <rect x="90" y="50" width="18" height="3" rx="1" fill={faint} />
        {/* Activity row */}
        <rect x="20" y="66" width="120" height="16" rx="4" fill={faint} />
        <rect x="26" y="70" width="30" height="3" rx="1" fill={ink} />
        <rect x="26" y="76" width="50" height="3" rx="1" fill={ink} opacity="0.4" />
      </>
    );
  }
  if (index === 5) {
    // CMS Development — content blocks with edit pencil
    return (
      <>
        {/* Content blocks */}
        <rect x="16" y="14" width="96" height="72" rx="4" fill="none" stroke={ink} />
        <rect x="22" y="20" width="50" height="6" rx="1" fill={ink} />
        <rect x="22" y="30" width="82" height="3" rx="1" fill={faint} />
        <rect x="22" y="36" width="78" height="3" rx="1" fill={faint} />
        <rect x="22" y="42" width="66" height="3" rx="1" fill={faint} />
        {/* Image block */}
        <rect x="22" y="50" width="42" height="28" rx="3" fill={faint} stroke={ink} strokeWidth="0.5" />
        <rect x="70" y="50" width="36" height="3" rx="1" fill={faint} />
        <rect x="70" y="56" width="30" height="3" rx="1" fill={faint} />
        <rect x="70" y="62" width="34" height="3" rx="1" fill={faint} />
        {/* Edit pencil icon */}
        <g transform="translate(124, 20)">
          <rect x="0" y="0" width="24" height="24" rx="12" fill={accent} />
          <path d="M8 16 L8 13 L15 6 L18 9 L11 16 Z" fill="white" />
          <path d="M15 6 L18 9" stroke="white" strokeWidth="1" fill="none" />
        </g>
      </>
    );
  }
  if (index === 6) {
    // Website Redesign — old vs new with refresh arrow
    return (
      <>
        {/* Old site (faded, messy) */}
        <rect x="14" y="20" width="52" height="36" rx="3" fill="none" stroke={ink} strokeDasharray="2 2" opacity="0.5" />
        <rect x="18" y="24" width="44" height="6" rx="1" fill={faint} />
        <rect x="18" y="34" width="20" height="3" rx="1" fill={faint} />
        <rect x="42" y="34" width="12" height="3" rx="1" fill={faint} />
        <rect x="18" y="42" width="44" height="8" rx="1" fill={faint} />
        {/* Arrow */}
        <path d="M72 38 L88 38" stroke={accent} strokeWidth="2" />
        <path d="M84 34 L90 38 L84 42" fill={accent} />
        {/* New site (clean, structured) */}
        <rect x="94" y="20" width="52" height="36" rx="3" fill="none" stroke={accent} />
        <rect x="98" y="24" width="44" height="6" rx="1" fill={accent} opacity="0.3" />
        <rect x="98" y="34" width="28" height="4" rx="1" fill={ink} />
        <rect x="98" y="42" width="20" height="6" rx="3" fill={accent} />
        {/* Refresh icon */}
        <path d="M72 66 A 14 14 0 1 1 88 66" fill="none" stroke={accent} strokeWidth="1.5" />
        <path d="M86 62 L90 66 L86 70" fill="none" stroke={accent} strokeWidth="1.5" />
      </>
    );
  }
  // index === 7: SEO-Ready Builds — magnifying glass over ranking bars
  return (
    <>
      {/* Search bar */}
      <rect x="30" y="14" width="100" height="14" rx="7" fill="none" stroke={ink} />
      <circle cx="42" cy="21" r="4" fill="none" stroke={accent} strokeWidth="1.2" />
      <line x1="45" y1="24" x2="48" y2="27" stroke={accent} strokeWidth="1.2" />
      <rect x="54" y="19" width="40" height="4" rx="1" fill={faint} />
      {/* Ranking positions */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="30" y={36 + i * 12} width={100 - i * 12} height="8" rx="2" fill={i === 0 ? accent : faint} opacity={i === 0 ? 0.25 : 1} stroke={i === 0 ? accent : "none"} />
          <text x="34" y={42 + i * 12} fontSize="5" fill={i === 0 ? accent : ink} fontFamily="monospace">#{i + 1}</text>
          <rect x="48" y={38 + i * 12} width={30 - i * 4} height="3" rx="1" fill={i === 0 ? accent : ink} opacity={i === 0 ? 1 : 0.3} />
        </g>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CRM & LEAD MANAGEMENT
   0 Sales Pipeline CRM    │ 1 Lead Management        │ 2 Lead Capture Forms
   3 WhatsApp CRM          │ 4 Field Sales CRM        │ 5 Follow-up Automation
   6 Quotes & Invoicing    │ 7 CRM Data Migration
   ═══════════════════════════════════════════════════════════════════════════ */

function CrmIllustration({ index, ink, accent, faint }: IllustrationProps) {
  if (index === 0) {
    // Sales Pipeline — horizontal funnel stages
    return (
      <>
        {/* Pipeline stages */}
        {["New", "Qual", "Prop", "Won"].map((label, i) => (
          <g key={label}>
            <rect x={18 + i * 34} y={30 + i * 4} width="28" height={40 - i * 8} rx="3" fill={i === 3 ? accent : faint} stroke={i === 3 ? accent : ink} strokeWidth="0.6" opacity={i === 3 ? 0.3 : 1} />
            <text x={32 + i * 34} y={53} fontSize="5" fill={i === 3 ? accent : ink} textAnchor="middle" fontFamily="sans-serif">{label}</text>
          </g>
        ))}
        {/* Arrow connectors */}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${48 + i * 34} 50 L${52 + i * 34} 50`} stroke={ink} strokeWidth="0.8" markerEnd="url(#arrow)" />
        ))}
        {/* Deal count dots */}
        {[5, 3, 2, 1].map((count, col) => (
          Array.from({ length: count }, (_, row) => (
            <circle key={`${col}-${row}`} cx={28 + col * 34} cy={36 + row * 5 + col * 4} r="1.5" fill={col === 3 ? accent : ink} opacity="0.5" />
          ))
        ))}
      </>
    );
  }
  if (index === 1) {
    // Lead Management — stacked contact cards
    return (
      <>
        {/* Card stack */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={28 + i * 6} y={22 + i * 18} width="98" height="28" rx="4" fill={i === 0 ? "rgba(245,244,242,1)" : "none"} stroke={i === 1 ? accent : ink} strokeWidth={i === 1 ? 1.2 : 0.6} />
            {/* Avatar circle */}
            <circle cx={40 + i * 6} cy={36 + i * 18} r="7" fill={i === 1 ? accent : faint} opacity={i === 1 ? 0.25 : 1} />
            <circle cx={40 + i * 6} cy={34 + i * 18} r="3" fill={i === 1 ? accent : ink} opacity="0.5" />
            {/* Name & info */}
            <rect x={52 + i * 6} y={31 + i * 18} width="30" height="3" rx="1" fill={i === 1 ? accent : ink} opacity={i === 1 ? 1 : 0.5} />
            <rect x={52 + i * 6} y={38 + i * 18} width="20" height="2" rx="1" fill={faint} />
            {/* Status badge */}
            <rect x={100 + i * 6} y={33 + i * 18} width="18" height="6" rx="3" fill={i === 1 ? accent : faint} opacity={i === 1 ? 0.2 : 1} />
          </g>
        ))}
      </>
    );
  }
  if (index === 2) {
    // Lead Capture Forms — form with fields and submit
    return (
      <>
        <rect x="30" y="12" width="100" height="76" rx="6" fill="none" stroke={ink} />
        <rect x="38" y="18" width="50" height="5" rx="1" fill={ink} />
        {/* Form fields */}
        {["Name", "Email", "Phone", "Message"].map((_, i) => (
          <g key={i}>
            <rect x="38" y={28 + i * 12} width={i === 3 ? 80 : 76} height={i === 3 ? 14 : 8} rx="2" fill="white" stroke={ink} strokeWidth="0.5" />
            <rect x="42" y={31 + i * 12} width={20 + i * 4} height="2" rx="1" fill={faint} />
          </g>
        ))}
        {/* Submit button */}
        <rect x="38" y="74" width="32" height="10" rx="5" fill={accent} />
        <rect x="44" y="77.5" width="20" height="3" rx="1" fill="white" opacity="0.9" />
      </>
    );
  }
  if (index === 3) {
    // WhatsApp CRM — chat bubbles
    return (
      <>
        {/* Phone outline */}
        <rect x="40" y="8" width="80" height="84" rx="10" fill="none" stroke={ink} />
        <rect x="40" y="8" width="80" height="14" rx="10" fill={faint} />
        <circle cx="56" cy="15" r="5" fill="rgba(37,211,102,0.25)" stroke="rgba(37,211,102,0.6)" />
        <rect x="66" y="12" width="24" height="3" rx="1" fill={ink} />
        {/* Chat bubbles */}
        <rect x="48" y="28" width="46" height="12" rx="6" fill="rgba(37,211,102,0.15)" stroke="rgba(37,211,102,0.4)" strokeWidth="0.5" />
        <rect x="52" y="32" width="30" height="3" rx="1" fill={ink} opacity="0.5" />
        <rect x="66" y="44" width="48" height="12" rx="6" fill={faint} stroke={ink} strokeWidth="0.5" />
        <rect x="70" y="48" width="34" height="3" rx="1" fill={ink} opacity="0.5" />
        <rect x="48" y="60" width="40" height="12" rx="6" fill="rgba(37,211,102,0.15)" stroke="rgba(37,211,102,0.4)" strokeWidth="0.5" />
        <rect x="52" y="64" width="28" height="3" rx="1" fill={ink} opacity="0.5" />
        {/* Typing input */}
        <rect x="46" y="76" width="68" height="10" rx="5" fill="white" stroke={ink} strokeWidth="0.5" />
      </>
    );
  }
  if (index === 4) {
    // Field Sales CRM — map with pins and route
    return (
      <>
        {/* Map area */}
        <rect x="16" y="14" width="128" height="72" rx="4" fill={faint} />
        {/* Roads */}
        <path d="M16 50 Q50 48 80 40 T144 35" fill="none" stroke={ink} strokeWidth="0.8" />
        <path d="M30 14 Q35 45 40 86" fill="none" stroke={ink} strokeWidth="0.8" />
        <path d="M100 14 Q95 50 110 86" fill="none" stroke={ink} strokeWidth="0.8" />
        {/* Map pins */}
        {[[45, 38], [80, 30], [110, 42], [65, 60]].map(([x, y], i) => (
          <g key={i}>
            <path d={`M${x} ${y} C${x - 5} ${y - 10} ${x + 5} ${y - 10} ${x} ${y}`} fill={i === 0 ? accent : ink} opacity={i === 0 ? 1 : 0.5} />
            <circle cx={x} cy={(y as number) - 8} r="3" fill={i === 0 ? accent : ink} opacity={i === 0 ? 1 : 0.4} />
            <circle cx={x} cy={(y as number) - 8} r="1.5" fill="white" />
          </g>
        ))}
        {/* Route line */}
        <path d="M45 38 L80 30 L110 42 L65 60" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="3 2" />
      </>
    );
  }
  if (index === 5) {
    // Follow-up Automation — clock with circular arrows
    return (
      <>
        {/* Clock face */}
        <circle cx="80" cy="46" r="28" fill="none" stroke={ink} />
        <circle cx="80" cy="46" r="26" fill="none" stroke={faint} />
        {/* Clock hands */}
        <line x1="80" y1="46" x2="80" y2="28" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="46" x2="94" y2="46" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="80" cy="46" r="2" fill={accent} />
        {/* Hour marks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1={80 + 22 * Math.cos((deg - 90) * Math.PI / 180)}
            y1={46 + 22 * Math.sin((deg - 90) * Math.PI / 180)}
            x2={80 + 24 * Math.cos((deg - 90) * Math.PI / 180)}
            y2={46 + 24 * Math.sin((deg - 90) * Math.PI / 180)}
            stroke={ink}
            strokeWidth="1"
          />
        ))}
        {/* Circular arrows around clock */}
        <path d="M80 12 A34 34 0 0 1 114 46" fill="none" stroke={accent} strokeWidth="1.2" />
        <path d="M112 42 L116 47 L110 48" fill={accent} />
        <path d="M80 80 A34 34 0 0 1 46 46" fill="none" stroke={accent} strokeWidth="1.2" />
        <path d="M48 50 L44 45 L50 44" fill={accent} />
      </>
    );
  }
  if (index === 6) {
    // Quotes & Invoicing — document with line items
    return (
      <>
        {/* Document */}
        <rect x="36" y="10" width="88" height="80" rx="4" fill="white" stroke={ink} />
        {/* Header */}
        <rect x="44" y="16" width="32" height="5" rx="1" fill={ink} />
        <rect x="100" y="16" width="16" height="5" rx="1" fill={accent} opacity="0.3" />
        <line x1="44" y1="26" x2="116" y2="26" stroke={ink} strokeWidth="0.5" />
        {/* Line items */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="44" y={30 + i * 10} width="40" height="3" rx="1" fill={ink} opacity="0.4" />
            <rect x="100" y={30 + i * 10} width="16" height="3" rx="1" fill={ink} opacity="0.3" />
            <line x1="44" y1={37 + i * 10} x2="116" y2={37 + i * 10} stroke={faint} />
          </g>
        ))}
        {/* Total */}
        <line x1="44" y1="70" x2="116" y2="70" stroke={ink} strokeWidth="0.8" />
        <rect x="80" y="73" width="36" height="5" rx="1" fill={accent} />
        {/* Currency symbol */}
        <text x="48" y="78" fontSize="7" fill={accent} fontWeight="600" fontFamily="monospace">₹</text>
      </>
    );
  }
  // index === 7: CRM Data Migration — databases with transfer arrow
  return (
    <>
      {/* Old database */}
      <ellipse cx="42" cy="32" rx="22" ry="8" fill={faint} stroke={ink} />
      <path d="M20 32 V56" stroke={ink} />
      <path d="M64 32 V56" stroke={ink} />
      <ellipse cx="42" cy="56" rx="22" ry="8" fill="none" stroke={ink} />
      <ellipse cx="42" cy="44" rx="22" ry="8" fill="none" stroke={ink} opacity="0.3" />
      {/* Arrow */}
      <path d="M68 46 L92 46" stroke={accent} strokeWidth="2" />
      <path d="M88 42 L94 46 L88 50" fill={accent} />
      {/* Data particles */}
      <circle cx="74" cy="40" r="1.5" fill={accent} opacity="0.6" />
      <circle cx="80" cy="44" r="1.5" fill={accent} opacity="0.8" />
      <circle cx="86" cy="48" r="1.5" fill={accent} opacity="0.4" />
      {/* New database */}
      <ellipse cx="118" cy="32" rx="22" ry="8" fill={accent} opacity="0.15" stroke={accent} />
      <path d="M96 32 V56" stroke={accent} />
      <path d="M140 32 V56" stroke={accent} />
      <ellipse cx="118" cy="56" rx="22" ry="8" fill="none" stroke={accent} />
      <ellipse cx="118" cy="44" rx="22" ry="8" fill="none" stroke={accent} opacity="0.3" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE APP DEVELOPMENT
   0 iOS Development       │ 1 Android Development    │ 2 React Native Apps
   3 Flutter Apps           │ 4 Offline-First Apps     │ 5 Payments & UPI
   6 Push & Analytics       │ 7 App Store Launch
   ═══════════════════════════════════════════════════════════════════════════ */

function MobileIllustration({ index, ink, accent, faint }: IllustrationProps) {
  // Shared phone shell
  const Phone = ({ children, x = 50 }: { children: React.ReactNode; x?: number }) => (
    <>
      <rect x={x} y="6" width="60" height="88" rx="10" fill="white" stroke={ink} />
      <rect x={x + 16} y="10" width="28" height="4" rx="2" fill={faint} />
      {children}
    </>
  );

  if (index === 0) {
    // iOS — phone with iOS-style UI (status bar, rounded cards)
    return (
      <Phone>
        <rect x="56" y="20" width="48" height="8" rx="1" fill={ink} />
        <rect x="56" y="32" width="48" height="20" rx="6" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="60" y="36" width="24" height="3" rx="1" fill={ink} />
        <rect x="60" y="42" width="16" height="2" rx="1" fill={ink} opacity="0.3" />
        <rect x="56" y="56" width="22" height="22" rx="6" fill={accent} opacity="0.2" />
        <rect x="82" y="56" width="22" height="22" rx="6" fill={faint} stroke={ink} strokeWidth="0.4" />
        {/* Tab bar */}
        <rect x="50" y="82" width="60" height="12" rx="0" fill={faint} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={60 + i * 14} cy="88" r="2.5" fill={i === 0 ? accent : ink} opacity={i === 0 ? 1 : 0.25} />
        ))}
      </Phone>
    );
  }
  if (index === 1) {
    // Android — phone with Material-style top bar and FAB
    return (
      <Phone>
        <rect x="50" y="18" width="60" height="12" rx="0" fill={accent} opacity="0.15" />
        <rect x="56" y="22" width="30" height="4" rx="1" fill={accent} />
        {/* Content cards */}
        <rect x="56" y="34" width="48" height="16" rx="3" fill={faint} stroke={ink} strokeWidth="0.3" />
        <rect x="56" y="54" width="48" height="16" rx="3" fill={faint} stroke={ink} strokeWidth="0.3" />
        {/* FAB button */}
        <circle cx="100" cy="76" r="8" fill={accent} />
        <line x1="96" y1="76" x2="104" y2="76" stroke="white" strokeWidth="1.5" />
        <line x1="100" y1="72" x2="100" y2="80" stroke="white" strokeWidth="1.5" />
      </Phone>
    );
  }
  if (index === 2) {
    // React Native — phone with code brackets
    return (
      <Phone>
        <rect x="56" y="20" width="48" height="56" rx="4" fill={faint} />
        {/* Code brackets */}
        <text x="66" y="42" fontSize="14" fill={accent} fontFamily="monospace" fontWeight="600">{"<"}</text>
        <text x="90" y="42" fontSize="14" fill={accent} fontFamily="monospace" fontWeight="600">{"/>"}</text>
        {/* React circle */}
        <ellipse cx="80" cy="54" rx="12" ry="4" fill="none" stroke={ink} strokeWidth="0.8" />
        <ellipse cx="80" cy="54" rx="12" ry="4" fill="none" stroke={ink} strokeWidth="0.8" transform="rotate(60, 80, 54)" />
        <ellipse cx="80" cy="54" rx="12" ry="4" fill="none" stroke={ink} strokeWidth="0.8" transform="rotate(-60, 80, 54)" />
        <circle cx="80" cy="54" r="2" fill={accent} />
        {/* Bottom bar */}
        <rect x="56" y="80" width="48" height="8" rx="1" fill={faint} />
      </Phone>
    );
  }
  if (index === 3) {
    // Flutter — phone with layered widget cards
    return (
      <Phone>
        <rect x="56" y="20" width="48" height="10" rx="2" fill={accent} opacity="0.15" />
        {/* Layered widgets */}
        <rect x="54" y="34" width="44" height="18" rx="4" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="58" y="38" width="36" height="10" rx="3" fill="white" stroke={ink} strokeWidth="0.3" />
        <rect x="54" y="56" width="52" height="14" rx="4" fill="white" stroke={accent} strokeWidth="0.6" />
        <rect x="58" y="59" width="24" height="3" rx="1" fill={accent} />
        <rect x="58" y="64" width="16" height="2" rx="1" fill={ink} opacity="0.3" />
        {/* Flutter diamond-ish shape */}
        <path d="M80 74 L86 80 L80 86 L74 80 Z" fill={accent} opacity="0.2" stroke={accent} strokeWidth="0.6" />
      </Phone>
    );
  }
  if (index === 4) {
    // Offline-First — phone with cloud-offline icon
    return (
      <Phone>
        <rect x="56" y="20" width="48" height="48" rx="4" fill={faint} />
        {/* Cloud with X */}
        <path d="M68 44 A8 8 0 0 1 70 30 A10 10 0 0 1 90 30 A8 8 0 0 1 92 44 Z" fill="none" stroke={ink} strokeWidth="1.2" />
        <line x1="75" y1="34" x2="85" y2="42" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="85" y1="34" x2="75" y2="42" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        {/* Sync arrow below */}
        <path d="M72 54 A8 8 0 0 1 88 54" fill="none" stroke={ink} strokeWidth="1" />
        <path d="M86 51 L89 55 L85 56" fill={ink} />
        {/* Data indicator */}
        <rect x="58" y="74" width="44" height="6" rx="3" fill={accent} opacity="0.15" />
        <rect x="58" y="74" width="28" height="6" rx="3" fill={accent} opacity="0.3" />
        <text x="64" y="79" fontSize="4" fill={accent} fontFamily="sans-serif">Synced</text>
      </Phone>
    );
  }
  if (index === 5) {
    // Payments & UPI — phone with payment card & rupee
    return (
      <Phone>
        {/* Card */}
        <rect x="56" y="22" width="48" height="28" rx="4" fill={ink} opacity="0.08" stroke={ink} strokeWidth="0.5" />
        <rect x="60" y="26" width="14" height="8" rx="2" fill={accent} opacity="0.4" />
        <rect x="60" y="40" width="24" height="3" rx="1" fill={ink} opacity="0.3" />
        <rect x="92" y="40" width="8" height="3" rx="1" fill={ink} opacity="0.3" />
        {/* Rupee symbol */}
        <text x="72" y="72" fontSize="18" fill={accent} fontWeight="700" fontFamily="sans-serif" textAnchor="middle">₹</text>
        {/* UPI-like dots */}
        <circle cx="88" cy="66" r="3" fill={accent} opacity="0.3" />
        <circle cx="96" cy="62" r="3" fill={accent} opacity="0.5" />
        <circle cx="96" cy="70" r="3" fill={accent} opacity="0.3" />
        {/* Success check */}
        <rect x="56" y="80" width="48" height="8" rx="4" fill={accent} opacity="0.15" />
        <path d="M76 83 L79 86 L86 80" fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
      </Phone>
    );
  }
  if (index === 6) {
    // Push & Analytics — phone with notification bell and chart
    return (
      <Phone>
        {/* Notification */}
        <rect x="54" y="18" width="52" height="18" rx="4" fill="white" stroke={accent} strokeWidth="0.6" />
        <circle cx="62" cy="27" r="4" fill={accent} opacity="0.2" />
        <path d="M60 26 L62 22 L64 26 M59 27 L65 27" fill="none" stroke={accent} strokeWidth="0.8" />
        <rect x="70" y="23" width="28" height="2" rx="1" fill={ink} opacity="0.4" />
        <rect x="70" y="28" width="20" height="2" rx="1" fill={ink} opacity="0.2" />
        {/* Mini chart */}
        <rect x="56" y="42" width="48" height="32" rx="3" fill={faint} />
        <polyline points="60,68 68,60 76,64 84,52 92,56 100,46" fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="100" cy="46" r="2" fill={accent} />
        {/* Stats row */}
        <rect x="56" y="78" width="22" height="10" rx="2" fill={faint} stroke={ink} strokeWidth="0.3" />
        <rect x="82" y="78" width="22" height="10" rx="2" fill={faint} stroke={ink} strokeWidth="0.3" />
      </Phone>
    );
  }
  // index === 7: App Store Launch — phone with star rating
  return (
    <Phone>
      {/* App icon */}
      <rect x="66" y="22" width="28" height="28" rx="8" fill={accent} opacity="0.2" stroke={accent} strokeWidth="0.6" />
      <rect x="74" y="30" width="12" height="12" rx="3" fill={accent} opacity="0.4" />
      {/* App name */}
      <rect x="62" y="56" width="36" height="4" rx="1" fill={ink} />
      {/* Star rating */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${64 + i * 8} 66 l1.5 3 3.5 0.5 -2.5 2.4 0.6 3.4 -3.1 -1.6 -3.1 1.6 0.6 -3.4 -2.5 -2.4 3.5 -0.5z`} fill={i < 4 ? accent : faint} stroke={i < 4 ? accent : ink} strokeWidth="0.3" />
      ))}
      {/* Download button */}
      <rect x="62" y="80" width="36" height="10" rx="5" fill={accent} />
      <rect x="70" y="83.5" width="20" height="3" rx="1" fill="white" opacity="0.9" />
    </Phone>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUSINESS AUTOMATION
   0 Sales Automation      │ 1 Approval Workflows     │ 2 Document Automation
   3 Billing Automation    │ 4 Customer Notifications  │ 5 Task & Reminder Systems
   6 Reporting Dashboards  │ 7 Spreadsheet Replacement
   ═══════════════════════════════════════════════════════════════════════════ */

function AutomationIllustration({ index, ink, accent, faint }: IllustrationProps) {
  if (index === 0) {
    // Sales Automation — funnel with gear
    return (
      <>
        {/* Funnel */}
        <path d="M40 18 L120 18 L96 50 L96 78 L64 78 L64 50 Z" fill={faint} stroke={ink} />
        {/* Stages */}
        <line x1="48" y1="30" x2="112" y2="30" stroke={ink} strokeDasharray="2 2" />
        <line x1="58" y1="42" x2="102" y2="42" stroke={ink} strokeDasharray="2 2" />
        {/* Items flowing in */}
        <circle cx="60" cy="24" r="2.5" fill={accent} />
        <circle cx="80" cy="24" r="2.5" fill={ink} opacity="0.4" />
        <circle cx="100" cy="24" r="2.5" fill={ink} opacity="0.4" />
        <circle cx="80" cy="36" r="2.5" fill={accent} opacity="0.6" />
        {/* Gear icon */}
        <circle cx="130" cy="28" r="10" fill="none" stroke={accent} strokeWidth="1" />
        <circle cx="130" cy="28" r="4" fill="none" stroke={accent} strokeWidth="1" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1={130 + 8 * Math.cos(deg * Math.PI / 180)}
            y1={28 + 8 * Math.sin(deg * Math.PI / 180)}
            x2={130 + 12 * Math.cos(deg * Math.PI / 180)}
            y2={28 + 12 * Math.sin(deg * Math.PI / 180)}
            stroke={accent}
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        {/* Output arrow */}
        <path d="M80 78 L80 88" stroke={accent} strokeWidth="1.5" />
        <path d="M76 85 L80 90 L84 85" fill={accent} />
      </>
    );
  }
  if (index === 1) {
    // Approval Workflows — flowchart with checkmarks
    return (
      <>
        {/* Start node */}
        <circle cx="30" cy="30" r="10" fill={faint} stroke={ink} />
        <rect x="24" y="28" width="12" height="4" rx="1" fill={ink} />
        {/* Arrow */}
        <line x1="40" y1="30" x2="58" y2="30" stroke={ink} />
        <path d="M55 27 L60 30 L55 33" fill={ink} />
        {/* Decision diamond */}
        <path d="M80 16 L100 30 L80 44 L60 30 Z" fill={accent} opacity="0.1" stroke={accent} />
        <text x="80" y="33" fontSize="6" fill={accent} textAnchor="middle" fontFamily="sans-serif">?</text>
        {/* Yes path */}
        <line x1="100" y1="30" x2="118" y2="30" stroke={accent} />
        <path d="M115 27 L120 30 L115 33" fill={accent} />
        <rect x="120" y="20" width="24" height="20" rx="4" fill={accent} opacity="0.15" stroke={accent} />
        <path d="M128 30 L132 34 L140 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        {/* No path */}
        <line x1="80" y1="44" x2="80" y2="56" stroke={ink} />
        <path d="M77 53 L80 58 L83 53" fill={ink} />
        <rect x="64" y="58" width="32" height="16" rx="4" fill={faint} stroke={ink} />
        <rect x="70" y="62" width="20" height="3" rx="1" fill={ink} opacity="0.4" />
        <rect x="70" y="68" width="14" height="3" rx="1" fill={ink} opacity="0.3" />
        {/* Loop arrow */}
        <path d="M64 66 Q36 66 36 46 Q36 30 40 30" fill="none" stroke={ink} strokeDasharray="2 2" />
      </>
    );
  }
  if (index === 2) {
    // Document Automation — document with lightning bolt
    return (
      <>
        {/* Document */}
        <rect x="32" y="12" width="70" height="76" rx="4" fill="white" stroke={ink} />
        <rect x="40" y="20" width="34" height="4" rx="1" fill={ink} />
        <rect x="40" y="28" width="54" height="3" rx="1" fill={faint} />
        <rect x="40" y="34" width="50" height="3" rx="1" fill={faint} />
        <rect x="40" y="40" width="42" height="3" rx="1" fill={faint} />
        <rect x="40" y="50" width="54" height="3" rx="1" fill={faint} />
        <rect x="40" y="56" width="48" height="3" rx="1" fill={faint} />
        <rect x="40" y="62" width="38" height="3" rx="1" fill={faint} />
        <rect x="40" y="72" width="24" height="8" rx="4" fill={accent} opacity="0.15" />
        {/* Lightning bolt */}
        <g transform="translate(114, 24)">
          <circle cx="12" cy="14" r="18" fill={accent} opacity="0.1" />
          <path d="M14 2 L6 16 L14 16 L10 28 L22 12 L14 12 Z" fill={accent} />
        </g>
      </>
    );
  }
  if (index === 3) {
    // Billing Automation — invoice with cycle arrows
    return (
      <>
        {/* Invoice document */}
        <rect x="38" y="14" width="60" height="72" rx="4" fill="white" stroke={ink} />
        <rect x="46" y="20" width="20" height="4" rx="1" fill={ink} />
        <line x1="46" y1="28" x2="90" y2="28" stroke={ink} strokeWidth="0.5" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x="46" y={32 + i * 10} width="24" height="3" rx="1" fill={ink} opacity="0.4" />
            <rect x="78" y={32 + i * 10} width="12" height="3" rx="1" fill={ink} opacity="0.3" />
          </g>
        ))}
        <line x1="46" y1="62" x2="90" y2="62" stroke={ink} strokeWidth="0.8" />
        <rect x="68" y="66" width="22" height="5" rx="1" fill={accent} opacity="0.3" />
        <text x="50" y="71" fontSize="5" fill={accent} fontWeight="600" fontFamily="monospace">₹</text>
        {/* Circular process arrows */}
        <path d="M106 30 A20 20 0 0 1 126 50" fill="none" stroke={accent} strokeWidth="1.5" />
        <path d="M124 47 L128 52 L122 52" fill={accent} />
        <path d="M126 50 A20 20 0 0 1 106 70" fill="none" stroke={accent} strokeWidth="1.5" />
        <path d="M108 68 L104 72 L110 72" fill={accent} />
        <path d="M106 70 A20 20 0 0 1 106 30" fill="none" stroke={accent} strokeWidth="1.5" />
        {/* Center text */}
        <text x="116" y="53" fontSize="5" fill={accent} textAnchor="middle" fontFamily="sans-serif">Auto</text>
      </>
    );
  }
  if (index === 4) {
    // Customer Notifications — bell with radiating lines
    return (
      <>
        {/* Bell */}
        <path d="M68 40 A12 12 0 0 1 92 40 L94 60 L66 60 Z" fill={accent} opacity="0.15" stroke={accent} strokeWidth="1" />
        <line x1="62" y1="60" x2="98" y2="60" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M76 60 Q80 66 84 60" fill="none" stroke={accent} strokeWidth="1" />
        {/* Notification dot */}
        <circle cx="92" cy="36" r="4" fill={accent} />
        {/* Radiating lines */}
        <line x1="56" y1="36" x2="48" y2="30" stroke={accent} strokeWidth="0.8" opacity="0.5" />
        <line x1="54" y1="46" x2="44" y2="46" stroke={accent} strokeWidth="0.8" opacity="0.5" />
        <line x1="104" y1="36" x2="112" y2="30" stroke={accent} strokeWidth="0.8" opacity="0.5" />
        <line x1="106" y1="46" x2="116" y2="46" stroke={accent} strokeWidth="0.8" opacity="0.5" />
        {/* Message preview cards */}
        <rect x="20" y="68" width="50" height="14" rx="4" fill={faint} stroke={ink} strokeWidth="0.5" />
        <rect x="24" y="72" width="28" height="2" rx="1" fill={ink} opacity="0.4" />
        <rect x="24" y="77" width="20" height="2" rx="1" fill={ink} opacity="0.2" />
        <rect x="78" y="68" width="50" height="14" rx="4" fill={faint} stroke={ink} strokeWidth="0.5" />
        <rect x="82" y="72" width="28" height="2" rx="1" fill={ink} opacity="0.4" />
        <rect x="82" y="77" width="20" height="2" rx="1" fill={ink} opacity="0.2" />
      </>
    );
  }
  if (index === 5) {
    // Task & Reminder — checklist with clock
    return (
      <>
        {/* Checklist */}
        <rect x="20" y="14" width="72" height="72" rx="4" fill="white" stroke={ink} />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x="28" y={24 + i * 12} width="8" height="8" rx="2" fill={i < 3 ? accent : "none"} opacity={i < 3 ? 0.2 : 1} stroke={i < 3 ? accent : ink} strokeWidth="0.6" />
            {i < 3 && <path d={`M30 ${28 + i * 12} L32 ${30 + i * 12} L36 ${26 + i * 12}`} fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />}
            <rect x="42" y={26 + i * 12} width={30 - i * 3} height="3" rx="1" fill={ink} opacity={i < 3 ? 0.3 : 0.6} />
          </g>
        ))}
        {/* Clock */}
        <circle cx="120" cy="50" r="20" fill="none" stroke={ink} />
        <line x1="120" y1="50" x2="120" y2="36" stroke={ink} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="120" y1="50" x2="132" y2="50" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="120" cy="50" r="2" fill={accent} />
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1={120 + 16 * Math.cos((deg - 90) * Math.PI / 180)}
            y1={50 + 16 * Math.sin((deg - 90) * Math.PI / 180)}
            x2={120 + 18 * Math.cos((deg - 90) * Math.PI / 180)}
            y2={50 + 18 * Math.sin((deg - 90) * Math.PI / 180)}
            stroke={ink}
            strokeWidth="1.2"
          />
        ))}
      </>
    );
  }
  if (index === 6) {
    // Reporting Dashboards — multi-panel with chart
    return (
      <>
        <rect x="16" y="14" width="128" height="72" rx="4" fill="none" stroke={ink} />
        {/* Top stat cards */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={22 + i * 40} y={20} width="34" height="20" rx="3" fill={faint} />
            <rect x={26 + i * 40} y={24} width="16" height="3" rx="1" fill={ink} opacity="0.3" />
            <rect x={26 + i * 40} y={30} width="22" height="5" rx="1" fill={i === 0 ? accent : ink} opacity={i === 0 ? 0.8 : 0.5} />
          </g>
        ))}
        {/* Bar chart */}
        <rect x="22" y="46" width="72" height="34" rx="3" fill={faint} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={28 + i * 10} y={72 - [14, 20, 12, 26, 18, 22][i]} width="6" height={[14, 20, 12, 26, 18, 22][i]} rx="1" fill={i === 3 ? accent : ink} opacity={i === 3 ? 0.7 : 0.2} />
        ))}
        {/* Line chart */}
        <rect x="100" y="46" width="38" height="34" rx="3" fill={faint} />
        <polyline points="106,72 114,64 122,68 130,56" fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="130" cy="56" r="2" fill={accent} />
      </>
    );
  }
  // index === 7: Spreadsheet Replacement — spreadsheet → clean UI
  return (
    <>
      {/* Old spreadsheet (crossed out) */}
      <rect x="10" y="22" width="56" height="40" rx="2" fill={faint} stroke={ink} strokeWidth="0.5" />
      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          {[0, 1, 2].map((col) => (
            <rect key={col} x={14 + col * 16} y={26 + row * 9} width="14" height="7" fill="none" stroke={ink} strokeWidth="0.3" />
          ))}
        </g>
      ))}
      {/* X cross over spreadsheet */}
      <line x1="14" y1="26" x2="62" y2="58" stroke={accent} strokeWidth="1.5" opacity="0.6" />
      <line x1="62" y1="26" x2="14" y2="58" stroke={accent} strokeWidth="1.5" opacity="0.6" />
      {/* Arrow */}
      <path d="M72 42 L86 42" stroke={accent} strokeWidth="1.5" />
      <path d="M83 39 L88 42 L83 45" fill={accent} />
      {/* Clean new UI */}
      <rect x="92" y="18" width="56" height="48" rx="4" fill="white" stroke={accent} />
      <rect x="96" y="22" width="30" height="4" rx="1" fill={ink} />
      <rect x="96" y="30" width="44" height="10" rx="3" fill={accent} opacity="0.1" stroke={accent} strokeWidth="0.4" />
      <rect x="100" y="33" width="20" height="3" rx="1" fill={accent} />
      <rect x="96" y="44" width="20" height="6" rx="3" fill={faint} />
      <rect x="120" y="44" width="20" height="6" rx="3" fill={faint} />
      <rect x="96" y="54" width="44" height="6" rx="3" fill={accent} opacity="0.15" />
      {/* Checkmark */}
      <path d="M118 72 L122 76 L132 66" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOM SOFTWARE & ERP
   0 ERP Systems           │ 1 Billing & Accounting   │ 2 Inventory Management
   3 Logistics & Fleet     │ 4 HR & Payroll           │ 5 Internal Admin Tools
   6 Document Management   │ 7 Legacy Modernisation
   ═══════════════════════════════════════════════════════════════════════════ */

function SoftwareIllustration({ index, ink, accent, faint }: IllustrationProps) {
  if (index === 0) {
    // ERP Systems — multi-module dashboard
    return (
      <>
        <rect x="16" y="14" width="128" height="72" rx="4" fill="none" stroke={ink} />
        {/* Sidebar */}
        <rect x="16" y="14" width="26" height="72" rx="4" fill={faint} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="22" y={24 + i * 10} width="14" height="5" rx="1" fill={i === 1 ? accent : ink} opacity={i === 1 ? 0.6 : 0.2} />
        ))}
        {/* Module cards */}
        <rect x="48" y="20" width="42" height="26" rx="3" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="52" y="24" width="18" height="3" rx="1" fill={accent} />
        <rect x="52" y="30" width="30" height="3" rx="1" fill={ink} opacity="0.2" />
        <rect x="52" y="36" width="24" height="3" rx="1" fill={ink} opacity="0.2" />
        <rect x="96" y="20" width="42" height="26" rx="3" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="100" y="24" width="18" height="3" rx="1" fill={ink} opacity="0.5" />
        <rect x="100" y="30" width="30" height="3" rx="1" fill={ink} opacity="0.2" />
        <rect x="48" y="52" width="42" height="26" rx="3" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="52" y="56" width="18" height="3" rx="1" fill={ink} opacity="0.5" />
        <rect x="96" y="52" width="42" height="26" rx="3" fill={accent} opacity="0.08" stroke={accent} strokeWidth="0.5" />
        <rect x="100" y="56" width="18" height="3" rx="1" fill={accent} />
        <rect x="100" y="62" width="30" height="3" rx="1" fill={ink} opacity="0.2" />
      </>
    );
  }
  if (index === 1) {
    // Billing & Accounting — calculator with columns
    return (
      <>
        {/* Calculator body */}
        <rect x="56" y="12" width="48" height="76" rx="6" fill="white" stroke={ink} />
        {/* Screen */}
        <rect x="62" y="18" width="36" height="14" rx="2" fill={faint} />
        <text x="92" y="29" fontSize="8" fill={accent} fontFamily="monospace" textAnchor="end">1,250</text>
        {/* Buttons grid */}
        {Array.from({ length: 16 }, (_, i) => (
          <rect
            key={i}
            x={62 + (i % 4) * 9}
            y={36 + Math.floor(i / 4) * 9}
            width="7"
            height="7"
            rx="1.5"
            fill={i % 4 === 3 ? accent : faint}
            opacity={i % 4 === 3 ? 0.25 : 1}
            stroke={i % 4 === 3 ? accent : ink}
            strokeWidth="0.4"
          />
        ))}
        {/* Ledger lines on side */}
        <rect x="16" y="22" width="32" height="56" rx="3" fill={faint} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect x="20" y={28 + i * 8} width="12" height="2" rx="1" fill={ink} opacity="0.3" />
            <rect x="36" y={28 + i * 8} width="8" height="2" rx="1" fill={ink} opacity="0.2" />
          </g>
        ))}
        {/* Balance */}
        <rect x="112" y="38" width="32" height="24" rx="4" fill={accent} opacity="0.1" stroke={accent} strokeWidth="0.5" />
        <text x="128" y="48" fontSize="5" fill={accent} textAnchor="middle" fontFamily="sans-serif">Balance</text>
        <text x="128" y="56" fontSize="6" fill={accent} textAnchor="middle" fontFamily="monospace">₹</text>
      </>
    );
  }
  if (index === 2) {
    // Inventory Management — boxes with grid
    return (
      <>
        {/* Warehouse shelf */}
        <rect x="20" y="18" width="120" height="64" rx="3" fill="none" stroke={ink} />
        <line x1="20" y1="40" x2="140" y2="40" stroke={ink} strokeWidth="0.5" />
        <line x1="20" y1="60" x2="140" y2="60" stroke={ink} strokeWidth="0.5" />
        <line x1="60" y1="18" x2="60" y2="82" stroke={ink} strokeWidth="0.5" />
        <line x1="100" y1="18" x2="100" y2="82" stroke={ink} strokeWidth="0.5" />
        {/* Boxes */}
        <rect x="28" y="22" width="24" height="14" rx="2" fill={accent} opacity="0.15" stroke={accent} strokeWidth="0.6" />
        <rect x="68" y="22" width="24" height="14" rx="2" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="108" y="22" width="24" height="14" rx="2" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="28" y="44" width="24" height="14" rx="2" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="68" y="44" width="24" height="14" rx="2" fill={accent} opacity="0.15" stroke={accent} strokeWidth="0.6" />
        <rect x="28" y="64" width="24" height="14" rx="2" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="108" y="64" width="24" height="14" rx="2" fill={faint} stroke={ink} strokeWidth="0.4" />
        {/* Scan barcode indicator */}
        <g transform="translate(108, 44)">
          {[0, 3, 5, 7, 9, 12, 14].map((x) => (
            <rect key={x} x={x} y={0} width={x % 3 === 0 ? 2 : 1} height="14" fill={ink} opacity="0.4" />
          ))}
        </g>
      </>
    );
  }
  if (index === 3) {
    // Logistics & Fleet — truck with route
    return (
      <>
        {/* Route path */}
        <path d="M20 72 Q40 72 60 56 T120 36" fill="none" stroke={faint} strokeWidth="2" />
        <path d="M20 72 Q40 72 60 56 T120 36" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="4 3" />
        {/* Location dots */}
        <circle cx="20" cy="72" r="4" fill={accent} opacity="0.2" stroke={accent} />
        <circle cx="60" cy="56" r="3" fill={ink} opacity="0.3" />
        <circle cx="120" cy="36" r="4" fill={accent} stroke={accent} />
        <circle cx="120" cy="36" r="1.5" fill="white" />
        {/* Truck (simplified) */}
        <rect x="80" y="14" width="32" height="18" rx="3" fill="white" stroke={ink} />
        <rect x="112" y="20" width="16" height="12" rx="2" fill={faint} stroke={ink} />
        <circle cx="90" cy="34" r="3" fill={ink} />
        <circle cx="102" cy="34" r="3" fill={ink} />
        <circle cx="120" cy="34" r="3" fill={ink} />
        {/* Cargo in truck */}
        <rect x="84" y="18" width="10" height="10" rx="1" fill={accent} opacity="0.2" />
        <rect x="96" y="18" width="10" height="10" rx="1" fill={accent} opacity="0.15" />
      </>
    );
  }
  if (index === 4) {
    // HR & Payroll — org chart with people
    return (
      <>
        {/* Top person */}
        <circle cx="80" cy="18" r="6" fill={accent} opacity="0.2" stroke={accent} />
        <circle cx="80" cy="16" r="2.5" fill={accent} opacity="0.5" />
        {/* Lines down */}
        <line x1="80" y1="24" x2="80" y2="34" stroke={ink} />
        <line x1="40" y1="34" x2="120" y2="34" stroke={ink} />
        {/* Level 2 people */}
        {[40, 80, 120].map((x, i) => (
          <g key={x}>
            <line x1={x} y1="34" x2={x} y2="40" stroke={ink} />
            <circle cx={x} cy={48} r="6" fill={faint} stroke={i === 1 ? accent : ink} strokeWidth={i === 1 ? 0.8 : 0.5} />
            <circle cx={x} cy={46} r="2.5" fill={i === 1 ? accent : ink} opacity="0.4" />
          </g>
        ))}
        {/* Level 3 */}
        <line x1="40" y1="54" x2="40" y2="60" stroke={ink} />
        <line x1="24" y1="60" x2="56" y2="60" stroke={ink} />
        {[24, 56].map((x) => (
          <g key={x}>
            <line x1={x} y1="60" x2={x} y2="66" stroke={ink} />
            <circle cx={x} cy={72} r="5" fill={faint} stroke={ink} strokeWidth="0.4" />
            <circle cx={x} cy={70} r="2" fill={ink} opacity="0.3" />
          </g>
        ))}
        <line x1="120" y1="54" x2="120" y2="60" stroke={ink} />
        <line x1="104" y1="60" x2="136" y2="60" stroke={ink} />
        {[104, 136].map((x) => (
          <g key={x}>
            <line x1={x} y1="60" x2={x} y2="66" stroke={ink} />
            <circle cx={x} cy={72} r="5" fill={faint} stroke={ink} strokeWidth="0.4" />
            <circle cx={x} cy={70} r="2" fill={ink} opacity="0.3" />
          </g>
        ))}
        {/* Payslip icon */}
        <rect x="68" y="62" width="24" height="18" rx="3" fill="white" stroke={accent} strokeWidth="0.6" />
        <text x="80" y="73" fontSize="6" fill={accent} textAnchor="middle" fontFamily="monospace">₹</text>
      </>
    );
  }
  if (index === 5) {
    // Internal Admin Tools — settings panel with toggles
    return (
      <>
        <rect x="16" y="14" width="128" height="72" rx="4" fill="none" stroke={ink} />
        <rect x="16" y="14" width="128" height="14" rx="4" fill={faint} />
        <rect x="24" y="18" width="24" height="5" rx="1" fill={ink} />
        {/* Toggle rows */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x="24" y={34 + i * 10} width={30 + i * 2} height="3" rx="1" fill={ink} opacity="0.4" />
            {/* Toggle switch */}
            <rect x="112" y={33 + i * 10} width="20" height="6" rx="3" fill={i < 3 ? accent : faint} opacity={i < 3 ? 0.3 : 1} stroke={i < 3 ? accent : ink} strokeWidth="0.4" />
            <circle cx={i < 3 ? 128 : 116} cy={36 + i * 10} r="2.5" fill={i < 3 ? accent : ink} opacity={i < 3 ? 1 : 0.3} />
          </g>
        ))}
      </>
    );
  }
  if (index === 6) {
    // Document Management — folders with files
    return (
      <>
        {/* Main folder */}
        <path d="M24 28 L24 20 L52 20 L58 28 Z" fill={accent} opacity="0.2" stroke={accent} strokeWidth="0.6" />
        <rect x="24" y="28" width="64" height="44" rx="3" fill="white" stroke={accent} strokeWidth="0.6" />
        {/* Files inside */}
        <rect x="30" y="34" width="24" height="30" rx="2" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="34" y="38" width="14" height="2" rx="1" fill={ink} opacity="0.3" />
        <rect x="34" y="44" width="12" height="2" rx="1" fill={ink} opacity="0.2" />
        <rect x="34" y="50" width="16" height="2" rx="1" fill={ink} opacity="0.2" />
        <rect x="58" y="34" width="24" height="30" rx="2" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="62" y="38" width="14" height="2" rx="1" fill={ink} opacity="0.3" />
        <rect x="62" y="44" width="10" height="2" rx="1" fill={ink} opacity="0.2" />
        {/* Second folder */}
        <path d="M100 38 L100 32 L118 32 L122 38 Z" fill={faint} stroke={ink} strokeWidth="0.4" />
        <rect x="100" y="38" width="44" height="34" rx="3" fill="white" stroke={ink} strokeWidth="0.5" />
        <rect x="106" y="44" width="18" height="20" rx="2" fill={faint} stroke={ink} strokeWidth="0.3" />
        <rect x="128" y="44" width="10" height="20" rx="2" fill={faint} stroke={ink} strokeWidth="0.3" />
        {/* Search icon */}
        <circle cx="130" cy="22" r="6" fill="none" stroke={ink} />
        <line x1="134" y1="27" x2="138" y2="31" stroke={ink} strokeWidth="1.2" />
      </>
    );
  }
  // index === 7: Legacy Modernisation — old block → new block
  return (
    <>
      {/* Old system */}
      <rect x="10" y="22" width="52" height="40" rx="2" fill={faint} stroke={ink} strokeDasharray="2 2" opacity="0.6" />
      <rect x="16" y="28" width="40" height="5" rx="1" fill={ink} opacity="0.2" />
      <rect x="16" y="36" width="16" height="4" rx="1" fill={ink} opacity="0.15" />
      <rect x="36" y="36" width="16" height="4" rx="1" fill={ink} opacity="0.15" />
      <rect x="16" y="44" width="40" height="12" rx="1" fill={ink} opacity="0.08" />
      <text x="36" y="52" fontSize="5" fill={ink} textAnchor="middle" fontFamily="monospace" opacity="0.4">v1.0</text>
      {/* Transformation arrow */}
      <path d="M68 42 L88 42" stroke={accent} strokeWidth="2" />
      <path d="M84 38 L90 42 L84 46" fill={accent} />
      {/* Sparkle */}
      <path d="M78 32 L80 28 L82 32 L86 34 L82 36 L80 40 L78 36 L74 34 Z" fill={accent} opacity="0.3" />
      {/* New modern system */}
      <rect x="96" y="18" width="52" height="48" rx="6" fill="white" stroke={accent} />
      <rect x="96" y="18" width="52" height="10" rx="6" fill={accent} opacity="0.1" />
      <rect x="102" y="21" width="20" height="4" rx="1" fill={accent} />
      <rect x="102" y="34" width="40" height="10" rx="3" fill={accent} opacity="0.08" stroke={accent} strokeWidth="0.3" />
      <rect x="106" y="37" width="18" height="3" rx="1" fill={accent} opacity="0.5" />
      <rect x="102" y="48" width="18" height="6" rx="3" fill={faint} />
      <rect x="124" y="48" width="18" height="6" rx="3" fill={faint} />
      <rect x="102" y="58" width="40" height="4" rx="2" fill={accent} opacity="0.2" />
      {/* Version badge */}
      <text x="122" y="78" fontSize="5" fill={accent} textAnchor="middle" fontFamily="monospace">v2.0 ✓</text>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTEGRATIONS & APIs
   0 REST & GraphQL APIs   │ 1 GST E-Invoicing       │ 2 Tally Integration
   3 Payment Gateways      │ 4 WhatsApp Business API  │ 5 ONDC Integration
   6 Webhooks & Events     │ 7 Third-Party Connectors
   ═══════════════════════════════════════════════════════════════════════════ */

function IntegrationIllustration({ index, ink, accent, faint }: IllustrationProps) {
  if (index === 0) {
    // REST & GraphQL APIs — code brackets with endpoint
    return (
      <>
        {/* Terminal/editor window */}
        <rect x="20" y="14" width="120" height="72" rx="4" fill="white" stroke={ink} />
        <rect x="20" y="14" width="120" height="12" rx="4" fill={faint} />
        <circle cx="28" cy="20" r="2" fill={accent} />
        <circle cx="35" cy="20" r="2" fill={ink} opacity="0.3" />
        <circle cx="42" cy="20" r="2" fill={ink} opacity="0.3" />
        {/* Code lines */}
        <text x="28" y="36" fontSize="5" fill={accent} fontFamily="monospace">GET</text>
        <rect x="48" y="32" width="60" height="4" rx="1" fill={faint} />
        <text x="28" y="46" fontSize="5" fill="rgba(37,180,100,0.8)" fontFamily="monospace">200</text>
        <rect x="48" y="42" width="40" height="4" rx="1" fill={faint} />
        <text x="28" y="56" fontSize="5.5" fill={ink} fontFamily="monospace" opacity="0.5">{"{"}</text>
        <rect x="38" y="58" width="30" height="3" rx="1" fill={ink} opacity="0.2" />
        <rect x="38" y="64" width="44" height="3" rx="1" fill={ink} opacity="0.2" />
        <rect x="38" y="70" width="20" height="3" rx="1" fill={ink} opacity="0.2" />
        <text x="28" y="80" fontSize="5.5" fill={ink} fontFamily="monospace" opacity="0.5">{"}"}</text>
      </>
    );
  }
  if (index === 1) {
    // GST E-Invoicing — invoice with GST badge
    return (
      <>
        {/* Invoice */}
        <rect x="36" y="10" width="68" height="80" rx="4" fill="white" stroke={ink} />
        <rect x="44" y="16" width="24" height="4" rx="1" fill={ink} />
        <line x1="44" y1="24" x2="96" y2="24" stroke={ink} strokeWidth="0.5" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="44" y={28 + i * 9} width="28" height="3" rx="1" fill={ink} opacity="0.3" />
            <rect x="82" y={28 + i * 9} width="14" height="3" rx="1" fill={ink} opacity="0.2" />
          </g>
        ))}
        <line x1="44" y1="64" x2="96" y2="64" stroke={ink} strokeWidth="0.8" />
        <rect x="68" y="68" width="28" height="5" rx="1" fill={ink} opacity="0.3" />
        <text x="48" y="83" fontSize="5" fill={ink} opacity="0.3" fontFamily="monospace">GSTIN</text>
        {/* GST badge */}
        <rect x="110" y="16" width="34" height="20" rx="6" fill={accent} opacity="0.15" stroke={accent} />
        <text x="127" y="24" fontSize="6" fill={accent} fontWeight="700" textAnchor="middle" fontFamily="sans-serif">GST</text>
        <text x="127" y="32" fontSize="4" fill={accent} textAnchor="middle" fontFamily="sans-serif">e-Invoice</text>
        {/* Checkmark seal */}
        <circle cx="127" cy="52" r="10" fill={accent} opacity="0.1" stroke={accent} />
        <path d="M122 52 L126 56 L134 46" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </>
    );
  }
  if (index === 2) {
    // Tally Integration — ledger book with sync
    return (
      <>
        {/* Book / ledger */}
        <rect x="22" y="16" width="60" height="68" rx="3" fill="white" stroke={ink} />
        <rect x="22" y="16" width="8" height="68" rx="3" fill={faint} />
        {/* Ledger lines */}
        <line x1="36" y1="30" x2="76" y2="30" stroke={ink} strokeWidth="0.3" />
        <line x1="36" y1="40" x2="76" y2="40" stroke={ink} strokeWidth="0.3" />
        <line x1="36" y1="50" x2="76" y2="50" stroke={ink} strokeWidth="0.3" />
        <line x1="36" y1="60" x2="76" y2="60" stroke={ink} strokeWidth="0.3" />
        <line x1="60" y1="24" x2="60" y2="78" stroke={ink} strokeWidth="0.3" />
        <rect x="38" y="24" width="16" height="3" rx="1" fill={ink} opacity="0.3" />
        <rect x="62" y="24" width="10" height="3" rx="1" fill={ink} opacity="0.2" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="38" y={33 + i * 10} width={12 + i * 2} height="2" rx="1" fill={ink} opacity="0.2" />
            <rect x="62" y={33 + i * 10} width="8" height="2" rx="1" fill={ink} opacity="0.2" />
          </g>
        ))}
        {/* Sync arrows */}
        <path d="M90 40 L110 40" stroke={accent} strokeWidth="1.2" />
        <path d="M107 37 L112 40 L107 43" fill={accent} />
        <path d="M110 56 L90 56" stroke={accent} strokeWidth="1.2" />
        <path d="M93 53 L88 56 L93 59" fill={accent} />
        {/* Tally-like app */}
        <rect x="116" y="26" width="30" height="44" rx="4" fill={accent} opacity="0.1" stroke={accent} />
        <rect x="120" y="30" width="22" height="4" rx="1" fill={accent} opacity="0.5" />
        <rect x="120" y="38" width="22" height="8" rx="2" fill={accent} opacity="0.1" />
        <rect x="120" y="50" width="22" height="8" rx="2" fill={accent} opacity="0.1" />
        <rect x="120" y="62" width="14" height="4" rx="2" fill={accent} opacity="0.3" />
      </>
    );
  }
  if (index === 3) {
    // Payment Gateways — credit card with shield/lock
    return (
      <>
        {/* Credit card */}
        <rect x="20" y="24" width="84" height="52" rx="6" fill="white" stroke={ink} />
        <rect x="20" y="36" width="84" height="10" fill={faint} />
        {/* Chip */}
        <rect x="30" y="28" width="14" height="10" rx="2" fill={accent} opacity="0.25" stroke={accent} strokeWidth="0.5" />
        <line x1="34" y1="28" x2="34" y2="38" stroke={accent} strokeWidth="0.4" />
        <line x1="38" y1="28" x2="38" y2="38" stroke={accent} strokeWidth="0.4" />
        <line x1="30" y1="33" x2="44" y2="33" stroke={accent} strokeWidth="0.4" />
        {/* Card number */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={28 + i * 18} y={52} width="14" height="3" rx="1" fill={ink} opacity="0.2" />
        ))}
        <rect x="28" y="62" width="24" height="3" rx="1" fill={ink} opacity="0.3" />
        <rect x="78" y="62" width="18" height="3" rx="1" fill={ink} opacity="0.2" />
        {/* Shield / lock icon */}
        <path d="M126 22 L140 28 L140 46 Q140 58 126 64 Q112 58 112 46 L112 28 Z" fill={accent} opacity="0.1" stroke={accent} strokeWidth="1" />
        <rect x="121" y="40" width="10" height="10" rx="2" fill={accent} opacity="0.3" />
        <path d="M122 40 V36 A4 4 0 0 1 130 36 V40" fill="none" stroke={accent} strokeWidth="1" />
        <circle cx="126" cy="46" r="1.5" fill={accent} />
      </>
    );
  }
  if (index === 4) {
    // WhatsApp Business API — chat + code
    return (
      <>
        {/* Chat side */}
        <rect x="14" y="16" width="60" height="68" rx="6" fill="white" stroke={ink} />
        <rect x="14" y="16" width="60" height="12" rx="6" fill="rgba(37,211,102,0.12)" />
        <circle cx="24" cy="22" r="4" fill="rgba(37,211,102,0.3)" />
        <rect x="32" y="20" width="20" height="3" rx="1" fill={ink} opacity="0.5" />
        {/* Messages */}
        <rect x="22" y="34" width="36" height="10" rx="5" fill="rgba(37,211,102,0.1)" stroke="rgba(37,211,102,0.3)" strokeWidth="0.5" />
        <rect x="26" y="37.5" width="24" height="3" rx="1" fill={ink} opacity="0.3" />
        <rect x="32" y="48" width="36" height="10" rx="5" fill={faint} />
        <rect x="36" y="51.5" width="24" height="3" rx="1" fill={ink} opacity="0.3" />
        <rect x="22" y="62" width="40" height="10" rx="5" fill="rgba(37,211,102,0.1)" stroke="rgba(37,211,102,0.3)" strokeWidth="0.5" />
        {/* API code side */}
        <rect x="86" y="22" width="58" height="52" rx="4" fill={faint} stroke={ink} strokeWidth="0.5" />
        <text x="92" y="32" fontSize="4.5" fill={accent} fontFamily="monospace">POST</text>
        <rect x="92" y="36" width="40" height="3" rx="1" fill={ink} opacity="0.2" />
        <text x="92" y="48" fontSize="4.5" fill={ink} fontFamily="monospace" opacity="0.4">{"{"}</text>
        <rect x="98" y="52" width="30" height="2" rx="1" fill={ink} opacity="0.15" />
        <rect x="98" y="58" width="24" height="2" rx="1" fill={ink} opacity="0.15" />
        <text x="92" y="68" fontSize="4.5" fill={ink} fontFamily="monospace" opacity="0.4">{"}"}</text>
        {/* Connect arrow */}
        <path d="M76 50 L84 50" stroke={accent} strokeWidth="1.2" />
        <path d="M82 47 L86 50 L82 53" fill={accent} />
      </>
    );
  }
  if (index === 5) {
    // ONDC Integration — network mesh
    return (
      <>
        {/* Central ONDC node */}
        <circle cx="80" cy="50" r="14" fill={accent} opacity="0.1" stroke={accent} />
        <text x="80" y="53" fontSize="5" fill={accent} fontWeight="700" textAnchor="middle" fontFamily="sans-serif">ONDC</text>
        {/* Surrounding nodes */}
        {[
          [36, 28], [124, 28], [36, 72], [124, 72], [80, 14], [80, 86],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1={80} y1={50} x2={x} y2={y} stroke={ink} strokeWidth="0.6" strokeDasharray="2 2" />
            <circle cx={x} cy={y} r="8" fill={faint} stroke={ink} strokeWidth="0.5" />
            <rect x={(x as number) - 4} y={(y as number) - 2} width="8" height="4" rx="1" fill={ink} opacity="0.3" />
          </g>
        ))}
      </>
    );
  }
  if (index === 6) {
    // Webhooks & Events — hook arrows with event dots
    return (
      <>
        {/* Source system */}
        <rect x="16" y="28" width="36" height="44" rx="4" fill={faint} stroke={ink} />
        <rect x="22" y="34" width="24" height="4" rx="1" fill={ink} opacity="0.4" />
        {/* Event dots firing */}
        <circle cx="56" cy="36" r="3" fill={accent} />
        <circle cx="62" cy="44" r="3" fill={accent} opacity="0.6" />
        <circle cx="58" cy="56" r="3" fill={accent} opacity="0.4" />
        {/* Webhook arrows (hook-shaped) */}
        <path d="M56 36 Q68 36 74 30 Q80 24 86 30" fill="none" stroke={accent} strokeWidth="1" />
        <path d="M62 44 Q74 44 80 50 Q86 56 92 50" fill="none" stroke={accent} strokeWidth="1" />
        <path d="M58 56 Q70 56 76 62 Q82 68 88 62" fill="none" stroke={accent} strokeWidth="1" />
        {/* Target endpoints */}
        <rect x="90" y="18" width="52" height="14" rx="4" fill="white" stroke={ink} strokeWidth="0.5" />
        <rect x="94" y="22" width="20" height="3" rx="1" fill={ink} opacity="0.3" />
        <circle cx="134" cy="25" r="3" fill={accent} opacity="0.3" />
        <rect x="90" y="38" width="52" height="14" rx="4" fill="white" stroke={accent} strokeWidth="0.6" />
        <rect x="94" y="42" width="20" height="3" rx="1" fill={accent} opacity="0.5" />
        <circle cx="134" cy="45" r="3" fill={accent} />
        <rect x="90" y="58" width="52" height="14" rx="4" fill="white" stroke={ink} strokeWidth="0.5" />
        <rect x="94" y="62" width="20" height="3" rx="1" fill={ink} opacity="0.3" />
        <circle cx="134" cy="65" r="3" fill={accent} opacity="0.3" />
      </>
    );
  }
  // index === 7: Third-Party Connectors — puzzle pieces
  return (
    <>
      {/* Central puzzle piece */}
      <path d="M64 34 H72 V30 A4 4 0 0 1 80 30 V34 H88 V42 H92 A4 4 0 0 1 92 50 H88 V58 H80 V62 A4 4 0 0 1 72 62 V58 H64 V50 H60 A4 4 0 0 1 60 42 H64 Z" fill={accent} opacity="0.15" stroke={accent} strokeWidth="0.8" />
      {/* Left piece */}
      <path d="M24 34 H32 V30 A4 4 0 0 1 40 30 V34 H48 V42 H52 A4 4 0 0 1 52 50 H48 V58 H40 V62 A4 4 0 0 1 32 62 V58 H24 V50 H20 A4 4 0 0 1 20 42 H24 Z" fill={faint} stroke={ink} strokeWidth="0.6" />
      {/* Right piece */}
      <path d="M104 34 H112 V30 A4 4 0 0 1 120 30 V34 H128 V42 H132 A4 4 0 0 1 132 50 H128 V58 H120 V62 A4 4 0 0 1 112 62 V58 H104 V50 H100 A4 4 0 0 1 100 42 H104 Z" fill={faint} stroke={ink} strokeWidth="0.6" />
      {/* Connection indicators */}
      <circle cx="56" cy="46" r="2" fill={accent} />
      <circle cx="96" cy="46" r="2" fill={accent} />
    </>
  );
}
