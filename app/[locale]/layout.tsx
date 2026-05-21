import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Footer from "../components/Footer"
import Nav from "../components/Nav"
import { isLocale, locales, siteUrl, ui, type Locale } from "../lib/i18n"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {}
  const locale = params.locale as Locale
  const t = ui[locale]

  return {
    title: `${t.brand} - ${t.heroBadge}`,
    description: t.heroText,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        fr: `${siteUrl}/fr`,
        es: `${siteUrl}/es`,
        zh: `${siteUrl}/zh`
      }
    }
  }
}

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale as Locale

  return (
    <div className="pageShell">
      <Nav locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
    </div>
  )
}
