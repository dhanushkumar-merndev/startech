import { MagneticLink } from "@/components/magnetic";
import { Reveal } from "@/components/reveal";
import { SplitHeading } from "@/components/split-heading";
import { site } from "@/lib/site";

export function Cta() {
  return (
    <section className="shell pb-16 pt-6 sm:pb-24 sm:pt-8 md:pb-32">
      <Reveal>
        <div className="grain relative overflow-hidden rounded-[22px] sm:rounded-[28px] bg-ink px-5 py-14 text-center text-white sm:px-12 sm:py-20 md:px-16 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-full size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px]"
            style={{ background: "radial-gradient(circle, #e10600 0%, transparent 70%)" }}
          />

          <div className="relative z-10">
            <span className="eyebrow text-brand-hot">Next step</span>
            <SplitHeading className="d2 mx-auto mt-4 sm:mt-6 max-w-3xl font-display">
              Tell us what you want to build.
            </SplitHeading>
            <p className="mx-auto mt-5 sm:mt-7 max-w-xl text-[0.875rem] sm:text-[0.9375rem] leading-relaxed text-white/55">
              Tell us whether you need a website, CRM, mobile app, automation or custom
              software. We will come back with a clear scope, timeline and next step.
            </p>

            <div className="mt-8 sm:mt-11 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <MagneticLink href="/contact" className="btn btn-red w-full sm:w-auto justify-center" strength={18}>
                Start a project
              </MagneticLink>
              <a href={`mailto:${site.email}`} className="btn border border-white/20 text-white w-full sm:w-auto justify-center">
                <span className="relative z-10">{site.email}</span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
