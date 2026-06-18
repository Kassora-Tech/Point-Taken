import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('order_number')
    const supabase = await createClient()
    
    if (orderNumber) {
      const { data, error } = await supabase
        .from('orders')
        .select('order_number, status, tracking_number, created_at, updated_at')
        .eq('order_number', orderNumber)
        .single()
      if (error) throw error
      return NextResponse.json(data)
    }
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tracking info' }, { status: 500 })
  }
}
