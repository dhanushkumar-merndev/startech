"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { MOTION_OK, MOTION_REDUCED, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { setSmoothScrollLocked } from "./scroll-manager";
import { nav, site } from "@/lib/site";
import { ServicesMenu } from "./services-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const [mega, setMega] = useState(false);
  const root = useRef<HTMLElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const drawerTl = useRef<gsap.core.Timeline | null>(null);

  // Close the drawer whenever the route changes — adjusted during render
  // rather than in an effect, so it also covers back/forward navigation.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setMega(false);
  }

  useGSAP(
    () => {
      const header = root.current;
      if (!header) return;

      // Reading progress, scrubbed against the whole document.
      //
      // Resolved as an element rather than left as a scoped selector string. A
      // scoped selector matches nothing once the scope ref is detached, and
      // gsap.fromTo still builds the ScrollTrigger for that empty target list —
      // one with no trigger element to fall back to, which then throws inside
      // refresh() and takes the whole route commit down with it. The explicit
      // trigger keeps it valid even if the bar itself ever goes missing.
      const progress = header.querySelector<HTMLElement>(".hdr-progress");
      if (progress) {
        gsap.fromTo(
          progress,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: document.body,
              start: 0,
              end: () => ScrollTrigger.maxScroll(window),
              scrub: 0.3,
            },
          },
        );
      }

      const bar = header.querySelector<HTMLElement>(".hdr-bar");
      if (!bar) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_REDUCED, () => {
        gsap.set(root.current, { autoAlpha: 1, y: 0 });
      });
      mm.add(MOTION_OK, () => {
        gsap.to(root.current, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.08 });
      });

      const trigger = ScrollTrigger.create({
        start: "top -140",
        end: () => ScrollTrigger.maxScroll(window),
        onUpdate: (self) => {
          setScrolled(self.scroll() > 24);
        },
        onLeaveBack: () => {
          setScrolled(false);
        },
      });

      return () => {
        trigger.kill();
        mm.revert();
      };
    },
    { scope: root },
  );

  // Drawer: the panel wipes down from the top edge, then the links deal in.
  //
  // The timeline is built once and played/reversed, never rebuilt per toggle.
  // Rebuilding would be a trap: killing a timeline leaves its inline styles
  // in place, so a fresh `from()` would read the stale `autoAlpha: 0` as its
  // destination and animate 0 → 0. Explicit `fromTo` endpoints make each
  // tween independent of whatever state the element was left in.
  useGSAP(
    () => {
      const panel = drawer.current;
      if (!panel) return;

      drawerTl.current = gsap
        .timeline({ paused: true })
        .fromTo(
          panel,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.45, ease: "power4.inOut" },
        )
        .fromTo(
          ".drawer-item",
          { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.38, stagger: 0.045, ease: "power3.out" },
          0.14,
        )
        .fromTo(
          ".drawer-foot",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.34 },
          0.26,
        );

      return () => {
        drawerTl.current?.kill();
        drawerTl.current = null;
      };
    },
    { scope: drawer },
  );

  // Drive that timeline from the open state. Pointer events are toggled here
  // rather than inside the timeline so the panel stops intercepting taps the
  // instant it starts closing.
  useEffect(() => {
    const tl = drawerTl.current;
    const panel = drawer.current;
    if (!tl || !panel) return;

    if (open) {
      panel.style.pointerEvents = "auto";
      tl.timeScale(1).play();
    } else {
      panel.style.pointerEvents = "none";
      // Closing should get out of the way rather than replay the entrance
      // backwards at the same pace — most closes happen because a link was
      // tapped, and the next page is already loading behind the panel.
      tl.timeScale(2.4).reverse();
    }
  }, [open]);

  // Lock the page behind either navigation overlay. The mega-menu is fixed to
  // the header, so without this the Lenis page layer could still scroll under
  // it while a visitor is choosing a service.
  useEffect(() => {
    const locked = open || mega;
    document.body.style.overflow = locked ? "hidden" : "";
    setSmoothScrollLocked(locked);
    return () => {
      document.body.style.overflow = "";
      setSmoothScrollLocked(false);
    };
  }, [open, mega]);

  return (
    <>
    <header
      ref={root}
      className="site-header fixed inset-x-0 top-0 z-50"
      // Leaving the header area anywhere closes the mega-menu, which covers
      // both moving up off the nav and down past the panel.
      onPointerLeave={() => setMega(false)}
    >
      <div
        className={`hdr-bar relative transition-[background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled || mega
            ? "border-b border-line bg-white/95 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* Reading progress, pinned to the top edge of the bar. */}
        <div
          aria-hidden
          className="hdr-progress absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-brand"
        />

        <div
          className="shell flex h-[76px] items-center justify-between md:h-[84px]"
        >
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="relative z-10 shrink-0"
          >
            <Image
              src="/logo.png"
              alt=""
              width={749}
              height={226}
              priority
              sizes="(max-width: 767px) 162px, 172px"
              className="h-auto w-[162px] lg:w-[172px]"
            />
          </Link>

          {/* The inline nav needs more room than a landscape tablet has, so it
              only takes over at xl — everything below keeps the drawer. */}
          <nav
            className="hidden items-center gap-8 xl:flex"
          >
            {nav.map((item) => {
              const active = pathname === item.href;
              const inactive = "text-ink hover:text-ink";
              const selected = "text-brand";

              // Services opens the mega-menu on hover; the link itself still
              // navigates, so it works without a pointer and without JS.
              if (item.href === "/services") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onPointerEnter={() => setMega(true)}
                    onFocus={() => setMega(true)}
                    onClick={() => setMega(false)}
                    aria-expanded={mega}
                    aria-haspopup="true"
                    className={`ul-link flex items-center gap-1.5 text-[0.9375rem] font-medium transition-colors duration-300 ${
                      active || mega ? selected : inactive
                    }`}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden
                      fill="none"
                      className={`size-3 transition-transform duration-300 ${
                        mega ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M3 6l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onPointerEnter={() => setMega(false)}
                  className={`ul-link text-[0.9375rem] font-medium transition-colors duration-300 ${
                    active ? selected : inactive
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="btn btn-primary !px-6 !py-3 text-sm"
            >
              Start a project
            </Link>
          </nav>

          {/* Toggled on pointerdown, not click. A press that lands while the
              page is still gliding gets spent cancelling that momentum, and
              no click is ever dispatched — which is why the button felt dead
              until scrolling had fully settled. pointerdown always arrives.
              Keyboard activation still comes through click, where `detail` is
              0 because no pointer press preceded it. */}
          <button
            type="button"
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              setOpen((v) => !v);
            }}
            onClick={(event) => {
              if (event.detail === 0) setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-10 flex size-11 touch-manipulation items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink xl:hidden"
          >
            {/* Both icons are mounted and cross-faded, so the swap cannot flash
                an empty button while the drawer is mid-animation. */}
            <span className="relative block size-5">
              <HiBars3
                aria-hidden
                className={`absolute inset-0 size-5 transition-all duration-300 ${
                  open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
              />
              <HiXMark
                aria-hidden
                className={`absolute inset-0 size-5 transition-all duration-300 ${
                  open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <ServicesMenu open={mega} onClose={() => setMega(false)} />
    </header>

      {/* Mobile drawer — a sibling of the header, not a child of it.
          The header carries a transform for its entrance, and a transformed
          ancestor becomes the containing block for `position: fixed`
          descendants: nested inside, this panel sized itself to the 76px
          header box instead of the viewport and never showed its contents.
          It sits just under the header's z-50 so the close button stays live. */}
      <div
        id="mobile-nav"
        ref={drawer}
        data-lenis-prevent
        // clip-path hides the panel but leaves it hit-testable and in the tab
        // order, so a closed drawer still covered the whole mobile viewport if
        // the imperative pointerEvents write below ever fell out of sync — and
        // its links stayed keyboard-reachable regardless. inert closes both.
        inert={!open}
        className="fixed inset-0 z-40 bg-paper xl:hidden"
        style={{ clipPath: "inset(0 0 100% 0)", pointerEvents: "none" }}
      >
        <div className="shell flex h-full flex-col justify-between pb-10 pt-28">
          <nav className="flex flex-col gap-1">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="drawer-item group flex items-baseline gap-4 border-b border-line py-5"
              >
                {/* Decorative index — kept out of the link's accessible name. */}
                <span aria-hidden className="font-mono text-xs text-muted">
                  0{i + 1}
                </span>
                <span className="d3 font-display group-hover:text-brand">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="drawer-foot space-y-4">
            <Link href="/contact" className="btn btn-red w-full">
              Start a project
            </Link>
            <a href={`mailto:${site.email}`} className="block text-sm text-muted">
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
