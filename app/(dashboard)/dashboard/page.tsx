import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, ShoppingCart, FileText, Calendar, Truck, CheckCircle, Clock, XCircle, Mail, Users, MessageSquare } from 'lucide-react'
import type { Order, CalendarEvent, TrackingLog } from '@/lib/types'

export default async function DashboardPage() {
  let totalOrders = 0
  let activeProducts = 0
  let blogPosts = 0
  let totalSubscribers = 0
  let pendingEnquiries = 0
  let upcomingEvents: CalendarEvent[] = []
  let recentOrders: Order[] = []
  let recentLogs: TrackingLog[] = []
  let recentEnquiries: any[] = []

  try {
    const supabase = await createClient()

    const [oCount, pCount, bCount, sCount, eqCount] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      supabase.from('subscribers').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }),
    ])
    totalOrders = oCount.count || 0
    activeProducts = pCount.count || 0
    blogPosts = bCount.count || 0
    totalSubscribers = sCount.count || 0
    pendingEnquiries = eqCount.count || 0

    const { data: events } = await supabase
      .from('events').select('*').gte('start_date', new Date().toISOString()).order('start_date', { ascending: true }).limit(5)
    if (events) upcomingEvents = events as CalendarEvent[]

    const { data: orders } = await supabase
      .from('orders').select('*').order('created_at', { ascending: false }).limit(10)
    if (orders) recentOrders = orders as Order[]

    const { data: logs } = await supabase
      .from('tracking_logs').select('*').order('created_at', { ascending: false }).limit(20)
    if (logs) recentLogs = logs as TrackingLog[]

    const { data: enquiries } = await supabase
      .from('enquiries').select('*').order('created_at', { ascending: false }).limit(5)
    if (enquiries) recentEnquiries = enquiries
  } catch {}

  const statusColor: Record<string, string> = {
    pending: 'text-yellow-500', confirmed: 'text-blue-500', processing: 'text-orange-500',
    shipped: 'text-blue-400', delivered: 'text-green-500', cancelled: 'text-red-500',
  }
  const statusIcon: Record<string, any> = {
    pending: Clock, confirmed: Package, processing: Truck, shipped: Truck, delivered: CheckCircle, cancelled: XCircle,
  }

  function formatLogAction(log: TrackingLog): string {
    const meta = log.metadata as Record<string, any>
    switch (log.action) {
      case 'status_changed':
        return `Order ${meta.order_number} changed from ${meta.from_status} to ${meta.to_status}`
      case 'created':
        if (log.entity_type === 'order') return `New order ${meta.order_number} from ${meta.customer_name}`
        if (log.entity_type === 'product') return `Product "${meta.name}" added`
        if (log.entity_type === 'event') return `Event "${meta.title}" created`
        return `${log.entity_type} created`
      case 'published':
        return `Blog post "${meta.title}" published`
      case 'unpublished':
        return `Blog post "${meta.title}" unpublished`
      case 'updated':
        return `Product "${meta.name}" updated`
      case 'deleted':
        return `${log.entity_type} "${meta.name || meta.title}" deleted`
      default:
        return `${log.action} on ${log.entity_type}`
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Dashboard Overview</h1>
        <p className="text-[#9A9A9A] mt-1">Welcome to the Point-Taken Group dashboard.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={ShoppingCart} label="Orders" value={totalOrders.toString()} />
        <StatCard icon={Package} label="Products" value={activeProducts.toString()} />
        <StatCard icon={FileText} label="Blog Posts" value={blogPosts.toString()} />
        <StatCard icon={Calendar} label="Events" value={upcomingEvents.length.toString()} />
        <StatCard icon={Users} label="Subscribers" value={totalSubscribers.toString()} />
        <StatCard icon={MessageSquare} label="Enquiries" value={pendingEnquiries.toString()} />
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
                        <p className="text-xs text-[#9A9A9A] mt-0.5">R {Number(order.total).toFixed(2)}</p>
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
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: event.color || '#C0152A' }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#F5F5F5]">{event.title}</p>
                      <p className="text-xs text-[#9A9A9A]">{formatDate(event.start_date)}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize shrink-0">{event.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#9A9A9A] text-sm">No upcoming events.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enquiries */}
      {recentEnquiries.length > 0 && (
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader>
            <CardTitle className="font-display text-lg text-[#F5F5F5]">Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEnquiries.map((eq: any) => (
                <div key={eq.id} className="flex items-start justify-between p-3 rounded-lg bg-[#0A0A0A] border border-white/5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#F5F5F5]">{eq.name}</p>
                    <p className="text-xs text-[#9A9A9A]">{eq.email} {eq.company ? `• ${eq.company}` : ''}</p>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2">{eq.message}</p>
                  </div>
                  <span className="text-xs text-[#9A9A9A] shrink-0 ml-4">{formatDate(eq.created_at)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Feed */}
      <Card className="bg-[#1A1A1A] border-white/5">
        <CardHeader>
          <CardTitle className="font-display text-lg text-[#F5F5F5]">Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length > 0 ? (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0A0A]/50">
                  <p className="text-sm text-[#F5F5F5]">{formatLogAction(log)}</p>
                  <span className="text-xs text-[#9A9A9A] shrink-0 ml-4">{formatDate(log.created_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#9A9A9A] text-sm">Activity will appear here as you manage orders, products, and content.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card className="bg-[#1A1A1A] border-white/5">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="p-2.5 rounded-xl bg-[#C0152A]/10">
          <Icon className="h-5 w-5 text-[#C0152A]" />
        </div>
        <div>
          <p className="text-xs text-[#9A9A9A]">{label}</p>
          <p className="font-display text-xl font-bold text-[#F5F5F5]">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
