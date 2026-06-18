import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/lib/types'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden hover:border-[#C0152A]/20 hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-48 bg-[#2A2A2A]">
          {post.cover_image ? (
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
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
          <h3 className="font-display font-bold text-[#F5F5F5] mb-2 group-hover:text-[#C0152A] transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-[#9A9A9A] text-sm line-clamp-2">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-1 text-[#C0152A] text-sm font-semibold mt-4">
            Read More <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </Link>
  )
}
