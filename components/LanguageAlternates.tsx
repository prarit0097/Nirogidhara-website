import Link from "next/link";
import type { Locale } from "../lib/types";

export function LanguageAlternates({ current, enHref, hiHref }: { current: Locale; enHref: string; hiHref: string }) {
  return (
    <div className="language-panel" aria-label="Language versions">
      <Link className={current === "en" ? "active" : ""} href={enHref}>
        English
      </Link>
      <Link className={current === "hi" ? "active" : ""} href={hiHref}>
        हिन्दी
      </Link>
    </div>
  );
}
