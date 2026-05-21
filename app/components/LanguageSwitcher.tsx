import Link from "next/link"
import { localeNames, locales, type Locale } from "../lib/i18n"

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <div className="languageSwitcher" aria-label="Language selector">
      {locales.map((item) => (
        <Link key={item} className={item === locale ? "active" : ""} href={`/${item}`}>
          {localeNames[item]}
        </Link>
      ))}
    </div>
  )
}
