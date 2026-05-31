import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

const adminClient = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await adminClient
      .from('restaurant_tables')
      .select('*')
      .order('id', { ascending: true })

    if (error) throw error

    // If no tables exist, return placeholder data
    if (!data || data.length === 0) {
      return NextResponse.json(
        Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          status: 'available',
          guest_name: null,
          updated_at: new Date().toISOString(),
        }))
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Tables fetch error:', error)
    // Return placeholder tables on error
    return NextResponse.json(
      Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        status: 'available',
        guest_name: null,
        updated_at: new Date().toISOString(),
      }))
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as { id: number; status: string; guest_name?: string | null }

    const { data, error } = await adminClient
      .from('restaurant_tables')
      .update({
        status: body.status,
        guest_name: body.guest_name ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Table update error:', error)
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 })
  }
}
