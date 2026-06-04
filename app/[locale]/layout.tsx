import { notFound } from "next/navigation";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { locales } from "../../lib/site";
import type { Locale } from "../../lib/types";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!locales.includes(locale as never)) {
    notFound();
  }
  return (
    <div lang={locale}>
      <Header locale={locale as Locale} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
