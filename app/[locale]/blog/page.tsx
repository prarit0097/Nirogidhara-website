import type { Metadata } from "next";
import { PostCard } from "../../../components/PostCard";
import { getPublishedPosts } from "../../../lib/db";
import { siteUrl } from "../../../lib/site";
import type { Locale } from "../../../lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  return {
    title: locale === "hi" ? "आयुर्वेद ब्लॉग" : "Ayurveda Blog",
    description:
      locale === "hi"
        ? "Nirogidhara के रोज़ाना हिन्दी और English आयुर्वेद जागरूकता ब्लॉग।"
        : "Daily Nirogidhara Ayurveda awareness blogs in English and Hindi.",
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: {
        en: `${siteUrl}/en/blog`,
        hi: `${siteUrl}/hi/blog`
      }
    }
  };
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const posts = getPublishedPosts(locale, 60);
  const isHindi = locale === "hi";

  return (
    <section className="page-hero section-shell">
      <p>{isHindi ? "Daily Ayurveda SEO library" : "Daily Ayurveda SEO library"}</p>
      <h1>{isHindi ? "Nirogidhara आयुर्वेद ब्लॉग" : "Nirogidhara Ayurveda Blog"}</h1>
      <div className="post-grid blog-index">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
