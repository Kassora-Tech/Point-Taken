import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail } from 'lucide-react'
import NewsletterForm from './NewsletterForm'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/store', label: 'Store' },
  { href: '/directory', label: 'Directory' },
  { href: '/contact', label: 'Contact' },
]

const services = ['Supply', 'Healthcare', 'Government', 'Delivery']

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="https://i.ibb.co/vCYDLZLf/Invoicelogo-Pnt-Takn-Grp-Logo-jpg.jpg"
                alt="Point-Taken Group"
                width={36}
                height={36}
                className="rounded shrink-0"
                preload
              />
              <span className="font-display text-lg font-bold tracking-wider text-[#F5F5F5]">
                POINT-TAKEN GROUP
              </span>
            </div>
            <p className="text-[#9A9A9A] text-sm leading-relaxed">
              Your Partner in Excellence and Innovation
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-[#F5F5F5] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#9A9A9A] hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-[#F5F5F5] mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-[#9A9A9A] text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-display font-bold text-[#F5F5F5] mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-[#9A9A9A]">
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-[#C0152A] mt-0.5 shrink-0" />
                  <div>
                    <p>073 957 6209</p>
                    <p>071 855 5447</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-[#C0152A] mt-0.5 shrink-0" />
                  <div>
                    <p className="hover:text-white transition-colors">
                      <a href="mailto:orders.ptg1@gmail.com">orders.ptg1@gmail.com</a>
                    </p>
                    <p className="hover:text-white transition-colors">
                      <a href="mailto:admin@pointtaken.co.za">admin@pointtaken.co.za</a>
                    </p>
                    <p className="hover:text-white transition-colors">
                      <a href="mailto:sales@pointtaken.co.za">sales@pointtaken.co.za</a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-bold text-[#F5F5F5] mb-4">Stay Updated</h3>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 space-y-3 text-center text-sm text-[#9A9A9A]">
          <p className="flex items-center justify-center gap-1">
            <MapPin className="h-4 w-4 text-[#C0152A] shrink-0" />
            4 Locations: Bloemfontein · Kimberley · Welkom · Despatch
          </p>
          <p>
            Reg: 2021/150859/07 · MAAA: 1157674 · LOGIS: JQ956 · SAHPRA: 00003162MD · TAX: 9279067251 · CSR: 1035270
          </p>
          <p className="pt-2">&copy; {new Date().getFullYear()} Point-Taken Group (Pty) Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
