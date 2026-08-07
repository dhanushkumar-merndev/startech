import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms covering use of the ${site.name} website and the basis on which we quote for work.`,
};

const sections = [
  {
    h: "This website",
    p: "Content here is provided for information. Case study figures are supplied by the clients named and were accurate at the time of publication. Nothing on this site is an offer capable of acceptance.",
  },
  {
    h: "Quotes and estimates",
    p: "Price ranges shown are indicative. A binding quote follows a discovery conversation and is issued in a signed statement of work that sets out scope, milestones and payment terms.",
  },
  {
    h: "Intellectual property",
    p: "Our marks and the design of this site remain ours. Work produced for a client under a signed statement of work transfers to that client on payment, in full, including source code.",
  },
  {
    h: "Confidentiality",
    p: "Anything you send us in an enquiry is treated as confidential. We are happy to sign your NDA before a first call if you would prefer.",
  },
  {
    h: "Governing law",
    p: "These terms are governed by the laws of India, with the courts at Chennai having exclusive jurisdiction.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms." lead="The basis on which we publish and quote." />

      <section className="shell py-20 md:py-28">
        <div className="max-w-2xl space-y-12">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-xl tracking-[-0.03em]">{s.h}</h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{s.p}</p>
            </div>
          ))}
          <p className="border-t border-line pt-8 text-sm text-muted">
            Last updated 6 August 2026. Questions to {site.email}.
          </p>
        </div>
      </section>
    </>
  );
}
