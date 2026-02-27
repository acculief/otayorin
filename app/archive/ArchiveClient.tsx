'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Newsletter {
  id: string
  created_at: string
  event_count: number
  raw_text: string
}

interface Props {
  newsletters: Newsletter[]
  isPremium: boolean
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return (
    d.getFullYear() +
    '/' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '/' +
    String(d.getDate()).padStart(2, '0') +
    ' ' +
    String(d.getHours()).padStart(2, '0') +
    ':' +
    String(d.getMinutes()).padStart(2, '0')
  )
}

function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp('(' + escaped + ')', 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function ArchiveClient({ newsletters, isPremium }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!isPremium || !query.trim()) return newsletters
    const q = query.toLowerCase()
    return newsletters.filter((n) => n.raw_text.toLowerCase().includes(q))
  }, [newsletters, query, isPremium])

  return (
    <>
      {/* 検索ボックス */}
      {isPremium ? (
        <div className="mb-5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="キーワードで検索..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>
          {query && (
            <p className="text-xs text-gray-500 mt-1.5 ml-1">
              {filtered.length}件ヒット（全{newsletters.length}件中）
            </p>
          )}
        </div>
      ) : (
        <div className="mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-blue-800 font-bold text-sm">
            🔍 アーカイブを全文検索したいですか？
          </p>
          <p className="text-blue-600 text-xs mt-1">
            スタンダードプラン（¥380/月）で全文検索・無制限保存が使えます。
          </p>
          <Link
            href="/pricing"
            className="inline-block mt-2 text-xs font-bold text-blue-600 underline"
          >
            詳しく見る →
          </Link>
        </div>
      )}

      {/* 検索結果なし */}
      {isPremium && query && filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-gray-700 font-bold">
            「{query}」に一致するお便りがありません
          </p>
          <button
            onClick={() => setQuery('')}
            className="mt-4 text-sm text-blue-600 underline"
          >
            検索をクリア
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {!query && (
            <p className="text-sm text-gray-500">{newsletters.length}件のお便り</p>
          )}
          {filtered.map((n) => {
            let preview: string
            if (isPremium && query.trim()) {
              const idx = n.raw_text.toLowerCase().indexOf(query.toLowerCase())
              const start = Math.max(0, idx - 30)
              const end = Math.min(n.raw_text.length, idx + 80)
              preview =
                (start > 0 ? '...' : '') +
                n.raw_text
                  .slice(start, end)
                  .replace(/\n+/g, ' ') +
                (end < n.raw_text.length ? '...' : '')
            } else {
              preview =
                n.raw_text.replace(/\n+/g, ' ').trim().slice(0, 60) + '...'
            }

            return (
              <div
                key={n.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">
                      {formatDate(n.created_at)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed line-clamp-2">
                      {isPremium && query ? (
                        <Highlighted text={preview} query={query} />
                      ) : (
                        preview
                      )}
                    </p>
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
    </>
  )
}
