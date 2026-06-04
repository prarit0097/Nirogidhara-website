import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";
import { insertImage, insertJobLog, insertPost, postExists } from "../../../../lib/db";
import { topics } from "../../../../lib/site";
import type { BlogPost, GeneratedImage, Locale } from "../../../../lib/types";

export const dynamic = "force-dynamic";

type CodexPublishPayload = {
  translationGroup: string;
  image: {
    id: string;
    path: string;
    alt: string;
    caption: string;
    prompt: string;
    svg: string;
  };
  posts: Array<{
    locale: Locale;
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    excerpt: string;
    content: string;
    faq: Array<{ question: string; answer: string }>;
    topicId: string;
    targetKeyword: string;
    sources: Array<{ name: string; url: string }>;
    internalLinks: Array<{ title: string; href: string }>;
    socialCaptions: Record<string, string>;
    seoScore: number;
  }>;
};

const unsafeMedicalClaims = [
  "cure",
  "guaranteed",
  "treats cancer",
  "treat cancer",
  "diabetes cure",
  "cures diabetes",
  "permanent cure",
  "100% result"
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanSlug(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().toLowerCase();
}

function stringValue(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function arrayValue<T>(value: unknown, mapper: (item: unknown) => T | null, maxItems: number) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(mapper).filter((item): item is T => Boolean(item)).slice(0, maxItems);
}

function parsePayload(input: unknown): CodexPublishPayload {
  if (!isRecord(input) || !isRecord(input.image)) {
    throw new Error("Invalid payload shape.");
  }

  const translationGroup = stringValue(input.translationGroup, 90);
  const imagePath = stringValue(input.image.path, 120);
  const svg = stringValue(input.image.svg, 80_000);

  if (!translationGroup.startsWith("codex-")) {
    throw new Error("translationGroup must start with codex-.");
  }
  if (!/^\/generated\/codex-[a-z0-9-]+\.svg$/.test(imagePath)) {
    throw new Error("image.path must be /generated/codex-*.svg.");
  }
  if (!svg.startsWith("<svg") || !svg.includes("</svg>")) {
    throw new Error("image.svg must be a complete SVG document.");
  }

  const posts = arrayValue(
    input.posts,
    (item) => {
      if (!isRecord(item)) {
        return null;
      }
      const locale: Locale | null = item.locale === "en" || item.locale === "hi" ? item.locale : null;
      const topicId = stringValue(item.topicId, 60);
      if (!locale || !topics.some((topic) => topic.id === topicId)) {
        return null;
      }
      return {
        locale,
        slug: cleanSlug(item.slug),
        title: stringValue(item.title, 140),
        metaTitle: stringValue(item.metaTitle, 150),
        metaDescription: stringValue(item.metaDescription, 180),
        excerpt: stringValue(item.excerpt, 260),
        content: stringValue(item.content, 24_000),
        faq: arrayValue(
          item.faq,
          (faqItem) =>
            isRecord(faqItem)
              ? {
                  question: stringValue(faqItem.question, 180),
                  answer: stringValue(faqItem.answer, 500)
                }
              : null,
          6
        ),
        topicId,
        targetKeyword: stringValue(item.targetKeyword, 90),
        sources: arrayValue(
          item.sources,
          (source) =>
            isRecord(source)
              ? {
                  name: stringValue(source.name, 120),
                  url: stringValue(source.url, 320)
                }
              : null,
          8
        ),
        internalLinks: arrayValue(
          item.internalLinks,
          (link) =>
            isRecord(link)
              ? {
                  title: stringValue(link.title, 120),
                  href: stringValue(link.href, 180)
                }
              : null,
          6
        ),
        socialCaptions: isRecord(item.socialCaptions)
          ? Object.fromEntries(
              Object.entries(item.socialCaptions).map(([key, value]) => [key, stringValue(value, 420)])
            )
          : {},
        seoScore: Number.isFinite(Number(item.seoScore)) ? Math.round(Number(item.seoScore)) : 0
      };
    },
    2
  );

  if (posts.length !== 2 || !posts.some((post) => post.locale === "en") || !posts.some((post) => post.locale === "hi")) {
    throw new Error("Payload must include exactly one English and one Hindi post.");
  }

  for (const post of posts) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
      throw new Error(`Invalid slug for ${post.locale}.`);
    }
    if (post.content.length < 1_500 || post.sources.length < 3 || post.faq.length < 3 || post.seoScore < 75) {
      throw new Error(`Post quality gate failed for ${post.locale}.`);
    }
    const lowerText = `${post.title}\n${post.excerpt}\n${post.content}`.toLowerCase();
    if (unsafeMedicalClaims.some((claim) => lowerText.includes(claim))) {
      throw new Error(`Unsafe medical claim detected for ${post.locale}.`);
    }
  }

  return {
    translationGroup,
    image: {
      id: stringValue(input.image.id, 110) || `${translationGroup}-image`,
      path: imagePath,
      alt: stringValue(input.image.alt, 180),
      caption: stringValue(input.image.caption, 220),
      prompt: stringValue(input.image.prompt, 1_200),
      svg
    },
    posts
  };
}

async function writeGeneratedSvg(path: string, svg: string) {
  const relativePath = normalize(path.replace(/^\/+/, ""));
  const target = join(process.cwd(), "public", relativePath);
  const generatedRoot = join(process.cwd(), "public", "generated");
  if (!target.startsWith(generatedRoot)) {
    throw new Error("Refusing to write outside public/generated.");
  }
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, svg, "utf8");
}

export async function POST(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const supplied = request.headers.get("x-cron-secret");
    if (supplied !== expected) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const payload = parsePayload(await request.json());
    const now = new Date().toISOString();
    const duplicates = payload.posts.filter((post) => postExists(post.locale, post.slug));
    if (duplicates.length > 0) {
      return Response.json(
        { status: "skipped", message: "One or more posts already exist.", duplicates: duplicates.map((post) => post.slug) },
        { status: 409 }
      );
    }

    await writeGeneratedSvg(payload.image.path, payload.image.svg);

    const image: GeneratedImage = {
      id: payload.image.id,
      postGroup: payload.translationGroup,
      path: payload.image.path,
      alt: payload.image.alt,
      caption: payload.image.caption,
      prompt: payload.image.prompt,
      createdAt: now
    };
    insertImage(image);

    const posts: BlogPost[] = payload.posts.map((post) => ({
      id: `${payload.translationGroup}-${post.locale}`,
      locale: post.locale,
      translationGroup: payload.translationGroup,
      slug: post.slug,
      title: post.title,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      excerpt: post.excerpt,
      content: post.content,
      faqJson: JSON.stringify(post.faq),
      topicId: post.topicId,
      targetKeyword: post.targetKeyword,
      imagePath: payload.image.path,
      imageAlt: payload.image.alt,
      imageCaption: payload.image.caption,
      sourcesJson: JSON.stringify(post.sources),
      internalLinksJson: JSON.stringify(post.internalLinks),
      socialCaptionsJson: JSON.stringify(post.socialCaptions),
      seoScore: post.seoScore,
      status: "published",
      safetyNotes: "Published by Codex-side automation after endpoint quality gates.",
      createdAt: now,
      publishedAt: now,
      updatedAt: now
    }));

    for (const post of posts) {
      insertPost(post);
    }

    insertJobLog({
      id: `job-${Date.now()}-${payload.translationGroup}`,
      jobType: "codex-daily-publish",
      status: "success",
      message: `Published Codex-generated bilingual post group ${payload.translationGroup}.`,
      detailJson: JSON.stringify({ image: image.path, posts: posts.map((post) => ({ locale: post.locale, slug: post.slug })) }),
      createdAt: now
    });

    return Response.json({ status: "success", group: payload.translationGroup, posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Codex publish error.";
    insertJobLog({
      id: `job-${Date.now()}-codex-publish-failed`,
      jobType: "codex-daily-publish",
      status: "failed",
      message,
      detailJson: "{}",
      createdAt: new Date().toISOString()
    });
    return Response.json({ status: "failed", message }, { status: 400 });
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    schedule: "Codex-side Windows Task Scheduler at 07:00 Asia/Kolkata",
    endpoint: "POST /api/automation/codex-publish"
  });
}
