import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "../lib/types";
import { blogUrl } from "../lib/site";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="post-card">
      <Link href={blogUrl(post.locale, post.slug)} className="post-image-frame">
        <Image src={post.imagePath} alt={post.imageAlt} fill sizes="(max-width: 768px) 100vw, 34vw" loading="eager" />
      </Link>
      <div>
        <p className="mini-label">{post.targetKeyword}</p>
        <h3>
          <Link href={blogUrl(post.locale, post.slug)}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        <span className="score-chip">SEO {post.seoScore}/100</span>
      </div>
    </article>
  );
}
