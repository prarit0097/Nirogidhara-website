import Link from "next/link";
import { medicalDisclaimer, siteUrl } from "../lib/site";

export function Footer() {
  return (
    <footer className="footer-band">
      <div>
        <h2>Nirogidhara</h2>
        <p>{medicalDisclaimer}</p>
      </div>
      <div className="footer-links">
        <Link href="/en/about">About</Link>
        <Link href="/en/editorial-policy">Editorial Policy</Link>
        <Link href="/en/contact">Contact</Link>
        <a href={`${siteUrl}/sitemap.xml`}>Sitemap</a>
      </div>
    </footer>
  );
}
