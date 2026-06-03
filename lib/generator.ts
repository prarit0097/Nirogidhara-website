import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  automationPaused,
  getPublishedPosts,
  insertImage,
  insertJobLog,
  insertPost,
  postExists,
  upsertSocialPost
} from "./db";
import { blogUrl, siteUrl, topicUrl, topics } from "./site";
import type { BlogPost, GeneratedImage, Locale, SocialPost, Topic } from "./types";

const blockedClaims = [
  "cure",
  "guarantee",
  "treats disease",
  "prevents disease",
  "permanent weight loss",
  "instant fat loss",
  "diagnose",
  "इलाज",
  "गारंटी",
  "बीमारी ठीक",
  "स्थायी वजन"
];

const sources = [
  {
    name: "FSSAI health supplements guidance",
    url: "https://fssai.gov.in/cms/health-supplements.php"
  },
  {
    name: "FSSAI Advertising and Claims Regulations",
    url: "https://www.fssai.gov.in/upload/uploadfiles/files/Compendium_Advertising_Claims_Regulations_04_03_2021.pdf"
  },
  {
    name: "FSSAI Ayurveda Aahara Regulations",
    url: "https://www.fssai.gov.in/upload/notifications/2022/05/62789a20b54bdGazette_Notification_Ayurveda_Aahara_09_05_2022.pdf"
  },
  {
    name: "WHO traditional medicine overview",
    url: "https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine"
  }
];

const englishAngles = [
  "simple morning rhythm",
  "food timing awareness",
  "seasonal balance",
  "herb literacy",
  "sleep-friendly evening habits",
  "hydration and mindful eating",
  "stress-aware breathing pauses",
  "global Ayurveda vocabulary"
];

const hindiAngles = [
  "सरल सुबह की लय",
  "भोजन समय की समझ",
  "मौसम के अनुसार संतुलन",
  "जड़ी-बूटी जागरूकता",
  "नींद के लिए शाम की आदतें",
  "जल और mindful eating",
  "तनाव में छोटी श्वास विराम",
  "वैश्विक आयुर्वेद शब्दावली"
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 78);
}

function hash(input: string) {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0;
  }
  return value.toString(36);
}

function chooseTopic(now: Date) {
  const daySeed = Math.floor(now.getTime() / 86_400_000);
  return topics[daySeed % topics.length];
}

function chooseAngle(now: Date, locale: Locale) {
  const daySeed = Math.floor(now.getTime() / 86_400_000);
  const list = locale === "en" ? englishAngles : hindiAngles;
  return list[daySeed % list.length];
}

function buildTitle(topic: Topic, locale: Locale, angle: string) {
  if (locale === "hi") {
    return `${topic.titleHi}: ${angle} के लिए आयुर्वेदिक जागरूकता`;
  }
  return `${topic.titleEn}: Ayurveda awareness for ${angle}`;
}

function buildContent(topic: Topic, locale: Locale, angle: string) {
  if (locale === "hi") {
    return `## आज का विचार
${topic.titleHi} आयुर्वेद को रोजमर्रा की भाषा में समझने का एक शांत और व्यावहारिक तरीका है। ${angle} जैसे छोटे विषय हमें याद दिलाते हैं कि wellness केवल एक बड़ा संकल्प नहीं, बल्कि रोज की छोटी समझदार आदतों से बनती है।

## आयुर्वेदिक दृष्टि
आयुर्वेद शरीर, मन, भोजन, मौसम और दिनचर्या को अलग-अलग हिस्सों की तरह नहीं देखता। इसका मूल संदेश संतुलन, नियमितता और जागरूकता है। इस लेख का उद्देश्य शिक्षा है, कोई चिकित्सा सलाह नहीं।

## आज अपनाने योग्य सुरक्षित अभ्यास
- अपने दिन की शुरुआत धीमी गति से करें और शरीर की अवस्था को देखें।
- भोजन के समय जल्दबाजी कम करें और स्वाद, भूख तथा तृप्ति पर ध्यान दें।
- मौसम और अपनी ऊर्जा के अनुसार routine को थोड़ा नरम या सक्रिय बनाएं।
- किसी भी herb, supplement या intense routine को medical condition में अपनाने से पहले qualified professional से सलाह लें।

## क्यों यह बात global audience के लिए जरूरी है
दुनिया भर में लोग natural wellness के बारे में जानना चाहते हैं, लेकिन exaggerated claims confusion पैदा करते हैं। Nirogidhara का उद्देश्य Ayurveda को responsible, practical और evidence-aware भाषा में फैलाना है।

## FAQs
### क्या यह चिकित्सा सलाह है?
नहीं। यह केवल educational awareness content है।

### क्या Ayurveda daily routine में helpful हो सकता है?
Ayurveda routine, observation और balance की भाषा देता है। Personal health decisions qualified professional के साथ लेने चाहिए।

### क्या herbs सभी के लिए safe होती हैं?
नहीं। Herbs भी शरीर, age, medication और condition के अनुसार अलग असर कर सकती हैं।`;
  }

  return `## Today's idea
${topic.titleEn} is a practical doorway into Ayurveda for modern readers. A small theme like ${angle} can make wellness feel less like a trend and more like a daily language of attention.

## The Ayurveda perspective
Ayurveda does not separate food, rest, season, mind, and routine into isolated boxes. Its enduring message is balance, rhythm, observation, and context. This article is educational awareness, not medical advice.

## Safe practices to explore today
- Begin the day slowly enough to notice your energy, appetite, and mental pace.
- Eat without rushing, and pay attention to hunger, taste, and fullness.
- Adjust routine gently by season instead of forcing the same pattern every day.
- Speak with a qualified professional before using herbs, supplements, or intense routines if you have a medical condition, pregnancy, or medication use.

## Why this matters globally
People around the world are searching for natural wellness education, but exaggerated claims create confusion. Nirogidhara exists to share Ayurveda in language that is practical, responsible, and evidence-aware.

## FAQs
### Is this medical advice?
No. Nirogidhara publishes educational awareness content only.

### Can Ayurveda support daily routine awareness?
Ayurveda offers a vocabulary for rhythm, observation, and balance. Personal health decisions should be made with a qualified professional.

### Are herbs safe for everyone?
No. Herbs can interact with age, medication, body context, and health conditions.`;
}

function extractFaq(content: string) {
  const matches = [...content.matchAll(/### (.*?)\n([\s\S]*?)(?=\n### |\n## |$)/g)];
  return matches.map((match) => ({ question: match[1].trim(), answer: match[2].trim() }));
}

function qualityGate(post: Pick<BlogPost, "title" | "content" | "sourcesJson" | "targetKeyword" | "metaDescription">) {
  const text = `${post.title} ${post.content} ${post.metaDescription}`.toLowerCase();
  const blocked = blockedClaims.filter((claim) => text.includes(claim.toLowerCase()));
  const sourceCount = JSON.parse(post.sourcesJson).length;
  const score =
    45 +
    Math.min(20, Math.round(post.content.length / 120)) +
    (post.targetKeyword ? 10 : 0) +
    (sourceCount >= 3 ? 10 : 0) +
    (extractFaq(post.content).length >= 2 ? 10 : 0);
  return {
    passed: blocked.length === 0 && sourceCount >= 3 && score >= 75,
    blocked,
    score: Math.min(score, 100)
  };
}

function buildSvgImage(topic: Topic, locale: Locale, title: string, fileName: string) {
  const folder = join(process.cwd(), "public", "generated");
  if (!existsSync(folder)) {
    mkdirSync(folder, { recursive: true });
  }
  const sunX = 760 + (hash(title).charCodeAt(0) % 90);
  const leafRotation = (hash(fileName).charCodeAt(0) % 28) - 14;
  const escapeSvg = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const shortTitle = escapeSvg(title).slice(0, 72);
  const topicLabel = escapeSvg(locale === "hi" ? topic.titleHi : topic.titleEn);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img">
  <defs>
    <radialGradient id="sun" cx="70%" cy="30%" r="34%">
      <stop offset="0" stop-color="#ffe7a3"/>
      <stop offset=".48" stop-color="#d48a36"/>
      <stop offset="1" stop-color="#071a16"/>
    </radialGradient>
    <linearGradient id="river" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#12322d"/>
      <stop offset=".48" stop-color="#40886f"/>
      <stop offset="1" stop-color="#d4a34b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#071a16"/>
  <circle cx="${sunX}" cy="168" r="220" fill="url(#sun)" opacity=".95"/>
  <path d="M-80 452 C190 335 360 545 620 432 C835 338 990 398 1280 286 L1280 700 L-80 700Z" fill="url(#river)" opacity=".8"/>
  <path d="M-20 498 C238 380 385 568 656 476 C860 405 990 455 1230 355" fill="none" stroke="#f1d183" stroke-width="5" opacity=".48"/>
  <g transform="translate(150 390) rotate(${leafRotation})" fill="#8cad63">
    <ellipse cx="0" cy="-62" rx="20" ry="78"/>
    <ellipse cx="-48" cy="-28" rx="18" ry="68" transform="rotate(-34)"/>
    <ellipse cx="48" cy="-24" rx="18" ry="68" transform="rotate(34)"/>
    <rect x="-4" y="-20" width="8" height="160" rx="4" fill="#c98f45"/>
  </g>
  <g stroke="#c78b43" stroke-width="2" fill="none" opacity=".34" transform="translate(945 410)">
    <circle r="86"/><circle r="54"/><path d="M0-105V105M-105 0H105M-74-74L74 74M74-74L-74 74"/>
  </g>
  <text x="74" y="104" fill="#f6e8c7" font-family="Georgia, serif" font-size="36" letter-spacing="2">NIROGIDHARA</text>
  <text x="74" y="166" fill="#ffe19a" font-family="Georgia, serif" font-size="54" font-weight="700">${shortTitle}</text>
  <text x="76" y="224" fill="#d3e2cf" font-family="Arial, sans-serif" font-size="25">${topicLabel} • Daily Ayurveda Awareness</text>
</svg>`;
  writeFileSync(join(folder, fileName), svg, "utf8");
}

async function buildOpenAiImage(prompt: string, fileName: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1",
      prompt,
      size: "1536x1024",
      quality: "medium",
      background: "opaque"
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI image generation failed: ${response.status} ${await response.text()}`);
  }

  const payload = (await response.json()) as { data?: { b64_json?: string; url?: string }[] };
  const item = payload.data?.[0];
  if (!item?.b64_json) {
    throw new Error("OpenAI image response did not include b64_json.");
  }

  const folder = join(process.cwd(), "public", "generated");
  if (!existsSync(folder)) {
    mkdirSync(folder, { recursive: true });
  }
  writeFileSync(join(folder, fileName), Buffer.from(item.b64_json, "base64"));
  return `/generated/${fileName}`;
}

async function createImageAsset(topic: Topic, group: string, date: Date) {
  const prompt = `Create a premium editorial Ayurveda awareness image for Nirogidhara. Theme: ${topic.titleEn}. Living Ayurveda World: realistic herbs, flowing clear water, warm sun, earth textures, copper mandala geometry, global wellness mood, no product packaging, no medical claims, no sales message. Include subtle brand text "Nirogidhara" only if clean and accurate.`;
  const pngName = `${group}.png`;
  try {
    const openAiPath = await buildOpenAiImage(prompt, pngName);
    if (openAiPath) {
      return { path: openAiPath, prompt, mode: "openai" };
    }
  } catch (error) {
    insertJobLog({
      id: `job-${Date.now()}-${group}-image-fallback`,
      jobType: "image-generation",
      status: "failed",
      message: "OpenAI image generation failed; SVG fallback used.",
      detailJson: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      createdAt: new Date().toISOString()
    });
  }

  const svgName = `${group}.svg`;
  buildSvgImage(topic, "en", buildTitle(topic, "en", chooseAngle(date, "en")), svgName);
  return {
    path: `/generated/${svgName}`,
    prompt: `${prompt} Fallback rendered as original SVG.`,
    mode: "svg"
  };
}

function buildPost(locale: Locale, topic: Topic, group: string, now: Date, imagePath: string): BlogPost {
  const angle = chooseAngle(now, locale);
  const title = buildTitle(topic, locale, angle);
  const slugBase =
    locale === "en"
      ? slugify(`${topic.slugEn}-${angle}-${now.toISOString().slice(0, 10)}`)
      : slugify(`${topic.slugEn}-${hash(`${title}-${now.toISOString().slice(0, 10)}`)}`);
  const content = buildContent(topic, locale, angle);
  const targetKeyword = locale === "en" ? topic.keywords[0] : `${topic.titleHi} आयुर्वेद`;
  const publishedAt = now.toISOString();
  const sourceJson = JSON.stringify(sources);
  const related = topics
    .filter((candidate) => candidate.id !== topic.id)
    .slice(0, 3)
    .map((candidate) => ({
      title: locale === "en" ? candidate.titleEn : candidate.titleHi,
      href: topicUrl(locale, candidate)
    }));
  const socialCaptions = {
    linkedin:
      locale === "en"
        ? `${title}\n\nRead today's Nirogidhara Ayurveda awareness guide: ${siteUrl}${blogUrl(locale, slugBase)}`
        : `${title}\n\nआज की Nirogidhara आयुर्वेद जागरूकता गाइड पढ़ें: ${siteUrl}${blogUrl(locale, slugBase)}`,
    instagram:
      locale === "en"
        ? `${title}\n\n#Nirogidhara #Ayurveda #WellnessEducation`
        : `${title}\n\n#Nirogidhara #Ayurveda #HindiWellness`,
    facebook: `${title}\n${siteUrl}${blogUrl(locale, slugBase)}`,
    youtube: `${title} | Nirogidhara daily Ayurveda awareness`
  };

  const draft = {
    title,
    content,
    sourcesJson: sourceJson,
    targetKeyword,
    metaDescription:
      locale === "en"
        ? `A practical Nirogidhara guide to ${topic.titleEn.toLowerCase()} through ${angle}, written for Ayurveda awareness.`
        : `${topic.titleHi} और ${angle} पर Nirogidhara की शैक्षिक आयुर्वेद जागरूकता गाइड।`
  };
  const gate = qualityGate(draft);

  return {
    id: `${group}-${locale}`,
    locale,
    translationGroup: group,
    slug: slugBase,
    title,
    metaTitle: `${title} | Nirogidhara`,
    metaDescription: draft.metaDescription,
    excerpt:
      locale === "en"
        ? `Explore ${topic.titleEn.toLowerCase()} with a practical, evidence-aware Ayurveda lens.`
        : `${topic.titleHi} को सरल, सुरक्षित और जागरूक आयुर्वेदिक दृष्टि से समझें।`,
    content,
    faqJson: JSON.stringify(extractFaq(content)),
    topicId: topic.id,
    targetKeyword,
    imagePath,
    imageAlt:
      locale === "en"
        ? `Original Nirogidhara Ayurveda visual for ${topic.titleEn}`
        : `${topic.titleHi} के लिए Nirogidhara की मूल आयुर्वेदिक छवि`,
    imageCaption:
      locale === "en"
        ? `Daily Nirogidhara visual for ${topic.titleEn}.`
        : `${topic.titleHi} के लिए Nirogidhara की दैनिक छवि।`,
    sourcesJson: sourceJson,
    internalLinksJson: JSON.stringify([{ title: locale === "en" ? topic.titleEn : topic.titleHi, href: topicUrl(locale, topic) }, ...related]),
    socialCaptionsJson: JSON.stringify(socialCaptions),
    seoScore: gate.score,
    status: gate.passed ? "published" : "blocked",
    safetyNotes: gate.passed ? "Passed automated safety and SEO gates." : `Blocked terms: ${gate.blocked.join(", ")}`,
    createdAt: publishedAt,
    publishedAt: gate.passed ? publishedAt : null,
    updatedAt: publishedAt
  };
}

function enqueueSocial(post: BlogPost) {
  const captions = JSON.parse(post.socialCaptionsJson) as Record<string, string>;
  for (const [channel, caption] of Object.entries(captions)) {
    const configured = Boolean(process.env[`${channel.toUpperCase()}_ACCESS_TOKEN`]);
    const social: SocialPost = {
      id: `${post.id}-${channel}`,
      postId: post.id,
      channel,
      status: configured ? "pending" : "skipped",
      caption,
      error: configured ? null : "Missing access token; queued as skipped for admin visibility.",
      createdAt: new Date().toISOString(),
      postedAt: null
    };
    upsertSocialPost(social);
  }
}

export async function generateDailyContent(date = new Date()) {
  if (automationPaused()) {
    insertJobLog({
      id: `job-${Date.now()}-paused`,
      jobType: "daily-generation",
      status: "blocked",
      message: "Automation is paused.",
      detailJson: "{}",
      createdAt: new Date().toISOString()
    });
    return { status: "blocked", message: "Automation is paused." };
  }

  const topic = chooseTopic(date);
  const group = `daily-${date.toISOString().slice(0, 10)}-${topic.id}`;

  if (postExists("en", slugify(`${topic.slugEn}-${chooseAngle(date, "en")}-${date.toISOString().slice(0, 10)}`))) {
    return { status: "skipped", message: "Daily post already exists." };
  }

  const imageAsset = await createImageAsset(topic, group, date);
  const image: GeneratedImage = {
    id: `${group}-image`,
    postGroup: group,
    path: imageAsset.path,
    alt: `Original Nirogidhara Ayurveda awareness visual for ${topic.titleEn}`,
    caption: `A living Ayurveda world visual for ${topic.titleEn}.`,
    prompt: imageAsset.prompt,
    createdAt: date.toISOString()
  };
  insertImage(image);

  const posts = [buildPost("en", topic, group, date, imageAsset.path), buildPost("hi", topic, group, date, imageAsset.path)];
  for (const post of posts) {
    insertPost(post);
    if (post.status === "published") {
      enqueueSocial(post);
    }
  }

  insertJobLog({
    id: `job-${Date.now()}-${group}`,
    jobType: "daily-generation",
    status: posts.every((post) => post.status === "published") ? "success" : "blocked",
    message: `Generated ${posts.length} posts and one original image for ${topic.titleEn}.`,
    detailJson: JSON.stringify({ group, topic: topic.id, posts: posts.map((post) => ({ locale: post.locale, slug: post.slug, status: post.status })) }),
    createdAt: new Date().toISOString()
  });

  return { status: "success", group, posts };
}

export async function seedInitialContent() {
  if (getPublishedPosts(undefined, 1).length > 0) {
    return { status: "skipped", message: "Seed content already exists." };
  }
  const today = new Date("2026-06-03T06:00:00.000+05:30");
  const results = [];
  for (let offset = 0; offset < 8; offset += 1) {
    const date = new Date(today.getTime() - offset * 86_400_000);
    results.push(await generateDailyContent(date));
  }
  return { status: "success", results };
}
