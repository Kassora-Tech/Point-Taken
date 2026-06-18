import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
    
    const { error } = await supabase.from('subscribers').insert({ email })
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
      }
      throw error
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
