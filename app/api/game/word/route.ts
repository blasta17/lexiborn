import { NextResponse } from "next/server"
import { isLocale, type Locale } from "../../../lib/i18n"
import { getGameWordFromDb, getStaticGameWord } from "../../../lib/dbGame"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const localeParam = searchParams.get("locale") || "en"
  const slug = searchParams.get("slug") || ""

  if (!isLocale(localeParam) || !slug) {
    return NextResponse.json({ error: "Invalid locale or slug" }, { status: 400 })
  }

  const locale = localeParam as Locale
  const dbWord = await getGameWordFromDb(locale, slug).catch(() => null)
  const word = dbWord || getStaticGameWord(locale, slug)

  if (!word) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 })
  }

  return NextResponse.json({ word })
}
