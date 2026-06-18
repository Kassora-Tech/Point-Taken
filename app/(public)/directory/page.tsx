import { createClient } from '@/lib/supabase/server'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { DirectoryEntry } from '@/lib/types'

export const metadata = {
  title: 'Directory — Point-Taken Group',
  description: 'Our partners, suppliers, and clients directory.',
}

export default async function DirectoryPage() {
  let entries: DirectoryEntry[] = []
  let categories: string[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('directory_entries')
      .select('*')
      .eq('active', true)
      .order('featured', { ascending: false })
      .order('name', { ascending: true })
    if (data) {
      entries = data as DirectoryEntry[]
      categories = [...new Set(entries.map((e) => e.category).filter(Boolean))] as string[]
    }
  } catch {}

  return (
    <div className="min-h-screen">
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Directory</span>
            <h1 className="font-display text-5xl sm:text-7xl font-black text-[#F5F5F5] mt-4 leading-tight">
              Partners & <span className="text-[#C0152A]">Suppliers</span>
            </h1>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {categories.map((cat) => (
                <span key={cat} className="px-4 py-1.5 rounded-full bg-[#1A1A1A] border border-white/10 text-[#9A9A9A] text-sm hover:border-[#C0152A]/30 transition-colors cursor-pointer">
                  {cat}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6 hover:border-[#C0152A]/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#F5F5F5]">{entry.name}</h3>
                    <Badge variant="outline" className="mt-1 border-[#C0152A]/20 text-[#C0152A] text-xs">
                      {entry.category}
                    </Badge>
                  </div>
                  {entry.featured && (
                    <span className="px-2 py-0.5 bg-[#C0152A] text-white text-[10px] font-bold rounded">Featured</span>
                  )}
                </div>
                {entry.description && (
                  <p className="text-[#9A9A9A] text-sm mb-4">{entry.description}</p>
                )}
                <div className="space-y-2 text-xs text-[#9A9A9A]">
                  {entry.phone && (
                    <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-[#C0152A]" /> {entry.phone}</span>
                  )}
                  {entry.email && (
                    <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-[#C0152A]" /> {entry.email}</span>
                  )}
                  {entry.address && (
                    <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-[#C0152A]" /> {entry.address}</span>
                  )}
                  {entry.website && (
                    <span className="flex items-center gap-1.5"><Globe className="h-3 w-3 text-[#C0152A]" /> {entry.website}</span>
                  )}
                </div>
              </div>
            ))}
            {entries.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-[#9A9A9A]">Directory coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
