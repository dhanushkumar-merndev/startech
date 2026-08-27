import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Cursor } from "@/components/cursor";
import { ScrollManager } from "@/components/scroll-manager";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-star-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-star-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://startechindia.com"),
  title: {
    default: `${site.name} —  CRM & Software Development`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  keywords: [
    "website development Chennai",
    "CRM and lead management India",
    "mobile app development Chennai",
    "business automation India",
    "custom ERP software Chennai",
    "Star Tech India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: `${site.name} —  CRM & Software Development`,
    description: site.tagline,
  },
  twitter: { card: "summary_large_image" },
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper">
        {/* GSAP animates these from a hidden resting state. With scripting
            unavailable nothing would ever reveal them, so hand the content
            straight back. */}
        <noscript>
          <style>{`.reveal,.site-header,.hero-cta>*{opacity:1!important;transform:none!important}.split-hold{visibility:visible!important}.hero-rule{transform:scaleX(1)!important}`}</style>
        </noscript>

        <Cursor />
        <ScrollManager />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
