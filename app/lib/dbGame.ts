import type { PoolClient } from "pg"
import type { Locale } from "./i18n"
import { dbQuery, hasDatabaseUrl, withTransaction } from "./db"
import { getWord, type BadgeKey, type InventedWord } from "./words"

type DbWordRow = {
  word_id: string
  slug: string
  locale: Locale
  word: string
  pronunciation: string
  origin_hint: string
  official_definition_id: string | null
  definition_id: string
  definition_text: string
  example_sentence: string
  total_votes: string | number
  badges: BadgeKey[] | null
}

type LeaderRow = {
  definition_id: string
  total_votes: string | number
}

export type VoteResult = {
  alreadyVoted: boolean
  selectedDefinitionId: string
  pointsAwarded: number
  word: InventedWord
}

function normalizeBadges(value: unknown): BadgeKey[] {
  if (Array.isArray(value)) return value.filter(Boolean) as BadgeKey[]
  if (typeof value === "string") {
    return value.replace(/[{}]/g, "").split(",").filter(Boolean) as BadgeKey[]
  }
  return []
}

function rowsToWord(rows: DbWordRow[]): InventedWord | null {
  if (!rows.length) return null
  const first = rows[0]
  const options = rows.map((row) => {
    const badges = normalizeBadges(row.badges)
    const badge = badges.find((item) => item === "community" || item === "rising" || item === "poetic")
    return {
      id: row.definition_id,
      text: row.definition_text,
      votes: Number(row.total_votes) || 0,
      ...(badge ? { badge } : {})
    }
  })

  const communityPick = [...options].sort((a, b) => b.votes - a.votes)[0]
  const official = options.find((option) => option.id === first.official_definition_id) || communityPick
  const officialRow = rows.find((row) => row.definition_id === official?.id) || first

  return {
    source: "database",
    locale: first.locale,
    slug: first.slug,
    word: first.word,
    pronunciation: first.pronunciation,
    originHint: first.origin_hint,
    officialDefinition: official?.text || communityPick?.text || "",
    example: officialRow.example_sentence,
    options
  }
}

async function getLeaderboard(client: PoolClient, wordId: string) {
  const result = await client.query<LeaderRow>(
    `SELECT d.id AS definition_id,
            d.base_votes + COALESCE(COUNT(v.id), 0)::int AS total_votes
       FROM definitions d
       LEFT JOIN votes v ON v.definition_id = d.id
      WHERE d.word_id = $1
      GROUP BY d.id, d.base_votes
      ORDER BY total_votes DESC, d.id ASC`,
    [wordId]
  )
  return result.rows
}

async function refreshCommunityPick(client: PoolClient, wordId: string) {
  const leaderboard = await getLeaderboard(client, wordId)
  const topDefinition = leaderboard[0]
  if (!topDefinition) return leaderboard

  await client.query(
    `UPDATE words
        SET official_definition_id = $1,
            updated_at = now()
      WHERE id = $2`,
    [topDefinition.definition_id, wordId]
  )

  await client.query(
    `DELETE FROM definition_badges db
      USING definitions d
      WHERE db.definition_id = d.id
        AND d.word_id = $1
        AND db.badge_key = 'community'`,
    [wordId]
  )

  await client.query(
    `INSERT INTO definition_badges (definition_id, badge_key)
     VALUES ($1, 'community')
     ON CONFLICT (definition_id, badge_key) DO NOTHING`,
    [topDefinition.definition_id]
  )

  return leaderboard
}

const gameWordSql = `SELECT w.id AS word_id,
            w.slug,
            w.locale,
            w.word,
            w.pronunciation,
            w.origin_hint,
            w.official_definition_id,
            d.id AS definition_id,
            d.text AS definition_text,
            d.example_sentence,
            d.base_votes + COALESCE(vc.vote_count, 0)::int AS total_votes,
            COALESCE(array_agg(db.badge_key) FILTER (WHERE db.badge_key IS NOT NULL), '{}') AS badges
       FROM words w
       JOIN definitions d ON d.word_id = w.id
       LEFT JOIN (
         SELECT definition_id, COUNT(*)::int AS vote_count
           FROM votes
          GROUP BY definition_id
       ) vc ON vc.definition_id = d.id
       LEFT JOIN definition_badges db ON db.definition_id = d.id
      WHERE w.locale = $1
        AND w.slug = $2
        AND w.is_active = TRUE
      GROUP BY w.id, d.id, vc.vote_count
      ORDER BY d.id ASC`

async function getGameWordFromClient(client: PoolClient, locale: Locale, slug: string): Promise<InventedWord | null> {
  const result = await client.query<DbWordRow>(gameWordSql, [locale, slug])
  return rowsToWord(result.rows)
}

export async function getGameWordFromDb(locale: Locale, slug: string): Promise<InventedWord | null> {
  if (!hasDatabaseUrl) return null
  const result = await dbQuery<DbWordRow>(gameWordSql, [locale, slug])
  return rowsToWord(result.rows)
}

export async function submitVoteToDb(input: {
  locale: Locale
  wordSlug: string
  definitionId: string
  anonymousId: string
}): Promise<VoteResult> {
  if (!hasDatabaseUrl) {
    throw new Error("DATABASE_URL is not configured")
  }

  return withTransaction(async (client) => {
    const wordResult = await client.query<{ id: string }>(
      `SELECT id FROM words WHERE locale = $1 AND slug = $2 AND is_active = TRUE LIMIT 1`,
      [input.locale, input.wordSlug]
    )
    const wordId = wordResult.rows[0]?.id
    if (!wordId) throw new Error("WORD_NOT_FOUND")

    const definitionResult = await client.query<{ id: string }>(
      `SELECT id FROM definitions WHERE id = $1 AND word_id = $2 LIMIT 1`,
      [input.definitionId, wordId]
    )
    if (!definitionResult.rows[0]) throw new Error("DEFINITION_NOT_FOUND")

    const existingVote = await client.query<{ definition_id: string; points_awarded: number }>(
      `SELECT definition_id, points_awarded
         FROM votes
        WHERE word_id = $1
          AND anonymous_id = $2
          AND user_id IS NULL
        LIMIT 1`,
      [wordId, input.anonymousId]
    )

    if (existingVote.rows[0]) {
      await refreshCommunityPick(client, wordId)
      const word = await getGameWordFromClient(client, input.locale, input.wordSlug)
      if (!word) throw new Error("WORD_NOT_FOUND")
      return {
        alreadyVoted: true,
        selectedDefinitionId: existingVote.rows[0].definition_id,
        pointsAwarded: existingVote.rows[0].points_awarded,
        word
      }
    }

    const voteInsert = await client.query<{ id: string }>(
      `INSERT INTO votes (word_id, definition_id, anonymous_id, points_awarded)
       VALUES ($1, $2, $3, 0)
       RETURNING id`,
      [wordId, input.definitionId, input.anonymousId]
    )

    const leaderboard = await refreshCommunityPick(client, wordId)
    const rankIndex = leaderboard.findIndex((row) => row.definition_id === input.definitionId)
    const pointsByRank = [100, 75, 50, 25]
    const pointsAwarded = pointsByRank[rankIndex] ?? 10

    await client.query(
      `UPDATE votes SET points_awarded = $1 WHERE id = $2`,
      [pointsAwarded, voteInsert.rows[0].id]
    )

    const word = await getGameWordFromClient(client, input.locale, input.wordSlug)
    if (!word) throw new Error("WORD_NOT_FOUND")

    return {
      alreadyVoted: false,
      selectedDefinitionId: input.definitionId,
      pointsAwarded,
      word
    }
  })
}

export function getStaticGameWord(locale: Locale, slug: string) {
  const word = getWord(locale, slug)
  return word ? { ...word, source: "static" as const } : null
}
