import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Cta } from "@/components/sections/cta";
import { getSubService, getSubServiceSlug, services } from "@/lib/site";

type SubServicePageProps = {
  params: Promise<{ service: string; item: string }>;
};

export function generateStaticParams() {
  return services.flatMap((service) =>
    service.children.map((child) => ({
      service: service.id,
      item: getSubServiceSlug(child.name),
    })),
  );
}

export async function generateMetadata({ params }: SubServicePageProps): Promise<Metadata> {
  const { service: serviceId, item } = await params;
  const result = getSubService(serviceId, item);
  if (!result) return {};

  return {
    title: result.child.name,
    description: `${result.child.name} services by Star Tech India, built as part of our ${result.service.title.toLowerCase()} practice.`,
  };
}

export default async function SubServicePage({ params }: SubServicePageProps) {
  const { service: serviceId, item } = await params;
  const result = getSubService(serviceId, item);
  if (!result) notFound();

  const { service, child } = result;
  const childIndex = service.children.findIndex((entry) => entry.name === child.name) + 1;
  const related = service.children.filter((entry) => entry.name !== child.name).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`${service.index}.${String(childIndex).padStart(2, "0")} · ${service.title}`}
        title={child.name}
        lead={`A focused ${child.name.toLowerCase()} solution, planned around the way your team works and connected to the rest of your business.`}
      >
        <Link href={`/services/${service.id}`} className="ul-link text-sm text-brand">
          ← Back to {service.title}
        </Link>
      </PageHero>

      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow text-brand">What we deliver</span>
            <h2 className="d3 mt-5 font-display">Clear scope. Useful from day one.</h2>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {[
              ["Discovery", `Map the real process, priorities and success measures for ${child.name.toLowerCase()}.`],
              ["Experience", "Design the workflows, screens and hand-offs people will use every day."],
              ["Build", `Connect ${child.name.toLowerCase()} to the tools and data your business already relies on.`],
              ["Launch", "Test with your team, train the owners and improve the system after it goes live."],
            ].map(([title, body], index) => (
              <Reveal key={title} delay={index * 55}>
                <article className="h-full rounded-[22px] border border-line bg-paper/85 p-6 backdrop-blur-[2px] md:p-7">
                  <span className="font-mono text-xs text-brand">0{index + 1}</span>
                  <h3 className="mt-6 font-display text-xl tracking-[-0.03em]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper/80 py-20 backdrop-blur-[2px] md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow text-brand">Built as one system</span>
            <h2 className="d3 mt-5 font-display">Part of your {service.title.toLowerCase()} practice.</h2>
          </Reveal>

          <Reveal className="lg:col-span-7 lg:col-start-6">
            <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
              This capability is designed to work cleanly with the other parts of your operation—not as another isolated tool your team has to manage.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {service.deliverables.map((deliverable) => (
                <span key={deliverable} className="tag bg-paper text-muted">{deliverable}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-brand">Explore the practice</span>
          <h2 className="d3 mt-5 font-display">Related capabilities.</h2>
        </Reveal>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {related.map((relatedChild) => (
            <Link
              key={relatedChild.name}
              href={`/services/${service.id}/${getSubServiceSlug(relatedChild.name)}`}
              className="group rounded-[22px] border border-line bg-paper/85 p-6 transition-colors duration-300 hover:border-ink hover:bg-ink md:p-7"
            >
              <span className="text-xs text-muted transition-colors duration-300 group-hover:text-brand-hot">{service.title}</span>
              <h3 className="mt-8 font-display text-2xl tracking-[-0.04em] transition-colors duration-300 group-hover:text-white">
                {relatedChild.name}
              </h3>
              <span className="mt-8 inline-flex text-sm text-brand transition-transform duration-300 group-hover:translate-x-1">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      <Cta />
    </>
  );
}
