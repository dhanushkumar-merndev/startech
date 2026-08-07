import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Cta } from "@/components/sections/cta";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guides on websites, CRM, mobile apps and business automation for growing businesses.",
};

const posts = [
  {
    category: "Website development",
    title: "What a business website needs before you spend on marketing.",
    excerpt: "A practical checklist for turning your website into a reliable source of enquiries.",
    read: "6 min read",
  },
  {
    category: "CRM & leads",
    title: "Five signs your sales team has outgrown spreadsheets.",
    excerpt: "Where leads get lost, why follow-ups slow down and when a CRM starts paying for itself.",
    read: "5 min read",
  },
  {
    category: "Mobile apps",
    title: "When a mobile app is better than a responsive website.",
    excerpt: "The use cases where offline access, notifications and device features make a real difference.",
    read: "4 min read",
  },
  {
    category: "Automation",
    title: "Start business automation with the work your team repeats every day.",
    excerpt: "A simple way to identify high-value workflows before you buy another tool or build software.",
    read: "7 min read",
  },
  {
    category: "Custom software",
    title: "Build, buy or integrate: how to make the right software decision.",
    excerpt: "A framework for choosing between off-the-shelf tools, integrations and a custom platform.",
    read: "8 min read",
  },
  {
    category: "Integrations",
    title: "Why disconnected tools create more work than they save.",
    excerpt: "How to connect website forms, CRM, billing and customer communication without duplicate entry.",
    read: "5 min read",
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Useful ideas for growing businesses."
        lead="Clear, practical guides on websites, CRM, mobile apps, automation and the systems that help your team move faster."
      />

      <section className="shell py-20 md:py-28">
        <Reveal>
          <article className="grid overflow-hidden rounded-[24px] border border-line bg-ink text-white lg:grid-cols-12">
            <div className="relative min-h-[260px] overflow-hidden bg-brand p-7 lg:col-span-5 lg:min-h-0 lg:p-10">
              <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full border-[28px] border-white/20" />
              <div aria-hidden className="absolute bottom-8 left-8 size-24 rounded-full border border-white/35" />
              <span className="relative z-10 eyebrow text-white/75">Featured guide</span>
            </div>
            <div className="flex flex-col p-7 lg:col-span-7 lg:p-10">
              <span className="eyebrow text-brand-hot">CRM & lead management</span>
              <h2 className="mt-6 max-w-2xl font-display text-[clamp(2rem,4vw,3.6rem)] leading-[0.96] tracking-[-0.045em]">
                A simple lead-management process every growing business can use.
              </h2>
              <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-white/60">
                The practical stages, reminders and reporting habits that keep every enquiry moving from first contact to conversion.
              </p>
              <span className="mt-8 text-sm text-white/45">8 min read</span>
            </div>
          </article>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.title} delay={index * 60}>
              <article className="group flex h-full min-h-[250px] flex-col rounded-[22px] border border-line bg-paper p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ink/35 md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="eyebrow text-brand">{post.category}</span>
                  <span className="font-mono text-[0.6875rem] text-muted">{post.read}</span>
                </div>
                <h2 className="mt-8 font-display text-[clamp(1.45rem,2.4vw,1.9rem)] leading-[1.03] tracking-[-0.035em]">
                  {post.title}
                </h2>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{post.excerpt}</p>
                <span className="mt-auto pt-8 text-sm font-medium text-ink">
                  Read guide <span aria-hidden className="ml-1 text-brand">→</span>
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Cta />
    </>
  );
}
