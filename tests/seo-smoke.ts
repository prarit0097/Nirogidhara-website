import { existsSync } from "node:fs";
import { getLatestImages, getPublishedPosts } from "../lib/db";
import { blogUrl, topicUrl, topics } from "../lib/site";

const posts = getPublishedPosts(undefined, 100);
const images = getLatestImages(20);
const failures: string[] = [];

if (posts.length < 8) {
  failures.push(`Expected at least 8 published posts, found ${posts.length}.`);
}

for (const locale of ["en", "hi"] as const) {
  const localized = posts.filter((post) => post.locale === locale);
  if (localized.length < 4) {
    failures.push(`Expected at least 4 ${locale} posts, found ${localized.length}.`);
  }
}

for (const post of posts) {
  if (!post.metaTitle || !post.metaDescription || !post.imageAlt || !post.targetKeyword) {
    failures.push(`Missing SEO metadata for ${post.id}.`);
  }
  if (JSON.parse(post.sourcesJson).length < 3) {
    failures.push(`Missing sources for ${post.id}.`);
  }
  if (!blogUrl(post.locale, post.slug).startsWith(`/${post.locale}/blog/`)) {
    failures.push(`Bad blog URL for ${post.id}.`);
  }
}

for (const topic of topics) {
  if (!topicUrl("en", topic).startsWith("/en/") || !topicUrl("hi", topic).startsWith("/hi/")) {
    failures.push(`Bad topic URL for ${topic.id}.`);
  }
}

for (const image of images) {
  const localPath = image.path.replace(/^\//, "public/");
  if (!existsSync(localPath)) {
    failures.push(`Missing generated image file ${image.path}.`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`SEO smoke passed: ${posts.length} posts, ${images.length} images, ${topics.length} topic pillars.`);
