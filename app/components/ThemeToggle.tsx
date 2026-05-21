"use client"

import { useEffect, useState } from "react"
import type { Locale } from "../lib/i18n"
import { ui } from "../lib/i18n"

type Theme = "light" | "dark"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"
  const saved = window.localStorage.getItem("lexiborn-theme")
  if (saved === "light" || saved === "dark") return saved
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export default function ThemeToggle({ locale }: { locale: Locale }) {
  const [theme, setTheme] = useState<Theme>("light")
  const t = ui[locale]

  useEffect(() => {
    const initial = getInitialTheme()
    setTheme(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    document.documentElement.dataset.theme = next
    window.localStorage.setItem("lexiborn-theme", next)
  }

  return (
    <button className="themeToggle" type="button" onClick={toggleTheme} aria-label="Toggle theme">
      <span className="themeIcon">{theme === "dark" ? "☾" : "☀"}</span>
      <span>{theme === "dark" ? t.themeDark : t.themeLight}</span>
    </button>
  )
}
