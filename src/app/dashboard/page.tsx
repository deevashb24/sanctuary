'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Mic } from 'lucide-react'

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('Alex')
  const [isListening, setIsListening] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [showVoiceToast, setShowVoiceToast] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name?.split(' ')[0] || 'Friend')
      }
    }
    loadUser()
  }, [])

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice recognition.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setShowVoiceToast(true)
      setVoiceTranscript('')
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setVoiceTranscript(transcript)
      // Once we have a result, route to Chat and automatically submit it
      setTimeout(() => {
        router.push(`/chat?initialMessage=${encodeURIComponent(transcript)}`)
      }, 1000)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error)
      setIsListening(false)
      setShowVoiceToast(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      setTimeout(() => setShowVoiceToast(false), 2000)
    }

    recognition.start()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="bg-gradient-to-br from-[#001719] via-[#002f33] to-[#0D2527] min-h-screen text-on-surface antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* App Container */}
      <div className="flex h-screen overflow-hidden">
        
        {/* SideNavBar */}
        <nav className="hidden md:flex flex-col py-stack-lg gap-stack-md bg-surface-container-low/60 backdrop-blur-xl h-screen w-64 fixed left-0 top-0 border-r border-soft-white/10 z-50">
          {/* Header */}
          <div className="px-6 mb-8 flex flex-col items-center text-center gap-2">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 mb-2">
              <img alt="User's Zen Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfw3mcHHpHI1q0qcjXBDlxpZDHGYxT_fhGySNkJAAebPWAF9qSHd4WU4uHvaib6OTInCdt_D9bGltOM00CYNVp1__DnvHq-fuz1vnvrWm-nc6SDVaYPA5t3LrKTGCjey_PDxALQAGE5JqDVIvGI7C_RPaIKwaGxgIdFmZdCiT2IgwCxhqLG4vDOBdRCsSHh5BaJLQnBrRBk4h2WIcjy722IvD1It2UZsqNwcMRH9U4v7iTRmr-tZ0k_duej-he9fOCbCrvPxeeeRo" />
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Sanctuary</h1>
            <p className="font-label-caps text-label-caps text-on-surface-variant/70 uppercase">Stay Grounded</p>
          </div>
          
          {/* Primary Navigation */}
          <div className="flex flex-col gap-2 flex-1 px-4">
            <Link href="/dashboard" className="flex items-center gap-4 py-3 text-primary font-bold border-l-4 border-primary pl-4 hover:bg-primary-container/10 transition-all duration-200 group">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              <span className="font-body-md group-hover:translate-x-1 duration-200">Daily Flow</span>
            </Link>
            
            <Link href="/chat" className="flex items-center gap-4 py-3 text-on-surface-variant pl-4 hover:text-primary hover:bg-primary-container/10 transition-all duration-200 group border-l-4 border-transparent">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span className="font-body-md group-hover:translate-x-1 duration-200">Sanctuary AI</span>
            </Link>
            
            <Link href="/onboard" className="flex items-center gap-4 py-3 text-on-surface-variant pl-4 hover:text-primary hover:bg-primary-container/10 transition-all duration-200 group border-l-4 border-transparent">
              <span className="material-symbols-outlined">self_care</span>
              <span className="font-body-md group-hover:translate-x-1 duration-200">Check-In</span>
            </Link>
            
            <Link href="/insights" className="flex items-center gap-4 py-3 text-on-surface-variant pl-4 hover:text-primary hover:bg-primary-container/10 transition-all duration-200 group border-l-4 border-transparent">
              <span className="material-symbols-outlined">psychology</span>
              <span className="font-body-md group-hover:translate-x-1 duration-200">Insights</span>
            </Link>
          </div>
          
          {/* CTA */}
          <div className="px-6 mb-8">
            <button onClick={() => router.push('/onboard')} className="w-full py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-body-md hover:bg-primary hover:text-on-primary transition-colors duration-300 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">air</span>
              Take a Breath
            </button>
          </div>
          
          {/* Footer Navigation */}
          <div className="flex flex-col gap-2 px-4 mt-auto">
            <button onClick={() => router.push('/settings')} className="flex items-center gap-4 py-2 text-on-surface-variant pl-4 hover:text-primary hover:bg-primary-container/10 transition-all duration-200">
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="font-body-md text-sm">Settings</span>
            </button>
            <button onClick={handleSignOut} className="flex items-center gap-4 py-2 text-error pl-4 hover:bg-error/10 transition-all duration-200">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="font-body-md text-sm">Sign Out</span>
            </button>
          </div>
        </nav>
        
        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 relative overflow-y-auto overflow-x-hidden">
          {/* Background Atmospheric Glows */}
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-background-ambient/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
          
          <div className="max-w-screen-xl mx-auto px-margin-desktop py-12 flex flex-col gap-12 relative z-10 min-h-full">
            {/* Header Section */}
            <header className="flex justify-between items-end mt-8 md:mt-0 px-6 md:px-0">
              <div>
                <h2 className="font-display-lg text-3xl md:text-5xl text-soft-white mb-2">Morning, {userName}.</h2>
                <p className="font-body-lg text-lg text-on-surface-variant">The air is still. Take a moment to center yourself.</p>
              </div>
            </header>
            
            {/* Central Focus: Breathing Orb Hero */}
            <section className="flex flex-col items-center justify-center py-8 md:py-16 relative">
              
              {/* Voice Toast Notification */}
              {showVoiceToast && (
                <div className="absolute top-0 z-50 bg-surface-container-highest/90 backdrop-blur-md border border-primary/30 px-6 py-3 rounded-full flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                  <Mic className="h-4 w-4 text-primary animate-pulse" />
                  <span className="font-body-md text-sm text-soft-white">
                    {voiceTranscript ? `"${voiceTranscript}"` : "Try saying hello..."}
                  </span>
                </div>
              )}

              {/* Glowing Aura Container */}
              <div 
                onClick={startListening}
                className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center cursor-pointer group"
              >
                {/* Pulsing ambient glow */}
                <div className={`absolute inset-0 rounded-full bg-primary/30 blur-[60px] ${isListening ? 'animate-ping duration-1000' : 'animate-aura-pulse'}`}></div>
                <div className="absolute inset-4 rounded-full bg-secondary/20 blur-[40px] animate-breathe"></div>
                {/* Core Orb Image */}
                <div className={`relative z-10 w-full h-full rounded-full overflow-hidden shadow-[0_0_80px_rgba(178,218,255,0.2)] ${isListening ? 'scale-105' : 'animate-breathe'} transition-transform duration-500`}>
                  <img alt="Pulsing breathing orb" className="w-full h-full object-cover mix-blend-screen opacity-90 group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida/ADBb0ughLLH1HF9mAIRjxuqQ4V6tqoESRI6Ku0zaYRtSad7x_KAonYZRUQskxUiEWOwkDv5K4l1Lut0hlAbjC_7_ET_lCIslwoQj8hDah8xcjB01S0OQAFJDCIx5xgWv25CFBBAAVk1iUuHWcy_zGH9ept1CrVWfqVRhpplLkm2i447nJGzLNuW7yeavKIm5RNDPIEAW2brBvMBlNhPWHXsu92d-gI9riZ2ua_E4M2lzdQqRRXozk6knqtRJAug" />
                </div>
              </div>
              
              <div className="mt-12 text-center flex flex-col items-center gap-4 px-6">
                <p className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">Tap to begin</p>
                <h3 className="font-headline-lg text-2xl md:text-3xl text-soft-white font-light">Deep Resonance</h3>
                <p className="font-body-md text-on-surface-variant max-w-sm">A 5-minute guided breathwork session to synchronize your rhythm with the surrounding tranquility.</p>
              </div>
            </section>
            
            {/* Bento Grid: Secondary Activities */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mt-auto px-6 md:px-0">
              
              {/* Weekly Rhythm (Streak Tracker) */}
              <div className="bg-surface-container-low/40 backdrop-blur-xl border border-soft-white/5 rounded-3xl p-8 lg:col-span-5 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                    <h3 className="font-title-md text-xl text-soft-white">Weekly Rhythm</h3>
                  </div>
                  <p className="font-body-md text-on-surface-variant text-sm">You&apos;ve found peace 4 days this week.</p>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  {/* Days */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary text-secondary flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(118,221,118,0.2)]">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <span className="font-label-caps text-[10px] text-on-surface-variant">M</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary text-secondary flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(118,221,118,0.2)]">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <span className="font-label-caps text-[10px] text-on-surface-variant">T</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-surface-variant text-on-surface-variant flex items-center justify-center text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
                    </div>
                    <span className="font-label-caps text-[10px] text-on-surface-variant">W</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary text-secondary flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(118,221,118,0.2)]">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <span className="font-label-caps text-[10px] text-on-surface-variant">T</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(178,218,255,0.2)] relative">
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></span>
                    </div>
                    <span className="font-label-caps text-[10px] text-primary">F</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-surface-variant border-dashed text-on-surface-variant/50 flex items-center justify-center text-sm"></div>
                    <span className="font-label-caps text-[10px] text-on-surface-variant/50">S</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-surface-variant border-dashed text-on-surface-variant/50 flex items-center justify-center text-sm"></div>
                    <span className="font-label-caps text-[10px] text-on-surface-variant/50">S</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Relief (Carousel) */}
              <div className="bg-surface-container-low/40 backdrop-blur-xl border border-soft-white/5 rounded-3xl p-8 lg:col-span-7 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-title-md text-xl text-soft-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">water_drop</span>
                    Quick Relief
                  </h3>
                  <button className="text-primary hover:text-primary-fixed-dim text-sm font-body-md transition-colors">View All</button>
                </div>
                
                {/* Horizontal Scroll Container */}
                <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4 -mx-4 px-4">
                  {/* Card 1: Box Breathing */}
                  <div onClick={() => router.push('/chat?initialMessage=Please%20guide%20me%20through%20a%203-minute%20Box%20Breathing%20exercise.')} className="min-w-[240px] h-48 rounded-2xl relative overflow-hidden group snap-start cursor-pointer border border-soft-white/5">
                    <div className="absolute inset-0 bg-surface-container-high/60 z-10 transition-opacity group-hover:opacity-40"></div>
                    <img alt="Box Breathing Background" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGORE8YyF9Dds5XzFdr5LaO0E35yxodr8DET1SvGT72NoTTOAKan_DklkBGQSd6fWSO46AHHSPG6vEieHMByCYPqdBYy1rGESrsggPJnY7UdJnzmmwEq-1Df0fLXXK_ZrPRrSgPUDEHpSuF4l36KcW9Rfw1Autp2XgO4FHJKEUtj2RgHli1GT6EvCngEwXB2cgDQKStxoyUdXSoaFdmJCTY8bWAEpbU5I4fTpOeulLZ7qd2wZ10FAOKknGXSSUVovcA0M9Mu7ydpg" />
                    <div className="absolute inset-0 z-20 p-5 flex flex-col justify-end bg-gradient-to-t from-[#001719]/90 to-transparent">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-soft-white text-[16px]">stop</span>
                        <span className="font-label-caps text-[10px] text-soft-white/80 uppercase">3 Min</span>
                      </div>
                      <h4 className="font-title-md text-soft-white group-hover:text-primary transition-colors">Box Breathing</h4>
                    </div>
                  </div>
                  
                  {/* Card 2: Forest Walk */}
                  <div onClick={() => router.push('/chat?initialMessage=Please%20guide%20me%20through%20a%2010-minute%20Forest%20Walk%20visualization.')} className="min-w-[240px] h-48 rounded-2xl relative overflow-hidden group snap-start cursor-pointer border border-soft-white/5">
                    <div className="absolute inset-0 bg-surface-container-high/60 z-10 transition-opacity group-hover:opacity-40"></div>
                    <img alt="Forest Walk Background" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGeGeQtrq5fa7htwm4X0UlfkbMS6NWrOg_f3qt4TIaPz7BMTy2IVTy6jodHbraBjEkDwJ3C7irWgMyjBOJQ0xlAVOFbBmy-XFJtJhMha7z6tUWuDO-OQzNDlNvvYx089K8OjocqZmAz5MISYftMAgH7sg5Rmm4t3qbILMeuWHNV4VOIJWrmNmkxRYqQ8sGM_KZgrXYkJXjRATqPSNnNfvbtbdoAi1wqMFe3bPIX5Ct5ZnbDfqoH6GVt4X26JFdypQb3oclJutT4CY" />
                    <div className="absolute inset-0 z-20 p-5 flex flex-col justify-end bg-gradient-to-t from-[#001719]/90 to-transparent">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-soft-white text-[16px]">headphones</span>
                        <span className="font-label-caps text-[10px] text-soft-white/80 uppercase">10 Min Soundscape</span>
                      </div>
                      <h4 className="font-title-md text-soft-white group-hover:text-primary transition-colors">Forest Walk</h4>
                    </div>
                  </div>
                  
                  {/* Card 3: Body Scan */}
                  <div onClick={() => router.push('/chat?initialMessage=Please%20guide%20me%20through%20a%205-minute%20Body%20Scan.')} className="min-w-[240px] h-48 rounded-2xl relative overflow-hidden group snap-start cursor-pointer border border-soft-white/5">
                    <div className="absolute inset-0 bg-surface-container-high/60 z-10 transition-opacity group-hover:opacity-40"></div>
                    <img alt="Body Scan Background" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV0PYJjFb5JQSOQOxZaoIyUgCZbkydvh7aMSd5h3CwOwKeh4w5vZ8ueYjHtUtpB0zRC4qqtYVwJ0KiLFVZzvcB9m-Zcn7DtzPSWzcQvmS-BlyOJbP178KrRnJm8BlChkztpnZlZ0LYUtO5Gviy3d3cORA7OMswx07I5X8S6MF1CJuLoxy-_jhi4vyLacLHf0i4j2kKU1-NBwILEbFgcs9ZGqZqHO0BXk0MGBwqtU-9M0Q9OxVVJC59tbEz-8cFhUw5Rq_qHOFMbqg" />
                    <div className="absolute inset-0 z-20 p-5 flex flex-col justify-end bg-gradient-to-t from-[#001719]/90 to-transparent">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-soft-white text-[16px]">accessibility_new</span>
                        <span className="font-label-caps text-[10px] text-soft-white/80 uppercase">5 Min</span>
                      </div>
                      <h4 className="font-title-md text-soft-white group-hover:text-primary transition-colors">Body Scan</h4>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      {/* Hide scrollbar styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  )
}
