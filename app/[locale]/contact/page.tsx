import type { Metadata } from "next";
import { siteUrl } from "../../../lib/site";
import type { Locale } from "../../../lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "hi" ? "Contact Nirogidhara" : "Contact Nirogidhara",
    description: "Contact Nirogidhara for Ayurveda awareness, corrections, and editorial questions.",
    alternates: { canonical: `${siteUrl}/${locale}/contact` }
  };
}

export default function ContactPage() {
  return (
    <section className="page-hero section-shell content-page">
      <p>Corrections and contact</p>
      <h1>Contact Nirogidhara</h1>
      <p>
        For corrections, editorial questions, social collaboration, or Ayurveda awareness partnerships, contact the team
        at <a href="mailto:nirogidhara@gmail.com">nirogidhara@gmail.com</a>.
      </p>
      <p>
        Add a domain email such as <strong>care@nirogidhara.com</strong> after DNS and mail hosting are configured.
      </p>
    </section>
  );
}
