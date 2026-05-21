import type { Locale } from "../lib/i18n"
import { ui } from "../lib/i18n"

export default function Footer({ locale }: { locale: Locale }) {
  const t = ui[locale]

  return (
    <footer className="footer">
      <div className="container footerGrid">
        <div>
          <strong>{t.brand}</strong>
          <p>{t.footer}</p>
        </div>
        <div className="footerMini">© {new Date().getFullYear()} LexiBorn</div>
      </div>
    </footer>
  )
}
