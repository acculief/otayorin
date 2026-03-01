import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'おたよりんのプライバシーポリシーです。',
  robots: { index: false },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="font-black text-xl text-blue-600">📄 おたよりん</Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12 prose prose-sm">
        <h1 className="text-2xl font-black text-gray-900 mb-8">プライバシーポリシー</h1>

        <p className="text-gray-500 text-sm mb-8">最終更新日：2025年3月1日</p>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. 収集する情報</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            おたよりん（以下「本サービス」）は、以下の情報を収集する場合があります。
          </p>
          <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
            <li>アップロードされたお便りの画像・テキスト内容（OCR処理のため）</li>
            <li>メールアドレス（有料プラン登録時）</li>
            <li>ブラウザのCookieによる匿名識別子（無料枠管理のため）</li>
            <li>アクセスログ（IPアドレス、ブラウザ情報等）</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. 情報の利用目的</h2>
          <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
            <li>お便りからのイベント・持ち物情報の抽出</li>
            <li>アーカイブ機能の提供</li>
            <li>有料プランの管理・決済処理</li>
            <li>サービスの改善・障害対応</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. 第三者への提供</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            本サービスは、以下の場合を除き、収集した個人情報を第三者に提供しません。
          </p>
          <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>サービス提供に必要な業務委託先（Supabase、Stripe、Google Cloud Vision API等）</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. 画像データの取り扱い</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            アップロードされたお便りの画像は、テキスト抽出（OCR）処理のためにのみ使用されます。
            処理後、画像ファイル自体はサーバーに保存されません。
            抽出されたテキスト内容は、有料プランのアーカイブ機能でのみ保存されます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. Cookieの使用</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            本サービスは、無料枠の利用回数管理のためにブラウザのCookieを使用します。
            Cookieには個人を特定できる情報は含まれません。
            ブラウザの設定によりCookieを無効にすることも可能ですが、
            その場合、一部機能が正常に動作しないことがあります。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. セキュリティ</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            本サービスは、収集した情報の安全管理のため、
            通信の暗号化（HTTPS）、アクセス制限等の適切な安全措置を講じています。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. お問い合わせ</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            プライバシーポリシーに関するお問い合わせは、
            サービス内のお問い合わせフォームよりご連絡ください。
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-gray-100">
          <Link href="/" className="text-blue-600 text-sm hover:underline">← トップに戻る</Link>
        </div>
      </main>
    </div>
  )
}
