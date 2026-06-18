'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, Shield, Truck, Users, Leaf, Target, Star } from 'lucide-react'

const DeliveryGlyph = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-white/5" />
    <path
      d="M25 55 L45 55 L45 75 L55 75 L55 55 L75 55 L50 25 Z"
      fill="currentColor"
      className="text-[#C0152A]"
      opacity="0.3"
    />
    <circle cx="35" cy="75" r="6" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#C0152A]" />
    <circle cx="65" cy="75" r="6" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#C0152A]" />
  </svg>
)

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

const metrics = [
  { value: 'Est. 2021', label: 'Since Founded' },
  { value: '4', label: 'Locations' },
  { value: '96%', label: 'Satisfaction' },
]

export default function HeroPTG() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5])

  const [activeMode, setActiveMode] = useState(0)
  const [activeCommitment, setActiveCommitment] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMode((prev) => (prev + 1) % 2)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCommitment((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-[#0A0A0A]"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C0152A]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#C0152A]/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#C0152A]/5 rounded-full blur-[80px]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3"
            >
              <span className="px-4 py-1.5 rounded-full bg-[#C0152A]/10 border border-[#C0152A]/20 text-[#C0152A] text-xs font-semibold tracking-wider font-display">
                POINT-TAKEN GROUP (PTY) LTD.
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#9A9A9A] text-xs">
                Nationwide Supply & Delivery
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#9A9A9A] text-xs hidden sm:block">
                Est. 2021
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] text-[#F5F5F5]"
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
              className="text-[#9A9A9A] text-lg leading-relaxed max-w-xl"
            >
              Point-Taken Group delivers top-tier products and services across South Africa, with dedicated teams, transparent communication, and an unwavering commitment to quality.
            </motion.p>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-8"
            >
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="font-display text-2xl font-bold text-[#F5F5F5]">{metric.value}</div>
                  <div className="text-[#9A9A9A] text-xs mt-1">{metric.label}</div>
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
                  description: 'End-to-end supply solutions with LOGIS and SAHPRA certification. We source, procure, and deliver with precision.',
                },
                {
                  title: 'Delivery Network',
                  description: 'Nationwide delivery infrastructure with real-time tracking, proactive communication, and dedicated account management.',
                },
              ].map((mode, i) => (
                <button
                  key={mode.title}
                  onClick={() => setActiveMode(i)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-500 ${
                    activeMode === i
                      ? 'bg-[#C0152A]/10 border-[#C0152A]/30 shadow-[0_0_30px_rgba(192,21,42,0.15)]'
                      : 'bg-[#1A1A1A] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="font-display font-bold text-sm text-[#F5F5F5] mb-2">{mode.title}</div>
                  <div className="text-[#9A9A9A] text-xs leading-relaxed">{mode.description}</div>
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
              {['LOGIS & SAHPRA Certified', 'Nationwide 4-City Network', 'Dedicated Account Teams'].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[#9A9A9A] text-xs font-medium"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="relative">
            {/* Orbiting Cards */}
            <div className="relative w-full aspect-square">
              <motion.div
                style={{ rotateX, rotateY }}
                className="w-full h-full"
              >
                {/* Central Glyph */}
                <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-[#C0152A]/20 to-transparent border border-[#C0152A]/10 flex items-center justify-center shadow-[0_0_60px_rgba(192,21,42,0.15)]">
                  <div className="w-24 h-24 text-[#C0152A]">
                    <DeliveryGlyph />
                  </div>
                </div>

                {/* Floating Elements */}
                {[
                  { angle: 0, label: 'Supply', desc: 'LOGIS Certified' },
                  { angle: 72, label: 'Delivery', desc: 'Nationwide' },
                  { angle: 144, label: 'Healthcare', desc: 'SAHPRA Registered' },
                  { angle: 216, label: 'Government', desc: 'Public Sector' },
                  { angle: 288, label: 'Consulting', desc: 'Strategic' },
                ].map((item, i) => {
                  const angle = (item.angle * Math.PI) / 180
                  const radius = 42
                  const x = 50 + radius * Math.cos(angle)
                  const y = 50 + radius * Math.sin(angle)

                  return (
                    <motion.div
                      key={item.label}
                      className="absolute w-28 h-28 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: 'easeInOut',
                      }}
                    >
                      <div className="w-full h-full rounded-2xl bg-[#1A1A1A] border border-white/10 p-3 flex flex-col items-center justify-center text-center shadow-lg">
                        <div className="font-display font-bold text-xs text-[#F5F5F5]">{item.label}</div>
                        <div className="text-[#9A9A9A] text-[10px] mt-1">{item.desc}</div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Showcase Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(192,21,42,0.2)]"
              >
                <Image
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                  alt="Supply Chain Logistics"
                  fill
                  className="object-cover"
                  preload
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Commitments Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24"
        >
          <div className="text-center mb-8">
            <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">
              Our Commitments
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commitments.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
                  onMouseEnter={() => setActiveCommitment(i)}
                  className={`relative p-6 rounded-2xl border transition-all duration-500 ${
                    activeCommitment === i
                      ? 'bg-[#C0152A]/10 border-[#C0152A]/30 shadow-[0_0_30px_rgba(192,21,42,0.15)]'
                      : 'bg-[#1A1A1A] border-white/5 hover:border-white/10'
                  }`}
                >
                  <Icon
                    className={`h-8 w-8 mb-4 transition-colors ${
                      activeCommitment === i ? 'text-[#C0152A]' : 'text-[#9A9A9A]'
                    }`}
                  />
                  <div className="font-display font-bold text-lg text-[#F5F5F5] mb-2">{item.title}</div>
                  <p className="text-[#9A9A9A] text-sm mb-4">{item.description}</p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      activeCommitment === i ? 'text-[#C0152A]' : 'text-[#9A9A9A]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      activeCommitment === i ? 'bg-[#C0152A]' : 'bg-[#9A9A9A]'
                    }`} />
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
