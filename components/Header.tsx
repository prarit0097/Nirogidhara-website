import Link from "next/link";
import { Leaf } from "lucide-react";
import { navItems } from "../lib/site";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/en" aria-label="Nirogidhara home">
        <span className="brand-mark">
          <Leaf size={20} />
        </span>
        <span>Nirogidhara</span>
      </Link>
      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="language-switch" href="/hi">
        हिन्दी
      </Link>
    </header>
  );
}
