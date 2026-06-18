'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Truck, Package, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Order } from '@/lib/types'

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-500' },
  confirmed: { label: 'Confirmed', icon: Package, color: 'text-blue-500' },
  processing: { label: 'Processing', icon: Truck, color: 'text-orange-500' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-blue-400' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-500' },
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!orderNumber.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.trim())
        .single()
      if (data) {
        setOrder(data as Order)
      } else {
        setError('Order not found. Please check your order number.')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const StatusIcon = order ? statusConfig[order.status]?.icon : null

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0A0A0A]">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Track Your Order</span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-[#F5F5F5] mt-4">Order Tracking</h1>
          <p className="text-[#9A9A9A] mt-4">Enter your order number to check the status of your delivery.</p>
        </motion.div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <Input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. PTG-001"
            className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5]"
          />
          <Button type="submit" disabled={loading} className="bg-[#C0152A] hover:bg-[#E8354A] text-white shrink-0">
            <Search className="h-4 w-4 mr-2" />
            Track
          </Button>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">{error}</div>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#9A9A9A] text-sm">Order Number</p>
                <p className="font-display text-xl font-bold text-[#F5F5F5]">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-[#9A9A9A] text-sm">Status</p>
                <div className={`flex items-center gap-1.5 font-semibold ${statusConfig[order.status]?.color}`}>
                  {StatusIcon && <StatusIcon className="h-4 w-4" />}
                  {statusConfig[order.status]?.label}
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="text-[#9A9A9A] text-sm">Customer</p>
              <p className="text-[#F5F5F5]">{order.customer_name}</p>
            </div>

            {order.tracking_number && (
              <div className="border-t border-white/5 pt-4">
                <p className="text-[#9A9A9A] text-sm">Tracking Number</p>
                <p className="text-[#F5F5F5] font-mono">{order.tracking_number}</p>
              </div>
            )}

            <div className="border-t border-white/5 pt-4">
              <p className="text-[#9A9A9A] text-sm">Order Date</p>
              <p className="text-[#F5F5F5]">{formatDate(order.created_at)}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
