'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      toast.success('Check your email for reset link.')
      router.push('/auth/login')
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="https://i.ibb.co/vCYDLZLf/Invoicelogo-Pnt-Takn-Grp-Logo-jpg.jpg"
            alt="Point-Taken Group"
            width={80}
            height={80}
            className="mx-auto rounded-xl mb-4"
            preload
          />
          <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Reset Password</h1>
          <p className="text-[#9A9A9A] mt-2">Enter your email to receive a reset link</p>
        </div>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-6">
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="text-sm text-[#9A9A9A] mb-1 block">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                Send Reset Link
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="text-sm text-[#9A9A9A] hover:text-[#F5F5F5] transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
