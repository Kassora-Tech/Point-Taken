'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Order } from '@/lib/types'

const STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered']
const STEP_KEYS: Order['status'][] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

const statusBadge: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  processing: { label: 'Processing', variant: 'default' },
  shipped: { label: 'Shipped', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!orderNumber.trim() || !email.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.trim())
        .eq('customer_email', email.trim())
        .single()
      if (err) {
        console.error('Supabase query error:', err)
        setError('Order not found. Please check your order number and email.')
        return
      }
      if (data) {
        setOrder(data as Order)
      } else {
        setError('Order not found. Please check your order number and email.')
      }
    } catch (err) {
      console.error('Failed to look up order:', err)
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentStepIndex = order ? STEP_KEYS.indexOf(order.status) : -1
  const isCancelled = order?.status === 'cancelled'

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <section className="py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Order Tracking</span>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-[#F5F5F5] mt-4 leading-tight">
            Track Your Order
          </h1>
          <p className="text-[#9A9A9A] mt-4">
            Enter your order number and email to check your delivery status.
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
          <Input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Order number (e.g. PTG-001)"
            className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5]"
            required
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5]"
            required
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
            className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#9A9A9A] text-sm">Order Number</p>
                <p className="font-display text-xl font-bold text-[#F5F5F5]">{order.order_number}</p>
              </div>
              <Badge variant={statusBadge[order.status]?.variant || 'outline'} className="text-sm px-4 py-1.5">
                {order.status === 'cancelled' && <XCircle className="h-3.5 w-3.5 mr-1.5" />}
                {statusBadge[order.status]?.label || order.status}
              </Badge>
            </div>

            {!isCancelled && (
              <div className="pt-2">
                <p className="text-[#9A9A9A] text-sm mb-4">Order Progress</p>
                <div className="flex items-center justify-between">
                  {STEPS.map((step, i) => {
                    const isCompleted = i < currentStepIndex
                    const isCurrent = i === currentStepIndex
                    return (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                              isCompleted
                                ? 'bg-[#C0152A] border-[#C0152A] text-white'
                                : isCurrent
                                  ? 'bg-[#C0152A]/20 border-[#C0152A] text-[#C0152A]'
                                  : 'bg-[#0A0A0A] border-white/10 text-[#9A9A9A]'
                            }`}
                          >
                            {isCompleted ? <CheckCircle className="h-4 w-4" /> : i + 1}
                          </div>
                          <span
                            className={`text-[10px] mt-1.5 whitespace-nowrap font-medium ${
                              isCompleted || isCurrent ? 'text-[#F5F5F5]' : 'text-[#9A9A9A]'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 mb-5 ${
                              i < currentStepIndex ? 'bg-[#C0152A]' : 'bg-white/10'
                            }`}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/5 pt-6">
              <div>
                <p className="text-[#9A9A9A] text-xs mb-1">Customer</p>
                <p className="text-[#F5F5F5] text-sm font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-[#9A9A9A] text-xs mb-1">Order Date</p>
                <p className="text-[#F5F5F5] text-sm font-medium">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p className="text-[#9A9A9A] text-xs mb-1">Total</p>
                <p className="text-[#F5F5F5] text-sm font-bold">R {Number(order.total).toFixed(2)}</p>
              </div>
              {order.tracking_number && (
                <div>
                  <p className="text-[#9A9A9A] text-xs mb-1">Tracking Number</p>
                  <p className="text-[#F5F5F5] text-sm font-mono">{order.tracking_number}</p>
                </div>
              )}
            </div>

            {order.delivery_address && (
              <div className="border-t border-white/5 pt-6">
                <p className="text-[#9A9A9A] text-xs mb-1">Delivery Address</p>
                <p className="text-[#F5F5F5] text-sm">{order.delivery_address}</p>
              </div>
            )}

            {order.items && order.items.length > 0 && (
              <div className="border-t border-white/5 pt-6">
                <p className="text-[#9A9A9A] text-xs mb-3">Items</p>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-[#0A0A0A] rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-[#C0152A] shrink-0" />
                        <div>
                          <p className="text-[#F5F5F5] text-sm font-medium">{item.name}</p>
                          <p className="text-[#9A9A9A] text-xs">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-[#F5F5F5] text-sm font-semibold">R {Number(item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  )
}
