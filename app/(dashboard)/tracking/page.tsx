'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Search, Truck, Package, CheckCircle, Clock, XCircle, Eye } from 'lucide-react'
import type { Order } from '@/lib/types'

const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-500' },
  confirmed: { label: 'Confirmed', icon: Package, color: 'text-blue-500' },
  processing: { label: 'Processing', icon: Truck, color: 'text-orange-500' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-blue-400' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-500' },
}

export default function TrackingPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (data) setOrders(data as Order[])
    setLoading(false)
  }

  async function updateStatus(order: Order, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', order.id)
    if (error) toast.error('Failed')
    else { toast.success(`Order ${status}`); fetchOrders() }
  }

  const filtered = orders.filter((o) => {
    const matchesSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_email || '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  function openDetail(order: Order) { setSelectedOrder(order); setDetailOpen(true) }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Order Tracking</h1>
        <p className="text-[#9A9A9A] mt-1">Manage and track all orders.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9A9A]" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-[#1A1A1A] border-white/10 text-[#F5F5F5]" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-40 bg-[#1A1A1A] border-white/10 text-[#F5F5F5]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5]">
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusConfig).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-[#1A1A1A] border-white/5">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-[#9A9A9A]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-[#9A9A9A]">No orders found.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((order) => {
                const config = statusConfig[order.status]
                const StatusIcon = config?.icon
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => openDetail(order)}>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#F5F5F5]">{order.order_number}</p>
                      <p className="text-xs text-[#9A9A9A]">{order.customer_name} • {order.customer_email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`flex items-center gap-1 text-sm font-semibold ${config?.color}`}>
                        {StatusIcon && <StatusIcon className="h-4 w-4" />}
                        {config?.label}
                      </span>
                      <span className="font-display font-bold text-[#F5F5F5]">R {Number(order.total).toFixed(2)}</span>
                      <Button variant="ghost" size="icon" className="text-[#9A9A9A]"><Eye className="h-4 w-4" /></Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] max-w-lg">
          <DialogTitle className="font-display text-xl font-bold">Order Details</DialogTitle>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-[#9A9A9A] text-xs">Order Number</p>
                  <p className="font-display font-bold text-[#F5F5F5]">{selectedOrder.order_number}</p>
                </div>
                <Select value={selectedOrder.status} onValueChange={(v) => { if (v) { updateStatus(selectedOrder, v); setDetailOpen(false) } }}>
                  <SelectTrigger className={`w-36 border-white/10 ${statusConfig[selectedOrder.status]?.color}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10">
                    {[...statusFlow, 'cancelled'].map((s) => (
                      <SelectItem key={s} value={s} className="text-[#F5F5F5]">{statusConfig[s]?.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-[#9A9A9A] text-xs">Customer</p><p className="text-[#F5F5F5]">{selectedOrder.customer_name}</p></div>
                <div><p className="text-[#9A9A9A] text-xs">Email</p><p className="text-[#F5F5F5]">{selectedOrder.customer_email}</p></div>
                <div><p className="text-[#9A9A9A] text-xs">Phone</p><p className="text-[#F5F5F5]">{selectedOrder.customer_phone || 'N/A'}</p></div>
                <div><p className="text-[#9A9A9A] text-xs">Date</p><p className="text-[#F5F5F5]">{formatDate(selectedOrder.created_at)}</p></div>
              </div>
              {selectedOrder.tracking_number && (
                <div><p className="text-[#9A9A9A] text-xs">Tracking #</p><p className="font-mono text-[#F5F5F5]">{selectedOrder.tracking_number}</p></div>
              )}
              {selectedOrder.delivery_address && (
                <div><p className="text-[#9A9A9A] text-xs">Delivery Address</p><p className="text-[#F5F5F5]">{selectedOrder.delivery_address}</p></div>
              )}
              <div>
                <p className="text-[#9A9A9A] text-xs mb-2">Items</p>
                <div className="bg-[#0A0A0A] rounded-lg p-3 space-y-2">
                  {(selectedOrder.items as any[])?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#F5F5F5]">{item.name} x{item.quantity}</span>
                      <span className="text-[#C0152A]">R {Number(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selectedOrder.notes && (
                <div><p className="text-[#9A9A9A] text-xs">Notes</p><p className="text-[#F5F5F5] text-sm">{selectedOrder.notes}</p></div>
              )}
              <div className="text-right">
                <p className="text-[#9A9A9A] text-xs">Total</p>
                <p className="font-display text-2xl font-bold text-[#C0152A]">R {Number(selectedOrder.total).toFixed(2)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
