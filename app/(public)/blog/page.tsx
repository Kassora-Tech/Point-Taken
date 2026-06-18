import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Calendar, ArrowRight, Tag } from 'lucide-react'
import type { BlogPost } from '@/lib/types'

export const metadata = {
  title: 'Blog — Point-Taken Group',
  description: 'Latest insights, updates, and news from Point-Taken Group.',
}

export default async function BlogPage() {
  let posts: BlogPost[] = []
  let allTags: string[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    if (data) {
      posts = data as BlogPost[]
      allTags = [...new Set(posts.flatMap((p) => p.tags || []))]
    }
  } catch {}

  return (
    <div className="min-h-screen">
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Blog</span>
            <h1 className="font-display text-5xl sm:text-7xl font-black text-[#F5F5F5] mt-4 leading-tight">
              Insights & <span className="text-[#C0152A]">Updates</span>
            </h1>
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {allTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-[#C0152A]/10 border border-[#C0152A]/20 text-[#C0152A] text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden hover:border-[#C0152A]/20 hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="relative h-48 bg-[#2A2A2A]">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-[#C0152A] text-4xl font-black">PTG</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
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
                    <div className="flex items-center gap-1 text-[#C0152A] text-sm font-semibold mt-4">
                      Read More <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
            {posts.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-[#9A9A9A]">No blog posts published yet. Check back soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
