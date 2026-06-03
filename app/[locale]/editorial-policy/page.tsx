import type { Metadata } from "next";
import { medicalDisclaimer, siteUrl } from "../../../lib/site";
import type { Locale } from "../../../lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "hi" ? "Editorial Policy" : "Editorial Policy",
    description: "How Nirogidhara creates, checks, updates, and corrects Ayurveda awareness content.",
    alternates: { canonical: `${siteUrl}/${locale}/editorial-policy` }
  };
}

export default function EditorialPolicyPage() {
  return (
    <section className="page-hero section-shell content-page">
      <p>Responsible publishing</p>
      <h1>Editorial Policy</h1>
      <p>{medicalDisclaimer}</p>
      <h2>Content standards</h2>
      <p>
        Articles must be educational, practical, source-aware, and free from cure, diagnosis, treatment, prevention, or
        guaranteed-result claims. Health-sensitive statements require citations from reputable public sources.
      </p>
      <h2>Automation safeguards</h2>
      <p>
        The daily publishing engine checks duplicate topics, required SEO metadata, source count, unsafe claims, FAQ
        structure, internal links, image metadata, and social captions before publishing.
      </p>
      <h2>Corrections</h2>
      <p>
        If an article needs correction, the admin dashboard can unpublish, regenerate, or update content. Corrected
        articles should preserve their updated date and avoid silently changing health-sensitive guidance.
      </p>
    </section>
  );
}
