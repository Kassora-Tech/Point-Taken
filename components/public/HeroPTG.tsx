'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Shield, Star, Leaf } from 'lucide-react'

const metrics = [
  { value: '2021', label: 'Established' },
  { value: '4', label: 'Cities' },
  { value: '96%', label: 'Satisfaction' },
]

const commitments = [
  {
    title: 'Integrity',
    description: 'We operate with the highest ethical standards, ensuring honesty and transparency in all interactions.',
    status: 'Active',
    icon: Shield,
  },
  {
    title: 'Excellence',
    description: 'From product quality to customer service — we strive for excellence in every facet of our business.',
    status: 'Committed',
    icon: Star,
  },
  {
    title: 'Sustainability',
    description: 'Dedicated to environmental responsibility, minimizing our impact while maximizing client value.',
    status: 'Ongoing',
    icon: Leaf,
  },
]

const outerNodes = ['Supply', 'Healthcare', 'Government', 'Delivery']
const innerNodes = ['LOGIS', 'SAHPRA', 'Est.2021', 'Nationwide']

const nodePositions = [
  'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
  'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
  'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
]

export default function HeroPTG() {
  const [activeMode, setActiveMode] = useState(0)
  const [activeCommitment, setActiveCommitment] = useState(0)

  useEffect(() => {
    const modeInterval = setInterval(() => setActiveMode((p) => (p + 1) % 2), 4000)
    const commitInterval = setInterval(() => setActiveCommitment((p) => (p + 1) % 3), 5000)
    return () => {
      clearInterval(modeInterval)
      clearInterval(commitInterval)
    }
  }, [])

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(192,21,42,0.12) 0%, transparent 60%),' +
          'radial-gradient(ellipse 40% 60% at 100% 0%, rgba(192,21,42,0.08) 0%, transparent 50%),' +
          '#0A0A0A',
      }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Badge + Status Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 flex-wrap"
            >
              <span className="px-4 py-1.5 rounded-full bg-[#C0152A]/10 border border-[#C0152A]/20 text-[#C0152A] text-xs font-semibold tracking-wider font-display">
                POINT-TAKEN GROUP (PTY) LTD.
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs">
                Nationwide Supply & Delivery
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs">
                Est. 2021
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl lg:text-7xl xl:text-8xl font-black leading-[1.05] text-white"
            >
              Your partner in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C0152A] to-[#E8354A]">
                excellence
              </span>
              <br />
              supply, delivery, and service solutions that exceed expectations.
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/60 max-w-xl"
            >
              Point-Taken Group delivers top-tier products and services across South Africa,
              with dedicated teams, transparent communication, and an unwavering commitment to quality.
            </motion.p>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-8"
            >
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="font-display text-2xl font-bold text-white">{m.value}</div>
                  <div className="text-white/40 text-xs mt-1">{m.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Mode Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                {
                  title: 'Supply Chain',
                  description:
                    'End-to-end supply solutions with LOGIS and SAHPRA certification. We source, procure, and deliver with precision.',
                },
                {
                  title: 'Delivery Network',
                  description:
                    'Nationwide delivery infrastructure with real-time tracking, proactive communication, and dedicated account management.',
                },
              ].map((mode, i) => (
                <button
                  key={mode.title}
                  onClick={() => setActiveMode(i)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-500 ${
                    activeMode === i
                      ? 'bg-[#C0152A]/10 border-[#C0152A]/30'
                      : 'bg-[#111111] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="font-display font-bold text-sm text-white mb-2">{mode.title}</div>
                  <div className="text-white/40 text-xs leading-relaxed">{mode.description}</div>
                </button>
              ))}
            </motion.div>

            {/* Control Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              {[
                'LOGIS & SAHPRA Certified',
                'Nationwide 4-City Network',
                'Dedicated Account Teams',
              ].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-white/60 text-xs font-medium"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT COLUMN — ORBITAL RING SYSTEM */}
          <div className="relative">
            <div className="relative w-full aspect-square">
              {/* Center glow */}
              <div className="absolute inset-[25%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(192,21,42,0.25),transparent_70%)]" />

              {/* Center PTG logo */}
              <div className="absolute inset-[32%] rounded-full bg-[#111111] border border-white/10 flex items-center justify-center z-10">
                <span className="font-display text-4xl font-black text-[#C0152A]">PTG</span>
              </div>

              {/* Outer ring (CW rotation) */}
              <div className="absolute inset-[5%] rounded-full border border-[#C0152A]/20 ring-outer">
                {outerNodes.map((label, i) => (
                  <div
                    key={label}
                    className={`absolute ${nodePositions[i]} node-label`}
                  >
                    <div className="bg-[#1A1A1A] border border-white/10 rounded-full px-3 py-1.5 text-xs font-display font-bold text-white whitespace-nowrap">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Inner ring (CCW rotation) */}
              <div className="absolute inset-[18%] rounded-full border border-[#C0152A]/15 ring-inner">
                {innerNodes.map((label, i) => (
                  <div
                    key={label}
                    className={`absolute ${nodePositions[i]} node-label`}
                  >
                    <div className="bg-[#1A1A1A] border border-white/10 rounded-full px-3 py-1.5 text-xs font-display font-bold text-white whitespace-nowrap">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Showcase Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -bottom-4 -right-4 w-40 h-40 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(192,21,42,0.2)]"
              >
                <Image
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                  alt="Logistics"
                  fill
                  className="object-cover"
                  preload
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* COMMITMENTS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24"
        >
          <div className="text-center mb-10">
            <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">
              Our Commitments
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commitments.map((item, i) => {
              const Icon = item.icon
              const isActive = activeCommitment === i
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
                  onMouseEnter={() => setActiveCommitment(i)}
                  className={`relative p-6 rounded-2xl border transition-all duration-500 ${
                    isActive
                      ? 'bg-[#C0152A]/10 border-[#C0152A]/30'
                      : 'bg-[#111111] border-white/5 hover:border-white/10'
                  }`}
                >
                  <Icon
                    className={`h-8 w-8 mb-4 transition-colors ${
                      isActive ? 'text-[#C0152A]' : 'text-white/40'
                    }`}
                  />
                  <div className="font-display font-bold text-lg text-white mb-2">{item.title}</div>
                  <p className="text-white/40 text-sm mb-4">{item.description}</p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      isActive ? 'text-[#C0152A]' : 'text-white/40'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-[#C0152A]' : 'bg-white/40'
                      }`}
                    />
                    {item.status}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
