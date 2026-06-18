import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-4">
      <div className="text-center max-w-lg">
        <div className="font-display text-[200px] font-black text-[#C0152A]/20 leading-none select-none">
          404
        </div>
        <h1 className="font-display text-2xl text-[#F5F5F5] mt-4 leading-tight">
          This page doesn&apos;t exist — but your supply solution does.
        </h1>
        <p className="text-[#9A9A9A] mt-4">
          The page you&apos;re looking for has moved or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-8 py-3 bg-[#C0152A] hover:bg-[#E8354A] text-white font-semibold rounded-full transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
