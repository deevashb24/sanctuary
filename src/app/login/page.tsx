'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Shield, Mail, Lock, User, ArrowRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          throw new Error("Full name is required for registration.")
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        })
        if (signUpError) throw signUpError
        // If email confirmation is required, this will not log them in automatically
        // For this scaffold, we assume auto-login if confirm is disabled
        router.push('/onboard')
        router.refresh()
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        router.push('/onboard')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-sage-light/20 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-sage-light to-amber-soft p-[1px] flex items-center justify-center shadow-lg shadow-sage-deep/10 mb-4">
            <div className="h-full w-full rounded-[11px] bg-surface-container-lowest flex items-center justify-center">
              <Shield className="h-6 w-6 text-sage-deep" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-ink-stone tracking-tight">Sanctuary</h1>
          <p className="text-on-surface-variant text-sm mt-1">Your AI-guided mental space</p>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">{isSignUp ? 'Create an account' : 'Welcome back'}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Enter your details below to create your account' 
                : 'Enter your email and password to sign in'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAuth}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-error-container border border-error/20 text-on-error-container p-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-stone" htmlFor="name">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-outline" />
                    <Input 
                      id="name" 
                      placeholder="Jane Doe" 
                      className="pl-9" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink-stone" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-outline" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-ink-stone" htmlFor="password">Password</label>
                  {!isSignUp && (
                    <button type="button" className="text-xs text-sage-deep hover:underline" aria-label="Forgot password">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-outline" />
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••" 
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading} aria-label={isSignUp ? 'Sign up' : 'Sign in'}>
                {loading ? <Spinner size="sm" className="mr-2 text-surface-container-lowest" /> : null}
                {isSignUp ? 'Create account' : 'Sign in'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
              
              <div className="text-center text-sm text-on-surface-variant">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button 
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError(null)
                  }}
                  className="text-sage-deep hover:underline font-medium"
                  aria-label={isSignUp ? 'Switch to sign in' : 'Switch to sign up'}
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
