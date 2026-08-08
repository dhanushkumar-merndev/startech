import { Marquee } from "@/components/marquee";
import { Cta } from "@/components/sections/cta";
import { DashboardWindow } from "@/components/sections/dashboard-window";
import { Hero } from "@/components/sections/hero";
import { ProductWindows } from "@/components/sections/product-windows";
import { ServicesList } from "@/components/sections/services-list";
import { WorkGrid } from "@/components/sections/work-grid";
import { clients } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Hero />
      <DashboardWindow />
      {/* Sits directly under the workspace preview so the two read as one
          block: the product, then the businesses running on it. */}
      <div className="shell mt-6 text-center md:mt-12">
        <p className="eyebrow text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
          Trusted by growing businesses &amp; industry leaders across India
        </p>
      </div>
      <div className="mt-4 border-y border-line bg-bone/60 md:mt-5">
        <Marquee items={clients} logos />
      </div>
      <ProductWindows />
      <ServicesList />
      <WorkGrid limit={3} />
      <Cta />
    </>
  );
}
