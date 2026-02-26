import Link from 'next/link'

const features = [
  { icon: '📸', title: '写真1枚でOK', desc: 'お便りを撮影するだけ。手入力ゼロ。' },
  { icon: '📅', title: 'カレンダーに自動登録', desc: 'Googleカレンダーにワンクリックで追加。' },
  { icon: '👨‍👩‍👧', title: '家族で共有', desc: 'パパ・ママ両方のカレンダーに同時追加。' },
  { icon: '🔔', title: '前日リマインダー', desc: '「また忘れた！」が二度とない。' },
]

const voices = [
  { text: '運動会を夫に伝え忘れて大ゲンカ。もうこれなしでは生きられない😂', name: 'ゆかさん・小1ママ' },
  { text: '共働きで時間がなさすぎる。ランドセルからくしゃくしゃのプリント問題がついに解決', name: 'たかしさん・パパ' },
  { text: '保育園のお知らせも全部読み取れた！神アプリすぎる', name: 'みなこさん・年長ママ' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-black text-xl text-blue-600">📄 おたよりん</span>
          <Link href="/app" className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            無料で試す
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-block bg-blue-50 text-blue-600 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
          子育て世代の悩みを解決
        </div>
        <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">
          学校のお便りを<br />
          <span className="text-blue-600">写真1枚で</span><br />
          カレンダーに登録
        </h1>
        <p className="text-gray-500 text-lg mb-2">手入力ゼロ。家族に自動共有。</p>
        <p className="text-gray-400 text-sm mb-8">「また行事を忘れた！」が二度とない。</p>
        <Link
          href="/app"
          className="inline-block bg-blue-600 text-white font-black text-xl px-10 py-5 rounded-2xl hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5 shadow-md"
        >
          無料で試してみる →
        </Link>
        <p className="text-gray-400 text-xs mt-3">登録不要・クレジットカード不要</p>
      </section>

      {/* Demo image area */}
      <section className="max-w-xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 text-center border border-blue-100">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="w-16 h-20 bg-white rounded-xl shadow-md flex items-center justify-center text-3xl mb-2">📄</div>
              <p className="text-xs text-gray-500">お便り</p>
            </div>
            <div className="text-3xl text-blue-400">→</div>
            <div className="text-center">
              <div className="w-16 h-20 bg-white rounded-xl shadow-md flex items-center justify-center text-3xl mb-2">📸</div>
              <p className="text-xs text-gray-500">写真を撮る</p>
            </div>
            <div className="text-3xl text-blue-400">→</div>
            <div className="text-center">
              <div className="w-16 h-20 bg-blue-600 rounded-xl shadow-md flex items-center justify-center text-3xl mb-2">📅</div>
              <p className="text-xs text-blue-600 font-bold">カレンダー登録！</p>
            </div>
          </div>
          <p className="text-blue-700 font-bold mt-6 text-sm">これだけです。</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-6">なぜ選ばれるのか</h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-50 rounded-2xl p-4">
              <div className="text-3xl mb-2">{f.icon}</div>
              <p className="font-bold text-gray-900 text-sm">{f.title}</p>
              <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Voices */}
      <section className="max-w-xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-6">使った人の声</h2>
        <div className="space-y-3">
          {voices.map((v) => (
            <div key={v.name} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-gray-700 text-sm leading-relaxed">&ldquo;{v.text}&rdquo;</p>
              <p className="text-gray-400 text-xs mt-2 text-right">— {v.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="max-w-xl mx-auto px-4 pb-16">
        <div className="bg-blue-600 rounded-3xl p-8 text-center text-white">
          <p className="font-bold text-blue-200 text-sm mb-2">ファミリープラン</p>
          <p className="text-5xl font-black mb-1">¥480<span className="text-2xl font-bold text-blue-200">/月</span></p>
          <p className="text-blue-200 text-sm mb-6">無制限・家族5人まで・リマインダー付き</p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-blue-600 font-black px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            詳しく見る
          </Link>
          <p className="text-blue-300 text-xs mt-3">まずは無料版から（月3件まで）</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">📄 おたよりん</p>
          <p className="text-gray-300 text-xs mt-1">学校のお便りを家族のカレンダーへ</p>
        </div>
      </footer>
    </div>
  )
}
