import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
    apiVersion: '2026-02-25.clover',
  })

  try {
    const { email } = await req.json()
    const origin = req.headers.get('origin') ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'おたよりん ファミリープラン',
              description: '無制限読み取り・家族共有（最大5人）・リマインダー付き',
            },
            unit_amount: 480,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: origin + '/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: origin + '/pricing',
      locale: 'ja',
      metadata: { email: email ?? '' },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    return NextResponse.json({ error: 'Stripe error' }, { status: 500 })
  }
}
