'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/types'

const CATEGORIES = ['All', 'Healthcare', 'Stationery', 'Safety', 'Cleaning', 'Government']

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
        if (error) {
          console.error('Supabase fetch error:', error)
          return
        }
        if (!cancelled && data) {
          setProducts(data as Product[])
        }
      } catch (err) {
        console.error('Failed to load products:', err)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-4">
          <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Store</span>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-[#F5F5F5] mt-4 leading-tight">
            Products & <span className="text-[#C0152A]">Supplies</span>
          </h1>
          <p className="text-[#9A9A9A] text-base sm:text-lg mt-4 max-w-2xl">
            SAHPRA-compliant medical supplies, PPE, stationery, and more — delivered nationwide.
          </p>
        </div>

        {/* Filter bar */}
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9A9A]" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#111111] border-white/8 text-[#F5F5F5] placeholder:text-[#9A9A9A]"
            />
          </div>
        </div>

        {/* Count */}
        <p className="text-[#9A9A9A] text-sm mb-6">
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-[#9A9A9A] text-lg">No products found in this category.</p>
          </div>
        )}
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-[#111111] border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(192,21,42,0.2)]">
      {/* Image */}
      <Link href={`/store/${product.id}`}>
        <div className="relative h-52 bg-[#0A0A0A]">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[#C0152A] text-3xl font-black">PTG</span>
            </div>
          )}
          {product.category && (
            <span className="absolute top-2 left-2 px-3 py-1 bg-[#C0152A]/90 text-white text-xs font-bold rounded-full">
              {product.category}
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 space-y-3">
        <h3 className="font-display font-bold text-lg text-[#F5F5F5]">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-[#9A9A9A] line-clamp-2">{product.description}</p>
        )}
        <p className="font-display text-2xl font-bold text-[#C0152A]">
          R {Number(product.price).toFixed(2)}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <a
            href={`mailto:info@pointtaken.co.za?subject=Quote Request: ${encodeURIComponent(product.name)}`}
            className="flex-1"
          >
            <Button className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white font-semibold text-xs">
              Request Quote
            </Button>
          </a>
          <Link href={`/store/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-white/8 text-[#F5F5F5] hover:bg-white/5 text-xs">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
