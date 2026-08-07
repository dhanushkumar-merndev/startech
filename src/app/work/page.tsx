import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Cta } from "@/components/sections/cta";
import { WorkGrid } from "@/components/sections/work-grid";
import { Marquee } from "@/components/marquee";
import { clients } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Examples of websites, CRM, mobile apps, automation and custom software built for growing businesses.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Systems in daily use."
        lead="Every project below is still in production and still supported by us. Names and numbers are published with client permission."
      />

      <WorkGrid bare />

      <div className="border-y border-line">
        <Marquee label="Partnering with category leaders across logistics, healthcare & finance" items={clients} duration={44} />
      </div>

      <Cta />
    </>
  );
}
