import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} handles the personal data you share with us.`,
};

const sections = [
  {
    h: "What we collect",
    p: "Only what you send us: the name, email, company, phone number and project brief submitted through our enquiry form, plus anonymous, aggregated traffic counts. We do not run advertising trackers or sell data to anyone.",
  },
  {
    h: "Why we hold it",
    p: "To reply to your enquiry and, if we work together, to administer the engagement. That is the whole purpose. We do not add you to a mailing list unless you ask.",
  },
  {
    h: "How long we keep it",
    p: "Enquiries that do not become projects are deleted after 24 months. Project records are retained for seven years to meet Indian statutory and tax requirements.",
  },
  {
    h: "Who else sees it",
    p: "Our hosting and email providers, as processors, under contract. Client project data is never shared between clients and is never used to train third-party models.",
  },
  {
    h: "Your rights",
    p: `Write to ${site.email} to ask for a copy of what we hold, to correct it, or to have it deleted. We respond within 30 days.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy."
        lead="A short policy, because we collect very little."
      />

      <section className="shell py-20 md:py-28">
        <div className="max-w-2xl space-y-12">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-xl tracking-[-0.03em]">{s.h}</h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{s.p}</p>
            </div>
          ))}
          <p className="border-t border-line pt-8 text-sm text-muted">
            Last updated 6 August 2026. This page is a plain-language summary, not legal
            advice; ask your counsel to review it before you rely on it.
          </p>
        </div>
      </section>
    </>
  );
}
