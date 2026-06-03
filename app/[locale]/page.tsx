import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { HeroScene } from "../../components/HeroScene";
import { LanguageAlternates } from "../../components/LanguageAlternates";
import { PostCard } from "../../components/PostCard";
import { TopicGrid } from "../../components/TopicGrid";
import { getLatestImages, getPublishedPosts } from "../../lib/db";
import { medicalDisclaimer, siteUrl, topicUrl, topics } from "../../lib/site";
import type { Locale } from "../../lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const isHindi = locale === "hi";
  return {
    title: isHindi ? "Nirogidhara | विश्व के लिए आयुर्वेद जागरूकता" : "Nirogidhara | Ayurveda Awareness for the World",
    description: isHindi
      ? "Nirogidhara रोज़ हिन्दी और English में आयुर्वेद जागरूकता, original images और responsible wellness education publish करता है।"
      : "Nirogidhara publishes daily bilingual Ayurveda awareness guides, original images, and responsible wellness education.",
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        hi: `${siteUrl}/hi`
      }
    }
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const isHindi = locale === "hi";
  const posts = getPublishedPosts(locale, 4);
  const images = getLatestImages(6);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>{isHindi ? "विश्व के लिए आयुर्वेद जागरूकता" : "Ayurveda awareness for the world"}</h1>
          <p>
            {isHindi
              ? "Daily bilingual guides, original visuals और evidence-aware wellness education के साथ Nirogidhara आयुर्वेद को जिम्मेदार भाषा में दुनिया तक पहुंचाता है।"
              : "Daily bilingual guides, original visuals, and evidence-aware wellness education that share Ayurveda with responsible global language."}
          </p>
          <div className="hero-actions">
            <Link href={`/${locale}/blog`} className="primary-action">
              {isHindi ? "आज का ब्लॉग पढ़ें" : "Read today's guide"}
            </Link>
            <Link href={topicUrl(locale, topics[0])} className="secondary-action">
              {isHindi ? "आयुर्वेद सीखें" : "Start learning Ayurveda"}
            </Link>
          </div>
          <LanguageAlternates current={locale} enHref="/en" hiHref="/hi" />
        </div>
        <HeroScene />
        <div className="hero-next">
          <span>{isHindi ? "SEO pillars" : "SEO pillars"}</span>
          <strong>{topics.length}</strong>
          <span>{isHindi ? "knowledge clusters" : "knowledge clusters"}</span>
        </div>
      </section>

      <TopicGrid locale={locale} />

      <section className="section-shell split-section">
        <div className="section-heading">
          <p>{isHindi ? "Daily publishing engine" : "Daily publishing engine"}</p>
          <h2>{isHindi ? "रोज़ नया ब्लॉग और original image" : "A fresh guide and original image every day"}</h2>
        </div>
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="gallery-strip section-shell">
        <div className="section-heading">
          <p>{isHindi ? "Image SEO" : "Image SEO"}</p>
          <h2>{isHindi ? "Original Ayurveda visuals" : "Original Ayurveda visuals"}</h2>
        </div>
        <div className="gallery-grid">
          {images.map((image) => (
            <figure key={image.id}>
              <Image src={image.path} alt={image.alt} width={420} height={220} loading="eager" />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section-shell trust-band">
        <h2>{isHindi ? "Responsible awareness, not medical promises" : "Responsible awareness, not medical promises"}</h2>
        <p>{medicalDisclaimer}</p>
        <Link href={`/${locale}/editorial-policy`}>{isHindi ? "Editorial policy पढ़ें" : "Read editorial policy"}</Link>
      </section>
    </>
  );
}
