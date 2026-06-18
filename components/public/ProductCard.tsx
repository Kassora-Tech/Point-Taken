import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden hover:border-[#C0152A]/20 hover:-translate-y-1 transition-all duration-300 group">
      <Link href={`/store/${product.id}`}>
        <div className="relative h-48 bg-[#2A2A2A]">
          {product.images && product.images[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
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
        <p className="font-display text-xl font-bold text-[#C0152A]">R {product.price.toFixed(2)}</p>
        <Button className="w-full mt-4 bg-[#C0152A] hover:bg-[#E8354A] text-white font-semibold">
          <ShoppingCart className="h-4 w-4 mr-2" /> Request Quote
        </Button>
      </div>
    </div>
  )
}
