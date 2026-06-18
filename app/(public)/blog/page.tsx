'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/lib/types'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
        if (error) {
          console.error('Supabase fetch error:', error)
          return
        }
        if (!cancelled && data) {
          const typed = data as BlogPost[]
          setPosts(typed)
          setAllTags([...new Set(typed.flatMap((p) => p.tags || []))])
        }
      } catch (err) {
        console.error('Failed to load blog posts:', err)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts

  const featured = filtered.length > 0 ? filtered[0] : null
  const remaining = filtered.length > 1 ? filtered.slice(1) : []

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Blog</span>
          <h1 className="font-display text-8xl font-black text-[#F5F5F5] mt-4 leading-none">
            <span className="text-stroke">INSIGHTS</span>
          </h1>
          <p className="text-[#9A9A9A] text-base sm:text-lg mt-4 max-w-2xl">
            Latest news, updates, and industry insights from Point-Taken Group.
          </p>
        </div>

        {allTags.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mt-12 mb-8">
            <button
              onClick={() => setActiveTag(null)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !activeTag
                  ? 'bg-[#C0152A] text-white'
                  : 'bg-[#111111] text-[#9A9A9A] border border-white/8 hover:border-[#C0152A]/30'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  tag === activeTag
                    ? 'bg-[#C0152A] text-white'
                    : 'bg-[#111111] text-[#9A9A9A] border border-white/8 hover:border-[#C0152A]/30'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[#9A9A9A] text-lg">No blog posts published yet. Check back soon.</p>
          </div>
        )}

        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden mb-8"
          >
            <Link href={`/blog/${featured.slug}`} className="flex flex-col md:flex-row group">
              <div className="md:w-1/2 h-64 md:h-auto bg-[#2A2A2A]">
                {featured.cover_image ? (
                  <img
                    src={featured.cover_image}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-[#C0152A] text-5xl font-black">PTG</span>
                  </div>
                )}
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs text-[#9A9A9A] mb-3">
                  <Calendar className="h-3 w-3" />
                  {formatDate(featured.created_at)}
                </div>
                <h2 className="font-display text-2xl font-bold text-[#F5F5F5] mb-3 group-hover:text-[#C0152A] transition-colors">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-[#9A9A9A] text-sm leading-relaxed">{featured.excerpt}</p>
                )}
                {featured.tags && featured.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {featured.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-full bg-[#C0152A]/10 border border-[#C0152A]/20 text-[#C0152A] text-[10px] font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1 text-[#C0152A] text-sm font-semibold mt-4">
                  Read Article <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {remaining.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remaining.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden hover:border-[#C0152A]/20 hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="relative h-52 bg-[#2A2A2A]">
                      {post.cover_image ? (
                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-[#C0152A] text-4xl font-black">PTG</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-[#9A9A9A] mb-3">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.created_at)}
                      </div>
                      <h2 className="font-display font-bold text-lg text-[#F5F5F5] mb-2 group-hover:text-[#C0152A] transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-[#9A9A9A] text-sm line-clamp-2">{post.excerpt}</p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-full bg-[#C0152A]/10 border border-[#C0152A]/20 text-[#C0152A] text-[10px] font-semibold"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[#C0152A] text-sm font-semibold mt-auto pt-4">
                        Read More <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
