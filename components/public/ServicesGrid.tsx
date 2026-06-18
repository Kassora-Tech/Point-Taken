'use client'

import { motion } from 'framer-motion'
import { Truck, Shield, Heart, Building2, BarChart3, Users } from 'lucide-react'

const services = [
  { icon: Truck, title: 'Supply & Procurement', description: 'Sourcing top-tier products across all categories' },
  { icon: Shield, title: 'Nationwide Delivery', description: '4-city network, reliable last-mile delivery' },
  { icon: Heart, title: 'Healthcare Supplies', description: 'SAHPRA-registered medical product distribution' },
  { icon: Building2, title: 'Government Contracts', description: 'LOGIS-certified supplier for public sector' },
  { icon: BarChart3, title: 'Consultation Services', description: 'Tailored supply chain strategies for your business' },
  { icon: Users, title: 'Account Management', description: 'Dedicated teams, proactive communication' },
]

export default function ServicesGrid() {
  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Services</span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-[#F5F5F5] mt-4">
            What We Deliver
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[#1A1A1A] rounded-2xl border border-white/5 p-6 hover:border-[#C0152A]/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#C0152A]/10 flex items-center justify-center mb-4 group-hover:bg-[#C0152A]/20 transition-colors">
                  <Icon className="h-6 w-6 text-[#C0152A]" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#F5F5F5] mb-2">{service.title}</h3>
                <p className="text-[#9A9A9A] text-sm">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
