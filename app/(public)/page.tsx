'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HeroPTG from '@/components/public/HeroPTG'
import StatsBar from '@/components/public/StatsBar'
import ServicesGrid from '@/components/public/ServicesGrid'
import BlogCard from '@/components/public/BlogCard'
import ContactSection from '@/components/public/ContactSection'
import { createClient } from '@/lib/supabase/client'
import type { BlogPost } from '@/lib/types'

export default function HomePage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    async function fetchPosts() {
      try {
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
      <StatsBar />
      <ServicesGrid />

      <section className="py-16 bg-[#0A0A0A] overflow-hidden border-t border-white/5">
        <div className="animate-marquee whitespace-nowrap">
          <span className="font-display text-[100px] font-black text-[#C0152A]/20 leading-none mx-4">
            Excellence · Innovation · Integrity · Sustainability · Point-Taken Group ·{' '}
          </span>
          <span className="font-display text-[100px] font-black text-[#C0152A]/20 leading-none mx-4">
            Excellence · Innovation · Integrity · Sustainability · Point-Taken Group ·{' '}
          </span>
        </div>
      </section>

      <section className="py-24 bg-[#1A1A1A] bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-white/5"
            >
              <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Vision</span>
              <h2 className="font-display text-3xl font-bold text-[#F5F5F5] mt-4 mb-4">Vision</h2>
              <p className="text-[#9A9A9A] text-lg leading-relaxed">
                To be the premier provider of supply and service solutions, consistently exceeding customer expectations.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-white/5"
            >
              <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Mission</span>
              <h2 className="font-display text-3xl font-bold text-[#F5F5F5] mt-4 mb-4">Mission</h2>
              <p className="text-[#9A9A9A] text-lg leading-relaxed">
                To deliver reliable and top-quality products and services while fostering sustainability, innovation, and lasting partnerships.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">From Our Blog</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-[#F5F5F5] mt-4">Latest Insights</h2>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="border-[#C0152A] text-[#C0152A] hover:bg-[#C0152A]/10">
                View All Posts <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => <BlogCard key={post.id} post={post} />)
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-5 h-80 animate-pulse">
                  <div className="h-48 bg-[#2A2A2A] rounded-xl mb-4" />
                  <div className="h-4 bg-[#2A2A2A] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#2A2A2A] rounded w-1/2" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden bg-[#0A0A0A] border-t border-white/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-[#C0152A]/20 rounded-full blur-[120px] animate-pulse" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl sm:text-7xl font-black text-[#F5F5F5] mb-8">
              Ready to take the point?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="outline" className="border-[#C0152A] text-[#C0152A] hover:bg-[#C0152A]/10 px-8 py-6 text-lg">
                  Contact Us
                </Button>
              </Link>
              <Link href="/store">
                <Button className="bg-[#C0152A] hover:bg-[#E8354A] text-white px-8 py-6 text-lg font-semibold">
                  View Our Store
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <ContactSection />
    </>
  )
}
