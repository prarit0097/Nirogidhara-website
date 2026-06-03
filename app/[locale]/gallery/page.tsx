import Image from "next/image";
import type { Metadata } from "next";
import { getLatestImages } from "../../../lib/db";
import { siteUrl } from "../../../lib/site";
import type { Locale } from "../../../lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "hi" ? "आयुर्वेद इमेज गैलरी" : "Ayurveda Image Gallery",
    description: "Original Nirogidhara Ayurveda awareness images generated for daily education.",
    alternates: {
      canonical: `${siteUrl}/${locale}/gallery`
    }
  };
}

export default function GalleryPage() {
  const images = getLatestImages(60);
  return (
    <section className="page-hero section-shell">
      <p>Original visual library</p>
      <h1>Nirogidhara Ayurveda Image Gallery</h1>
      <div className="gallery-grid large">
        {images.map((image) => (
          <figure key={image.id}>
            <Image src={image.path} alt={image.alt} width={600} height={315} loading="eager" />
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
