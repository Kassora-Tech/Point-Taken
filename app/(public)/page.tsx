'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Package, Truck, Heart, Building2, Lightbulb, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HeroPTG from '@/components/public/HeroPTG'
import BlogCard from '@/components/public/BlogCard'
import ContactSection from '@/components/public/ContactSection'
import type { BlogPost } from '@/lib/types'

const stats = [
  { value: '2021', label: 'Established' },
  { value: '4', label: 'Cities' },
  { value: '96%', label: 'Satisfaction' },
  { value: 'LOGIS', label: 'Certified' },
  { value: 'SAHPRA', label: 'Registered' },
]

const services = [
  { icon: Package, title: 'Supply & Procurement', description: 'Sourcing top-tier products across all categories with speed and reliability.' },
  { icon: Truck, title: 'Nationwide Delivery', description: 'Comprehensive logistics network ensuring timely delivery to all major cities.' },
  { icon: Heart, title: 'Healthcare Supplies', description: 'SAHPRA-registered medical product distribution for healthcare facilities.' },
  { icon: Building2, title: 'Government Contracts', description: 'LOGIS-certified supplier for public sector procurement needs.' },
  { icon: Lightbulb, title: 'Consultation Services', description: 'Strategic supply chain consulting tailored to your business requirements.' },
  { icon: Users, title: 'Account Management', description: 'Dedicated account teams providing proactive communication and support.' },
]

const marqueeText = 'Excellence · Innovation · Integrity · Sustainability · Point-Taken Group ·'

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center"
    >
      <div className="font-display font-black text-4xl text-white">{value}</div>
      <div className="text-sm uppercase tracking-widest text-white/70">{label}</div>
    </motion.div>
  )
}

export default function HomePage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3)
        if (data) setBlogPosts(data as BlogPost[])
      } catch {}
    }
    fetchPosts()
  }, [])

  return (
    <>
      <HeroPTG />

      {/* Stats Bar */}
      <section
        className="py-8 relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 80% 100% at 20% 0%, rgba(232,53,74,0.4) 0%, transparent 60%),' +
            'radial-gradient(ellipse 80% 100% at 80% 100%, rgba(139,13,28,0.5) 0%, transparent 60%),' +
            'linear-gradient(135deg, #8B0D1C 0%, #C0152A 50%, #6B0915 100%)',
        }}
      >
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0.000001%, transparent 0.0001%, transparent 50%, #fff 50.000001%, transparent 50.0002%, transparent 99.9999%)', backgroundSize: '4px 4px' }} />
        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 text-white relative z-10">
          {stats.map((stat) => (
            <Stat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </section>

      {/* Section transition fade */}
      <div className="h-10 bg-gradient-to-b from-[#8B0D1C] to-[#0A0A0A]" />

      {/* Services Grid */}
      <section
        className="py-20"
        style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #111111 50%, #0A0A0A 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-black text-5xl sm:text-6xl text-[#F5F5F5]">What We Deliver</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#111111] border-l-4 border-l-[#C0152A] border border-white/8 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(192,21,42,0.15)] transition-all duration-300"
                >
                  <Icon className="h-8 w-8 text-[#C0152A] mb-4" />
                  <h3 className="font-display font-bold text-lg text-[#F5F5F5] mb-2">{service.title}</h3>
                  <p className="text-sm text-[#9A9A9A]">{service.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Marquee Band */}
      <section className="py-16 bg-[#0A0A0A] overflow-hidden border-t border-white/5">
        <div className="animate-marquee whitespace-nowrap">
          <span className="font-display font-black text-[100px] sm:text-[120px] text-[#C0152A]/30 leading-none mx-4">
            {marqueeText}
          </span>
          <span className="font-display font-black text-[100px] sm:text-[120px] text-[#C0152A]/30 leading-none mx-4">
            {marqueeText}
          </span>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative overflow-hidden bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-0 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#C0152A]/20 rotate-12 origin-center" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:pr-16"
            >
              <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Vision</span>
              <h2 className="font-display text-4xl font-bold text-[#F5F5F5] mt-4 mb-6">Vision</h2>
              <p className="text-[#9A9A9A] text-lg leading-relaxed">
                To be the premier provider of supply and service solutions, consistently exceeding customer expectations through innovation, integrity, and unwavering commitment to quality.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:pl-16"
            >
              <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Mission</span>
              <h2 className="font-display text-4xl font-bold text-[#F5F5F5] mt-4 mb-6">Mission</h2>
              <p className="text-[#9A9A9A] text-lg leading-relaxed">
                To deliver reliable and top-quality products and services while fostering sustainability, innovation, and lasting partnerships that drive mutual growth.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 bg-[#0A0A0A] bg-dot-pattern">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-[#C0152A] text-sm tracking-widest font-semibold font-display uppercase">FROM OUR BLOG</p>
              <h2 className="font-display font-black text-5xl sm:text-6xl text-[#F5F5F5] mt-4">Latest Insights</h2>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="border-[#C0152A] text-[#C0152A] hover:bg-[#C0152A]/10 rounded-full">
                View All Posts <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <AnimatePresence mode="wait">
            {blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-[#111111] rounded-2xl border border-white/8 p-5 h-80 animate-pulse">
                      <div className="h-48 bg-[#1A1A1A] rounded-xl mb-4" />
                      <div className="h-4 bg-[#1A1A1A] rounded w-3/4 mb-2" />
                      <div className="h-3 bg-[#1A1A1A] rounded w-1/2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="py-20 text-center text-white relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 100% 0%, rgba(232,53,74,0.35) 0%, transparent 55%),' +
            'radial-gradient(ellipse 70% 90% at 0% 100%, rgba(107,9,21,0.6) 0%, transparent 60%),' +
            'linear-gradient(160deg, #6B0915 0%, #8B0D1C 40%, #C0152A 100%)',
        }}
      >
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-conic-gradient(#fff 0.000001%, transparent 0.0001%, transparent 50%, #fff 50.000001%, transparent 50.0002%, transparent 99.9999%)', backgroundSize: '4px 4px' }} />
        <p className="text-sm uppercase tracking-widest text-white/70 mb-4 relative z-10">Ready to work together?</p>
        <h2 className="font-display font-black text-5xl sm:text-6xl mb-8 relative z-10">Let's take the point.</h2>
        <div className="flex gap-4 justify-center flex-wrap relative z-10">
          <Link href="/contact">
            <Button
              className="bg-white text-[#8B0D1C] rounded-full px-8 py-6 text-lg font-semibold transition-all duration-300"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.25)', border: '1px solid rgba(0,0,0,0.05)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)' }}
            >
              Contact Us
            </Button>
          </Link>
          <Link href="/store">
            <Button
              className="rounded-full px-8 py-6 text-lg font-semibold transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.5)', color: '#FFFFFF', backdropFilter: 'blur(8px)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#FFFFFF' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}
            >
              View Our Store
            </Button>
          </Link>
        </div>
      </section>

      <ContactSection />
    </>
  )
}
