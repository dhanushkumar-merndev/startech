import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Bento } from "@/components/sections/bento";
import { CrmShowcase } from "@/components/sections/crm-showcase";
import { Cta } from "@/components/sections/cta";
import { ParallaxCards } from "@/components/sections/parallax-cards";
import { TechnologyStack } from "@/components/sections/technology-stack";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Connected websites, CRM, mobile apps and automation designed to turn enquiries into efficient daily work.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Systems that work better together."
        lead="We connect your website, lead capture, CRM, mobile app and operations workflows so every customer interaction has a clear next step."
      />
      <ParallaxCards />
      <CrmShowcase />
      <Bento />
      <TechnologyStack />
      <Cta />
    </>
  );
}
