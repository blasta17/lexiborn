"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import type { Locale } from "../lib/i18n"
import { routeWords, ui } from "../lib/i18n"
import {
  getDailyWordIndex,
  getWords,
  type BadgeKey,
  type DefinitionOption,
  type InventedWord
} from "../lib/words"

type RankedOption = DefinitionOption & { totalVotes: number }
type VoteResponse = {
  alreadyVoted: boolean
  selectedDefinitionId: string
  pointsAwarded: number
  word: InventedWord
}

const POINTS_BY_RANK = [100, 75, 50, 25]

function badgeLabel(locale: Locale, badge?: BadgeKey) {
  const t = ui[locale]
  if (badge === "community") return t.badgeCommunity
  if (badge === "rising") return t.badgeRising
  if (badge === "poetic") return t.badgePoetic
  return null
}

function voteStorageKey(locale: Locale, word: InventedWord) {
  return `lexiborn-vote-${locale}-${word.slug}`
}

function wordPointsStorageKey(locale: Locale, word: InventedWord) {
  return `lexiborn-points-${locale}-${word.slug}`
}

function scoreStorageKey() {
  return "lexiborn-total-score"
}

function localVoteKey(locale: Locale, optionId: string) {
  return `lexiborn-local-votes-${locale}-${optionId}`
}

function anonymousIdKey() {
  return "lexiborn-anonymous-id"
}

function pointsForRank(rankIndex: number) {
  return POINTS_BY_RANK[rankIndex] ?? 10
}

function getAnonymousId() {
  const stored = window.localStorage.getItem(anonymousIdKey())
  if (stored && stored.length >= 8) return stored
  const generated = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`
  window.localStorage.setItem(anonymousIdKey(), generated)
  return generated
}

function withLocalVotes(locale: Locale, word: InventedWord) {
  if (word.source === "database") return word
  return {
    ...word,
    options: word.options.map((option) => {
      const localVotes = Number(window.localStorage.getItem(localVoteKey(locale, option.id))) || 0
      return { ...option, votes: option.votes + localVotes }
    })
  }
}

export default function GameClient({ locale }: { locale: Locale }) {
  const t = ui[locale]
  const routes = routeWords[locale]
  const words = useMemo(() => getWords(locale), [locale])
  const [wordIndex, setWordIndex] = useState(getDailyWordIndex(locale))
  const [word, setWord] = useState<InventedWord>(words[getDailyWordIndex(locale)])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [score, setScore] = useState(0)
  const [roundPoints, setRoundPoints] = useState(0)
  const [saving, setSaving] = useState(false)
  const [usingDatabase, setUsingDatabase] = useState(false)

  useEffect(() => {
    let active = true
    const fallback = words[wordIndex % words.length]

    function applyWord(nextWord: InventedWord) {
      if (!active) return
      const playableWord = withLocalVotes(locale, nextWord)
      const storedVote = window.localStorage.getItem(voteStorageKey(locale, playableWord))
      const storedPoints = window.localStorage.getItem(wordPointsStorageKey(locale, playableWord))
      const storedScore = window.localStorage.getItem(scoreStorageKey())

      setWord(playableWord)
      setSelectedId(storedVote)
      setHasVoted(Boolean(storedVote))
      setRoundPoints(storedPoints ? Number(storedPoints) || 0 : 0)
      setScore(storedScore ? Number(storedScore) || 0 : 0)
      setCopied(false)
      setSaving(false)
      setUsingDatabase(playableWord.source === "database")
    }

    applyWord(fallback)

    fetch(`/api/game/word?locale=${locale}&slug=${encodeURIComponent(fallback.slug)}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { word?: InventedWord } | null) => {
        if (payload?.word) applyWord(payload.word)
      })
      .catch(() => {
        if (active) setUsingDatabase(false)
      })

    return () => {
      active = false
    }
  }, [locale, wordIndex, words])

  const optionsWithVotes = useMemo<RankedOption[]>(() => {
    return word.options
      .map((option) => ({ ...option, totalVotes: option.votes }))
      .sort((a, b) => b.totalVotes - a.totalVotes)
  }, [word])

  const totalVotes = optionsWithVotes.reduce((total, option) => total + option.totalVotes, 0)
  const communityPick = optionsWithVotes[0]
  const selectedRankIndex = selectedId ? optionsWithVotes.findIndex((option) => option.id === selectedId) : -1
  const selectedOption = selectedId ? optionsWithVotes.find((option) => option.id === selectedId) : null
  const selectedPercentage = selectedOption && totalVotes > 0
    ? Math.round((selectedOption.totalVotes / totalVotes) * 100)
    : 0

  function revealAndStore(nextWord: InventedWord, id: string, earnedPoints: number) {
    const hadPoints = window.localStorage.getItem(wordPointsStorageKey(locale, nextWord)) !== null
    const previousScore = Number(window.localStorage.getItem(scoreStorageKey())) || 0
    const nextScore = hadPoints ? previousScore : previousScore + earnedPoints

    window.localStorage.setItem(voteStorageKey(locale, nextWord), id)
    window.localStorage.setItem(wordPointsStorageKey(locale, nextWord), String(earnedPoints))
    window.localStorage.setItem(scoreStorageKey(), String(nextScore))

    setSelectedId(id)
    setRoundPoints(earnedPoints)
    setScore(nextScore)
    setHasVoted(true)
  }

  function fallbackVote(id: string) {
    const key = localVoteKey(locale, id)
    const nextCount = (Number(window.localStorage.getItem(key)) || 0) + 1
    window.localStorage.setItem(key, String(nextCount))

    const nextWord = {
      ...word,
      source: "static" as const,
      options: word.options.map((option) => option.id === id ? { ...option, votes: option.votes + 1 } : option)
    }
    const rankedAfterVote = [...nextWord.options].sort((a, b) => b.votes - a.votes)
    const rankIndex = rankedAfterVote.findIndex((option) => option.id === id)
    const earnedPoints = pointsForRank(rankIndex)

    setWord(nextWord)
    setUsingDatabase(false)
    revealAndStore(nextWord, id, earnedPoints)
  }

  async function selectOption(id: string) {
    if (hasVoted || saving || window.localStorage.getItem(voteStorageKey(locale, word))) return
    setSaving(true)

    try {
      const response = await fetch("/api/game/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          wordSlug: word.slug,
          definitionId: id,
          anonymousId: getAnonymousId()
        })
      })

      if (!response.ok) throw new Error("Database vote failed")
      const payload = await response.json() as VoteResponse
      const nextWord = payload.word
      setWord(nextWord)
      setUsingDatabase(nextWord.source === "database")
      revealAndStore(nextWord, payload.selectedDefinitionId, payload.pointsAwarded)
    } catch {
      fallbackVote(id)
    } finally {
      setSaving(false)
    }
  }

  function nextWord() {
    setWordIndex((current) => (current + 1) % words.length)
  }

  async function copyResult() {
    if (!hasVoted) return
    const message = `${word.word}: ${communityPick.text} — ${t.pointsEarned}: +${roundPoints} — LexiBorn`
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="gameLayout">
      <div className="gameCard mainGameCard">
        <div className="gameTopline">
          <span className="pill">{t.playTitle}</span>
          <span className="muted">{word.originHint}</span>
        </div>

        <h1 className="gameWord">{word.word}</h1>
        <p className="pronunciation">{t.pronunciation}: {word.pronunciation}</p>
        <p className="gameSubtitle">{t.playSubtitle}</p>

        <div className="optionList">
          {word.options.map((option) => {
            const active = selectedId === option.id
            const rankIndex = optionsWithVotes.findIndex((item) => item.id === option.id)
            const effectiveBadge = rankIndex === 0 ? "community" : option.badge === "community" ? undefined : option.badge
            const label = badgeLabel(locale, effectiveBadge)
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0

            return (
              <button
                key={option.id}
                type="button"
                className={`definitionOption ${active ? "active" : ""} ${hasVoted ? "revealed" : ""}`}
                onClick={() => selectOption(option.id)}
                disabled={hasVoted || saving}
              >
                <span className="optionText">{option.text}</span>
                {hasVoted && label ? <span className="badge">{label}</span> : null}
                <span className="optionFooter">
                  <span>{active && hasVoted ? t.yourGuess : saving ? t.vote : t.choose}</span>
                  {hasVoted ? <span>{percentage}%</span> : null}
                </span>
                {hasVoted ? <span className="voteBar" style={{ width: `${percentage}%` }} /> : null}
              </button>
            )
          })}
        </div>

        <div className="gameActions">
          <div className="scorePill" aria-live="polite">
            <span>{t.totalScore}</span>
            <strong>{score}</strong>
          </div>
          <div className="scorePill dbPill" title={usingDatabase ? t.dbLive : t.dbOffline}>
            <span>{usingDatabase ? t.dbLive : t.dbOffline}</span>
            <strong>{usingDatabase ? "DB" : "Local"}</strong>
          </div>
          <button className="secondaryButton" type="button" onClick={nextWord}>{t.next}</button>
          <button className="secondaryButton" type="button" onClick={copyResult} disabled={!hasVoted}>
            {copied ? t.copied : t.share}
          </button>
        </div>
      </div>

      <aside className="gameCard resultPanel">
        {!hasVoted ? (
          <div className="lockedResult">
            <span className="pill soft">{t.selectToReveal}</span>
            <h2>{t.resultLockedTitle}</h2>
            <p>{t.resultLockedText}</p>
            <div className="scorePreviewGrid">
              <div>
                <strong>+100</strong>
                <span>{t.rankOne}</span>
              </div>
              <div>
                <strong>+75</strong>
                <span>{t.rankTwo}</span>
              </div>
              <div>
                <strong>+50</strong>
                <span>{t.rankThree}</span>
              </div>
              <div>
                <strong>+25</strong>
                <span>{t.rankFour}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <span className="pill soft">{t.result}</span>
            <div className="pointsBox">
              <span>{t.pointsEarned}</span>
              <strong>+{roundPoints}</strong>
              <p>
                {selectedRankIndex >= 0 ? `#${selectedRankIndex + 1}` : ""}
                {selectedRankIndex >= 0 ? " · " : ""}
                {selectedPercentage}%
              </p>
            </div>

            <h2>{t.topGuesses}</h2>
            <div className="leaderboard">
              {optionsWithVotes.map((option, index) => {
                const percentage = totalVotes > 0 ? Math.round((option.totalVotes / totalVotes) * 100) : 0
                const effectiveBadge = index === 0 ? "community" : option.badge === "community" ? undefined : option.badge
                const label = badgeLabel(locale, effectiveBadge)
                const isYourPick = selectedId === option.id
                return (
                  <div className={`leaderRow ${isYourPick ? "yourPick" : ""}`} key={option.id}>
                    <div>
                      <strong>#{index + 1}</strong>
                      <p>{option.text}</p>
                      <div className="leaderBadges">
                        {label ? <span className="smallBadge">{label}</span> : null}
                        {isYourPick ? <span className="smallBadge yourGuessBadge">{t.yourGuess}</span> : null}
                      </div>
                    </div>
                    <span>{percentage}%</span>
                  </div>
                )
              })}
            </div>

            <div className="officialBox">
              <span>{t.officialMeaning}</span>
              <strong>{communityPick.text}</strong>
            </div>

            <div className="officialBox ghostBox">
              <span>{t.example}</span>
              <strong>{word.example}</strong>
            </div>

            <Link className="wordLink" href={`/${locale}/${routes.word}/${word.slug}`}>
              {word.word} SEO page →
            </Link>
          </>
        )}
      </aside>
    </section>
  )
}
