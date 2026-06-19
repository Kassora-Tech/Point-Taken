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
import { Search, Truck, Package, CheckCircle, Clock, XCircle, Eye, X } from 'lucide-react'
import type { Order } from '@/lib/types'

const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending:    { bg: '#F59E0B', text: '#FCD34D', label: 'Pending' },
  confirmed:  { bg: '#3B82F6', text: '#93C5FD', label: 'Confirmed' },
  processing: { bg: '#A855F7', text: '#D8B4FE', label: 'Processing' },
  shipped:    { bg: '#F97316', text: '#FDBA74', label: 'Shipped' },
  delivered:  { bg: '#22C55E', text: '#86EFAC', label: 'Delivered' },
  cancelled:  { bg: '#EF4444', text: '#FCA5A5', label: 'Cancelled' },
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
            {Object.entries(STATUS_COLORS).map(([key, val]) => (
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
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => openDetail(order)}>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#F5F5F5]">{order.order_number}</p>
                      <p className="text-xs text-[#9A9A9A]">{order.customer_name} • {order.customer_email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: STATUS_COLORS[order.status]?.text || '#F5F5F5' }}>
                        {STATUS_COLORS[order.status]?.label || order.status}
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
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] max-w-xl max-h-[85vh] overflow-y-auto">
          {selectedOrder && (
            <div className="p-6 space-y-6">
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="font-display text-xl font-bold text-[#F5F5F5]">{selectedOrder.order_number}</DialogTitle>
                  <p className="text-sm text-[#9A9A9A] mt-1">Placed {formatDate(selectedOrder.created_at)}</p>
                </div>
                <button onClick={() => setDetailOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#9A9A9A] hover:text-[#F5F5F5]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status full-width pill select */}
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Status</p>
                <Select value={selectedOrder.status} onValueChange={(v) => { if (v) { updateStatus(selectedOrder, v); setDetailOpen(false) } }}>
                  <SelectTrigger
                    className="w-full h-12 text-base font-semibold border-white/10 rounded-xl"
                    style={{
                      background: `${STATUS_COLORS[selectedOrder.status]?.bg}20` || 'rgba(255,255,255,0.05)',
                      color: STATUS_COLORS[selectedOrder.status]?.text || '#F5F5F5',
                      borderLeft: `4px solid ${STATUS_COLORS[selectedOrder.status]?.bg || '#9A9A9A'}`,
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10">
                    {[...statusFlow, 'cancelled'].map((s) => (
                      <SelectItem key={s} value={s} className="text-[#F5F5F5] font-medium">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[s]?.bg }} />
                          {STATUS_COLORS[s]?.label || s}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Customer */}
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Customer</p>
                <p className="text-[#F5F5F5] font-medium">{selectedOrder.customer_name}</p>
                <p className="text-sm text-[#9A9A9A]">{selectedOrder.customer_email} · {selectedOrder.customer_phone || 'N/A'}</p>
              </div>

              {/* Delivery */}
              {selectedOrder.delivery_address && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Delivery</p>
                  <p className="text-[#F5F5F5]">{selectedOrder.delivery_address}</p>
                  {selectedOrder.tracking_number && (
                    <p className="text-sm text-[#9A9A9A] mt-1">Tracking: <span className="font-mono text-[#F5F5F5]">{selectedOrder.tracking_number}</span></p>
                  )}
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Items</p>
                <div className="bg-[#0A0A0A] rounded-xl divide-y divide-white/5 overflow-hidden">
                  {(selectedOrder.items as any[])?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-3 px-4">
                      <span className="text-[#F5F5F5] text-sm font-medium">{item.name} <span className="text-[#9A9A9A] font-normal">x{item.quantity}</span></span>
                      <span className="text-[#C0152A] font-semibold text-sm">R {Number(item.price).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#9A9A9A] text-sm">Total</span>
                  <span className="font-display text-2xl font-bold text-[#C0152A]">R {Number(selectedOrder.total).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-[#0A0A0A] rounded-xl p-4">
                  <p className="text-xs text-[#9A9A9A] mb-1">Notes</p>
                  <p className="text-sm text-[#F5F5F5]">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
