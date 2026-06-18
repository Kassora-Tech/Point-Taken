import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import NewsletterForm from './NewsletterForm'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/directory', label: 'Directory' },
  { href: '/store', label: 'Store' },
  { href: '/contact', label: 'Contact' },
]

export default async function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="https://i.ibb.co/vCYDLZLf/Invoicelogo-Pnt-Takn-Grp-Logo-jpg.jpg"
                alt="Point-Taken Group"
                width={40}
                height={40}
                className="rounded"
                preload
              />
              <span className="font-display text-lg font-bold text-[#F5F5F5]">
                POINT-TAKEN
              </span>
            </div>
            <p className="text-[#9A9A9A] text-sm">
              Your Partner in Excellence and Innovation
            </p>
            <p className="text-[#9A9A9A] text-xs">
              Reg No: 2021/150859/07
            </p>
            <p className="text-[#9A9A9A] text-xs leading-relaxed">
              MAAA: 1157674 | LOGIS: JQ956<br />
              SAHPRA: 00003162MD | TAX: 9279067251<br />
              CSR: 1035270
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-[#F5F5F5] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#9A9A9A] hover:text-[#C0152A] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-[#F5F5F5] mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-[#9A9A9A]">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-[#C0152A] mt-0.5 shrink-0" />
                <span>073 957 6209 | 071 855 5447</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-[#C0152A] mt-0.5 shrink-0" />
                <div>
                  <p>orders.ptg1@gmail.com</p>
                  <p>admin@pointtaken.co.za</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#C0152A] mt-0.5 shrink-0" />
                <span>54 Rontgen Street, Hospitaalpark, Bloemfontein, 9301</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-[#F5F5F5] mb-4">Stay Updated</h3>
            <p className="text-[#9A9A9A] text-sm mb-4">
              Subscribe to our newsletter for updates and offers.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 text-center text-sm text-[#9A9A9A]">
          <p>&copy; {new Date().getFullYear()} Point-Taken Group (Pty) Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
