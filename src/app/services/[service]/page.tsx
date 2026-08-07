import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Cta } from "@/components/sections/cta";
import { getService, services } from "@/lib/site";

type ServicePageProps = {
  params: Promise<{ service: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ service: service.id }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { service: serviceId } = await params;
  const service = getService(serviceId);

  if (!service) return {};

  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: serviceId } = await params;
  const service = getService(serviceId);
  if (!service) notFound();

  return (
    <>
      <PageHero eyebrow={`Service ${service.index}`} title={service.title} lead={service.summary} />

      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow text-brand">What is included</span>
            <h2 className="d3 mt-5 font-display">A system built around your work.</h2>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {service.children.map((child, index) => (
              <Reveal key={child.name} delay={index * 45}>
                <article className="h-full rounded-[22px] border border-line bg-paper p-6 transition-colors duration-300 hover:border-ink/30 md:p-7">
                  <span className="font-mono text-xs text-brand">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 font-display text-xl tracking-[-0.03em]">{child.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Planned, designed and delivered as part of a connected {service.title.toLowerCase()} programme.
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow text-brand">Core deliverables</span>
            <h2 className="d3 mt-5 font-display">The essentials, covered.</h2>
          </Reveal>

          <Reveal className="lg:col-span-7 lg:col-start-6">
            <div className="grid overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2">
              {service.deliverables.map((deliverable, index) => (
                <div key={deliverable} className="bg-paper p-7 md:p-8">
                  <span className="font-mono text-xs text-brand">0{index + 1}</span>
                  <h3 className="mt-5 font-display text-2xl tracking-[-0.035em]">{deliverable}</h3>
                </div>
              ))}
            </div>

            <Link href="/contact" className="btn btn-primary mt-8">
              Discuss your requirements
            </Link>
          </Reveal>
        </div>
      </section>

      <Cta />
    </>
  );
}
