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
  return t.replace('：', ':').replace(/時(\d+)分/, ':$1').replace(/時$/, ':00')
}

export function extractEvents(text: string, refYear?: number): ExtractedEvent[] {
  const year = refYear ?? new Date().getFullYear()
  const events: ExtractedEvent[] = []
  const seen = new Set<string>()

  // Normalize text
  const normalized = text
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/\r\n/g, '\n')

  // Pattern 1: 月日（曜）時刻〜時刻　タイトル
  // e.g. "5月18日（土）9:00〜15:00　運動会"
  const p1 = /(\d{1,2})月(\d{1,2})日[（(（]?[月火水木金土日祝]?[）)）]?\s*(\d{1,2}[:：時]\d{0,2}分?)?[〜~\-]?(\d{1,2}[:：時]\d{0,2}分?)?\s+([^\n\d。、]{2,25})/g

  let m: RegExpExecArray | null
  while ((m = p1.exec(normalized)) !== null) {
    const [, mon, day, st, et, rawTitle] = m
    const title = rawTitle.trim().replace(/[　\s]+/g, ' ')
    if (!title || title.length < 2) continue
    const key = `${mon}/${day}/${title}`
    if (seen.has(key)) continue
    seen.add(key)
    events.push({
      id: crypto.randomUUID(),
      title,
      date: toDateString(year, parseInt(mon), parseInt(day)),
      startTime: st ? normalizeTime(st) : undefined,
      endTime: et ? normalizeTime(et) : undefined,
      icon: getIcon(title),
    })
  }

  // Pattern 2: タイトル　月日（曜）
  // e.g. "保護者会　5月24日（金）14:30"
  const p2 = /([^\n\d。、]{2,20})\s+(\d{1,2})月(\d{1,2})日[（(（]?[月火水木金土日祝]?[）)）]?\s*(\d{1,2}[:：時]\d{0,2}分?)?/g
  while ((m = p2.exec(normalized)) !== null) {
    const [, rawTitle, mon, day, st] = m
    const title = rawTitle.trim()
    if (!title || title.length < 2) continue
    const key = `${mon}/${day}/${title}`
    if (seen.has(key)) continue
    seen.add(key)
    events.push({
      id: crypto.randomUUID(),
      title,
      date: toDateString(year, parseInt(mon), parseInt(day)),
      startTime: st ? normalizeTime(st) : undefined,
      icon: getIcon(title),
    })
  }

  // Sort by date
  events.sort((a, b) => a.date.localeCompare(b.date))

  return events.slice(0, 20) // max 20 events
}

export function buildCalendarLink(event: ExtractedEvent): string {
  const base = 'https://calendar.google.com/calendar/r/eventedit'
  const params = new URLSearchParams()
  params.set('text', event.title)

  // Date formatting for Google Calendar: YYYYMMDD or YYYYMMDDTHHmmss
  const dateOnly = event.date.replace(/-/g, '')
  if (event.startTime) {
    const [h, mm] = event.startTime.split(':')
    const startDt = `${dateOnly}T${String(h).padStart(2, '0')}${String(mm || '00').padStart(2, '0')}00`
    let endDt = startDt
    if (event.endTime) {
      const [eh, em] = event.endTime.split(':')
      endDt = `${dateOnly}T${String(eh).padStart(2, '0')}${String(em || '00').padStart(2, '0')}00`
    } else {
      // Default 1 hour
      const endH = (parseInt(h) + 1) % 24
      endDt = `${dateOnly}T${String(endH).padStart(2, '0')}${String(mm || '00').padStart(2, '0')}00`
    }
    params.set('dates', `${startDt}/${endDt}`)
  } else {
    params.set('dates', `${dateOnly}/${dateOnly}`)
  }

  if (event.note) params.set('details', event.note)

  return `${base}?${params.toString()}`
}

export function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  return `${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`
}
