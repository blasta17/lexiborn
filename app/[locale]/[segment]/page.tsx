import { notFound } from "next/navigation"
import GameClient from "../../components/GameClient"
import { isLocale, routeWords, ui, type Locale } from "../../lib/i18n"

export function generateStaticParams() {
  return [
    { locale: "en", segment: "play" },
    { locale: "fr", segment: "jeu" },
    { locale: "es", segment: "juego" },
    { locale: "zh", segment: "play" }
  ]
}

export function generateMetadata({ params }: { params: { locale: string; segment: string } }) {
  if (!isLocale(params.locale)) return {}
  const locale = params.locale as Locale
  if (params.segment !== routeWords[locale].play && params.segment !== routeWords[locale].daily) return {}
  const t = ui[locale]
  return {
    title: `${t.playTitle} - ${t.brand}`,
    description: t.playSubtitle
  }
}

export default function GamePage({ params }: { params: { locale: string; segment: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale as Locale
  const routes = routeWords[locale]
  if (params.segment !== routes.play && params.segment !== routes.daily) notFound()

  return (
    <div className="container playPage">
      <GameClient locale={locale} />
    </div>
  )
}
