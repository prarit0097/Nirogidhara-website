import type { Locale, Topic } from "./types";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nirogidhara.com";

export const locales: Locale[] = ["en", "hi"];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी"
};

export const topics: Topic[] = [
  {
    id: "ayurveda-basics",
    slugEn: "ayurveda-basics",
    slugHi: "ayurveda-kya-hai",
    titleEn: "Ayurveda Basics",
    titleHi: "आयुर्वेद की बुनियाद",
    descriptionEn: "Clear, practical introductions to Ayurveda for global readers.",
    descriptionHi: "वैश्विक पाठकों के लिए आयुर्वेद की सरल और उपयोगी समझ।",
    keywords: ["ayurveda basics", "what is ayurveda", "ayurvedic awareness"]
  },
  {
    id: "dinacharya",
    slugEn: "daily-wellness",
    slugHi: "dinacharya",
    titleEn: "Daily Wellness",
    titleHi: "दिनचर्या",
    descriptionEn: "Daily routines inspired by classical Ayurveda and modern life.",
    descriptionHi: "आधुनिक जीवन के लिए आयुर्वेद प्रेरित दैनिक आदतें।",
    keywords: ["dinacharya", "daily ayurveda routine", "ayurvedic lifestyle"]
  },
  {
    id: "ritucharya",
    slugEn: "seasonal-wellness",
    slugHi: "ritucharya",
    titleEn: "Seasonal Wellness",
    titleHi: "ऋतुचर्या",
    descriptionEn: "Season-aware food, rest, and routine guidance.",
    descriptionHi: "मौसम के अनुसार भोजन, विश्राम और दिनचर्या की समझ।",
    keywords: ["ritucharya", "seasonal ayurveda", "seasonal wellness"]
  },
  {
    id: "herbs",
    slugEn: "ayurvedic-herbs",
    slugHi: "ayurvedic-jadi-bootiyan",
    titleEn: "Ayurvedic Herbs",
    titleHi: "आयुर्वेदिक जड़ी-बूटियाँ",
    descriptionEn: "Educational herb profiles with safe, non-medical language.",
    descriptionHi: "सुरक्षित और शैक्षिक भाषा में जड़ी-बूटियों की जानकारी।",
    keywords: ["ayurvedic herbs", "herbal wellness", "ayurveda plants"]
  },
  {
    id: "food-digestion",
    slugEn: "food-and-digestion",
    slugHi: "bhojan-aur-pachan",
    titleEn: "Food & Digestion",
    titleHi: "भोजन और पाचन",
    descriptionEn: "Ayurveda-inspired food habits and digestive awareness.",
    descriptionHi: "आयुर्वेद प्रेरित भोजन आदतें और पाचन जागरूकता।",
    keywords: ["ayurvedic food", "digestion ayurveda", "agni ayurveda"]
  },
  {
    id: "sleep-stress",
    slugEn: "sleep-and-stress",
    slugHi: "neend-aur-tanav",
    titleEn: "Sleep & Stress",
    titleHi: "नींद और तनाव",
    descriptionEn: "Gentle routines for rest, recovery, and calmer days.",
    descriptionHi: "आराम, रिकवरी और शांत दिनचर्या के लिए सरल उपाय।",
    keywords: ["ayurveda sleep", "stress wellness", "rest routine"]
  },
  {
    id: "natural-wellness",
    slugEn: "natural-wellness",
    slugHi: "prakritik-wellness",
    titleEn: "Natural Wellness",
    titleHi: "प्राकृतिक वेलनेस",
    descriptionEn: "Practical wellness education without exaggerated promises.",
    descriptionHi: "बिना बढ़े-चढ़े दावों के उपयोगी वेलनेस शिक्षा।",
    keywords: ["natural wellness", "holistic lifestyle", "wellness education"]
  },
  {
    id: "global-ayurveda",
    slugEn: "global-ayurveda",
    slugHi: "vishwa-ayurveda",
    titleEn: "Global Ayurveda",
    titleHi: "विश्व आयुर्वेद",
    descriptionEn: "How Ayurveda is understood, discussed, and practiced worldwide.",
    descriptionHi: "दुनिया भर में आयुर्वेद की समझ, चर्चा और अभ्यास।",
    keywords: ["global ayurveda", "ayurveda worldwide", "ayurveda awareness"]
  }
];

export function topicBySlug(locale: Locale, slug: string) {
  return topics.find((topic) => (locale === "en" ? topic.slugEn : topic.slugHi) === slug);
}

export function topicUrl(locale: Locale, topic: Topic) {
  return `/${locale}/${locale === "en" ? topic.slugEn : topic.slugHi}`;
}

export function blogUrl(locale: Locale, slug: string) {
  return `/${locale}/blog/${slug}`;
}

export const navItems = [
  { label: "Ayurveda", href: "/en/ayurveda-basics" },
  { label: "Herbs", href: "/en/ayurvedic-herbs" },
  { label: "Daily Wellness", href: "/en/daily-wellness" },
  { label: "Seasons", href: "/en/seasonal-wellness" },
  { label: "Blog", href: "/en/blog" },
  { label: "Gallery", href: "/en/gallery" }
];

export const medicalDisclaimer =
  "Nirogidhara publishes educational Ayurveda awareness content only. It does not diagnose, treat, cure, or prevent disease. Always consult a qualified healthcare professional for medical concerns.";
