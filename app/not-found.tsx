import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-4">
      <div className="text-center max-w-md">
        <div className="font-display text-[200px] font-black text-[#C0152A]/10 leading-none">404</div>
        <h1 className="font-display text-4xl font-bold text-[#F5F5F5] mt-4">Page Not Found</h1>
        <p className="text-[#9A9A9A] mt-4">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="inline-block mt-8">
          <Button className="bg-[#C0152A] hover:bg-[#E8354A] text-white font-semibold px-8">
            Back Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
