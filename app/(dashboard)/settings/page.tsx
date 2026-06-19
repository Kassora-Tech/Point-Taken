'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  User, Bell, Building2, Shield, Users2, Palette, AlertTriangle,
  Loader2, Save, Camera, Eye, EyeOff, ChevronRight
} from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  
  // Profile form
  const [fullName, setFullName] = useState('')
  
  // Security form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  // Demo toggle states
  const [emailOrders, setEmailOrders] = useState(true)
  const [emailStock, setEmailStock] = useState(false)
  const [emailDigest, setEmailDigest] = useState('weekly')
  const [pushNotifications, setPushNotifications] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user: u } } = await supabase.auth.getUser()
        if (u) {
          setUser(u)
          const { data: p } = await supabase.from('profiles').select('*').eq('id', u.id).single()
          if (p) {
            setProfile(p)
            setFullName(p.full_name || '')
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  async function saveProfile() {
    setSaving(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
      if (error) throw error
      toast.success('Profile updated')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function changePassword() {
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success('Password changed')
      setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  function demoToast(msg?: string) {
    toast.success(msg || 'Preferences saved (demo mode)')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-[#9A9A9A]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Settings</h1>
        <p className="text-[#9A9A9A] mt-1">Manage your account and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-[#1A1A1A] border border-white/5 flex-wrap h-auto p-2">
          {[
            { value: 'profile', label: 'Profile', icon: User },
            { value: 'notifications', label: 'Notifications', icon: Bell },
            { value: 'company', label: 'Company', icon: Building2 },
            { value: 'security', label: 'Security', icon: Shield },
            { value: 'team', label: 'Team', icon: Users2 },
            { value: 'appearance', label: 'Appearance', icon: Palette },
            { value: 'danger', label: 'Danger Zone', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-[#9A9A9A] data-[state=active]:text-[#F5F5F5] data-[state=active]:bg-[#C0152A]/10 gap-2 px-4 py-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* ============ PROFILE ============ */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-[#111111] border-white/8 rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="font-display font-bold text-xl text-[#F5F5F5]">Profile</h2>
                <p className="text-white/50 text-sm mt-1">Your personal information.</p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#1A1A1A] border border-white/10">
                  {user?.user_metadata?.avatar_url ? (
                    <Image src={user.user_metadata.avatar_url} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-[#9A9A9A]" />
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="border-white/10 text-[#9A9A9A]" onClick={() => demoToast('Avatar upload coming soon')}>
                  <Camera className="h-4 w-4 mr-2" /> Change Photo
                </Button>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-sm text-[#9A9A9A] mb-1 block">Full Name</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5] max-w-md" />
              </div>

              {/* Email (read only) */}
              <div>
                <label className="text-sm text-[#9A9A9A] mb-1 block">Email</label>
                <div className="max-w-md">
                  <Input value={user?.email || ''} disabled className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]/60" />
                  <p className="text-xs text-white/30 mt-1">Contact admin to change email</p>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="text-sm text-[#9A9A9A] mb-1 block">Role</label>
                <Badge variant="outline" className="border-[#C0152A]/30 text-[#C0152A] bg-[#C0152A]/10">
                  {profile?.role || 'Admin'}
                </Badge>
              </div>

              <Button onClick={saveProfile} disabled={saving} className="bg-[#C0152A] hover:bg-[#E8354A] text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ NOTIFICATIONS ============ */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-[#111111] border-white/8 rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="font-display font-bold text-xl text-[#F5F5F5]">Notifications</h2>
                <p className="text-white/50 text-xs mt-1">Demo mode — preferences are not yet saved</p>
              </div>
              <ToggleRow label="Email notifications for new orders" checked={emailOrders} onChange={setEmailOrders} />
              <ToggleRow label="Email notifications for low stock alerts" checked={emailStock} onChange={setEmailStock} />
              <div>
                <label className="text-sm text-[#9A9A9A] mb-1 block">Email digest frequency</label>
                <select value={emailDigest} onChange={(e) => setEmailDigest(e.target.value)} className="bg-[#0A0A0A] border border-white/10 text-[#F5F5F5] rounded-lg px-3 py-2 text-sm max-w-xs">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="off">Off</option>
                </select>
              </div>
              <ToggleRow label="Browser push notifications" checked={pushNotifications} onChange={setPushNotifications} />
              <Button onClick={() => demoToast()} className="bg-[#C0152A] hover:bg-[#E8354A] text-white">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ COMPANY ============ */}
        <TabsContent value="company" className="space-y-6">
          <Card className="bg-[#111111] border-white/8 rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="font-display font-bold text-xl text-[#F5F5F5]">Company Information</h2>
                <p className="text-white/50 text-sm mt-1">Registered business details — reference only.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Company Name" value="Point-Taken Group (Pty) Ltd." />
                <InfoField label="Registration" value="2021/150859/07" />
                <InfoField label="MAAA" value="1157674" />
                <InfoField label="LOGIS" value="JQ956" />
                <InfoField label="SAHPRA" value="00003162MD" />
                <InfoField label="TAX" value="9279067251" />
                <InfoField label="CSR" value="1035270" />
              </div>
              <Separator className="bg-white/10" />
              <div>
                <p className="text-sm font-semibold text-[#F5F5F5] mb-2">Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Phone" value="073 957 6209 / 071 855 5447" />
                  <InfoField label="Email" value="orders.ptg1@gmail.com / admin@pointtaken.co.za" />
                </div>
              </div>
              <Separator className="bg-white/10" />
              <div>
                <p className="text-sm font-semibold text-[#F5F5F5] mb-2">Locations</p>
                <p className="text-sm text-[#9A9A9A]">Bloemfontein · Kimberley · Welkom · Despatch</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ SECURITY ============ */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-[#111111] border-white/8 rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="font-display font-bold text-xl text-[#F5F5F5]">Security</h2>
                <p className="text-white/50 text-sm mt-1">Manage your account security.</p>
              </div>

              {/* Change Password */}
              <div className="space-y-4 max-w-md">
                <p className="text-sm font-semibold text-[#F5F5F5]">Change Password</p>
                <PwField label="Current Password" value={currentPassword} onChange={setCurrentPassword} show={showCurrentPw} toggleShow={() => setShowCurrentPw(!showCurrentPw)} />
                <PwField label="New Password" value={newPassword} onChange={setNewPassword} show={showNewPw} toggleShow={() => setShowNewPw(!showNewPw)} />
                <div>
                  <label className="text-sm text-[#9A9A9A] mb-1 block">Confirm New Password</label>
                  <Input type="password" placeholder="••••••••" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
                </div>
                <Button onClick={changePassword} disabled={saving} className="bg-[#C0152A] hover:bg-[#E8354A] text-white">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Update Password
                </Button>
              </div>

              <Separator className="bg-white/10" />

              {/* 2FA */}
              <ToggleRow label="Two-Factor Authentication" checked={twoFactor} onChange={setTwoFactor} badge="Coming soon" />

              <Separator className="bg-white/10" />

              {/* Active Sessions */}
              <div>
                <p className="text-sm font-semibold text-[#F5F5F5] mb-3">Active Sessions</p>
                <div className="bg-[#0A0A0A] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#F5F5F5] font-medium">Current session</p>
                      <p className="text-xs text-[#9A9A9A]">Chrome on Windows · Bloemfontein, ZA</p>
                    </div>
                    <Badge className="bg-green-500/15 text-green-400 border-green-500/30">Active now</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled className="border-white/10 text-[#9A9A9A] mt-3" onClick={() => demoToast('Feature coming soon')}>
                  Sign out all other sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ TEAM ============ */}
        <TabsContent value="team" className="space-y-6">
          <Card className="bg-[#111111] border-white/8 rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#F5F5F5]">Team Members</h2>
                  <p className="text-white/50 text-sm mt-1">Manage your team.</p>
                </div>
                <Button variant="outline" className="border-[#C0152A]/30 text-[#C0152A]" onClick={() => toast.info('Invitation feature coming soon — for now, ask new users to sign up at /auth/signup and an admin can assign their role manually in Supabase.')}>
                  Invite Team Member
                </Button>
              </div>
              <div className="bg-[#0A0A0A] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 text-xs text-white/40 uppercase tracking-wider">
                  <span>Name</span>
                  <span>Email</span>
                  <span>Role</span>
                  <span>Joined</span>
                </div>
                <div className="divide-y divide-white/5">
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-[#F5F5F5] font-medium">{profile?.full_name || user?.email}</span>
                    <span className="text-[#9A9A9A]">{user?.email}</span>
                    <Badge variant="outline" className="border-[#C0152A]/30 text-[#C0152A] bg-[#C0152A]/10 text-xs">{profile?.role || 'Admin'}</Badge>
                    <span className="text-[#9A9A9A] text-xs">{new Date(user?.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ APPEARANCE ============ */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-[#111111] border-white/8 rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="font-display font-bold text-xl text-[#F5F5F5]">Appearance</h2>
                <p className="text-white/50 text-sm mt-1">Customize the dashboard look.</p>
              </div>
              <div>
                <p className="text-sm text-[#9A9A9A] mb-3">Theme</p>
                <div className="flex gap-3">
                  <div className="flex items-center gap-3 bg-[#C0152A]/10 border border-[#C0152A]/30 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">PTG</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F5F5F5]">Dark</p>
                      <p className="text-xs text-[#C0152A]">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 opacity-50">
                    <div className="w-8 h-8 rounded-full bg-white border border-white/20 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-black">PTG</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#9A9A9A]">Light</p>
                      <Badge className="bg-white/10 text-white/50 text-[10px]">Coming soon</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#9A9A9A] mb-3">Accent Color</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#C0152A] border-2 border-[#C0152A]/50 ring-2 ring-[#C0152A]/30" />
                  <span className="text-sm text-[#F5F5F5]">PTG Red</span>
                  <Badge className="bg-[#C0152A]/10 text-[#C0152A] text-[10px]">Default</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ DANGER ZONE ============ */}
        <TabsContent value="danger" className="space-y-6">
          <Card className="bg-[#111111] border-red-500/20 rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="font-display font-bold text-xl text-red-500">Danger Zone</h2>
                <p className="text-white/50 text-sm mt-1">Irreversible actions.</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-xl border border-red-500/10">
                <div>
                  <p className="text-sm font-semibold text-[#F5F5F5]">Delete Account</p>
                  <p className="text-xs text-[#9A9A9A]">Permanently delete your account and all associated data.</p>
                </div>
                <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10" onClick={() => toast.error('Account deletion requires admin approval — contact admin@pointtaken.co.za')}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* === Helper Components === */

function ToggleRow({ label, checked, onChange, badge }: { label: string; checked: boolean; onChange: (v: boolean) => void; badge?: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#F5F5F5]">{label}</span>
        {badge && <Badge className="bg-white/5 text-white/40 text-[10px] border-white/10">{badge}</Badge>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-[#C0152A]' : 'bg-white/10'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0A0A0A] rounded-xl p-4">
      <p className="text-xs text-[#9A9A9A] mb-1">{label}</p>
      <p className="text-sm text-[#F5F5F5] font-medium">{value}</p>
    </div>
  )
}

function PwField({ label, value, onChange, show, toggleShow }: { label: string; value: string; onChange: (v: string) => void; show: boolean; toggleShow: () => void }) {
  return (
    <div>
      <label className="text-sm text-[#9A9A9A] mb-1 block">{label}</label>
      <div className="relative">
        <Input type={show ? 'text' : 'password'} placeholder="••••••••" value={value} onChange={(e) => onChange(e.target.value)} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5] pr-10" />
        <button type="button" onClick={toggleShow} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A9A9A] hover:text-[#F5F5F5]">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
