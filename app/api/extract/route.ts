import { NextRequest, NextResponse } from 'next/server'
import { extractEvents } from '@/lib/events'

export const maxDuration = 30

async function ocrWithVision(base64: string): Promise<string> {
  const apiKey = process.env.GOOGLE_VISION_API_KEY
  if (!apiKey) throw new Error('NO_KEY')

  const res = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: base64 },
          features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
          imageContext: { languageHints: ['ja', 'ja-t-i0-handwrit'] }
        }]
      })
    }
  )
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.responses?.[0]?.fullTextAnnotation?.text ?? ''
}

const DEMO_TEXT = `
令和6年度 行事予定（前期）

5月18日（土）9:00〜15:00　春の運動会
5月24日（金）14:30〜16:00　1学期保護者会
6月7日（金）15:00　引き渡し訓練
6月17日（月）〜21日（金）　個人懇談
7月19日（金）　1学期終業式
9月2日（月）　2学期始業式
10月15日（火）　運動会予備日
11月8日（金）14:00　学習発表会
12月23日（月）　2学期終業式
`

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File | null
    const demo = formData.get('demo') === 'true'

    let rawText = ''

    if (demo || !file) {
      rawText = DEMO_TEXT
    } else {
      const bytes = await file.arrayBuffer()
      const base64 = Buffer.from(bytes).toString('base64')

      try {
        rawText = await ocrWithVision(base64)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : ''
        if (msg === 'NO_KEY') {
          // Fall back to demo for now
          rawText = DEMO_TEXT
        } else {
          throw e
        }
      }
    }

    const events = extractEvents(rawText)

    return NextResponse.json({ events, rawText })
  } catch (err) {
    console.error('[extract]', err)
    return NextResponse.json({ error: 'OCR failed' }, { status: 500 })
  }
}
