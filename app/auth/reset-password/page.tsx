'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { Loader2, Lock, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Password updated successfully!')
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors z-10">
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
          <Image
            src="https://i.ibb.co/vCYDLZLf/Invoicelogo-Pnt-Takn-Grp-Logo-jpg.jpg"
            alt="Point-Taken Group"
            width={80}
            height={80}
            className="mx-auto rounded-xl mb-4"
            preload
          />
          </Link>
          <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Set New Password</h1>
          <p className="text-[#9A9A9A] mt-2">Choose a new password for your account</p>
        </div>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-6">
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="text-sm text-[#9A9A9A] mb-1 block">New Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
                />
              </div>
              <div>
                <label className="text-sm text-[#9A9A9A] mb-1 block">Confirm New Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
