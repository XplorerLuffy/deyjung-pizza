import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const isAdmin = searchParams.get('admin') === 'true'

  try {
    // Fetch categories
    const { data: categories, error: catError } = await adminClient
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (catError) throw catError

    // Fetch menu items
    let query = adminClient
      .from('menu_items')
      .select('*, category:categories(*)')
      .order('sort_order', { ascending: true })

    if (!isAdmin) {
      query = query.eq('is_available', true)
    }

    const { data: items, error: itemError } = await query

    if (itemError) throw itemError

    return NextResponse.json({ items: items || [], categories: categories || [] })
  } catch (error) {
    console.error('Menu fetch error:', error)
    return NextResponse.json({ items: [], categories: [] }, { status: 200 })
  }
}
