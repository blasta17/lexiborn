import Link from "next/link"
import type { Locale } from "../lib/i18n"
import { routeWords, ui } from "../lib/i18n"
import LanguageSwitcher from "./LanguageSwitcher"
import ThemeToggle from "./ThemeToggle"

export default function Nav({ locale }: { locale: Locale }) {
  const t = ui[locale]
  const routes = routeWords[locale]

  return (
    <header className="siteHeader">
      <nav className="navShell">
        <Link className="brand" href={`/${locale}`}>
          <span className="brandMark">L</span>
          <span>{t.brand}</span>
        </Link>

        <div className="navLinks">
          <Link href={`/${locale}`}>{t.navHome}</Link>
          <Link href={`/${locale}/${routes.play}`}>{t.navPlay}</Link>
          <a href={`/${locale}#words`}>{t.navWords}</a>
        </div>

        <div className="navTools">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle locale={locale} />
        </div>
      </nav>
    </header>
  )
}
