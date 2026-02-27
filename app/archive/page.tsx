import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import type { Metadata } from 'next'
import ArchiveClient from './ArchiveClient'

export const metadata: Metadata = {
  title: 'アーカイブ',
  description: '保存済みのお便り一覧',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkIsPremium(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('otayorin_users')
    .select('plan')
    .eq('email', userId)
    .single()
  return data?.plan === 'standard'
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
  let isPremium = false

  if (userId) {
    const [newslettersResult, premiumResult] = await Promise.all([
      supabase
        .from('otayorin_newsletters')
        .select('id, created_at, event_count, raw_text')
        .eq('user_email', userId)
        .order('created_at', { ascending: false })
        .limit(200),
      checkIsPremium(userId),
    ])
    newsletters = newslettersResult.data ?? []
    isPremium = premiumResult
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
          <ArchiveClient newsletters={newsletters} isPremium={isPremium} />
        )}
      </main>
    </div>
  )
}
