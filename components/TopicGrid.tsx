import Link from "next/link";
import { topicUrl, topics } from "../lib/site";
import type { Locale } from "../lib/types";

export function TopicGrid({ locale }: { locale: Locale }) {
  return (
    <section className="section-shell">
      <div className="section-heading">
        <p>Topic-cluster SEO</p>
        <h2>{locale === "hi" ? "आयुर्वेद ज्ञान के स्तंभ" : "Ayurveda knowledge pillars"}</h2>
      </div>
      <div className="topic-grid">
        {topics.map((topic, index) => (
          <Link key={topic.id} href={topicUrl(locale, topic)} className="topic-card">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{locale === "hi" ? topic.titleHi : topic.titleEn}</h3>
            <p>{locale === "hi" ? topic.descriptionHi : topic.descriptionEn}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
