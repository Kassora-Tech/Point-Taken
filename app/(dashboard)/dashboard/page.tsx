import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, FileText, Calendar, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'
import type { Order, CalendarEvent, TrackingLog } from '@/lib/types'

export default async function DashboardPage() {
  let totalOrders = 0
  let activeProducts = 0
  let blogPosts = 0
  let upcomingEvents: CalendarEvent[] = []
  let recentOrders: Order[] = []
  let recentLogs: TrackingLog[] = []

  try {
    const supabase = await createClient()

    const { count: oCount } = await supabase.from('orders').select('*', { count: 'exact', head: true })
    totalOrders = oCount || 0

    const { count: pCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true)
    activeProducts = pCount || 0

    const { count: bCount } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true })
    blogPosts = bCount || 0

    const { data: events } = await supabase
      .from('events').select('*').gte('start_date', new Date().toISOString()).order('start_date', { ascending: true }).limit(5)
    if (events) upcomingEvents = events as CalendarEvent[]

    const { data: orders } = await supabase
      .from('orders').select('*').order('created_at', { ascending: false }).limit(10)
    if (orders) recentOrders = orders as Order[]

    const { data: logs } = await supabase
      .from('tracking_logs').select('*').order('created_at', { ascending: false }).limit(20)
    if (logs) recentLogs = logs as TrackingLog[]
  } catch {}

  const statusColor: Record<string, string> = {
    pending: 'text-yellow-500', confirmed: 'text-blue-500', processing: 'text-orange-500',
    shipped: 'text-blue-400', delivered: 'text-green-500', cancelled: 'text-red-500',
  }
  const statusIcon: Record<string, any> = {
    pending: Clock, confirmed: Package, processing: Truck, shipped: Truck, delivered: CheckCircle, cancelled: XCircle,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Dashboard Overview</h1>
        <p className="text-[#9A9A9A] mt-1">Welcome to the Point-Taken Group dashboard.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Total Orders" value={totalOrders.toString()} />
        <StatCard icon={Package} label="Active Products" value={activeProducts.toString()} />
        <StatCard icon={FileText} label="Blog Posts" value={blogPosts.toString()} />
        <StatCard icon={Calendar} label="Upcoming Events" value={upcomingEvents.length.toString()} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader>
            <CardTitle className="font-display text-lg text-[#F5F5F5]">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const StatusIcon = statusIcon[order.status]
                  return (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-white/5">
                      <div>
                        <p className="text-sm font-medium text-[#F5F5F5]">{order.order_number}</p>
                        <p className="text-xs text-[#9A9A9A]">{order.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`flex items-center gap-1 text-xs font-semibold ${statusColor[order.status]}`}>
                          {StatusIcon && <StatusIcon className="h-3 w-3" />}
                          {order.status}
                        </span>
                        <p className="text-xs text-[#9A9A9A] mt-0.5">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-[#9A9A9A] text-sm">No orders yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader>
            <CardTitle className="font-display text-lg text-[#F5F5F5]">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#0A0A0A] border border-white/5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color || '#C0152A' }} />
                    <div>
                      <p className="text-sm font-medium text-[#F5F5F5]">{event.title}</p>
                      <p className="text-xs text-[#9A9A9A]">{formatDate(event.start_date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#9A9A9A] text-sm">No upcoming events.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1A1A1A] border-white/5">
        <CardHeader>
          <CardTitle className="font-display text-lg text-[#F5F5F5]">Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length > 0 ? (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-2 rounded text-sm">
                  <div>
                    <span className="text-[#C0152A] font-medium">{log.action}</span>
                    <span className="text-[#9A9A9A] ml-2">on {log.entity_type}</span>
                  </div>
                  <span className="text-xs text-[#9A9A9A]">{formatDate(log.created_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#9A9A9A] text-sm">No activity yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card className="bg-[#1A1A1A] border-white/5">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="p-3 rounded-xl bg-[#C0152A]/10">
          <Icon className="h-6 w-6 text-[#C0152A]" />
        </div>
        <div>
          <p className="text-sm text-[#9A9A9A]">{label}</p>
          <p className="font-display text-2xl font-bold text-[#F5F5F5]">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
