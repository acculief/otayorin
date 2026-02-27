import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アーカイブ',
  description: '保存済みのお便り一覧',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export default async function ArchivePage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('otayorin_uid')?.value

  let newsletters: Array<{
    id: string
    created_at: string
    event_count: number
    raw_text: string
  }> = []

  if (userId) {
    const { data } = await supabase
      .from('otayorin_newsletters')
      .select('id, created_at, event_count, raw_text')
      .eq('user_email', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    newsletters = data ?? []
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-lg text-blue-600">📄 おたよりん</Link>
          <Link href="/app" className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-full hover:bg-blue-100">
            読み取る
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">アーカイブ</h1>
          <p className="text-gray-500 text-sm mt-1">これまで読み取ったお便りの履歴</p>
        </div>

        {!userId || newsletters.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-gray-700 font-bold">まだ読み取り履歴がありません</p>
            <p className="text-gray-400 text-sm mt-2">お便りを読み取ると、ここに保存されます。</p>
            <Link href="/app" className="inline-block mt-6 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700">
              お便りを読み取る →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">{newsletters.length}件のお便り</p>
            {newsletters.map((n) => {
              const preview = n.raw_text
                .replace(/\n+/g, ' ')
                .trim()
                .slice(0, 60)
              return (
                <div key={n.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">{formatDate(n.created_at)}</p>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed line-clamp-2">{preview}...</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg">
                        📅 {n.event_count}件
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-blue-800 font-bold text-sm">🔍 アーカイブを全文検索したいですか？</p>
          <p className="text-blue-600 text-xs mt-1">スタンダードプラン（¥380/月）で全文検索・無制限保存が使えます。</p>
          <Link href="/pricing" className="inline-block mt-2 text-xs font-bold text-blue-600 underline">
            詳しく見る →
          </Link>
        </div>
      </main>
    </div>
  )
}
