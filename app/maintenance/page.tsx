import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Launching Soon — Point-Taken Group',
  description: "Point-Taken Group's new site is almost here. Check back soon.",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-4">
      <div className="text-center max-w-lg">
        <div className="font-display text-[200px] font-black text-[#C0152A]/20 leading-none select-none">
          PTG
        </div>
        <h1 className="font-display text-2xl text-[#F5F5F5] mt-4 leading-tight">
          Something new is on the way.
        </h1>
        <p className="text-[#9A9A9A] mt-4">
          Point-Taken Group&apos;s new site is launching soon. We&apos;re putting the
          finishing touches on it — check back shortly for our full range of
          supply, delivery, and service solutions across South Africa.
        </p>
      </div>
    </div>
  )
}
