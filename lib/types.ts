export type Locale = "en" | "hi";
export type PublishStatus = "draft" | "scheduled" | "published" | "blocked" | "unpublished";
export type SocialStatus = "pending" | "posted" | "failed" | "skipped";

export type Topic = {
  id: string;
  slugEn: string;
  slugHi: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  keywords: string[];
};

export type BlogPost = {
  id: string;
  locale: Locale;
  translationGroup: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  faqJson: string;
  topicId: string;
  targetKeyword: string;
  imagePath: string;
  imageAlt: string;
  imageCaption: string;
  sourcesJson: string;
  internalLinksJson: string;
  socialCaptionsJson: string;
  seoScore: number;
  status: PublishStatus;
  safetyNotes: string;
  createdAt: string;
  publishedAt: string | null;
  updatedAt: string;
};

export type GeneratedImage = {
  id: string;
  postGroup: string;
  path: string;
  alt: string;
  caption: string;
  prompt: string;
  createdAt: string;
};

export type JobLog = {
  id: string;
  jobType: string;
  status: "success" | "failed" | "blocked";
  message: string;
  detailJson: string;
  createdAt: string;
};

export type SocialPost = {
  id: string;
  postId: string;
  channel: string;
  status: SocialStatus;
  caption: string;
  error: string | null;
  createdAt: string;
  postedAt: string | null;
};
