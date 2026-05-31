import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import type { OrderStatus } from '@/lib/types'

const adminClient = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      customer_name?: string
      customer_phone?: string
      order_type: 'dinein' | 'takeaway'
      table_number?: number | null
      items: unknown[]
      subtotal: number
      status?: OrderStatus
      notes?: string
    }

    if (!body.order_type || !body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'order_type and items are required' }, { status: 400 })
    }

    const { data, error } = await adminClient
      .from('orders')
      .insert({
        customer_name: body.customer_name ?? null,
        customer_phone: body.customer_phone ?? null,
        order_type: body.order_type,
        table_number: body.table_number ?? null,
        items: body.items,
        subtotal: body.subtotal,
        status: body.status ?? 'new',
        notes: body.notes ?? null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')

    let query = adminClient
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
