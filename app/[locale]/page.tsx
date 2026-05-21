import Link from "next/link"
import { notFound } from "next/navigation"
import { isLocale, routeWords, ui, type Locale } from "../lib/i18n"
import { getCommunityPick, getDailyWord, getTotalVotes, getWords } from "../lib/words"

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale as Locale
  const t = ui[locale]
  const routes = routeWords[locale]
  const words = getWords(locale)
  const dailyWord = getDailyWord(locale)

  return (
    <>
      <section className="heroSection container">
        <div className="heroContent">
          <span className="heroBadge">✦ {t.heroBadge}</span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="heroActions">
            <Link className="primaryButton" href={`/${locale}/${routes.play}`}>{t.ctaPlay}</Link>
            <a className="secondaryButton" href="#words">{t.ctaExplore}</a>
          </div>
        </div>

        <div className="heroPreview" aria-label="Game preview">
          <div className="previewCard big">
            <span>{t.dailyWord}</span>
            <strong>{dailyWord.word}</strong>
          </div>
          <div className="previewGrid">
            <div className="previewCard"><strong>{words.length}</strong><span>{t.statsWords}</span></div>
            <div className="previewCard"><strong>4</strong><span>{t.statsLanguages}</span></div>
            <div className="previewCard"><strong>{getTotalVotes(locale).toLocaleString()}</strong><span>{t.statsVotes}</span></div>
          </div>
        </div>
      </section>

      <section className="container sectionBlock">
        <h2>{t.howTitle}</h2>
        <div className="stepsGrid">
          <article className="stepCard">
            <span>01</span>
            <h3>{t.step1Title}</h3>
            <p>{t.step1Text}</p>
          </article>
          <article className="stepCard">
            <span>02</span>
            <h3>{t.step2Title}</h3>
            <p>{t.step2Text}</p>
          </article>
          <article className="stepCard">
            <span>03</span>
            <h3>{t.step3Title}</h3>
            <p>{t.step3Text}</p>
          </article>
        </div>
      </section>

      <section id="words" className="container sectionBlock">
        <div className="sectionHeader">
          <div>
            <h2>{t.wordArchive}</h2>
            <p>{t.wordArchiveText}</p>
          </div>
          <Link className="secondaryButton" href={`/${locale}/${routes.play}`}>{t.ctaPlay}</Link>
        </div>

        <div className="wordGrid">
          {words.map((word) => {
            const top = getCommunityPick(word)
            return (
              <Link key={word.slug} className="wordCard" href={`/${locale}/${routes.word}/${word.slug}`}>
                <span className="smallBadge">{t.badgeCommunity}</span>
                <h3>{word.word}</h3>
                <p>{top.text}</p>
                <strong>{word.pronunciation}</strong>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
