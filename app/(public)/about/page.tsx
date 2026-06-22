'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Shield, Award, Building2, Heart, Target, Users } from 'lucide-react'
import ContactSection from '@/components/public/ContactSection'

const values = [
  { icon: Shield, title: 'Integrity', description: 'We operate with honesty and transparency in all dealings.' },
  { icon: Award, title: 'Excellence', description: 'Committed to the highest standards across every service.' },
  { icon: Heart, title: 'Sustainability', description: 'Environmental responsibility in all operations.' },
  { icon: Users, title: 'Partnership', description: 'Building lasting relationships with clients and suppliers.' },
]

const milestones = [
  { year: '2021', event: 'Company founded in Bloemfontein' },
  { year: '2022', event: 'LOGIS certification achieved' },
  { year: '2023', event: 'SAHPRA registration obtained' },
  { year: '2024', event: 'Expanded to 4 cities nationwide' },
]

const affiliations = [
  'Member of National Contract Cleaners Association',
  '3-Year Contract Partner — PURCO SA',
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">About Us</span>
            <h1 className="font-display text-5xl sm:text-7xl font-black text-[#F5F5F5] mt-4 leading-tight">
              Your Partner in <span className="text-[#C0152A]">Excellence</span>
            </h1>
            <p className="text-[#9A9A9A] text-lg mt-6 leading-relaxed">
              Point-Taken Group (Pty) Ltd. is a South African supply and delivery company headquartered in Bloemfontein. 
              Established in 2021, we have grown into a trusted partner for businesses across multiple sectors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Story</span>
              <h2 className="font-display text-4xl font-bold text-[#F5F5F5] mt-4 mb-6">From Bloemfontein to Nationwide</h2>
              <p className="text-[#9A9A9A] leading-relaxed mb-4">
                What started as a vision to bridge the gap in South African supply chains has grown into a multi-city 
                operation serving healthcare, government, corporate, and retail sectors.
              </p>
              <p className="text-[#9A9A9A] leading-relaxed">
                With LOGIS and SAHPRA certifications, we maintain the highest standards of compliance and quality 
                across every delivery we make.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-2xl overflow-hidden border border-white/10"
            >
              <Image
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                alt="Supply chain logistics"
                fill
                className="object-cover"
                preload
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Values</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-[#F5F5F5] mt-4">What We Stand For</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => {
              const Icon = val.icon
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6 hover:border-[#C0152A]/20 transition-all"
                >
                  <Icon className="h-8 w-8 text-[#C0152A] mb-4" />
                  <h3 className="font-display font-bold text-lg text-[#F5F5F5] mb-2">{val.title}</h3>
                  <p className="text-[#9A9A9A] text-sm">{val.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Timeline</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-[#F5F5F5] mt-4">Our Journey</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 pb-8 relative last:pb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[#C0152A] border-4 border-[#1A1A1A] ring-2 ring-[#C0152A]/30 z-10" />
                  {i < milestones.length - 1 && <div className="w-px flex-1 bg-white/10" />}
                </div>
                <div className="pb-8">
                  <span className="font-display text-xl font-bold text-[#C0152A]">{m.year}</span>
                  <p className="text-[#F5F5F5] mt-1">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Affiliations</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-[#F5F5F5] mt-4 mb-10">
              Partnerships & Memberships
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {affiliations.map((aff) => (
                <div
                  key={aff}
                  className="bg-[#1A1A1A] border border-[#C0152A]/20 rounded-full px-6 py-3 text-sm text-[#F5F5F5] font-medium"
                >
                  {aff}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <ContactSection />
    </div>
  )
}
