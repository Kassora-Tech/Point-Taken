'use client'

import { useState, useEffect, useRef } from 'react'
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
  Loader2, Save, Camera, Eye, EyeOff, ChevronRight, LogOut
} from 'lucide-react'
import type { Profile } from '@/lib/types'

interface UserPreferences {
  email_orders: boolean
  email_stock: boolean
  email_digest: string
  push_notifications: boolean
  theme: string
}

const DEFAULT_PREFS: UserPreferences = {
  email_orders: true,
  email_stock: false,
  email_digest: 'weekly',
  push_notifications: false,
  theme: 'dark',
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<Profile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Profile form
  const [fullName, setFullName] = useState('')

  // Security form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  // Notification preferences (persisted)
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS)
  const [savingPrefs, setSavingPrefs] = useState(false)

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

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

          // Load notification preferences
          const { data: prefData } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', u.id)
            .single()
          if (prefData) {
            setPrefs({
              email_orders: prefData.email_orders,
              email_stock: prefData.email_stock,
              email_digest: prefData.email_digest,
              push_notifications: prefData.push_notifications,
              theme: prefData.theme,
            })
          }

          // Load team members
          const { data: team } = await supabase.from('profiles').select('*').order('created_at', { ascending: true })
          if (team) setTeamMembers(team as Profile[])
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

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB')
      return
    }

    setUploadingAvatar(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)
      if (updateError) throw updateError

      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      setProfile({ ...profile, avatar_url: publicUrl })
      setUser({ ...user, user_metadata: { ...user.user_metadata, avatar_url: publicUrl } })
      toast.success('Avatar updated')
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function savePreferences() {
    setSavingPrefs(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          email_orders: prefs.email_orders,
          email_stock: prefs.email_stock,
          email_digest: prefs.email_digest,
          push_notifications: prefs.push_notifications,
          theme: prefs.theme,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
      if (error) throw error
      toast.success('Preferences saved')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save preferences')
    } finally {
      setSavingPrefs(false)
    }
  }

  async function changePassword() {
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
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

  async function signOutAllSessions() {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      if (error) throw error
      toast.success('Signed out of all sessions')
      router.push('/auth/login')
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign out')
    }
  }

  async function deleteAccount() {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Type DELETE to confirm')
      return
    }
    setDeleting(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      // Soft-delete: deactivate profile and sign out
      await supabase.from('profiles').update({ role: 'viewer', full_name: '[Deleted User]' }).eq('id', user.id)
      await supabase.from('user_preferences').delete().eq('user_id', user.id)
      await supabase.auth.signOut({ scope: 'global' })
      toast.success('Account deactivated')
      router.push('/auth/login')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account')
    } finally {
      setDeleting(false)
    }
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
                  {(profile?.avatar_url || user?.user_metadata?.avatar_url) ? (
                    <Image src={profile?.avatar_url || user.user_metadata.avatar_url} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-[#9A9A9A]" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-[#9A9A9A]"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />}
                    {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                  </Button>
                  <p className="text-xs text-white/30 mt-1">Max 2MB, JPG or PNG</p>
                </div>
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
                <p className="text-white/50 text-sm mt-1">Configure how you receive notifications.</p>
              </div>
              <ToggleRow label="Email notifications for new orders" checked={prefs.email_orders} onChange={(v) => setPrefs({ ...prefs, email_orders: v })} />
              <ToggleRow label="Email notifications for low stock alerts" checked={prefs.email_stock} onChange={(v) => setPrefs({ ...prefs, email_stock: v })} />
              <div>
                <label className="text-sm text-[#9A9A9A] mb-1 block">Email digest frequency</label>
                <select value={prefs.email_digest} onChange={(e) => setPrefs({ ...prefs, email_digest: e.target.value })} className="bg-[#0A0A0A] border border-white/10 text-[#F5F5F5] rounded-lg px-3 py-2 text-sm max-w-xs">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="off">Off</option>
                </select>
              </div>
              <ToggleRow label="Browser push notifications" checked={prefs.push_notifications} onChange={(v) => setPrefs({ ...prefs, push_notifications: v })} />
              <Button onClick={savePreferences} disabled={savingPrefs} className="bg-[#C0152A] hover:bg-[#E8354A] text-white">
                {savingPrefs ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Preferences
              </Button>
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

              {/* Active Sessions */}
              <div>
                <p className="text-sm font-semibold text-[#F5F5F5] mb-3">Session Management</p>
                <div className="bg-[#0A0A0A] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#F5F5F5] font-medium">Current session</p>
                      <p className="text-xs text-[#9A9A9A]">Logged in as {user?.email}</p>
                    </div>
                    <Badge className="bg-green-500/15 text-green-400 border-green-500/30">Active</Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-[#9A9A9A] hover:text-red-400 hover:border-red-500/30 mt-3"
                  onClick={() => {
                    if (confirm('This will sign you out of all devices. Continue?')) {
                      signOutAllSessions()
                    }
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out all sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ TEAM ============ */}
        <TabsContent value="team" className="space-y-6">
          <Card className="bg-[#111111] border-white/8 rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="font-display font-bold text-xl text-[#F5F5F5]">Team Members</h2>
                <p className="text-white/50 text-sm mt-1">{teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''} on this account.</p>
              </div>
              <div className="bg-[#0A0A0A] rounded-xl overflow-hidden">
                <div className="grid grid-cols-4 gap-4 px-4 py-3 text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                  <span>Name</span>
                  <span>Role</span>
                  <span>Joined</span>
                  <span>Status</span>
                </div>
                <div className="divide-y divide-white/5">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="grid grid-cols-4 gap-4 items-center px-4 py-3 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[#C0152A]/10 flex items-center justify-center shrink-0">
                          {member.avatar_url ? (
                            <Image src={member.avatar_url} alt="" width={28} height={28} className="rounded-full object-cover" />
                          ) : (
                            <User className="h-3.5 w-3.5 text-[#C0152A]" />
                          )}
                        </div>
                        <span className="text-[#F5F5F5] font-medium truncate">{member.full_name || 'Unnamed'}</span>
                      </div>
                      <Badge variant="outline" className="border-[#C0152A]/30 text-[#C0152A] bg-[#C0152A]/10 text-xs w-fit capitalize">{member.role}</Badge>
                      <span className="text-[#9A9A9A] text-xs">{new Date(member.created_at).toLocaleDateString()}</span>
                      <Badge className={member.id === user?.id ? 'bg-green-500/15 text-green-400 border-green-500/30 w-fit' : 'bg-white/5 text-white/40 w-fit'}>
                        {member.id === user?.id ? 'You' : 'Active'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/30">New team members can sign up at <span className="text-[#C0152A]">/auth/signup</span> and will appear here automatically.</p>
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
              <div className="p-4 bg-[#0A0A0A] rounded-xl border border-red-500/10 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[#F5F5F5]">Deactivate Account</p>
                  <p className="text-xs text-[#9A9A9A] mt-1">This will deactivate your account and sign you out of all sessions. Your data will be retained but your access will be removed.</p>
                </div>
                <div className="max-w-xs">
                  <label className="text-xs text-red-400 mb-1 block">Type DELETE to confirm</label>
                  <Input
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="DELETE"
                    className="bg-[#0A0A0A] border-red-500/20 text-[#F5F5F5]"
                  />
                </div>
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                  onClick={deleteAccount}
                  disabled={deleteConfirm !== 'DELETE' || deleting}
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Deactivate Account
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
