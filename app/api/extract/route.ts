import { NextRequest, NextResponse } from 'next/server'
import { extractEvents } from '@/lib/events'
import { createWorker } from 'tesseract.js'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60

const FREE_MONTHLY_LIMIT = 1

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

async function ocrTesseract(buffer: Buffer): Promise<string> {
  const worker = await createWorker('jpn', 1, {
    cachePath: '/tmp/tessdata',
    logger: () => {},
  })
  try {
    const { data: { text } } = await worker.recognize(buffer)
    return text
  } finally {
    await worker.terminate()
  }
}

async function ocrVision(base64: string): Promise<string> {
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
          imageContext: { languageHints: ['ja'] }
        }]
      })
    }
  )
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.responses?.[0]?.fullTextAnnotation?.text ?? ''
}

function getUserId(req: NextRequest): string {
  return req.cookies.get('otayorin_uid')?.value ?? crypto.randomUUID()
}

async function getMonthlyUsage(userId: string): Promise<number> {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const { count } = await supabase
    .from('otayorin_newsletters')
    .select('id', { count: 'exact', head: true })
    .eq('user_email', userId)
    .gte('created_at', monthStart)
  return count ?? 0
}

async function isPremium(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('otayorin_users')
    .select('plan')
    .eq('email', userId)
    .single()
  return data?.plan === 'standard'
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File | null
    const demo = formData.get('demo') === 'true'

    const userId = getUserId(req)

    if (!demo) {
      const premium = await isPremium(userId)
      if (!premium) {
        const usage = await getMonthlyUsage(userId)
        if (usage >= FREE_MONTHLY_LIMIT) {
          return NextResponse.json(
            {
              error: 'QUOTA_EXCEEDED',
              message: `無料プランは月${FREE_MONTHLY_LIMIT}件までです。スタンダードプラン（¥380/月）にアップグレードすると無制限でご利用いただけます。`,
              upgradeUrl: '/pricing',
            },
            { status: 429 }
          )
        }
      }
    }

    let rawText = ''

    if (demo || !file) {
      rawText = DEMO_TEXT
    } else {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')

      try {
        rawText = await ocrVision(base64)
      } catch {
        rawText = await ocrTesseract(buffer)
      }
    }

    const events = extractEvents(rawText)

    if (!demo) {
      await supabase.from('otayorin_newsletters').insert({
        user_email: userId,
        raw_text: rawText.slice(0, 5000),
        event_count: events.length,
      })
    }

    const res = NextResponse.json({ events, rawText })

    if (!req.cookies.get('otayorin_uid')) {
      res.cookies.set('otayorin_uid', userId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
      })
    }

    return res
  } catch (err) {
    console.error('[extract]', err)
    return NextResponse.json({ error: 'OCR failed' }, { status: 500 })
  }
}
