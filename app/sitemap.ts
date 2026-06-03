import type { MetadataRoute } from "next";
import { getPublishedPosts } from "../lib/db";
import { blogUrl, siteUrl, topicUrl, topics } from "../lib/site";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["/en", "/hi", "/en/blog", "/hi/blog", "/en/gallery", "/hi/gallery", "/en/about", "/hi/about"];
  const topicPages = topics.flatMap((topic) => [topicUrl("en", topic), topicUrl("hi", topic)]);
  const posts = getPublishedPosts(undefined, 1000).map((post) => ({
    url: `${siteUrl}${blogUrl(post.locale, post.slug)}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.8
  }));
  return [
    ...staticPages.map((page) => ({ url: `${siteUrl}${page}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 })),
    ...topicPages.map((page) => ({ url: `${siteUrl}${page}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.86 })),
    ...posts
  ];
}
