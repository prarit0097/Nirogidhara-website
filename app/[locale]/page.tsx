import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { LanguageAlternates } from "../../components/LanguageAlternates";
import { PostCard } from "../../components/PostCard";
import { TopicGrid } from "../../components/TopicGrid";
import { getLatestImages, getPublishedPosts } from "../../lib/db";
import { medicalDisclaimer, siteUrl, topicUrl, topics } from "../../lib/site";
import type { Locale } from "../../lib/types";

export const dynamic = "force-dynamic";

const editorialVisuals = [
  {
    src: "/media/ayurveda-herb-still-life.png",
    alt: "Tulsi, amla, turmeric, ashwagandha, and copper bowl in an Ayurveda still life",
    titleEn: "Herbs, rituals, and responsible learning",
    titleHi: "जड़ी-बूटियां, दिनचर्या और जिम्मेदार जानकारी",
    captionEn: "Original Nirogidhara visual for Ayurveda awareness and herb education.",
    captionHi: "आयुर्वेद जागरूकता और जड़ी-बूटी शिक्षा के लिए Nirogidhara का original visual."
  },
  {
    src: "/media/ayurveda-courtyard-wellness.png",
    alt: "Ayurveda courtyard with herbs, copper vessels, diya, and warm morning light",
    titleEn: "Daily wellness in a living Ayurveda setting",
    titleHi: "जीवंत आयुर्वेद वातावरण में daily wellness",
    captionEn: "A premium image-led direction for daily guides, gallery, and social posts.",
    captionHi: "Daily guides, gallery और social posts के लिए premium image-led direction."
  }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const isHindi = locale === "hi";
  return {
    title: isHindi ? "Nirogidhara | विश्व के लिए आयुर्वेद जागरूकता" : "Nirogidhara | Ayurveda Awareness for the World",
    description: isHindi
      ? "Nirogidhara रोज हिंदी और English में Ayurveda awareness guides, original images और responsible wellness education publish करता है."
      : "Nirogidhara publishes daily bilingual Ayurveda awareness guides, original images, and responsible wellness education.",
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        hi: `${siteUrl}/hi`
      }
    },
    openGraph: {
      title: isHindi ? "Nirogidhara | विश्व के लिए आयुर्वेद जागरूकता" : "Nirogidhara | Ayurveda Awareness for the World",
      description: isHindi
        ? "Daily bilingual Ayurveda awareness with original visuals and responsible education."
        : "Daily bilingual Ayurveda awareness with original visuals and responsible education.",
      images: [{ url: `${siteUrl}/media/ayurveda-river-hero.png`, width: 1600, height: 914, alt: "Nirogidhara Ayurveda awareness hero visual" }]
    }
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const isHindi = locale === "hi";
  const posts = getPublishedPosts(locale, 4);
  const images = getLatestImages(6);
  const featuredPost = posts[0];

  return (
    <>
      <section className="home-hero">
        <Image
          src="/media/ayurveda-river-hero.png"
          alt="Sunrise Ayurveda landscape with herbs, copper vessel, river, and temple"
          fill
          priority
          sizes="100vw"
          className="home-hero-image"
        />
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <p className="eyebrow">{isHindi ? "Living Ayurveda World" : "Living Ayurveda World"}</p>
          <h1>{isHindi ? "विश्व के लिए आयुर्वेद जागरूकता" : "Ayurveda awareness for the world"}</h1>
          <p>
            {isHindi
              ? "Nirogidhara रोज़ bilingual guides, original visuals और evidence-aware wellness education के साथ आयुर्वेद को जिम्मेदार भाषा में दुनिया तक पहुंचाता है."
              : "Nirogidhara shares Ayurveda through daily bilingual guides, original visuals, and evidence-aware wellness education for a global audience."}
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
        <div className="hero-proof">
          <span>{topics.length}</span>
          <p>{isHindi ? "SEO topic clusters" : "SEO topic clusters"}</p>
          <span>{posts.length}</span>
          <p>{isHindi ? "fresh guides shown" : "fresh guides shown"}</p>
        </div>
      </section>

      <section className="section-shell intro-band">
        <div>
          <p className="eyebrow">{isHindi ? "Brand direction" : "Brand direction"}</p>
          <h2>{isHindi ? "Premium visuals के साथ आयुर्वेद शिक्षा" : "Ayurveda education with premium visual storytelling"}</h2>
        </div>
        <p>
          {isHindi
            ? "Website का हर section अब real-looking generated Ayurveda imagery, clean typography और SEO-first content architecture पर बना है."
            : "Every section now uses real-looking generated Ayurveda imagery, cleaner typography, and an SEO-first content architecture."}
        </p>
      </section>

      <section className="section-shell visual-feature-grid" aria-label="Nirogidhara editorial visuals">
        {editorialVisuals.map((visual) => (
          <article className="visual-feature" key={visual.src}>
            <Image src={visual.src} alt={visual.alt} width={840} height={480} sizes="(max-width: 900px) 100vw, 48vw" />
            <div>
              <p className="eyebrow">{isHindi ? "Original image" : "Original image"}</p>
              <h2>{isHindi ? visual.titleHi : visual.titleEn}</h2>
              <p>{isHindi ? visual.captionHi : visual.captionEn}</p>
            </div>
          </article>
        ))}
      </section>

      <TopicGrid locale={locale} />

      <section className="section-shell magazine-section">
        <div className="section-heading">
          <p>{isHindi ? "Daily publishing engine" : "Daily publishing engine"}</p>
          <h2>{isHindi ? "रोज़ नया ब्लॉग, image और SEO-ready content" : "A fresh guide, image, and SEO-ready content every day"}</h2>
        </div>
        {featuredPost ? (
          <div className="featured-post">
            <Link href={`/${locale}/blog/${featuredPost.slug}`} className="featured-post-image">
              <Image src={featuredPost.imagePath} alt={featuredPost.imageAlt} fill sizes="(max-width: 900px) 100vw, 48vw" />
            </Link>
            <div>
              <p className="eyebrow">{featuredPost.targetKeyword}</p>
              <h3>
                <Link href={`/${locale}/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h3>
              <p>{featuredPost.excerpt}</p>
              <span className="score-chip">SEO {featuredPost.seoScore}/100</span>
            </div>
          </div>
        ) : null}
        <div className="post-grid compact-post-grid">
          {posts.slice(1).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="gallery-strip section-shell">
        <div className="section-heading">
          <p>{isHindi ? "Image SEO" : "Image SEO"}</p>
          <h2>{isHindi ? "Original Ayurveda visuals" : "Original Ayurveda visuals"}</h2>
        </div>
        <div className="gallery-grid premium-gallery">
          <figure>
            <Image src="/media/ayurveda-river-hero.png" alt="Nirogidhara Ayurveda river and herb hero visual" width={520} height={300} />
            <figcaption>{isHindi ? "Hero visual: Ayurveda, herbs, water और sunrise." : "Hero visual: Ayurveda, herbs, water, and sunrise."}</figcaption>
          </figure>
          <figure>
            <Image src="/media/ayurveda-herb-still-life.png" alt="Nirogidhara herb still life visual" width={520} height={300} />
            <figcaption>{isHindi ? "Herb education visual for evergreen blog topics." : "Herb education visual for evergreen blog topics."}</figcaption>
          </figure>
          <figure>
            <Image src="/media/ayurveda-courtyard-wellness.png" alt="Nirogidhara Ayurveda courtyard wellness visual" width={520} height={300} />
            <figcaption>{isHindi ? "Daily wellness visual for seasonal and routine guides." : "Daily wellness visual for seasonal and routine guides."}</figcaption>
          </figure>
          {images.slice(0, 3).map((image) => (
            <figure key={image.id}>
              <Image src={image.path} alt={image.alt} width={520} height={300} />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section-shell trust-band">
        <h2>{isHindi ? "जागरूकता, medical promises नहीं" : "Responsible awareness, not medical promises"}</h2>
        <p>{medicalDisclaimer}</p>
        <Link href={`/${locale}/editorial-policy`}>{isHindi ? "Editorial policy पढ़ें" : "Read editorial policy"}</Link>
      </section>
    </>
  );
}
