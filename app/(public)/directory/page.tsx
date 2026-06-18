'use client'

import { useEffect, useState } from 'react'
import { Phone, Mail, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { DirectoryEntry } from '@/lib/types'

const CATEGORIES = ['All', 'Healthcare', 'Government', 'Logistics', 'Education']

const CATEGORY_STYLES: Record<string, string> = {
  Healthcare: 'bg-red-500/15 text-red-400 border-red-500/30',
  Government: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Logistics: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Education: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
}

export default function DirectoryPage() {
  const [entries, setEntries] = useState<DirectoryEntry[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('directory_entries')
          .select('*')
          .eq('active', true)
          .order('featured', { ascending: false })
          .order('name', { ascending: true })
        if (error) {
          console.error('Supabase fetch error:', error)
          return
        }
        if (!cancelled && data) {
          setEntries(data as DirectoryEntry[])
        }
      } catch (err) {
        console.error('Failed to load directory:', err)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = entries.filter((e) => {
    const matchCategory = activeCategory === 'All' || e.category === activeCategory
    const matchSearch = !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const sorted = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-4">
          <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Directory</span>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-[#F5F5F5] mt-4 leading-tight">
            Partners & <span className="text-[#C0152A]">Suppliers</span>
          </h1>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-12 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === activeCategory
                    ? 'bg-[#C0152A] text-white'
                    : 'bg-[#111111] text-[#9A9A9A] border border-white/8 hover:border-[#C0152A]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#111111] border-white/8 text-[#F5F5F5] placeholder:text-[#9A9A9A]"
            />
          </div>
        </div>

        {/* Grid */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((entry) => {
              const isFeatured = entry.featured
              const badgeStyle = CATEGORY_STYLES[entry.category] || 'bg-[#C0152A]/15 text-[#C0152A] border-[#C0152A]/30'
              return (
                <div
                  key={entry.id}
                  className={`bg-[#111111] border border-white/8 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                    isFeatured
                      ? 'border-t-2 border-t-[#C0152A] shadow-[0_0_30px_rgba(192,21,42,0.15)]'
                      : ''
                  }`}
                >
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${badgeStyle}`}>
                      {entry.category}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#F5F5F5] mb-2">{entry.name}</h3>
                  {entry.description && (
                    <p className="text-sm text-[#9A9A9A] line-clamp-3 mb-4">{entry.description}</p>
                  )}
                  <div className="space-y-2 text-sm text-[#9A9A9A]">
                    {entry.phone && (
                      <a href={`tel:${entry.phone}`} className="flex items-center gap-2 hover:text-[#F5F5F5] transition-colors">
                        <Phone className="h-4 w-4 text-[#C0152A] shrink-0" />
                        <span>{entry.phone}</span>
                      </a>
                    )}
                    {entry.email && (
                      <a href={`mailto:${entry.email}`} className="flex items-center gap-2 hover:text-[#F5F5F5] transition-colors">
                        <Mail className="h-4 w-4 text-[#C0152A] shrink-0" />
                        <span className="truncate">{entry.email}</span>
                      </a>
                    )}
                    {entry.website && (
                      <a
                        href={entry.website.startsWith('http') ? entry.website : `https://${entry.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-[#F5F5F5] transition-colors"
                      >
                        <Globe className="h-4 w-4 text-[#C0152A] shrink-0" />
                        <span className="truncate">{entry.website}</span>
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-[#9A9A9A] text-lg">No entries found.</p>
          </div>
        )}
      </section>
    </div>
  )
}
