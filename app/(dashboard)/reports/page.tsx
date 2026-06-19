'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Package, ShoppingCart, FileText, Eye } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import type { Order, BlogPost, Product } from '@/lib/types'

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending:    { bg: '#F59E0B', text: '#FCD34D', label: 'Pending' },
  confirmed:  { bg: '#3B82F6', text: '#93C5FD', label: 'Confirmed' },
  processing: { bg: '#A855F7', text: '#D8B4FE', label: 'Processing' },
  shipped:    { bg: '#F97316', text: '#FDBA74', label: 'Shipped' },
  delivered:  { bg: '#22C55E', text: '#86EFAC', label: 'Delivered' },
  cancelled:  { bg: '#EF4444', text: '#FCA5A5', label: 'Cancelled' },
}

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [dateRange, setDateRange] = useState('30')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { fetchData() }, [dateRange])

  async function fetchData() {
    setLoading(true)
    const days = parseInt(dateRange)
    const since = new Date(Date.now() - days * 86400000).toISOString()

    const [oRes, pRes, prRes] = await Promise.all([
      supabase.from('orders').select('*').gte('created_at', since).order('created_at', { ascending: true }),
      supabase.from('blog_posts').select('*').order('views', { ascending: false }).limit(10),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
    ])
    if (oRes.data) setOrders(oRes.data as Order[])
    if (pRes.data) setPosts(pRes.data as BlogPost[])
    if (prRes.data) setProducts(prRes.data as Product[])
    setLoading(false)
  }

  const ordersByDay = orders.reduce<Record<string, number>>((acc, o) => {
    const day = o.created_at.split('T')[0]
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {})

  const ordersChartData = Object.entries(ordersByDay).map(([date, count]) => ({ date: date.slice(5), count }))

  const revenueByMonth = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce<Record<string, number>>((acc, o) => {
      const month = o.created_at.slice(0, 7)
      acc[month] = (acc[month] || 0) + Number(o.total)
      return acc
    }, {})

  const revenueChartData = Object.entries(revenueByMonth).map(([month, total]) => ({ month, total }))

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + Number(o.total), 0)

  if (loading) return <div className="text-center text-[#9A9A9A] py-16">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Reports & Analytics</h1>
          <p className="text-[#9A9A9A] mt-1">Business performance insights.</p>
        </div>
        <Select value={dateRange} onValueChange={(v) => v && setDateRange(v)}>
          <SelectTrigger className="w-40 bg-[#1A1A1A] border-white/10 text-[#F5F5F5]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5]">
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-6">
            <p className="text-[#9A9A9A] text-sm">Total Orders</p>
            <p className="font-display text-3xl font-bold text-[#F5F5F5]">{orders.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-6">
            <p className="text-[#9A9A9A] text-sm">Total Revenue</p>
            <p className="font-display text-3xl font-bold text-[#C0152A]">R {totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-6">
            <p className="text-[#9A9A9A] text-sm">Active Products</p>
            <p className="font-display text-3xl font-bold text-[#F5F5F5]">{products.filter((p) => p.active).length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-6">
            <p className="text-[#9A9A9A] text-sm">Avg Order Value</p>
            <p className="font-display text-3xl font-bold text-[#F5F5F5]">R {orders.length ? (totalRevenue / orders.length).toFixed(2) : '0.00'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader><CardTitle className="font-display text-lg text-[#F5F5F5]">Orders Over Time</CardTitle></CardHeader>
          <CardContent>
            {ordersChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ordersChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#9A9A9A" fontSize={12} />
                  <YAxis stroke="#9A9A9A" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F5F5F5' }} />
                  <Line type="monotone" dataKey="count" stroke="#C0152A" strokeWidth={2} dot={{ fill: '#C0152A' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-[#9A9A9A] text-sm">No data for this period.</p>}
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader><CardTitle className="font-display text-lg text-[#F5F5F5]">Orders by Status</CardTitle></CardHeader>
          <CardContent>
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusChartData.map((entry, i) => {
                      const color = STATUS_COLORS[entry.name]?.bg || '#9A9A9A'
                      return <Cell key={i} fill={color} />
                    })}
                  </Pie>
                  <Legend
                    formatter={(value: string) => {
                      const config = STATUS_COLORS[value]
                      return <span style={{ color: config?.text || '#9A9A9A' }}>{config?.label || value}</span>
                    }}
                  />
                  <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F5F5F5' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-[#9A9A9A] text-sm">No data for this period.</p>}
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader><CardTitle className="font-display text-lg text-[#F5F5F5]">Revenue by Month</CardTitle></CardHeader>
          <CardContent>
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#9A9A9A" fontSize={12} />
                  <YAxis stroke="#9A9A9A" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', color: '#F5F5F5' }} />
                  <Bar dataKey="total" fill="#C0152A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-[#9A9A9A] text-sm">No data for this period.</p>}
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardHeader><CardTitle className="font-display text-lg text-[#F5F5F5]">Top Blog Posts</CardTitle></CardHeader>
          <CardContent>
            {posts.length > 0 ? (
              <div className="space-y-3">
                {posts.slice(0, 5).map((post, i) => (
                  <div key={post.id} className="flex items-center justify-between p-2 rounded-lg bg-[#0A0A0A]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[#C0152A] font-bold text-sm w-5">{i + 1}.</span>
                      <span className="text-sm text-[#F5F5F5] truncate">{post.title}</span>
                    </div>
                    <span className="text-xs text-[#9A9A9A] flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views || 0}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-[#9A9A9A] text-sm">No blog data.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
