import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { isLocale, locales, routeWords, siteUrl, ui, type Locale } from "../../../lib/i18n"
import { getCommunityPick, getWord, getWords } from "../../../lib/words"

export function generateStaticParams() {
  const params: Array<{ locale: Locale; segment: string; slug: string }> = []
  locales.forEach((locale) => {
    getWords(locale).forEach((word) => {
      params.push({ locale, segment: routeWords[locale].word, slug: word.slug })
    })
  })
  return params
}

export function generateMetadata({ params }: { params: { locale: string; segment: string; slug: string } }): Metadata {
  if (!isLocale(params.locale)) return {}
  const locale = params.locale as Locale
  if (params.segment !== routeWords[locale].word) return {}
  const word = getWord(locale, params.slug)
  if (!word) return {}

  const titleMap: Record<Locale, string> = {
    en: `${word.word} Meaning - A New Invented Word`,
    fr: `Définition de ${word.word} - Un nouveau mot inventé`,
    es: `Significado de ${word.word} - Una palabra inventada`,
    zh: `${word.word} 的含义 - 一个新创造的词`
  }

  const descriptionMap: Record<Locale, string> = {
    en: `Discover ${word.word}, an invented English word with a community-voted meaning and popular guesses.`,
    fr: `Découvre ${word.word}, un mot français inventé avec une définition votée par la communauté et des guesses populaires.`,
    es: `Descubre ${word.word}, una palabra española inventada con significado votado por la comunidad y opciones populares.`,
    zh: `探索 ${word.word}，一个中文新词，由社区投票选择含义。`
  }

  return {
    title: titleMap[locale],
    description: descriptionMap[locale],
    alternates: {
      canonical: `${siteUrl}/${locale}/${routeWords[locale].word}/${word.slug}`
    }
  }
}

export default function WordPage({ params }: { params: { locale: string; segment: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale as Locale
  const routes = routeWords[locale]
  if (params.segment !== routes.word) notFound()
  const word = getWord(locale, params.slug)
  if (!word) notFound()

  const t = ui[locale]
  const sortedOptions = [...word.options].sort((a, b) => b.votes - a.votes)
  const totalVotes = sortedOptions.reduce((total, option) => total + option.votes, 0)
  const communityPick = getCommunityPick(word)

  return (
    <article className="container wordDetailPage">
      <Link className="backLink" href={`/${locale}`}>← {t.navHome}</Link>

      <section className="wordHeroCard">
        <span className="heroBadge">{t.officialMeaning}</span>
        <h1>{word.word}</h1>
        <p className="pronunciation">{t.pronunciation}: {word.pronunciation}</p>
        <p className="largeDefinition">{communityPick.text}</p>
        <div className="exampleBox">
          <span>{t.example}</span>
          <strong>{word.example}</strong>
        </div>
      </section>

      <section className="sectionBlock noPadTop">
        <div className="sectionHeader">
          <div>
            <h2>{t.popularBadges}</h2>
            <p>{word.originHint}</p>
          </div>
          <Link className="primaryButton" href={`/${locale}/${routes.play}`}>{t.ctaPlay}</Link>
        </div>

        <div className="definitionGrid">
          {sortedOptions.map((option, index) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
            const effectiveBadge = index === 0 ? "community" : option.badge === "community" ? undefined : option.badge
            const label = effectiveBadge === "community" ? t.badgeCommunity : effectiveBadge === "rising" ? t.badgeRising : effectiveBadge === "poetic" ? t.badgePoetic : null
            return (
              <div className="definitionCard" key={option.id}>
                <div className="definitionCardTop">
                  <span className="smallBadge">#{index + 1}</span>
                  {label ? <span className="badge">{label}</span> : null}
                </div>
                <p>{option.text}</p>
                <div className="miniProgress"><span style={{ width: `${percentage}%` }} /></div>
                <strong>{percentage}%</strong>
              </div>
            )
          })}
        </div>
      </section>
    </article>
  )
}
