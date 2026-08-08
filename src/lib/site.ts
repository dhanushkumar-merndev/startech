export const site = {
  name: "Star Tech India",
  short: "Star Tech",
  tagline: "Websites, CRM, mobile apps and business automation built for growing businesses.",
  email: "hello@startechindia.com",
  phone: "+91 97430 30555",
  /** Same line in the digits-only form wa.me requires (country code, no +). */
  whatsapp: "919743030555",
  address: [
    "No. 18, 1st Floor, 1st Main",
    "BSK 1st Stage, Srinivasa Nagar",
    "80 Feet Main Road",
    "Bengaluru, Karnataka 560050",
  ],
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export type SubService = {
  name: string;
  /**
   * Optional real artwork from /public. When absent the menu falls back to a
   * generated mark, so a card never renders as an empty box while photography
   * is still being commissioned.
   */
  image?: string;
};

export type Service = {
  id: "website" | "crm" | "mobile" | "automation" | "software" | "integrations";
  index: string;
  title: string;
  summary: string;
  deliverables: string[];
  children: SubService[];
};

export const services: Service[] = [
  {
    id: "website",
    index: "01",
    title: "Website Development",
    summary:
      "High-performing business websites, landing pages and web portals that make your company easy to trust, find and contact.",
    deliverables: ["Corporate websites", "Landing pages", "E-commerce", "Web portals"],
    children: [
      { name: "Corporate Websites" },
      { name: "Business Landing Pages" },
      { name: "E-commerce Websites" },
      { name: "Product & Service Portals" },
      { name: "Customer Portals" },
      { name: "CMS Development" },
      { name: "Website Redesign" },
      { name: "SEO-Ready Builds" },
    ],
  },
  {
    id: "crm",
    index: "02",
    title: "CRM & Lead Management",
    summary:
      "One place for every enquiry, customer and follow-up — built around how your sales team actually works.",
    deliverables: ["Lead capture", "Sales pipelines", "WhatsApp CRM", "Quote to cash"],
    children: [
      { name: "Sales Pipeline CRM" },
      { name: "Lead Management" },
      { name: "Lead Capture Forms" },
      { name: "WhatsApp CRM" },
      { name: "Field Sales CRM" },
      { name: "Follow-up Automation" },
      { name: "Quotes & Invoicing" },
      { name: "CRM Data Migration" },
    ],
  },
  {
    id: "mobile",
    index: "03",
    title: "Mobile App Development",
    summary:
      "Android and iOS apps with reliable offline use, payments and notifications for customers, field teams and operations.",
    deliverables: ["iOS & Android", "Offline first", "Payments", "Push & analytics"],
    children: [
      { name: "iOS Development" },
      { name: "Android Development" },
      { name: "React Native Apps" },
      { name: "Flutter Apps" },
      { name: "Offline-First Apps" },
      { name: "Payments & UPI" },
      { name: "Push & Analytics" },
      { name: "App Store Launch" },
    ],
  },
  {
    id: "automation",
    index: "04",
    title: "Business Automation",
    summary:
      "Replace repetitive work with connected workflows, approvals and alerts that keep every team moving without manual chasing.",
    deliverables: ["Workflow design", "Approvals", "Notifications", "Operational dashboards"],
    children: [
      { name: "Sales Automation" },
      { name: "Approval Workflows" },
      { name: "Document Automation" },
      { name: "Billing Automation" },
      { name: "Customer Notifications" },
      { name: "Task & Reminder Systems" },
      { name: "Reporting Dashboards" },
      { name: "Spreadsheet Replacement" },
    ],
  },
  {
    id: "software",
    index: "05",
    title: "Custom Software & ERP",
    summary:
      "Purpose-built ERP, billing, inventory and operations software that replaces spreadsheet sprawl and fits your process.",
    deliverables: ["ERP systems", "Billing", "Inventory", "Admin tools"],
    children: [
      { name: "ERP Systems" },
      { name: "Billing & Accounting" },
      { name: "Inventory Management" },
      { name: "Logistics & Fleet" },
      { name: "HR & Payroll" },
      { name: "Internal Admin Tools" },
      { name: "Document Management" },
      { name: "Legacy Modernisation" },
    ],
  },
  {
    id: "integrations",
    index: "06",
    title: "Integrations & APIs",
    summary:
      "Connect your website, CRM, software and apps to the tools your business already relies on.",
    deliverables: ["Tally & GST", "Payments", "WhatsApp", "Custom APIs"],
    children: [
      { name: "REST & GraphQL APIs" },
      { name: "GST E-Invoicing" },
      { name: "Tally Integration" },
      { name: "Payment Gateways" },
      { name: "WhatsApp Business API" },
      { name: "ONDC Integration" },
      { name: "Webhooks & Events" },
      { name: "Third-Party Connectors" },
    ],
  },
];

export function getService(id: string) {
  return services.find((service) => service.id === id);
}

/** URL-safe, stable IDs for individual service capabilities. */
export function getSubServiceSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSubService(serviceId: string, subServiceSlug: string) {
  const service = getService(serviceId);
  const child = service?.children.find((item) => getSubServiceSlug(item.name) === subServiceSlug);
  return service && child ? { service, child } : undefined;
}

export type CaseStudy = {
  slug: string;
  client: string;
  sector: string;
  title: string;
  result: string;
  metric: { value: string; label: string };
  year: string;
  tone: "ink" | "red" | "bone";
  services: string[];
  challenge: string;
  approach: string;
  outcomes: { value: string; label: string }[];
  stack: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "meridian-distribution",
    client: "Meridian Distribution",
    sector: "FMCG",
    title: "A CRM that replaced eleven spreadsheets",
    result:
      "Unified 240 field reps onto one pipeline with offline order capture across 14 states.",
    metric: { value: "38%", label: "faster order-to-invoice" },
    year: "2025",
    tone: "ink",
    services: ["CRM & Lead Management", "Mobile App Development", "Integrations & APIs"],
    challenge:
      "Meridian's 240 field reps booked orders on paper and WhatsApp. Regional managers rekeyed them into eleven separate spreadsheets, and head office saw national numbers eight days late — by which point stock decisions had already been made on stale data.",
    approach:
      "We spent two weeks riding along on beats in Coimbatore and Nagpur before designing anything. The result was an offline-first Android app for reps and a web CRM for managers, sharing one pipeline model and syncing to the existing SAP instance through a queue that tolerates the network dropping mid-order.",
    outcomes: [
      { value: "38%", label: "faster order-to-invoice" },
      { value: "240", label: "reps onboarded in 6 weeks" },
      { value: "0", label: "spreadsheets remaining" },
    ],
    stack: ["React Native", "Next.js", "PostgreSQL", "SAP integration", "AWS"],
  },
  {
    slug: "arya-finserv",
    client: "Arya Finserv",
    sector: "Lending",
    title: "Loan origination, rebuilt in 90 days",
    result:
      "Replaced a legacy desktop system with a web platform handling KYC, underwriting and disbursal.",
    metric: { value: "4.2x", label: "applications processed" },
    year: "2025",
    tone: "red",
    services: ["Custom Software & ERP", "Business Automation", "Integrations & APIs"],
    challenge:
      "A fifteen-year-old desktop application ran Arya's entire lending book. It required a branch visit to file anything, could not be audited without exporting to Excel, and the one engineer who understood it had retired.",
    approach:
      "We rebuilt origination as a web platform in three phases so nothing went dark: KYC and application capture first, then the underwriting rules engine, then disbursal and collections. Document extraction was automated with a model trained on their own historic files, cutting manual data entry per application from 22 minutes to under four.",
    outcomes: [
      { value: "4.2x", label: "applications processed" },
      { value: "90 days", label: "to production" },
      { value: "18 min", label: "saved per application" },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Azure", "Document AI"],
  },
  {
    slug: "kovai-logistics",
    client: "Kovai Logistics",
    sector: "Transport",
    title: "Fleet visibility for 1,800 vehicles",
    result:
      "Live tracking, ePOD capture and automated freight billing wired into their existing ERP.",
    metric: { value: "₹2.4Cr", label: "annual leakage recovered" },
    year: "2024",
    tone: "bone",
    services: ["Custom Software & ERP", "Mobile App Development", "Business Automation"],
    challenge:
      "Kovai billed freight from paper delivery notes that arrived weeks after the trip. Disputes were settled from memory, and an internal audit put unbilled and under-billed trips at roughly two crore a year.",
    approach:
      "Drivers capture proof of delivery in a low-bandwidth app; GPS telemetry from three different device vendors is normalised into one event stream. Freight is then calculated automatically against contracted rate cards and pushed into their ERP for invoicing the same day.",
    outcomes: [
      { value: "₹2.4Cr", label: "annual leakage recovered" },
      { value: "1,800", label: "vehicles tracked live" },
      { value: "Same day", label: "freight invoicing" },
    ],
    stack: ["React Native", "Go", "TimescaleDB", "Kafka", "AWS"],
  },
  {
    slug: "sundar-healthcare",
    client: "Sundar Healthcare",
    sector: "Healthcare",
    title: "Patient app for 32 clinics",
    result:
      "Appointments, records and payments in one app, integrated with their HIS and ABDM.",
    metric: { value: "91%", label: "appointments self-served" },
    year: "2024",
    tone: "bone",
    services: ["Mobile App Development", "Integrations & APIs", "Custom Software & ERP"],
    challenge:
      "Every appointment across 32 clinics went through a call centre that was busy from 8am and abandoned one call in four. Patients had no way to see reports without collecting a printout.",
    approach:
      "A patient app in Tamil, Hindi and English covering booking, reports, prescriptions and payments, connected to their hospital information system and registered with ABDM for health record portability. Front-desk staff kept a parallel console so nobody was forced onto the app.",
    outcomes: [
      { value: "91%", label: "appointments self-served" },
      { value: "32", label: "clinics live in 5 months" },
      { value: "3", label: "languages supported" },
    ],
    stack: ["Flutter", "Next.js", "PostgreSQL", "ABDM", "Razorpay"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

export const processSteps = [
  {
    step: "01",
    title: "Discover",
    body: "Two weeks on the floor with your team. We map the real process — including the workarounds nobody documents — before proposing a line of code.",
    duration: "1–2 weeks",
  },
  {
    step: "02",
    title: "Shape",
    body: "Clickable prototypes and a costed architecture. You approve something you can use, not a slide deck full of adjectives.",
    duration: "2–3 weeks",
  },
  {
    step: "03",
    title: "Build",
    body: "Two-week sprints with a working build at the end of each. A shared board, a demo every fortnight, and no invoice surprises.",
    duration: "8–20 weeks",
  },
  {
    step: "04",
    title: "Run",
    body: "Migration, training and an SLA. We stay on the hook for uptime and keep shipping improvements against a roadmap you own.",
    duration: "Ongoing",
  },
];

export const stats = [
  { value: 140, suffix: "+", label: "Products shipped" },
  { value: 11, suffix: " yrs", label: "Building software" },
  { value: 96, suffix: "%", label: "Client retention" },
  { value: 62, suffix: "", label: "Engineers on staff" },
];

export const testimonials = [
  {
    quote:
      "They spent a fortnight in our warehouse before writing anything. The CRM they built is the first system our sales team has not tried to work around.",
    name: "Rajesh Menon",
    role: "Managing Director, Meridian Distribution",
  },
  {
    quote:
      "Ninety days from kickoff to a live lending platform, and the handover documentation was better than our previous vendor's product.",
    name: "Priya Nair",
    role: "COO, Arya Finserv",
  },
  {
    quote:
      "What stood out was the honesty. They talked us out of two features we would have paid for and did not need.",
    name: "Anand Krishnan",
    role: "CTO, Kovai Logistics",
  },
];

export const clients = [
  "MERIDIAN",
  "ARYA FINSERV",
  "KOVAI LOGISTICS",
  "SUNDAR HEALTH",
  "VELAN STEEL",
  "NORTHGATE",
  "AMBER RETAIL",
  "TRIVENI AGRO",
];

export const capabilities = [
  {
    title: "Websites that create enquiries",
    body: "Fast, clear and built around the action you want visitors to take — call, enquire, book or buy.",
    span: "lg:col-span-7",
  },
  {
    title: "CRM your team will use",
    body: "Every lead, follow-up and customer conversation in one simple system your sales team can trust.",
    span: "lg:col-span-5",
  },
  {
    title: "Mobile apps for work on the move",
    body: "Reliable apps for customers, field teams and operations, with the right features for real daily use.",
    span: "lg:col-span-4",
  },
  {
    title: "Automation that removes repeat work",
    body: "Connected approvals, reminders and reporting that give your team more time for customers and growth.",
    span: "lg:col-span-8",
  },
];
