import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'おたよりん - 学校のお便りをカレンダーに自動登録',
  description: '学校のお便りを写真1枚でGoogleカレンダーに自動登録。手入力ゼロ、家族に自動共有。子育て世代の「また忘れた！」をなくす。',
  openGraph: {
    title: 'おたよりん - 学校のお便りをカレンダーに自動登録',
    description: '写真1枚でGoogleカレンダーに自動登録。手入力ゼロ、家族に自動共有。',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  )
}
