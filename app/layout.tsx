import type { Metadata } from "next";
import "./globals.css";
import { JsonLd } from "../components/JsonLd";
import { siteUrl } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nirogidhara | Ayurveda Awareness for the World",
    template: "%s | Nirogidhara"
  },
  description: "Daily bilingual Ayurveda awareness guides, original visuals, and evidence-aware wellness education.",
  openGraph: {
    type: "website",
    siteName: "Nirogidhara",
    images: ["/media/hero-water.svg"]
  },
  twitter: {
    card: "summary_large_image"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Nirogidhara",
              url: siteUrl,
              legalName: "NIROGIDHARA PRIVATE LIMITED",
              slogan: "Ayurveda awareness for the world"
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Nirogidhara",
              url: siteUrl,
              inLanguage: ["en", "hi"]
            }
          ]}
        />
        {children}
      </body>
    </html>
  );
}
