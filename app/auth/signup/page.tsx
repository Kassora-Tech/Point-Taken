'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, UserPlus } from 'lucide-react'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) throw error
      if (!data.user) throw new Error('Signup failed. Please try again.')

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, full_name: fullName })
      if (profileError) throw profileError

      toast.success('Account created successfully!')
      window.location.href = '/dashboard'
    } catch (err: any) {
      toast.error(err.message || 'Signup failed')
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
          <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Create Account</h1>
          <p className="text-[#9A9A9A] mt-2">Register for client portal access</p>
        </div>

        <Card className="bg-[#1A1A1A] border-white/5">
          <CardContent className="p-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-sm text-[#9A9A9A] mb-1 block">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]"
                />
              </div>
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
                <label className="text-sm text-[#9A9A9A] mb-1 block">Confirm Password</label>
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
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
