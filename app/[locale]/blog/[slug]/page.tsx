import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "../../../../components/JsonLd";
import { markdownToHtml, readingTime } from "../../../../lib/markdown";
import { getPost, getPublishedPosts } from "../../../../lib/db";
import { blogUrl, siteUrl, topicUrl, topics } from "../../../../lib/site";
import type { Locale } from "../../../../lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const post = getPost(locale, slug);
  if (!post) {
    return {};
  }
  const alternate = getPublishedPosts(locale === "en" ? "hi" : "en", 100).find(
    (candidate) => candidate.translationGroup === post.translationGroup
  );
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `${siteUrl}${blogUrl(locale, post.slug)}`,
      languages: {
        en: locale === "en" ? `${siteUrl}${blogUrl("en", post.slug)}` : alternate ? `${siteUrl}${blogUrl("en", alternate.slug)}` : undefined,
        hi: locale === "hi" ? `${siteUrl}${blogUrl("hi", post.slug)}` : alternate ? `${siteUrl}${blogUrl("hi", alternate.slug)}` : undefined
      }
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.imagePath],
      type: "article",
      publishedTime: post.publishedAt ?? post.createdAt
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.imagePath]
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const post = getPost(locale, slug);
  if (!post || post.status !== "published") {
    notFound();
  }
  const topic = topics.find((item) => item.id === post.topicId) ?? topics[0];
  const sources = JSON.parse(post.sourcesJson) as { name: string; url: string }[];
  const faq = JSON.parse(post.faqJson) as { question: string; answer: string }[];
  const links = JSON.parse(post.internalLinksJson) as { title: string; href: string }[];
  const html = markdownToHtml(post.content);
  const isHindi = locale === "hi";

  return (
    <article className="article-shell">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.metaDescription,
            image: `${siteUrl}${post.imagePath}`,
            datePublished: post.publishedAt ?? post.createdAt,
            dateModified: post.updatedAt,
            author: { "@type": "Organization", name: "Nirogidhara" },
            publisher: { "@type": "Organization", name: "Nirogidhara" },
            mainEntityOfPage: `${siteUrl}${blogUrl(locale, post.slug)}`,
            inLanguage: locale
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer }
            }))
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/${locale}` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/${locale}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}${blogUrl(locale, post.slug)}` }
            ]
          }
        ]}
      />
      <header className="article-header">
        <p>{isHindi ? topic.titleHi : topic.titleEn}</p>
        <h1>{post.title}</h1>
        <div className="article-meta">
          <span>{readingTime(post.content)} min read</span>
          <span>SEO {post.seoScore}/100</span>
          <span>{new Date(post.updatedAt).toLocaleDateString(locale === "hi" ? "hi-IN" : "en-US")}</span>
        </div>
      </header>
      <figure className="article-image">
        <Image src={post.imagePath} alt={post.imageAlt} width={1200} height={630} priority />
        <figcaption>{post.imageCaption}</figcaption>
      </figure>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
      <aside className="article-aside">
        <section>
          <h2>{isHindi ? "Internal links" : "Internal links"}</h2>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.title}
            </Link>
          ))}
          <Link href={topicUrl(locale, topic)}>{isHindi ? "Topic pillar" : "Topic pillar"}</Link>
        </section>
        <section>
          <h2>{isHindi ? "Sources" : "Sources"}</h2>
          {sources.map((source) => (
            <a key={source.url} href={source.url} rel="noreferrer" target="_blank">
              {source.name}
            </a>
          ))}
        </section>
      </aside>
    </article>
  );
}
