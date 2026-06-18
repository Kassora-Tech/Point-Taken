import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/types'

export const metadata = {
  title: 'Store — Point-Taken Group',
  description: 'Browse products from Point-Taken Group.',
}

export default async function StorePage() {
  let products: Product[] = []
  let categories: string[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    if (data) {
      products = data as Product[]
      categories = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[]
    }
  } catch {}

  const featuredProducts = products.filter((p) => p.featured)
  const nonFeatured = products.filter((p) => !p.featured)

  return (
    <div className="min-h-screen">
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Store</span>
            <h1 className="font-display text-5xl sm:text-7xl font-black text-[#F5F5F5] mt-4 leading-tight">
              Products & <span className="text-[#C0152A]">Supplies</span>
            </h1>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {categories.map((cat) => (
                <span key={cat} className="px-4 py-1.5 rounded-full bg-[#1A1A1A] border border-white/10 text-[#9A9A9A] text-sm hover:border-[#C0152A]/30 hover:text-[#C0152A] transition-colors cursor-pointer">
                  {cat}
                </span>
              ))}
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div className="mb-16">
              <h2 className="font-display text-2xl font-bold text-[#F5F5F5] mb-6">Featured Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nonFeatured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-[#9A9A9A]">No products available yet. Check back soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden hover:border-[#C0152A]/20 hover:-translate-y-1 transition-all duration-300 group">
      <Link href={`/store/${product.id}`}>
        <div className="relative h-48 bg-[#2A2A2A]">
          {product.images && product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[#C0152A] text-3xl font-black">PTG</span>
            </div>
          )}
          {product.featured && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-[#C0152A] text-white text-xs font-bold rounded">
              Featured
            </span>
          )}
        </div>
      </Link>
      <div className="p-5">
        {product.category && (
          <span className="text-[#9A9A9A] text-xs uppercase tracking-wider">{product.category}</span>
        )}
        <h3 className="font-display font-bold text-[#F5F5F5] mt-1 mb-2">{product.name}</h3>
        <p className="font-display text-xl font-bold text-[#C0152A]">R {Number(product.price).toFixed(2)}</p>
        <Link href={`/store/${product.id}`}>
          <Button className="w-full mt-4 bg-[#C0152A] hover:bg-[#E8354A] text-white font-semibold">
            <ShoppingCart className="h-4 w-4 mr-2" /> Request Quote
          </Button>
        </Link>
      </div>
    </div>
  )
}
