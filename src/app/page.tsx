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
      <ProductWindows />
      <div className="mt-20 border-y border-line md:mt-28">
        <Marquee label="Trusted by growing businesses & industry leaders across India" items={clients} />
      </div>
      <ServicesList />
      <WorkGrid limit={3} />
      <Cta />
    </>
  );
}
