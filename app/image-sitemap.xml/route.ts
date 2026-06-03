import { getPublishedPosts } from "../../lib/db";
import { blogUrl, siteUrl } from "../../lib/site";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function GET() {
  const posts = getPublishedPosts(undefined, 2000);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${posts
  .map(
    (post) => `  <url>
    <loc>${siteUrl}${blogUrl(post.locale, post.slug)}</loc>
    <image:image>
      <image:loc>${siteUrl}${post.imagePath}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
      <image:caption>${escapeXml(post.imageCaption)}</image:caption>
    </image:image>
  </url>`
  )
  .join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml" } });
}
