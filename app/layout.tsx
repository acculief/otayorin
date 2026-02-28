import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = 'https://otayorin.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'おたよりん｜学校のお便りを写真1枚でカレンダー登録',
    template: '%s | おたよりん',
  },
  description: '学校・保育園のお便りを写真に撮るだけ。Googleカレンダーに自動登録。持ち物リストも自動抽出。手入力ゼロ。月380円から。',
  verification: { google: '0uJTSoLifNf9F30GBAdAstHG5n6Ci6kGC29csJZbdRM' },
  openGraph: {
    title: 'おたよりん｜学校のお便りを写真1枚でカレンダー登録',
    description: '写真1枚でGoogleカレンダーに自動登録。持ち物リストも自動抽出。手入力ゼロ。',
    url: SITE_URL,
    siteName: 'おたよりん',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'おたよりん｜学校のお便りを写真1枚でカレンダー登録',
    description: '写真1枚でGoogleカレンダーに自動登録。持ち物リストも自動抽出。',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  )
}
