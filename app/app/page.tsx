'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ExtractedEvent, buildCalendarLink, formatDisplayDate } from '@/lib/events'

type State = 'idle' | 'loading' | 'done' | 'error' | 'quota'

export default function AppPage() {
  const [state, setState] = useState<State>('idle')
  const [events, setEvents] = useState<ExtractedEvent[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [added, setAdded] = useState<Set<string>>(new Set())
  const [allAdded, setAllAdded] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const process = useCallback(async (file: File | null, demo = false) => {
    setState('loading')
    setEvents([])
    setAdded(new Set())
    setAllAdded(false)

    if (file) {
      setPreview(URL.createObjectURL(file))
    }

    try {
      const fd = new FormData()
      if (file) fd.append('image', file)
      if (demo) fd.append('demo', 'true')

      const res = await fetch('/api/extract', { method: 'POST', body: fd })
      const data = await res.json()

      if (res.status === 429 && data.error === 'QUOTA_EXCEEDED') {
        setState('quota')
        return
      }
      if (data.error) throw new Error(data.error)
      setEvents(data.events)
      setState('done')
    } catch {
      setState('error')
    }
  }, [])

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    process(file)
  }

  const addEvent = (id: string) => {
    setAdded(prev => new Set([...prev, id]))
  }

  const addAll = () => {
    setAdded(new Set(events.map(e => e.id)))
    setAllAdded(true)
  }

  const reset = () => {
    setState('idle')
    setPreview(null)
    setEvents([])
    setAdded(new Set())
    setAllAdded(false)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-lg text-blue-600">📄 おたよりん</Link>
          <Link href="/pricing" className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-full hover:bg-blue-100">
            スタンダード ¥380/月
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Upload */}
        {state === 'idle' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">お便りを読み取る</h1>
              <p className="text-gray-500 text-sm mt-1">写真を撮るだけ。Googleカレンダーに自動登録。</p>
            </div>

            <div
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50/50'}`}
            >
              <div className="text-6xl mb-4">📸</div>
              <p className="text-gray-700 font-bold text-lg">お便りをここにドロップ</p>
              <p className="text-gray-400 text-sm mt-2">またはタップして写真を選択</p>
              <p className="text-gray-300 text-xs mt-1">JPG / PNG / HEIC 対応</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">または</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              onClick={() => process(null, true)}
              className="w-full py-3.5 bg-white border-2 border-blue-200 text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-colors"
            >
              📋 サンプルで試す（デモ）
            </button>
          </div>
        )}

        {/* Loading */}
        {state === 'loading' && (
          <div className="text-center py-24">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">📄</div>
            </div>
            {preview && (
              <img src={preview} className="w-24 h-24 object-cover rounded-xl mx-auto mb-4 opacity-60" alt="preview" />
            )}
            <p className="text-gray-700 font-bold text-lg">お便りを解析中...</p>
            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <p>✓ 文字を認識中</p>
              <p>✓ 日付を抽出中</p>
              <p className="animate-pulse">⟳ イベントを整理中...</p>
            </div>
          </div>
        )}

        {/* Quota exceeded */}
        {state === 'quota' && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔒</div>
            <p className="text-gray-900 font-black text-xl">今月の無料枠を使い切りました</p>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              無料プランは月1件まで読み取れます。<br />
              スタンダードプランなら無制限＋アーカイブ保存もできます。
            </p>
            <div className="mt-8 bg-blue-600 rounded-3xl p-6 text-white text-left">
              <p className="text-sm font-bold text-blue-200 uppercase mb-2">スタンダードプラン</p>
              <p className="text-3xl font-black">¥380<span className="text-base font-normal text-blue-200">/月</span></p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex gap-2"><span className="text-yellow-300">✓</span> 無制限読み取り</li>
                <li className="flex gap-2"><span className="text-yellow-300">✓</span> 全件アーカイブ保存</li>
                <li className="flex gap-2"><span className="text-yellow-300">✓</span> 全文検索</li>
                <li className="flex gap-2"><span className="text-yellow-300">✓</span> 持ち物リスト自動抽出</li>
                <li className="flex gap-2"><span className="text-yellow-300">✓</span> LINE週次まとめ配信</li>
              </ul>
              <Link
                href="/pricing"
                className="block mt-6 py-4 bg-white text-blue-600 font-black text-center rounded-xl hover:bg-blue-50 text-lg"
              >
                アップグレードする →
              </Link>
            </div>
            <button onClick={reset} className="mt-6 text-gray-400 text-sm hover:text-gray-600">
              ← 戻る
            </button>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">😢</div>
            <p className="text-gray-700 font-bold">読み取りに失敗しました</p>
            <p className="text-gray-400 text-sm mt-1">画像を変えて再度お試しください</p>
            <button onClick={reset} className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl">
              もう一度試す
            </button>
          </div>
        )}

        {/* Results */}
        {state === 'done' && (
          <div className="space-y-4">
            {/* Summary bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-black text-gray-900 text-lg">{events.length}件のイベントを検出</p>
                <p className="text-gray-400 text-xs mt-0.5">Googleカレンダーに追加できます</p>
              </div>
              <button
                onClick={addAll}
                disabled={allAdded}
                className={`font-bold text-sm px-4 py-2.5 rounded-xl transition-all ${allAdded ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`}
              >
                {allAdded ? '✅ 全件追加済み' : '📅 全件追加'}
              </button>
            </div>

            {/* Event cards */}
            <div className="space-y-3">
              {events.map((event) => {
                const isAdded = added.has(event.id)
                return (
                  <div
                    key={event.id}
                    className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all ${isAdded ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{event.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900">{event.title}</p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span className="text-blue-600 text-sm font-medium">
                            📅 {formatDisplayDate(event.date)}
                          </span>
                          {event.startTime && (
                            <span className="text-gray-500 text-sm">
                              ⏰ {event.startTime}{event.endTime ? `〜${event.endTime}` : ''}
                            </span>
                          )}
                        </div>
                        {event.note && (
                          <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{event.note}</p>
                        )}
                      </div>
                      <a
                        href={buildCalendarLink(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => addEvent(event.id)}
                        className={`flex-shrink-0 text-xs font-bold px-3 py-2 rounded-xl transition-all whitespace-nowrap ${isAdded ? 'bg-blue-100 text-blue-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`}
                      >
                        {isAdded ? '✅ 追加済み' : 'カレンダーに\n追加'}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Upgrade nudge */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-blue-800 font-bold text-sm">📚 お便りを保存しておきたいですか？</p>
              <p className="text-blue-600 text-xs mt-1">スタンダードプラン（¥380/月）で全件アーカイブ＋全文検索が使えます。</p>
              <Link href="/pricing" className="inline-block mt-2 text-xs font-bold text-blue-600 underline">
                詳しく見る →
              </Link>
            </div>

            <button onClick={reset} className="w-full py-3 text-gray-400 text-sm hover:text-gray-600">
              別のお便りを読み取る →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
