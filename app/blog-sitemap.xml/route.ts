import { getPublishedPosts } from "../../lib/db";
import { blogUrl, siteUrl } from "../../lib/site";

export const dynamic = "force-dynamic";

export function GET() {
  const posts = getPublishedPosts(undefined, 2000);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts
  .map(
    (post) => `  <url>
    <loc>${siteUrl}${blogUrl(post.locale, post.slug)}</loc>
    <lastmod>${post.updatedAt}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml" } });
}
