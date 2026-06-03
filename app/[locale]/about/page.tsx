import type { Metadata } from "next";
import { siteUrl } from "../../../lib/site";
import type { Locale } from "../../../lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "hi" ? "Nirogidhara के बारे में" : "About Nirogidhara",
    description: "Nirogidhara mission, legal identity, and Ayurveda awareness principles.",
    alternates: { canonical: `${siteUrl}/${locale}/about` }
  };
}

export default function AboutPage() {
  return (
    <section className="page-hero section-shell content-page">
      <p>Mission and authority</p>
      <h1>About Nirogidhara</h1>
      <p>
        Nirogidhara exists to spread responsible Ayurveda awareness globally through daily bilingual guides, original
        visuals, and practical wellness education. The platform does not sell products, provide diagnosis, or replace
        professional medical care.
      </p>
      <div className="authority-grid">
        <article>
          <h2>Legal identity</h2>
          <p>Legal name: NIROGIDHARA PRIVATE LIMITED</p>
          <p>CIN: U47721RJ2024PTC097240</p>
          <p>Registered office: Sriganganagar, Rajasthan, India.</p>
        </article>
        <article>
          <h2>Editorial ownership</h2>
          <p>
            Founder/editor profiles can be added here after the team confirms public bios, credentials, and approved
            portraits.
          </p>
        </article>
      </div>
    </section>
  );
}
