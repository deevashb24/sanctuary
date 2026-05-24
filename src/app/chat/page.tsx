'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { createClient } from '@/utils/supabase/client'
import { Send, AlertTriangle, Shield, User, Bot, Loader2, LogOut, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRouter, useSearchParams } from 'next/navigation'

type Message = {
  id: string
  role: 'user' | 'assistant' | 'system' | 'crisis'
  content: string
}

// Simple crisis detection keywords (for demonstration)
const CRISIS_KEYWORDS = ['suicide', 'kill myself', 'self harm', 'end it all', 'die']

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMessageParam = searchParams.get('initialMessage')
  const initialMessageProcessed = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addInitialGreeting = () => {
    setMessages([{
      id: 'greeting',
      role: 'assistant',
      content: "Hello. I'm here to listen. How are you feeling right now after checking in?"
    }])
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize session and load messages
    async function initChat() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Try to find an existing session for today
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data: sessions, error: sessionErr } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)

      let currentSessionId = null

      if (sessions && sessions.length > 0) {
        currentSessionId = sessions[0].id
        setSessionId(currentSessionId)
        
        // Load messages
        const { data: existingMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', currentSessionId)
          .order('created_at', { ascending: true })
          
        if (existingMessages && existingMessages.length > 0) {
          setMessages(existingMessages as Message[])
        } else {
          addInitialGreeting()
        }
      } else {
        // Create new session
        const { data: newSession, error: createErr } = await supabase
          .from('chat_sessions')
          .insert({ user_id: user.id, title: 'Session ' + new Date().toLocaleDateString() })
          .select()
          .single()
          
        if (newSession) {
          currentSessionId = newSession.id
          setSessionId(currentSessionId)
          addInitialGreeting()
        }
      }
    }
    
    initChat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // If an initial message was passed (e.g. from voice or quick exercises), submit it automatically
    if (initialMessageParam && sessionId && !initialMessageProcessed.current) {
      initialMessageProcessed.current = true
      setInput(initialMessageParam)
      // Small timeout to allow input state to register before submitting
      setTimeout(() => {
        handleSendMessage(new Event('submit') as any, initialMessageParam)
      }, 100)
    }
  }, [initialMessageParam, sessionId])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const checkForCrisis = (text: string) => {
    const lower = text.toLowerCase()
    return CRISIS_KEYWORDS.some(keyword => lower.includes(keyword))
  }

  const handleSendMessage = async (e: React.FormEvent, overrideInput?: string) => {
    e.preventDefault()
    
    const messageToSend = overrideInput || input

    if (!messageToSend.trim() || !sessionId || isLoading) return

    const userText = messageToSend.trim()
    if (!overrideInput) setInput('')
    
    // Add user message to UI
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userText }
    setMessages(prev => [...prev, newUserMsg])
    
    // Save user message to DB
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        user_id: user.id,
        role: 'user',
        content: userText
      })
    }

    // Crisis Override Check
    if (checkForCrisis(userText)) {
      const crisisMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'crisis',
        content: "It sounds like you are going through a very difficult time. Please know that you are not alone and there is support available. \n\nNational Suicide Prevention Lifeline: 988 (US) or 1-800-273-8255.\nCrisis Text Line: Text HOME to 741741.\n\nPlease reach out to a professional or someone you trust. I am an AI and cannot provide emergency help."
      }
      setMessages(prev => [...prev, crisisMsg])
      
      if (user) {
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          user_id: user.id,
          role: 'system',
          content: crisisMsg.content
        })
      }
      return // Halt normal API response
    }

    // Normal API call
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, sessionId })
      })

      if (!response.ok) throw new Error("Failed to fetch response")
      
      const data = await response.json()
      
      const aiMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: data.reply
      }
      setMessages(prev => [...prev, aiMsg])
      
      // Save AI message
      if (user) {
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          user_id: user.id,
          role: 'assistant',
          content: data.reply
        })
      }
    } catch (err) {
      console.error(err)
      // Basic error fallback message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: "I'm having trouble connecting right now. Please try again."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-ink-stone font-body-md">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} aria-label="Back to dashboard" className="h-9 w-9 text-on-surface-variant hover:text-ink-stone -ml-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sage-light to-amber-soft p-[1px]">
              <div className="h-full w-full rounded-[7px] bg-surface-container-lowest flex items-center justify-center">
                <Shield className="h-4 w-4 text-sage-deep" />
              </div>
            </div>
            <span className="font-headline-lg-mobile text-lg font-semibold tracking-tight text-sage-deep hidden sm:inline-block">Sanctuary</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/insights')} aria-label="View Insights">
            Insights
          </Button>
          <Button variant="outline" size="icon" onClick={handleSignOut} aria-label="Sign out" className="h-9 w-9 rounded-full border-outline-variant text-on-surface-variant hover:text-ink-stone">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-3xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 items-end`}>
                
                {/* Avatar */}
                <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-sage-light/30 text-sage-deep' : 
                  (msg.role === 'crisis' || (msg.role === 'system' && msg.content.includes('suicide'))) ? 'bg-error-container text-error' : 
                  'bg-surface-variant text-ink-stone'
                }`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : 
                   (msg.role === 'crisis' || (msg.role === 'system' && msg.content.includes('suicide'))) ? <AlertTriangle className="h-4 w-4" /> : 
                   <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble */}
                <div className={`px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-sage-light/20 border border-sage-light/30 text-sage-deep rounded-br-sm' : 
                  (msg.role === 'crisis' || (msg.role === 'system' && msg.content.includes('suicide'))) ? 'bg-error-container border border-error/20 text-on-error-container rounded-bl-sm shadow-sm' : 
                  msg.role === 'system' ? 'bg-surface-variant/50 text-on-surface-variant text-xs italic' :
                  'bg-surface-container-lowest border border-outline-variant/10 shadow-sm text-ink-stone rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 items-end">
                <div className="shrink-0 h-8 w-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm rounded-bl-sm flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-outline animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-outline animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-outline animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-background/80 backdrop-blur-md border-t border-outline-variant">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="pr-12 h-12 rounded-full bg-surface-container-lowest border-outline-variant focus-visible:ring-sage-deep focus-visible:border-sage-deep/50 transition-all font-body-md"
            disabled={isLoading || !sessionId}
            aria-label="Chat input"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1.5 h-9 w-9 rounded-full bg-coral-muted hover:opacity-90 squishy-btn text-surface-container-lowest" 
            disabled={!input.trim() || isLoading || !sessionId}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-surface-container-lowest" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        <p className="text-center text-xs text-outline mt-3 font-label-sm">
          Sanctuary AI can make mistakes. Consider verifying important information.
        </p>
      </footer>
    </div>
  )
}
