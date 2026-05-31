import React from 'react'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import TopBar from '@/components/admin/TopBar'
import StatCard from '@/components/admin/StatCard'
import { formatPrice, formatDate, statusColor, statusLabel } from '@/lib/utils/formatters'
import type { Order, RestaurantTable } from '@/lib/types'

const adminClient = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getDashboardData() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [ordersResult, tablesResult, settingsResult] = await Promise.all([
    adminClient
      .from('orders')
      .select('*')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false }),
    adminClient.from('restaurant_tables').select('*'),
    adminClient.from('settings').select('*').eq('key', 'daily_fixed_costs'),
  ])

  const orders: Order[] = ordersResult.data ?? []
  const tables: RestaurantTable[] = tablesResult.data ?? []

  const activeOrders = orders.filter((o) => o.status !== 'cancelled')
  const revenue = activeOrders.reduce((sum, o) => sum + o.subtotal, 0)

  const fixedCosts = settingsResult.data?.[0]?.value ? Number(settingsResult.data[0].value) : 0
  const netProfit = revenue - fixedCosts

  const tablesOccupied = tables.filter((t) => t.status === 'occupied').length

  return {
    orders: orders.slice(0, 5),
    allOrders: orders,
    revenue,
    netProfit,
    tablesOccupied,
    totalTables: tables.length || 6,
    tables,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Dashboard" />
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="💰"
            title="Today's Revenue"
            value={formatPrice(data.revenue)}
            subtitle="All active orders"
          />
          <StatCard
            icon="📈"
            title="Net Profit"
            value={formatPrice(data.netProfit)}
            subtitle="After daily costs"
          />
          <StatCard
            icon="📋"
            title="Orders Today"
            value={data.allOrders.length}
            subtitle={`${data.allOrders.filter((o) => o.status === 'new').length} new`}
          />
          <StatCard
            icon="🪑"
            title="Tables Occupied"
            value={`${data.tablesOccupied}/${data.totalTables}`}
            subtitle="Current capacity"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-surface-card border border-gold/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-lg text-brand-text">Recent Orders</h2>
              <a href="/admin/orders" className="text-gold text-xs hover:underline">
                View all →
              </a>
            </div>
            {data.orders.length === 0 ? (
              <div className="text-center py-12 text-brand-muted">
                <div className="text-4xl mb-2">📋</div>
                <p>No orders today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-surface-light rounded-xl"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-brand-text text-sm font-medium">#{order.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[order.status]}`}>
                          {statusLabel[order.status]}
                        </span>
                      </div>
                      <div className="text-brand-muted text-xs mt-0.5">
                        {order.customer_name || 'Guest'} · {formatDate(order.created_at)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-playfair text-gold text-sm font-bold">
                        {formatPrice(order.subtotal)}
                      </div>
                      <div className="text-xs text-brand-muted capitalize">
                        {order.order_type === 'dinein' ? `T${order.table_number}` : 'Takeaway'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table status */}
          <div className="bg-surface-card border border-gold/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-lg text-brand-text">Table Status</h2>
              <a href="/admin/tables" className="text-gold text-xs hover:underline">
                Manage →
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.tables.length === 0
                ? Array.from({ length: 6 }, (_, i) => (
                    <div
                      key={i}
                      className="p-3 bg-olive/10 border border-olive/20 rounded-xl text-center"
                    >
                      <div className="text-sm font-medium text-olive-light">Table {i + 1}</div>
                      <div className="text-xs text-brand-muted mt-0.5">Available</div>
                    </div>
                  ))
                : data.tables.map((table) => {
                    const colorMap: Record<string, string> = {
                      available: 'bg-olive/10 border-olive/20 text-olive-light',
                      occupied: 'bg-crimson/10 border-crimson/20 text-crimson-light',
                      reserved: 'bg-gold/10 border-gold/20 text-gold',
                    }
                    return (
                      <div
                        key={table.id}
                        className={`p-3 border rounded-xl text-center ${colorMap[table.status]}`}
                      >
                        <div className="text-sm font-medium">Table {table.id}</div>
                        <div className="text-xs mt-0.5 capitalize">{table.status}</div>
                      </div>
                    )
                  })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
