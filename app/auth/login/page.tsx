'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [magicLinkLoading, setMagicLinkLoading] = useState(false)

  function getErrorMessage(err: any): string {
    const message = err?.message || ''
    if (message.toLowerCase().includes('invalid login credentials')) {
      return 'Invalid email or password'
    }
    if (message.toLowerCase().includes('email not confirmed')) {
      return 'Please confirm your email before signing in'
    }
    if (message.toLowerCase().includes('rate limit')) {
      return 'Too many attempts. Please try again later.'
    }
    return message || 'Login failed'
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Welcome back!')
      window.location.href = '/dashboard'
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink() {
    if (!email) {
      toast.error('Please enter your email first')
      return
    }
    setMagicLinkLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      })
      if (error) throw error
      toast.success('Magic link sent! Check your email.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to send magic link')
    } finally {
      setMagicLinkLoading(false)
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
          <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Client Portal</h1>
          <p className="text-[#9A9A9A] mt-2">Sign in to your dashboard</p>
        </div>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
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
              <div>
                <label className="text-sm text-[#9A9A9A] mb-1 block">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-[#F5F5F5] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#9A9A9A] hover:text-[#C0152A] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                Sign In
              </Button>
            </form>

            <div className="my-6">
              <Separator className="bg-white/10" />
            </div>

            <Button
              variant="outline"
              onClick={handleMagicLink}
              disabled={magicLinkLoading}
              className="w-full border-white/10 text-[#F5F5F5] hover:bg-white/5"
            >
              {magicLinkLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              Send Magic Link
            </Button>

            <div className="mt-6 text-center">
              <Link
                href="/auth/signup"
                className="text-sm text-[#9A9A9A] hover:text-[#F5F5F5] transition-colors"
              >
                Need access? Request an account &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
