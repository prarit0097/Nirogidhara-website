import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostCard } from "../../../components/PostCard";
import { getPostsByTopic } from "../../../lib/db";
import { siteUrl, topicBySlug, topicUrl } from "../../../lib/site";
import type { Locale } from "../../../lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; topic: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, topic: slug } = await params;
  const locale = rawLocale as Locale;
  const topic = topicBySlug(locale, slug);
  if (!topic) {
    return {};
  }
  const title = locale === "hi" ? topic.titleHi : topic.titleEn;
  const description = locale === "hi" ? topic.descriptionHi : topic.descriptionEn;
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${topicUrl(locale, topic)}`,
      languages: {
        en: `${siteUrl}${topicUrl("en", topic)}`,
        hi: `${siteUrl}${topicUrl("hi", topic)}`
      }
    }
  };
}

export default async function TopicPage({ params }: { params: Promise<{ locale: string; topic: string }> }) {
  const { locale: rawLocale, topic: slug } = await params;
  const locale = rawLocale as Locale;
  const topic = topicBySlug(locale, slug);
  if (!topic) {
    notFound();
  }
  const posts = getPostsByTopic(locale, topic.id, 40);
  const isHindi = locale === "hi";

  return (
    <section className="page-hero section-shell">
      <p>{isHindi ? "Pillar page" : "Pillar page"}</p>
      <h1>{isHindi ? topic.titleHi : topic.titleEn}</h1>
      <p className="wide-copy">{isHindi ? topic.descriptionHi : topic.descriptionEn}</p>
      <div className="keyword-row">
        {topic.keywords.map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </div>
      <div className="post-grid blog-index">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Link className="secondary-action" href={`/${locale}/blog`}>
        {isHindi ? "सभी ब्लॉग देखें" : "View all blogs"}
      </Link>
    </section>
  );
}
