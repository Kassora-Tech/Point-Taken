'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const locations = [
  { address: '28 Retief Street, Windsor Park, Despatch, 6220', city: 'Despatch' },
  { address: '12 David Street, Cassandra, Kimberly, 8301', city: 'Kimberly' },
  { address: '3 Brebner Road, Flamingo Park, Welkom, 9459', city: 'Welkom' },
  { address: '54 Rontgen Street, Hospitaalpark, Bloemfontein, 9301', city: 'Bloemfontein' },
]

export default function ContactSection() {
  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Get in Touch</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-[#F5F5F5] mt-4">
            Our Locations
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6"
            >
              <MapPin className="h-6 w-6 text-[#C0152A] mb-3" />
              <h3 className="font-display font-bold text-[#F5F5F5] mb-2">{loc.city}</h3>
              <p className="text-[#9A9A9A] text-sm">{loc.address}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-8 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-[#C0152A] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-display font-bold text-[#F5F5F5] text-sm mb-1">Phone</h4>
                <p className="text-[#9A9A9A] text-xs">073 957 6209</p>
                <p className="text-[#9A9A9A] text-xs">071 855 5447</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-[#C0152A] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-display font-bold text-[#F5F5F5] text-sm mb-1">Email</h4>
                <p className="text-[#9A9A9A] text-xs">orders.ptg1@gmail.com</p>
                <p className="text-[#9A9A9A] text-xs">admin@pointtaken.co.za</p>
                <p className="text-[#9A9A9A] text-xs">sales@pointtaken.co.za</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#C0152A] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-display font-bold text-[#F5F5F5] text-sm mb-1">Hours</h4>
                <p className="text-[#9A9A9A] text-xs">Mon-Fri: 8AM-5PM</p>
                <p className="text-[#9A9A9A] text-xs">Sat: 8AM-1PM</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
