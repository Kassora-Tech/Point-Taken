'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/directory', label: 'Directory' },
  { href: '/store', label: 'Store' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 h-16 bg-black/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://i.ibb.co/vCYDLZLf/Invoicelogo-Pnt-Takn-Grp-Logo-jpg.jpg"
              alt="Point-Taken Group"
              width={36}
              height={36}
              className="rounded shrink-0"
              preload
            />
            <span className="font-display font-bold tracking-wider text-[#F5F5F5] text-sm sm:text-base">
              POINT-TAKEN GROUP
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors relative after:h-px after:bg-[#C0152A] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:transition-all ${
                    isActive ? 'text-[#C0152A]' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link href="/auth/login">
              <Button className="bg-[#C0152A] hover:bg-[#E8354A] text-white rounded-full px-6 font-semibold">
                Client Portal
              </Button>
            </Link>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0A0A0A] border-l border-white/10 p-6">
              <Link href="/" className="flex items-center gap-3 mb-8">
                <Image
                  src="https://i.ibb.co/vCYDLZLf/Invoicelogo-Pnt-Takn-Grp-Logo-jpg.jpg"
                  alt="Point-Taken Group"
                  width={36}
                  height={36}
                  className="rounded shrink-0"
                  preload
                />
                <span className="font-display font-bold tracking-wider text-[#F5F5F5] text-sm">
                  POINT-TAKEN GROUP
                </span>
              </Link>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-display font-bold transition-colors ${
                        isActive ? 'text-[#C0152A]' : 'text-[#F5F5F5] hover:text-[#C0152A]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="mt-4">
                  <Button className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white font-semibold rounded-full">
                    Client Portal
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
