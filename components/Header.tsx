import Link from "next/link";
import { Leaf } from "lucide-react";
import { navItemsByLocale } from "../lib/site";
import type { Locale } from "../lib/types";

export function Header({ locale }: { locale: Locale }) {
  const switchHref = locale === "hi" ? "/en" : "/hi";
  const switchLabel = locale === "hi" ? "English" : "हिन्दी";

  return (
    <header className="site-header">
      <Link className="brand" href={`/${locale}`} aria-label="Nirogidhara home">
        <span className="brand-mark">
          <Leaf size={20} />
        </span>
        <span>Nirogidhara</span>
      </Link>
      <nav aria-label="Primary navigation">
        {navItemsByLocale[locale].map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="language-switch" href={switchHref}>
        {switchLabel}
      </Link>
    </header>
  );
}
