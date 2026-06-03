import { createRequire } from "node:module";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import type { BlogPost, GeneratedImage, JobLog, Locale, PublishStatus, SocialPost } from "./types";

const require = createRequire(import.meta.url);
const { DatabaseSync } = require("node:sqlite") as {
  DatabaseSync: new (path: string) => {
    exec(sql: string): void;
    prepare(sql: string): {
      all(...params: unknown[]): unknown[];
      get(...params: unknown[]): unknown;
      run(...params: unknown[]): { changes: number; lastInsertRowid: number | bigint };
    };
  };
};

const dbPath = process.env.NIROGIDHARA_DB_PATH ?? join(process.cwd(), "data", "nirogidhara.sqlite");

let dbInstance: InstanceType<typeof DatabaseSync> | null = null;

function db() {
  if (!dbInstance) {
    const folder = dirname(dbPath);
    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
    }
    dbInstance = new DatabaseSync(dbPath);
    migrate(dbInstance);
  }
  return dbInstance;
}

function migrate(database: InstanceType<typeof DatabaseSync>) {
  database.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      locale TEXT NOT NULL,
      translation_group TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      meta_title TEXT NOT NULL,
      meta_description TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      faq_json TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      target_keyword TEXT NOT NULL,
      image_path TEXT NOT NULL,
      image_alt TEXT NOT NULL,
      image_caption TEXT NOT NULL,
      sources_json TEXT NOT NULL,
      internal_links_json TEXT NOT NULL,
      social_captions_json TEXT NOT NULL,
      seo_score INTEGER NOT NULL,
      status TEXT NOT NULL,
      safety_notes TEXT NOT NULL,
      created_at TEXT NOT NULL,
      published_at TEXT,
      updated_at TEXT NOT NULL,
      UNIQUE(locale, slug)
    );
    CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status, published_at);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_topic ON blog_posts(topic_id, locale);

    CREATE TABLE IF NOT EXISTS generated_images (
      id TEXT PRIMARY KEY,
      post_group TEXT NOT NULL,
      path TEXT NOT NULL,
      alt TEXT NOT NULL,
      caption TEXT NOT NULL,
      prompt TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS job_logs (
      id TEXT PRIMARY KEY,
      job_type TEXT NOT NULL,
      status TEXT NOT NULL,
      message TEXT NOT NULL,
      detail_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS social_posts (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      channel TEXT NOT NULL,
      status TEXT NOT NULL,
      caption TEXT NOT NULL,
      error TEXT,
      created_at TEXT NOT NULL,
      posted_at TEXT,
      UNIQUE(post_id, channel)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

function mapPost(row: any): BlogPost {
  return {
    id: row.id,
    locale: row.locale,
    translationGroup: row.translation_group,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    excerpt: row.excerpt,
    content: row.content,
    faqJson: row.faq_json,
    topicId: row.topic_id,
    targetKeyword: row.target_keyword,
    imagePath: row.image_path,
    imageAlt: row.image_alt,
    imageCaption: row.image_caption,
    sourcesJson: row.sources_json,
    internalLinksJson: row.internal_links_json,
    socialCaptionsJson: row.social_captions_json,
    seoScore: row.seo_score,
    status: row.status,
    safetyNotes: row.safety_notes,
    createdAt: row.created_at,
    publishedAt: row.published_at,
    updatedAt: row.updated_at
  };
}

export function getPublishedPosts(locale?: Locale, limit = 50) {
  const rows = locale
    ? db()
        .prepare("SELECT * FROM blog_posts WHERE status='published' AND locale=? ORDER BY published_at DESC LIMIT ?")
        .all(locale, limit)
    : db().prepare("SELECT * FROM blog_posts WHERE status='published' ORDER BY published_at DESC LIMIT ?").all(limit);
  return rows.map(mapPost);
}

export function getAllPosts(limit = 100) {
  return db()
    .prepare("SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT ?")
    .all(limit)
    .map(mapPost);
}

export function getPost(locale: Locale, slug: string) {
  const row = db().prepare("SELECT * FROM blog_posts WHERE locale=? AND slug=? LIMIT 1").get(locale, slug);
  return row ? mapPost(row) : null;
}

export function getLatestPost(locale: Locale) {
  const row = db()
    .prepare("SELECT * FROM blog_posts WHERE locale=? AND status='published' ORDER BY published_at DESC LIMIT 1")
    .get(locale);
  return row ? mapPost(row) : null;
}

export function getPostsByTopic(locale: Locale, topicId: string, limit = 30) {
  return db()
    .prepare(
      "SELECT * FROM blog_posts WHERE locale=? AND topic_id=? AND status='published' ORDER BY published_at DESC LIMIT ?"
    )
    .all(locale, topicId, limit)
    .map(mapPost);
}

export function postExists(locale: Locale, slug: string) {
  const row = db().prepare("SELECT id FROM blog_posts WHERE locale=? AND slug=? LIMIT 1").get(locale, slug);
  return Boolean(row);
}

export function insertPost(post: BlogPost) {
  db()
    .prepare(
      `INSERT INTO blog_posts (
        id, locale, translation_group, slug, title, meta_title, meta_description, excerpt, content, faq_json,
        topic_id, target_keyword, image_path, image_alt, image_caption, sources_json, internal_links_json,
        social_captions_json, seo_score, status, safety_notes, created_at, published_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      post.id,
      post.locale,
      post.translationGroup,
      post.slug,
      post.title,
      post.metaTitle,
      post.metaDescription,
      post.excerpt,
      post.content,
      post.faqJson,
      post.topicId,
      post.targetKeyword,
      post.imagePath,
      post.imageAlt,
      post.imageCaption,
      post.sourcesJson,
      post.internalLinksJson,
      post.socialCaptionsJson,
      post.seoScore,
      post.status,
      post.safetyNotes,
      post.createdAt,
      post.publishedAt,
      post.updatedAt
    );
}

export function updatePostStatus(id: string, status: PublishStatus) {
  const now = new Date().toISOString();
  const publishedAt = status === "published" ? now : null;
  db().prepare("UPDATE blog_posts SET status=?, published_at=COALESCE(?, published_at), updated_at=? WHERE id=?").run(
    status,
    publishedAt,
    now,
    id
  );
}

export function insertImage(image: GeneratedImage) {
  db()
    .prepare(
      "INSERT INTO generated_images (id, post_group, path, alt, caption, prompt, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(image.id, image.postGroup, image.path, image.alt, image.caption, image.prompt, image.createdAt);
}

export function getLatestImages(limit = 24) {
  return db()
    .prepare("SELECT * FROM generated_images ORDER BY created_at DESC LIMIT ?")
    .all(limit)
    .map((row: any): GeneratedImage => ({
      id: row.id,
      postGroup: row.post_group,
      path: row.path,
      alt: row.alt,
      caption: row.caption,
      prompt: row.prompt,
      createdAt: row.created_at
    }));
}

export function insertJobLog(log: JobLog) {
  db()
    .prepare("INSERT INTO job_logs (id, job_type, status, message, detail_json, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(log.id, log.jobType, log.status, log.message, log.detailJson, log.createdAt);
}

export function getJobLogs(limit = 50) {
  return db()
    .prepare("SELECT * FROM job_logs ORDER BY created_at DESC LIMIT ?")
    .all(limit)
    .map((row: any): JobLog => ({
      id: row.id,
      jobType: row.job_type,
      status: row.status,
      message: row.message,
      detailJson: row.detail_json,
      createdAt: row.created_at
    }));
}

export function upsertSocialPost(post: SocialPost) {
  db()
    .prepare(
      `INSERT INTO social_posts (id, post_id, channel, status, caption, error, created_at, posted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(post_id, channel) DO UPDATE SET status=excluded.status, caption=excluded.caption, error=excluded.error, posted_at=excluded.posted_at`
    )
    .run(post.id, post.postId, post.channel, post.status, post.caption, post.error, post.createdAt, post.postedAt);
}

export function getSocialPosts(limit = 80) {
  return db()
    .prepare("SELECT * FROM social_posts ORDER BY created_at DESC LIMIT ?")
    .all(limit)
    .map((row: any): SocialPost => ({
      id: row.id,
      postId: row.post_id,
      channel: row.channel,
      status: row.status,
      caption: row.caption,
      error: row.error,
      createdAt: row.created_at,
      postedAt: row.posted_at
    }));
}

export function getSetting(key: string, fallback = "") {
  const row = db().prepare("SELECT value FROM settings WHERE key=?").get(key) as { value: string } | undefined;
  return row?.value ?? fallback;
}

export function setSetting(key: string, value: string) {
  db()
    .prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
    .run(key, value);
}

export function automationPaused() {
  return getSetting("automation_paused", "false") === "true";
}
