export interface ExtractedItem {
  id: string
  name: string
  category: string
  icon: string
}

const ITEM_ICONS: Record<string, string> = {
  '体操服': '👕', '体操着': '👕', '水着': '🩱', '水泳帽': '🏊',
  '水筒': '🫙', 'お弁当': '🍱', 'お弁当箱': '🍱', '箸': '🥢',
  'ランドセル': '🎒', 'リュック': '🎒', '上履き': '👟', '外靴': '👟',
  '帽子': '🧢', '赤白帽': '🧢', 'タオル': '🏷️',
  '鉛筆': '✏️', '消しゴム': '🧹', 'ノート': '📓', '教科書': '📚',
  '連絡帳': '📒', '健康観察票': '📋', '保険証': '🪪', '診察券': '🪪',
  'ハンカチ': '🧻', 'ティッシュ': '🧻', 'マスク': '😷',
  'カッパ': '🌧️', '雨具': '☂️', '傘': '☂️',
  '絵の具': '🎨', '習字': '✍️', '習字道具': '✍️',
  '鍵盤ハーモニカ': '🎹', 'リコーダー': '🎵',
  '着替え': '👔', '下着': '👔', '靴下': '🧦',
}

const ITEM_CATEGORIES: Record<string, string> = {
  '体操服': '服装', '体操着': '服装', '水着': '服装', '帽子': '服装',
  '赤白帽': '服装', '着替え': '服装', '下着': '服装', '靴下': '服装',
  '上履き': '持ち物', '外靴': '持ち物', 'ランドセル': '持ち物', 'リュック': '持ち物',
  '水筒': '飲食', 'お弁当': '飲食', 'お弁当箱': '飲食', '箸': '飲食',
  '鉛筆': '学用品', '消しゴム': '学用品', 'ノート': '学用品', '教科書': '学用品',
  '健康観察票': '書類', '保険証': '書類', '診察券': '書類', '連絡帳': '書類',
  'ハンカチ': 'その他', 'ティッシュ': 'その他', 'マスク': 'その他',
}

function getIcon(name: string): string {
  for (const [keyword, icon] of Object.entries(ITEM_ICONS)) {
    if (name.includes(keyword)) return icon
  }
  return '📦'
}

function getCategory(name: string): string {
  for (const [keyword, cat] of Object.entries(ITEM_CATEGORIES)) {
    if (name.includes(keyword)) return cat
  }
  return '持ち物'
}

export function extractItems(text: string): ExtractedItem[] {
  const items: ExtractedItem[] = []
  const seen = new Set<string>()

  const normalized = text
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
    .replace(/[　]/g, ' ')
    .replace(/\r\n/g, '\n')

  function addItem(raw: string) {
    const name = raw.trim()
      .replace(/^[・●◆▶→\-\*①②③④⑤⑥⑦⑧⑨⑩\d\.\)）]+\s*/, '')
      .replace(/[（(][^)）]*[)）]/g, '')
      .trim()
    if (!name || name.length < 2 || name.length > 20) return
    if (seen.has(name)) return
    seen.add(name)
    items.push({
      id: crypto.randomUUID(),
      name,
      category: getCategory(name),
      icon: getIcon(name),
    })
  }

  // セクション検索: 持ち物：/ 準備物：など
  const sectionPattern = /(?:持ち物|準備物|必要なもの|用意するもの|お道具|持参|ご用意|準備品)[：:】]?\s*\n?((?:[^\n]+\n?){1,15})/gi
  let m = sectionPattern.exec(normalized)
  while (m) {
    const section = m[1]
    const lines = section.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      const bullet = trimmed.split(/[、，,・●◆▶]+/)
      for (const b of bullet) {
        if (b.trim().length > 1) addItem(b)
      }
    }
    m = sectionPattern.exec(normalized)
  }

  // 箇条書きリスト
  const bulletPattern = /[・●◆]([^\n・●◆]{2,15})/g
  let m2 = bulletPattern.exec(normalized)
  while (m2) {
    addItem(m2[1])
    m2 = bulletPattern.exec(normalized)
  }

  // 既知アイテムのキーワードマッチ（フォールバック）
  if (items.length === 0) {
    for (const keyword of Object.keys(ITEM_ICONS)) {
      const regex = new RegExp(`(?:^|[\\s、。\\n])(${keyword})(?:[\\s、。\\n]|$)`, 'g')
      if (regex.test(normalized)) {
        addItem(keyword)
      }
    }
  }

  return items.slice(0, 20)
}
