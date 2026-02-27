import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'おたよりん｜学校のお便りを写真1枚でカレンダー登録',
  description: '学校・保育園のお便りを写真に撮るだけ。Googleカレンダーに自動登録。手入力ゼロ、家族に共有。持ち物リストも自動抽出。月380円から。',
  alternates: { canonical: 'https://otayorin.vercel.app' },
  openGraph: {
    title: 'おたよりん｜学校のお便りを写真1枚でカレンダー登録',
    description: '写真1枚でGoogleカレンダーに自動登録。持ち物リストも自動抽出。手入力ゼロ。',
    url: 'https://otayorin.vercel.app',
    type: 'website',
  },
}

const features = [
  { icon: '📸', title: '写真1枚でOK', desc: 'お便りを撮影するだけ。手入力ゼロ。' },
  { icon: '📅', title: 'カレンダーに自動登録', desc: 'Googleカレンダーにワンクリックで追加。' },
  { icon: '🎒', title: '持ち物リスト抽出', desc: '「体操服・お弁当・水筒」を自動で一覧化。' },
  { icon: '📚', title: 'アーカイブ保存', desc: '全てのお便りを後から検索できる。' },
]

const steps = [
  { num: '1', icon: '📄', label: 'お便りを準備', desc: 'くしゃくしゃでもOK' },
  { num: '2', icon: '📸', label: 'スマホで撮影', desc: 'タップして選ぶだけ' },
  { num: '3', icon: '✨', label: 'AI解析', desc: '日程・持ち物を自動抽出' },
  { num: '4', icon: '📅', label: 'カレンダーに追加', desc: 'ボタン1つで完了' },
]

const voices = [
  { text: '運動会を夫に伝え忘れて大ゲンカ。もうこれなしでは生きられない😂', name: 'ゆかさん・小1ママ' },
  { text: '共働きで時間がなさすぎる。ランドセルからくしゃくしゃのプリント問題がついに解決！', name: 'たかしさん・パパ' },
  { text: '保育園のお知らせも全部読み取れた！持ち物リスト機能が本当に助かる', name: 'みなこさん・年長ママ' },
]

const faqs = [
  { q: '手書きのお便りも読めますか？', a: 'はい、Google Cloud Vision AIを使っているため、印刷・手書き問わず高精度で読み取れます。' },
  { q: '登録なしで使えますか？', a: '無料プランは登録不要でそのまま使えます。月1件の読み取りが無料です。' },
  { q: '子どもが複数いても使えますか？', a: 'はい。お便りごとに読み込むので、何人分でもお使いいただけます。' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-black text-xl text-blue-600">📄 おたよりん</span>
          <Link href="/app" className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            無料で試す
          </Link>
        </div>
      </header>

      <section className="max-w-xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-block bg-blue-50 text-blue-600 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
          子育て世代の「また忘れた！」をなくす
        </div>
        <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">
          学校のお便りを<br />
          <span className="text-blue-600">写真1枚で</span><br />
          カレンダーに登録
        </h1>
        <p className="text-gray-500 text-lg mb-1">手入力ゼロ。持ち物リストも自動抽出。</p>
        <p className="text-gray-400 text-sm mb-8">「また行事を忘れた！」「持ち物何だっけ？」が二度とない。</p>
        <Link
          href="/app"
          className="inline-block bg-blue-600 text-white font-black text-xl px-10 py-5 rounded-2xl hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5 shadow-md"
        >
          無料で試してみる →
        </Link>
        <p className="text-gray-400 text-xs mt-3">登録不要・クレジットカード不要</p>
      </section>

      <section className="max-w-xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
          <div className="flex items-start justify-center gap-2 overflow-x-auto">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-start gap-2 flex-shrink-0">
                <div className="text-center w-20">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-2xl mx-auto mb-2">
                    {step.icon}
                  </div>
                  <p className="text-xs font-black text-blue-700">{step.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="text-2xl text-blue-300 mt-4 flex-shrink-0">→</div>
                )}
              </div>
            ))}
          </div>
          <p className="text-blue-700 font-bold mt-6 text-sm text-center">たったこれだけ。30秒で完了。</p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-6">できること</h2>
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

      <section className="max-w-xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-6">料金</h2>
        <div className="grid gap-3">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase">無料プラン</p>
            <p className="text-3xl font-black text-gray-900 mt-1">¥0</p>
            <p className="text-gray-400 text-sm mt-1 mb-3">月1件まで・登録不要</p>
            <Link href="/app" className="block w-full py-2.5 text-center bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 text-sm">
              今すぐ試す
            </Link>
          </div>
          <div className="bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded-full">
              おすすめ
            </div>
            <p className="text-sm font-bold text-blue-200">スタンダードプラン</p>
            <p className="text-5xl font-black mt-1 mb-1">¥380<span className="text-2xl font-normal text-blue-200">/月</span></p>
            <p className="text-blue-200 text-sm mb-4">コーヒー1杯より安い</p>
            <ul className="space-y-1.5 mb-5 text-sm">
              {['無制限読み取り', '全件アーカイブ保存', '全文検索', '持ち物リスト自動抽出', 'LINE週次まとめ配信'].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/pricing"
              className="block py-4 bg-white text-blue-600 font-black text-center rounded-xl hover:bg-blue-50 text-lg"
            >
              詳しく見る →
            </Link>
            <p className="text-blue-300 text-xs text-center mt-2">初月無料トライアル付き</p>
          </div>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-6">よくある質問</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Q. {faq.q}</p>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 pb-16 text-center">
        <div className="bg-blue-600 rounded-3xl p-10 text-white">
          <p className="text-3xl font-black mb-2">まずは無料から</p>
          <p className="text-blue-200 mb-6">登録不要・30秒で使えます</p>
          <Link
            href="/app"
            className="inline-block bg-white text-blue-600 font-black text-xl px-10 py-4 rounded-2xl hover:bg-blue-50 transition-colors shadow-md"
          >
            無料で試してみる →
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">📄 おたよりん</p>
          <p className="text-gray-300 text-xs mt-1">学校のお便りを家族のカレンダーへ</p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/pricing" className="text-gray-300 text-xs hover:text-gray-500">料金</Link>
            <Link href="/app" className="text-gray-300 text-xs hover:text-gray-500">アプリ</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
