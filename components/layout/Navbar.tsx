'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://i.ibb.co/vCYDLZLf/Invoicelogo-Pnt-Takn-Grp-Logo-jpg.jpg"
              alt="Point-Taken Group"
              width={40}
              height={40}
              className="rounded"
              preload
            />
            <span className="font-display text-lg font-bold text-[#F5F5F5] hidden sm:block">
              POINT-TAKEN
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#9A9A9A] hover:text-[#F5F5F5] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/auth/login">
              <Button className="bg-[#C0152A] hover:bg-[#E8354A] text-white font-semibold">
                Client Portal
              </Button>
            </Link>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-[#F5F5F5] hover:bg-white/5 transition-colors">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0A0A0A] border-l border-white/10 p-6">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-display font-bold text-[#F5F5F5] hover:text-[#C0152A] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white font-semibold">
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
