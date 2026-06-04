import Image from "next/image";
import type { Metadata } from "next";
import { premiumVisuals, siteUrl } from "../../../lib/site";
import type { Locale } from "../../../lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  return {
    title: locale === "hi" ? "Ayurveda Image Gallery" : "Ayurveda Image Gallery",
    description: "Original Nirogidhara Ayurveda awareness images generated for daily education.",
    alternates: {
      canonical: `${siteUrl}/${locale}/gallery`
    }
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const isHindi = locale === "hi";

  return (
    <section className="page-hero section-shell">
      <p>{isHindi ? "Curated visual library" : "Curated visual library"}</p>
      <h1>{isHindi ? "Nirogidhara Ayurveda Image Gallery" : "Nirogidhara Ayurveda Image Gallery"}</h1>
      <p className="wide-copy">
        {isHindi
          ? "Premium Ayurveda visuals, image SEO assets aur awareness content ke liye curated gallery."
          : "A curated gallery of premium Ayurveda visuals, image SEO assets, and awareness content."}
      </p>

      <div className="gallery-grid large premium-gallery">
        {premiumVisuals.map((visual) => (
          <figure key={visual.src}>
            <Image src={visual.src} alt={visual.alt} width={600} height={338} priority />
            <figcaption>{isHindi ? visual.captionHi : visual.captionEn}</figcaption>
          </figure>
        ))}
      </div>

      <p className="gallery-note">
        {isHindi
          ? "Daily generated archive ko quality review ke baad public gallery me add kiya jayega."
          : "The daily generated archive will be added back to the public gallery after quality review."}
      </p>
    </section>
  );
}
