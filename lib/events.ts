export interface ExtractedEvent {
  id: string
  title: string
  date: string       // YYYY-MM-DD
  startTime?: string // HH:MM
  endTime?: string   // HH:MM
  note?: string
  icon: string
}

const EVENT_ICONS: Record<string, string> = {
  '運動会': '🏃', '体育祭': '🏃', '遠足': '🎒', '修学旅行': '🚌',
  '入学': '🌸', '卒業': '🎓', '始業式': '📚', '終業式': '🏖️',
  '保護者会': '👥', '懇談会': '👥', '個人懇談': '💬', '面談': '💬',
  '授業参観': '👀', '参観日': '👀', '学習発表会': '🎭',
  '運動': '⚽', '水泳': '🏊', 'プール': '🏊', '音楽会': '🎵',
  '夏休み': '🌻', '冬休み': '⛄', '春休み': '🌸',
  '給食': '🍱', '健康診断': '🏥', '身体測定': '📏',
  '持久走': '🏃', 'マラソン': '🏃', '発表会': '🎭', '展覧会': '🖼️',
  '入園': '🌸', '卒園': '🎓', '避難訓練': '🚨', '引き渡し': '🚨',
  '読書': '📖', '図書': '📚', 'クリスマス': '🎄', '七夕': '🎋',
}

function getIcon(title: string): string {
  for (const [keyword, icon] of Object.entries(EVENT_ICONS)) {
    if (title.includes(keyword)) return icon
  }
  return '📅'
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function normalizeTime(t: string): string {
  return t
    .replace(/[：｜]/g, ':')
    .replace(/時(\d+)分/, ':$1')
    .replace(/時$/, ':00')
    .replace(/分$/, '')
    .trim()
}

/** 年またがり推定: お便りが12月で、イベント月が1〜3月なら翌年 */
function inferYear(month: number, refYear: number, refMonth: number): number {
  if (refMonth === 12 && month <= 3) return refYear + 1
  if (refMonth === 11 && month === 1) return refYear + 1
  return refYear
}

export function extractEvents(text: string, refYear?: number): ExtractedEvent[] {
  const now = new Date()
  const year = refYear ?? now.getFullYear()
  const refMonth = now.getMonth() + 1
  const events: ExtractedEvent[] = []
  const seen = new Set<string>()

  // Normalize text: 全角数字→半角、全角スペース→半角
  const normalized = text
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/[　]/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/[・･]/g, ' ')

  function addEvent(mon: number, day: number, rawTitle: string, st?: string, et?: string) {
    const title = rawTitle.trim().replace(/\s+/g, ' ').replace(/[。、，,]$/, '')
    if (!title || title.length < 2) return
    const eventYear = inferYear(mon, year, refMonth)
    const key = `${mon}/${day}/${title}`
    if (seen.has(key)) return
    seen.add(key)
    events.push({
      id: crypto.randomUUID(),
      title,
      date: toDateString(eventYear, mon, day),
      startTime: st ? normalizeTime(st) : undefined,
      endTime: et ? normalizeTime(et) : undefined,
      icon: getIcon(title),
    })
  }

  // Pattern 1: 月日（曜）時刻〜時刻　タイトル
  const p1 = /(\d{1,2})月(\d{1,2})日[（(（]?[月火水木金土日祝振]?[）)）]?\s*(\d{1,2}[:：時]\d{0,2}分?)?(?:[〜~\-～](\d{1,2}[:：時]\d{0,2}分?))?\s+([^\n\d。、\[\]【】]{2,25})/g
  let m: RegExpExecArray | null
  while ((m = p1.exec(normalized)) !== null) {
    const [, mon, day, st, et, rawTitle] = m
    addEvent(parseInt(mon), parseInt(day), rawTitle, st, et)
  }

  // Pattern 2: タイトル　月日（曜）時刻
  const p2 = /([^\n\d。、\[\]【】]{2,20})[\s　]+(\d{1,2})月(\d{1,2})日[（(（]?[月火水木金土日祝振]?[）)）]?\s*(\d{1,2}[:：時]\d{0,2}分?)?/g
  while ((m = p2.exec(normalized)) !== null) {
    const [, rawTitle, mon, day, st] = m
    if (rawTitle.includes('年') || rawTitle.length > 20) continue
    addEvent(parseInt(mon), parseInt(day), rawTitle, st)
  }

  // Pattern 3: 箇条書き ・5月1日　入学式 / 【5月10日】保護者会
  const p3 = /[・●◆▶→\-\*【\[]?\s*(\d{1,2})月(\d{1,2})日[】\]]?\s*[（(]?[月火水木金土日祝振]?[）)]?\s*([^\n\d。、【\]]{2,25})/g
  while ((m = p3.exec(normalized)) !== null) {
    const [, mon, day, rawTitle] = m
    addEvent(parseInt(mon), parseInt(day), rawTitle)
  }

  // Pattern 4: 範囲日程 5月7日（火）〜10日（金）　遠足
  const p4 = /(\d{1,2})月(\d{1,2})日[（(]?[月火水木金土日祝振]?[）)]?[〜~～\-](\d{1,2})日[（(]?[月火水木金土日祝振]?[）)]?\s+([^\n\d。、]{2,25})/g
  while ((m = p4.exec(normalized)) !== null) {
    const [, mon, dayStart, , rawTitle] = m
    addEvent(parseInt(mon), parseInt(dayStart), rawTitle)
  }

  events.sort((a, b) => a.date.localeCompare(b.date))
  return events.slice(0, 20)
}

export function buildCalendarLink(event: ExtractedEvent): string {
  const base = 'https://calendar.google.com/calendar/r/eventedit'
  const params = new URLSearchParams()
  params.set('text', event.title)

  const dateOnly = event.date.replace(/-/g, '')
  if (event.startTime) {
    const [h, mm] = event.startTime.split(':')
    const startDt = `${dateOnly}T${String(h).padStart(2, '0')}${String(mm || '00').padStart(2, '0')}00`
    let endDt = startDt
    if (event.endTime) {
      const [eh, em] = event.endTime.split(':')
      endDt = `${dateOnly}T${String(eh).padStart(2, '0')}${String(em || '00').padStart(2, '0')}00`
    } else {
      const endH = (parseInt(h) + 1) % 24
      endDt = `${dateOnly}T${String(endH).padStart(2, '0')}${String(mm || '00').padStart(2, '0')}00`
    }
    params.set('dates', `${startDt}/${endDt}`)
  } else {
    const d = new Date(event.date + 'T00:00:00')
    d.setDate(d.getDate() + 1)
    const endDateOnly = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
    params.set('dates', `${dateOnly}/${endDateOnly}`)
  }

  if (event.note) params.set('details', event.note)
  return `${base}?${params.toString()}`
}

export function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  return `${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`
}
