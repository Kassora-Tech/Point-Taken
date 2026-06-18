'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const locations = [
  { city: 'Despatch', address: '28 Retief Street, Windsor Park, Despatch, 6220' },
  { city: 'Kimberly', address: '12 David Street, Cassandra, Kimberly, 8301' },
  { city: 'Welkom', address: '3 Brebner Road, Flamingo Park, Welkom, 9459' },
  { city: 'Bloemfontein', address: '54 Rontgen Street, Hospitaalpark, Bloemfontein, 9301' },
]

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Enquiry submitted! We will be in touch.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Contact Us</span>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-[#F5F5F5] mt-4 leading-tight">
            Get In Touch
          </h1>
          <p className="text-[#9A9A9A] text-base sm:text-lg mt-4 max-w-2xl">
            Have a question or need a quote? Reach out — we&apos;re here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8">
              <h2 className="font-display text-2xl font-bold text-[#F5F5F5] mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#9A9A9A] mb-1 block">Name *</label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#9A9A9A] mb-1 block">Email *</label>
                    <Input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#9A9A9A] mb-1 block">Phone</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
                      placeholder="+27 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#9A9A9A] mb-1 block">Subject</label>
                    <Input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
                      placeholder="What is this about?"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#9A9A9A] mb-1 block">Message *</label>
                  <Textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5] min-h-[120px]"
                    placeholder="How can we help you?"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white font-semibold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Send Enquiry
                </Button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8">
              <h2 className="font-display text-2xl font-bold text-[#F5F5F5] mb-6">Our Locations</h2>
              <div className="grid grid-cols-2 gap-4">
                {locations.map((loc) => (
                  <div
                    key={loc.city}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-white/5 hover:border-[#C0152A]/20 transition-colors"
                  >
                    <MapPin className="h-5 w-5 text-[#C0152A] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-display font-bold text-[#F5F5F5] text-sm">{loc.city}</span>
                      <p className="text-[#9A9A9A] text-xs mt-0.5">{loc.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8">
              <h2 className="font-display text-2xl font-bold text-[#F5F5F5] mb-6">Contact Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#C0152A] shrink-0" />
                  <div>
                    <p className="text-[#F5F5F5] text-sm">073 957 6209</p>
                    <p className="text-[#F5F5F5] text-sm">071 855 5447</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#C0152A] shrink-0" />
                  <div>
                    <p className="text-[#F5F5F5] text-sm">orders.ptg1@gmail.com</p>
                    <p className="text-[#F5F5F5] text-sm">admin@pointtaken.co.za</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#C0152A] shrink-0" />
                  <p className="text-[#F5F5F5] text-sm">Mon-Fri: 8AM-5PM | Sat: 8AM-1PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
