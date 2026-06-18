'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ShoppingCart, Loader2 } from 'lucide-react'

interface EnquiryModalProps {
  productId: string
  productName: string
}

export default function EnquiryModal({ productId, productName }: EnquiryModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product_id: productId, company: '' }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Quote request submitted! We will contact you shortly.')
      setOpen(false)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-[#C0152A] hover:bg-[#E8354A] text-white font-semibold px-8 py-2 rounded-lg inline-flex items-center justify-center transition-colors">
        <ShoppingCart className="h-4 w-4 mr-2" /> Request Quote
      </DialogTrigger>
      <DialogContent className="bg-[#1A1A1A] border border-white/10 text-[#F5F5F5]">
        <DialogTitle className="font-display text-2xl font-bold">Request Quote</DialogTitle>
        <DialogDescription className="text-[#9A9A9A]">
          Request a quote for: {productName}
        </DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
          />
          <Input
            type="email"
            required
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
          />
          <Input
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
          />
          <Textarea
            required
            placeholder="Your message or quantity needed"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
          />
          <Button type="submit" disabled={loading} className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
