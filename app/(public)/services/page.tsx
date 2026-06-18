'use client'

import { motion } from 'framer-motion'
import { Truck, Shield, Heart, Building2, BarChart3, Users, CheckCircle } from 'lucide-react'
import ContactSection from '@/components/public/ContactSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const services = [
  {
    icon: Truck,
    title: 'Supply & Procurement',
    desc: 'Sourcing top-tier products across all categories with competitive pricing and reliable lead times.',
    features: ['Vendor sourcing and negotiation', 'Quality assurance checks', 'Just-in-time delivery', 'Bulk procurement discounts'],
  },
  {
    icon: Shield,
    title: 'Nationwide Delivery',
    desc: '4-city network providing reliable last-mile delivery with real-time tracking and proactive updates.',
    features: ['Same-day delivery options', 'Real-time GPS tracking', 'Dedicated fleet management', 'Proof of delivery'],
  },
  {
    icon: Heart,
    title: 'Healthcare Supplies',
    desc: 'SAHPRA-registered medical product distribution serving hospitals, clinics, and healthcare providers.',
    features: ['SAHPRA compliant inventory', 'Cold chain logistics', 'Medical grade packaging', 'Emergency supply kits'],
  },
  {
    icon: Building2,
    title: 'Government Contracts',
    desc: 'LOGIS-certified supplier for public sector procurement with full compliance and reporting.',
    features: ['LOGIS registered', 'B-BBEE compliant', 'Tender management', 'Regulatory reporting'],
  },
  {
    icon: BarChart3,
    title: 'Consultation Services',
    desc: 'Tailored supply chain strategies to optimize your operations and reduce costs.',
    features: ['Supply chain audits', 'Process optimization', 'Cost reduction analysis', 'Vendor management'],
  },
  {
    icon: Users,
    title: 'Account Management',
    desc: 'Dedicated teams providing proactive communication and personalized service.',
    features: ['Single point of contact', 'Monthly performance reviews', '24/7 support line', 'Custom reporting'],
  },
]

const certifications = [
  { label: 'LOGIS', value: 'JQ956' },
  { label: 'SAHPRA', value: '00003162MD' },
  { label: 'MAAA', value: '1157674' },
  { label: 'CSR', value: '1035270' },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Our Services</span>
            <h1 className="font-display text-5xl sm:text-7xl font-black text-[#F5F5F5] mt-4 leading-tight">
              Supply. Deliver. <span className="text-[#C0152A]">Excel.</span>
            </h1>
            <p className="text-[#9A9A9A] text-lg mt-6 leading-relaxed">
              Comprehensive supply chain solutions backed by LOGIS and SAHPRA certifications.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((svc, i) => {
              const Icon = svc.icon
              return (
                <motion.div
                  key={svc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#0A0A0A] rounded-2xl border border-white/5 p-8 hover:border-[#C0152A]/20 transition-all"
                >
                  <Icon className="h-10 w-10 text-[#C0152A] mb-4" />
                  <h3 className="font-display text-2xl font-bold text-[#F5F5F5] mb-3">{svc.title}</h3>
                  <p className="text-[#9A9A9A] mb-6">{svc.desc}</p>
                  <ul className="space-y-2">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#9A9A9A]">
                        <CheckCircle className="h-4 w-4 text-[#C0152A] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#C0152A] text-sm font-semibold tracking-widest font-display uppercase">Certifications</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-[#F5F5F5] mt-4 mb-12">
              Licensed & Compliant
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
              {certifications.map((cert) => (
                <div key={cert.label} className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6">
                  <div className="font-display text-2xl font-bold text-[#C0152A]">{cert.value}</div>
                  <div className="text-[#9A9A9A] text-sm mt-1">{cert.label}</div>
                </div>
              ))}
            </div>
            <Link href="/contact">
              <Button className="bg-[#C0152A] hover:bg-[#E8354A] text-white font-semibold px-8">
                Request a Quote
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <ContactSection />
    </div>
  )
}
