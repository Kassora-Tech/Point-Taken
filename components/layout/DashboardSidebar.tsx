'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Bookmark,
  FolderOpen,
  ShoppingCart,
  Share2,
  Truck,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/blog-admin', label: 'Blog Manager', icon: FileText },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/directory-admin', label: 'Directory', icon: Bookmark },
  { href: '/dashboard/documents', label: 'Documents', icon: FolderOpen },
  { href: '/dashboard/store-admin', label: 'Store Manager', icon: ShoppingCart },
  { href: '/dashboard/social', label: 'Social Media', icon: Share2 },
  { href: '/dashboard/tracking', label: 'Order Tracking', icon: Truck },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  async function handleSignOut() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0A0A0A] border-r border-white/5 h-screen sticky top-0">
      <div className="p-4 border-b border-white/5">
        <Link href="/dashboard" className="font-display text-sm font-bold text-[#F5F5F5] tracking-wider">
          POINT-TAKEN<br />
          <span className="text-[#9A9A9A] text-xs font-normal">DASHBOARD</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#C0152A]/10 text-[#C0152A] shadow-[0_0_20px_rgba(192,21,42,0.1)]'
                    : 'text-[#9A9A9A] hover:text-[#F5F5F5] hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="p-3 border-t border-white/5 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-[#9A9A9A] hover:text-[#F5F5F5]"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-[#9A9A9A] hover:text-[#C0152A]"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
