import Link from "next/link";
import { SplitHeading } from "@/components/split-heading";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col justify-center py-32">
      <span className="eyebrow text-brand">Error 404</span>
      <SplitHeading as="h1" trigger="load" className="d1 mt-6 font-display">
        Nothing here.
      </SplitHeading>
      <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-muted">
        The page you asked for has moved or never existed. The work is still where you
        left it.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/" className="btn btn-primary">
          Back home
        </Link>
        <Link href="/work" className="btn btn-outline">
          See our work
        </Link>
      </div>
    </section>
  );
}
