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

export const navItemsByLocale: Record<Locale, { label: string; href: string }[]> = {
  en: navItems,
  hi: [
    { label: "आयुर्वेद", href: "/hi/ayurveda-kya-hai" },
    { label: "जड़ी-बूटियां", href: "/hi/ayurvedic-jadi-bootiyan" },
    { label: "दिनचर्या", href: "/hi/dinacharya" },
    { label: "ऋतुचर्या", href: "/hi/ritucharya" },
    { label: "ब्लॉग", href: "/hi/blog" },
    { label: "गैलरी", href: "/hi/gallery" }
  ]
};

export const premiumVisuals = [
  {
    src: "/media/ayurveda-river-hero.png",
    alt: "Ayurveda river landscape with herbs and sunrise",
    captionEn: "Global Ayurveda awareness",
    captionHi: "वैश्विक आयुर्वेद जागरूकता"
  },
  {
    src: "/media/ayurveda-copper-water.png",
    alt: "Copper water ritual with tulsi and neem leaves",
    captionEn: "Daily wellness rituals",
    captionHi: "दैनिक wellness rituals"
  },
  {
    src: "/media/ayurveda-sattvic-food.png",
    alt: "Sattvic food bowls on banana leaf with copper utensils",
    captionEn: "Food and digestion guides",
    captionHi: "भोजन और पाचन guides"
  },
  {
    src: "/media/ayurveda-evening-rest.png",
    alt: "Evening Ayurveda rest scene with herbal tea and diya",
    captionEn: "Sleep and stress awareness",
    captionHi: "नींद और तनाव जागरूकता"
  },
  {
    src: "/media/ayurveda-herb-still-life.png",
    alt: "Ayurveda herbs with copper bowl and turmeric",
    captionEn: "Herb education",
    captionHi: "जड़ी-बूटी शिक्षा"
  },
  {
    src: "/media/ayurveda-courtyard-wellness.png",
    alt: "Ayurveda courtyard with herbs and copper vessels",
    captionEn: "Seasonal living",
    captionHi: "मौसमी जीवनशैली"
  },
  {
    src: "/media/ayurveda-learning-manuscript.png",
    alt: "Ayurveda manuscript learning still life",
    captionEn: "Research and learning",
    captionHi: "Research और learning"
  }
];

export const topicVisualById: Record<string, string> = {
  "ayurveda-basics": "/media/ayurveda-learning-manuscript.png",
  dinacharya: "/media/ayurveda-copper-water.png",
  ritucharya: "/media/ayurveda-courtyard-wellness.png",
  herbs: "/media/ayurveda-herb-still-life.png",
  "food-digestion": "/media/ayurveda-sattvic-food.png",
  "sleep-stress": "/media/ayurveda-evening-rest.png",
  "natural-wellness": "/media/ayurveda-river-hero.png",
  "global-ayurveda": "/media/ayurveda-learning-manuscript.png"
};

export function topicVisualPath(topicId: string) {
  return topicVisualById[topicId] ?? "/media/ayurveda-herb-still-life.png";
}

export const medicalDisclaimer =
  "Nirogidhara publishes educational Ayurveda awareness content only. It does not diagnose, treat, cure, or prevent disease. Always consult a qualified healthcare professional for medical concerns.";
