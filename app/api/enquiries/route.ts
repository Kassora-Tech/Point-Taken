import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const ORDERS_EMAIL = 'Orders@ptaken.co.za'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { error } = await supabase.from('enquiries').insert({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      company: body.company || null,
      message: body.message,
      product_id: body.product_id || null,
    })
    if (error) throw error

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Point-Taken Website <onboarding@resend.dev>',
        to: ORDERS_EMAIL,
        replyTo: body.email,
        subject: `New Enquiry: ${body.subject || 'Website Contact Form'}`,
        text: [
          `Name: ${body.name}`,
          `Email: ${body.email}`,
          body.phone ? `Phone: ${body.phone}` : null,
          body.company ? `Company: ${body.company}` : null,
          '',
          body.message,
        ].filter(Boolean).join('\n'),
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }
}
