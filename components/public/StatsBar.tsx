'use client'

import { motion } from 'framer-motion'

const stats = [
  { value: '4', label: 'Locations' },
  { value: '2021', label: 'Established' },
  { value: 'Nationwide', label: 'Delivery' },
  { value: 'LOGIS', label: 'Certified' },
  { value: 'SAHPRA', label: 'Registered' },
]

export default function StatsBar() {
  return (
    <section className="bg-[#C0152A] py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-xl font-bold text-white">{stat.value}</div>
              <div className="text-white/70 text-xs uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
