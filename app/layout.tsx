import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "LexiBorn - Invented Word Game",
  description: "A multilingual daily game for words that do not exist yet.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lexiborn.example.com")
}

const themeScript = `
(function(){
  try {
    var saved = localStorage.getItem('lexiborn-theme');
    var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch(e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  )
}
