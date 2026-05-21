import { NextResponse } from "next/server"
import { isLocale, type Locale } from "../../../lib/i18n"
import { submitVoteToDb } from "../../../lib/dbGame"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type VoteBody = {
  locale?: string
  wordSlug?: string
  definitionId?: string
  anonymousId?: string
}

function cleanAnonymousId(value: unknown) {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, 128)
}

export async function POST(request: Request) {
  let body: VoteBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body.locale || !isLocale(body.locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 })
  }

  const wordSlug = typeof body.wordSlug === "string" ? body.wordSlug.trim() : ""
  const definitionId = typeof body.definitionId === "string" ? body.definitionId.trim() : ""
  const anonymousId = cleanAnonymousId(body.anonymousId)

  if (!wordSlug || !definitionId || anonymousId.length < 8) {
    return NextResponse.json({ error: "Missing vote data" }, { status: 400 })
  }

  try {
    const result = await submitVoteToDb({
      locale: body.locale as Locale,
      wordSlug,
      definitionId,
      anonymousId
    })
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vote failed"
    const status = message === "WORD_NOT_FOUND" || message === "DEFINITION_NOT_FOUND" ? 404 : 503
    return NextResponse.json({ error: message }, { status })
  }
}
