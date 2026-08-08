import Link from "next/link";
import Image from "next/image";
import { nav, services, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="grain relative overflow-hidden bg-ink text-white">
      <div className="shell relative z-10 pt-24 md:pt-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link
              href="/"
              aria-label={`${site.name} — home`}
              className="inline-flex"
            >
              <Image
                src="/logo.png"
                alt=""
                width={749}
                height={226}
                sizes="180px"
                className="h-auto w-[150px] brightness-0 invert sm:w-[180px]"
              />
            </Link>
            <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-muted-dark">
              {site.tagline}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="ul-link mt-8 inline-block font-display text-[clamp(1.4rem,3vw,2.1rem)] tracking-[-0.035em]"
            >
              {site.email}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="eyebrow text-muted-dark">Company</h3>
              <ul className="mt-5 space-y-3">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="ul-link text-sm text-white/85">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow text-muted-dark">Services</h3>
              <ul className="mt-5 space-y-3">
                {services.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <Link href={`/services#${s.id}`} className="ul-link text-sm text-white/85">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow text-muted-dark">Studio</h3>
              <address className="mt-5 not-italic text-sm leading-relaxed text-muted-dark">
                {site.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          </div>
        </div>

        {/* Oversized wordmark bleeding off the bottom edge. It is sized purely
            in vw so it scales down with the viewport rather than being cut off
            at its ends on a phone; the cap stops it growing without limit on a
            very wide screen. */}
        <div className="mt-20 flex justify-center select-none" aria-hidden>
          <div className="font-display text-center text-[min(10.5vw,11rem)] leading-[0.78] font-semibold tracking-[-0.055em] whitespace-nowrap text-white/[0.07]">
            STAR TECH INDIA
          </div>
        </div>

        <div className="flex flex-col gap-4 py-7 text-xs text-muted-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="ul-link">
              Privacy
            </Link>
            <Link href="/terms" className="ul-link">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
