'use client'
import { useState } from 'react'
import Link from 'next/link'

const FREE_FEATURES = [
  '月3件まで読み取り',
  '1人のみ',
  'Googleカレンダー追加（ディープリンク）',
]
const FREE_LIMITS = [
  'リマインダーなし',
  '家族共有なし',
  '履歴保存なし',
]

const PAID_FEATURES = [
  '無制限読み取り',
  '家族5人まで共有',
  '前日・3日前リマインダー',
  'お便り履歴保存',
  'Googleカレンダー自動同期',
  '優先サポート',
]

export default function PricingPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!email.trim()) {
      alert('メールアドレスを入力してください')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('エラーが発生しました。再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-lg text-blue-600">📄 おたよりん</Link>
          <Link href="/app" className="text-sm text-blue-600 font-bold">アプリを試す</Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900">シンプルな料金</h1>
          <p className="text-gray-500 mt-2">まずは無料から。いつでもアップグレード。</p>
        </div>

        <div className="grid gap-4">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm">
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">無料プラン</p>
              <p className="text-4xl font-black text-gray-900 mt-1">¥0<span className="text-lg font-normal text-gray-400">/月</span></p>
              <p className="text-gray-400 text-sm mt-1">まずは試してみたい方に</p>
            </div>
            <div className="space-y-2 mb-6">
              {FREE_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span> {f}
                </div>
              ))}
              {FREE_LIMITS.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-400">
                  <span>✗</span> {f}
                </div>
              ))}
            </div>
            <Link
              href="/app"
              className="block w-full py-3 text-center bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              無料で使う
            </Link>
          </div>

          {/* Family Plan */}
          <div className="bg-blue-600 rounded-3xl p-6 border-2 border-blue-600 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded-full">
              おすすめ
            </div>
            <div className="mb-4">
              <p className="text-sm font-bold text-blue-200 uppercase tracking-wide">ファミリープラン</p>
              <p className="text-4xl font-black mt-1">¥480<span className="text-lg font-normal text-blue-200">/月</span></p>
              <p className="text-blue-200 text-sm mt-1">コーヒー1杯より安く、ケンカが減る</p>
            </div>
            <div className="space-y-2 mb-6">
              {PAID_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-white">
                  <span className="text-yellow-300">✓</span> {f}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力"
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:bg-white/30 text-sm"
              />
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 bg-white text-blue-600 font-black rounded-xl hover:bg-blue-50 transition-all hover:shadow-md disabled:opacity-60 text-lg"
              >
                {loading ? '処理中...' : '今すぐ始める →'}
              </button>
              <p className="text-blue-200 text-xs text-center">
                いつでもキャンセル可能 · 初月無料トライアル
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-3 text-sm">よくある質問</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold text-gray-700">どんなお便りに対応していますか？</p>
              <p className="text-gray-500 mt-1">学校・保育園・幼稚園・習い事・医療機関など、日付が書かれた書類に対応しています。</p>
            </div>
            <div>
              <p className="font-bold text-gray-700">家族共有はどうやるの？</p>
              <p className="text-gray-500 mt-1">共有リンクを送るだけ。パパ・ママ両方のGoogleカレンダーに同じイベントを追加できます。</p>
            </div>
            <div>
              <p className="font-bold text-gray-700">解約はいつでもできますか？</p>
              <p className="text-gray-500 mt-1">はい。いつでもキャンセル可能です。解約後も期間終了まで使えます。</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
