import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Package, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/types'
import { notFound } from 'next/navigation'
import EnquiryModal from './EnquiryModal'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let product: Product | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('products').select('*').eq('id', id).single()
    if (data) product = data as Product
  } catch {}
  return {
    title: product ? `${product.name} — Point-Taken Group Store` : 'Product — Point-Taken Group',
    description: product?.description || 'Product details.',
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let product: Product | null = null
  let relatedProducts: Product[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase.from('products').select('*').eq('id', id).single()
    if (data) {
      product = data as Product
      if (product.category) {
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .neq('id', product.id)
          .eq('category', product.category)
          .eq('active', true)
          .limit(4)
        if (related) relatedProducts = related as Product[]
      }
    }
  } catch {}

  if (!product) notFound()

  return (
    <div className="min-h-screen py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/store" className="inline-flex items-center gap-2 text-[#9A9A9A] hover:text-[#C0152A] text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/10">
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-16 w-16 text-[#C0152A]/30" />
              </div>
            )}
          </div>

          <div>
            {product.category && (
              <Badge variant="outline" className="border-[#C0152A]/30 text-[#C0152A] mb-4">{product.category}</Badge>
            )}
            <h1 className="font-display text-4xl font-bold text-[#F5F5F5] mb-4">{product.name}</h1>
            <p className="font-display text-3xl font-bold text-[#C0152A] mb-6">R {Number(product.price).toFixed(2)}</p>
            {product.description && (
              <p className="text-[#9A9A9A] leading-relaxed mb-6">{product.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-[#9A9A9A] mb-6">
              <span className="flex items-center gap-1"><Package className="h-4 w-4" /> SKU: {product.sku || 'N/A'}</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Stock: {product.stock > 0 ? `${product.stock} units` : 'Contact us'}
              </span>
            </div>
            <EnquiryModal productId={product.id} productName={product.name} />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="font-display text-3xl font-bold text-[#F5F5F5] mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/store/${rp.id}`} className="group block">
                  <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-5 hover:border-[#C0152A]/20 transition-all">
                    <h3 className="font-display font-bold text-[#F5F5F5] group-hover:text-[#C0152A]">{rp.name}</h3>
                    <p className="font-display text-lg font-bold text-[#C0152A] mt-2">R {Number(rp.price).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
