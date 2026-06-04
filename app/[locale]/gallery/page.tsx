import Image from "next/image";
import type { Metadata } from "next";
import { getLatestImages } from "../../../lib/db";
import { premiumVisuals, siteUrl } from "../../../lib/site";
import type { Locale } from "../../../lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  return {
    title: locale === "hi" ? "आयुर्वेद इमेज गैलरी" : "Ayurveda Image Gallery",
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
  const images = getLatestImages(12);

  return (
    <section className="page-hero section-shell">
      <p>{isHindi ? "Original visual library" : "Original visual library"}</p>
      <h1>{isHindi ? "Nirogidhara आयुर्वेद इमेज गैलरी" : "Nirogidhara Ayurveda Image Gallery"}</h1>
      <p className="wide-copy">
        {isHindi
          ? "Premium Ayurveda visuals, daily image SEO assets और awareness content के लिए curated gallery."
          : "A curated gallery of premium Ayurveda visuals, daily image SEO assets, and awareness content."}
      </p>

      <div className="gallery-grid large premium-gallery">
        {premiumVisuals.map((visual) => (
          <figure key={visual.src}>
            <Image src={visual.src} alt={visual.alt} width={600} height={338} priority />
            <figcaption>{isHindi ? visual.captionHi : visual.captionEn}</figcaption>
          </figure>
        ))}
      </div>

      <div className="section-heading gallery-subheading">
        <p>{isHindi ? "Daily generated archive" : "Daily generated archive"}</p>
        <h2>{isHindi ? "Automation से बनी images" : "Images from the automation archive"}</h2>
      </div>
      <div className="gallery-grid archive-gallery">
        {images.map((image) => (
          <figure key={image.id}>
            <Image src={image.path} alt={image.alt} width={600} height={315} />
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
