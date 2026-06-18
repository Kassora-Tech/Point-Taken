import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Calendar, ArrowLeft, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BlogPost } from '@/lib/types'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let post: BlogPost | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()
    if (data) post = data as BlogPost
  } catch {}
  return {
    title: post ? `${post.title} — Point-Taken Group` : 'Blog Post — Point-Taken Group',
    description: post?.excerpt || 'Blog post from Point-Taken Group.',
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let post: BlogPost | null = null
  let relatedPosts: BlogPost[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()
    if (data) {
      post = data as BlogPost
      await supabase.from('blog_posts').update({ views: (post.views || 0) + 1 }).eq('id', post.id)
      if (post.tags && post.tags.length > 0) {
        const { data: related } = await supabase
          .from('blog_posts')
          .select('*')
          .neq('id', post.id)
          .overlaps('tags', post.tags)
          .eq('published', true)
          .limit(3)
        if (related) relatedPosts = related as BlogPost[]
      }
    }
  } catch {}

  if (!post) notFound()

  return (
    <div className="min-h-screen">
      <article className="py-24 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#9A9A9A] hover:text-[#C0152A] text-sm mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-[#C0152A]/10 border border-[#C0152A]/20 text-[#C0152A] text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display text-4xl sm:text-5xl font-black text-[#F5F5F5] leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-[#9A9A9A] text-sm mb-8">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {formatDate(post.created_at)}</span>
            <span>{post.views || 0} views</span>
          </div>

          {post.cover_image && (
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-12 border border-white/10">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {post.content && (
            <div
              className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-[#F5F5F5] prose-p:text-[#9A9A9A] prose-a:text-[#C0152A] prose-strong:text-[#F5F5F5] prose-code:text-[#C0152A]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="py-16 bg-[#1A1A1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-[#F5F5F5] mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                  <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 p-5 hover:border-[#C0152A]/20 transition-all">
                    <h3 className="font-display font-bold text-[#F5F5F5] group-hover:text-[#C0152A] transition-colors">{rp.title}</h3>
                    {rp.excerpt && <p className="text-[#9A9A9A] text-sm mt-2 line-clamp-2">{rp.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
