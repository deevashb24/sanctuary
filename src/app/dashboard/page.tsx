'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Shield, LogOut, MessageCircle, BarChart2, HeartHandshake } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name || 'Friend')
      }
    }
    loadUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background text-ink-stone font-body-md flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sage-light to-amber-soft p-[1px]">
            <div className="h-full w-full rounded-[7px] bg-surface-container-lowest flex items-center justify-center">
              <Shield className="h-4 w-4 text-sage-deep" />
            </div>
          </div>
          <span className="font-headline-lg-mobile text-lg font-semibold tracking-tight text-sage-deep">Sanctuary</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleSignOut} aria-label="Sign out" className="h-9 w-9 rounded-full border-outline-variant text-on-surface-variant hover:text-ink-stone">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-headline-xl text-ink-stone tracking-tight mb-2">Welcome, {userName}</h1>
            <p className="text-on-surface-variant text-lg">What would you like to do today?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Chat Card */}
            <Link href="/chat" className="group block">
              <div className="h-full bg-surface-container-lowest p-6 rounded-[2rem] border border-sage-light/30 shadow-sm hover:shadow-md transition-all duration-300 hover:border-sage-deep/30 flex flex-col items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sage-light/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                <div className="h-12 w-12 rounded-full bg-sage-light/20 flex items-center justify-center mb-6 text-sage-deep">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-headline-lg mb-2 text-ink-stone">Chat</h2>
                <p className="text-on-surface-variant mb-6 flex-1 text-sm">Talk to your AI companion in a secure, judgement-free space.</p>
                <div className="flex items-center text-sage-deep font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Start session →
                </div>
              </div>
            </Link>

            {/* Check-in Card */}
            <Link href="/onboard" className="group block">
              <div className="h-full bg-surface-container-lowest p-6 rounded-[2rem] border border-amber-soft/30 shadow-sm hover:shadow-md transition-all duration-300 hover:border-amber-soft/50 flex flex-col items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-soft/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                <div className="h-12 w-12 rounded-full bg-amber-soft/20 flex items-center justify-center mb-6 text-amber-soft">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-headline-lg mb-2 text-ink-stone">Check-in</h2>
                <p className="text-on-surface-variant mb-6 flex-1 text-sm">Log your current mood and how intense it feels today.</p>
                <div className="flex items-center text-amber-soft font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Log mood →
                </div>
              </div>
            </Link>

            {/* Insights Card */}
            <Link href="/insights" className="group block">
              <div className="h-full bg-surface-container-lowest p-6 rounded-[2rem] border border-coral-muted/30 shadow-sm hover:shadow-md transition-all duration-300 hover:border-coral-muted/50 flex flex-col items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-coral-muted/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                <div className="h-12 w-12 rounded-full bg-coral-muted/20 flex items-center justify-center mb-6 text-coral-muted">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-headline-lg mb-2 text-ink-stone">Insights</h2>
                <p className="text-on-surface-variant mb-6 flex-1 text-sm">Reflect on your mood patterns and emotional history over time.</p>
                <div className="flex items-center text-coral-muted font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  View insights →
                </div>
              </div>
            </Link>

          </div>
        </div>
      </main>
    </div>
  )
}
