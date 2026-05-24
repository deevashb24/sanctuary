'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, User, Bell, Shield, Moon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/Input'

export default function SettingsPage() {
  const [userName, setUserName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name || 'Friend')
        setEmail(user.email || '')
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased p-6">
      <div className="max-w-2xl mx-auto space-y-8 mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-4 text-on-surface-variant hover:text-on-surface -ml-3">
              <Link href="/dashboard">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-headline-xl tracking-tight text-soft-white">Settings</h1>
            <p className="text-on-surface-variant mt-1 font-body-md">Manage your account and preferences.</p>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-12 bg-surface-container-high rounded-xl w-full"></div>
            <div className="h-12 bg-surface-container-high rounded-xl w-full"></div>
            <div className="h-12 bg-surface-container-high rounded-xl w-full"></div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Account Settings */}
            <section className="bg-surface-container-low/40 border border-soft-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-primary" />
                <h2 className="font-title-md text-xl text-soft-white">Account Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-label-sm text-sm text-on-surface-variant mb-1">Name</label>
                  <Input 
                    disabled 
                    value={userName} 
                    className="bg-surface-container-high border-outline-variant/30 text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-sm text-on-surface-variant mb-1">Email</label>
                  <Input 
                    disabled 
                    value={email} 
                    className="bg-surface-container-high border-outline-variant/30 text-on-surface"
                  />
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section className="bg-surface-container-low/40 border border-soft-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Moon className="h-5 w-5 text-secondary" />
                <h2 className="font-title-md text-xl text-soft-white">Preferences</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/10">
                  <div>
                    <p className="text-soft-white">Dark Mode</p>
                    <p className="text-xs text-on-surface-variant">Enabled by default in Sanctuary</p>
                  </div>
                  <div className="h-6 w-10 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 h-4 w-4 bg-background rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/10">
                  <div>
                    <p className="text-soft-white">Notifications</p>
                    <p className="text-xs text-on-surface-variant">Daily check-in reminders</p>
                  </div>
                  <div className="h-6 w-10 bg-surface-container-highest rounded-full relative">
                    <div className="absolute left-1 top-1 h-4 w-4 bg-on-surface-variant rounded-full"></div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  )
}
