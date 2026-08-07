import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Star Tech India what you need built. Scope, timeline and a number back within three working days.",
};

const faqs = [
  {
    q: "How quickly can you start?",
    a: "Discovery usually begins within two to three weeks. Build teams are scheduled a quarter ahead, so the earlier we talk, the better the slot.",
  },
  {
    q: "Do you work outside India?",
    a: "Yes — around a fifth of our work is for clients in the UAE, Singapore and the UK. Delivery stays out of Chennai.",
  },
  {
    q: "Who owns the code?",
    a: "You do, in full, from the first commit. Repositories are in your organisation and we work inside them.",
  },
  {
    q: "Will you take over an existing project?",
    a: "Often. We start with a paid two-week audit of the codebase and infrastructure before committing to a plan.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you want to build."
        lead="Whether you need a website, CRM, mobile app, automation or custom software, share the details you have and we will help you choose the right next step."
      />

      <section className="shell py-20 md:py-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <Reveal>
              <div className="rounded-[22px] border border-line bg-bone p-8">
                <h2 className="eyebrow text-muted">Direct</h2>
                <div className="mt-6 space-y-5">
                  <a
                    href={`mailto:${site.email}`}
                    className="ul-link block font-display text-lg tracking-[-0.03em]"
                  >
                    {site.email}
                  </a>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="ul-link block font-display text-lg tracking-[-0.03em]"
                  >
                    {site.phone}
                  </a>
                </div>

                <h2 className="eyebrow mt-10 text-muted">Studio</h2>
                <address className="mt-5 not-italic text-[0.9375rem] leading-relaxed text-muted">
                  {site.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>

                <h2 className="eyebrow mt-10 text-muted">Hours</h2>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
                  Monday to Friday, 9:30 – 18:30 IST.
                  <br />
                  Support SLAs run around the clock.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="bg-bone py-24 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow text-brand">Before you write</span>
            <h2 className="d3 mt-5 font-display">Asked often.</h2>
          </Reveal>

          <div className="lg:col-span-7 lg:col-start-6">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 70}>
                <div className="border-t border-line py-7 last:border-b">
                  <h3 className="font-display text-xl tracking-[-0.03em]">{f.q}</h3>
                  <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-muted">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
