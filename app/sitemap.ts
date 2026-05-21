import type { MetadataRoute } from "next"
import { locales, routeWords, siteUrl } from "./lib/i18n"
import { getWords } from "./lib/words"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const urls: MetadataRoute.Sitemap = []

  locales.forEach((locale) => {
    urls.push({
      url: `${siteUrl}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.9
    })
    urls.push({
      url: `${siteUrl}/${locale}/${routeWords[locale].play}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95
    })
    getWords(locale).forEach((word) => {
      urls.push({
        url: `${siteUrl}/${locale}/${routeWords[locale].word}/${word.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75
      })
    })
  })

  return urls
}
