import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-3xl p-8 shadow-lg text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">ありがとうございます！</h1>
        <p className="text-gray-500 mb-2">ファミリープランのご登録が完了しました。</p>
        <p className="text-gray-400 text-sm mb-8">確認メールをお送りしました。さっそく使ってみましょう！</p>
        <Link
          href="/app"
          className="block w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-colors text-lg"
        >
          おたよりんを使う →
        </Link>
        <Link href="/" className="block mt-4 text-gray-400 text-sm hover:text-gray-600">
          トップに戻る
        </Link>
      </div>
    </div>
  )
}
