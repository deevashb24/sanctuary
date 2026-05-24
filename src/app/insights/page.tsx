'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ArrowLeft, Activity, Calendar, Moon, Sun, CloudRain, CloudLightning, Wind } from 'lucide-react'
import Link from 'next/link'

type MoodLog = {
  id: string
  primary_emotion: string
  note: string | null
  created_at: string
}

const emotionMap: Record<string, { label: string, color: string, bg: string, icon: React.ElementType }> = {
  calm: { label: 'Calm', color: 'text-sage-deep', bg: 'bg-sage-light/30', icon: Moon },
  happy: { label: 'Happy', color: 'text-tertiary-container', bg: 'bg-amber-soft/30', icon: Sun },
  sad: { label: 'Sad', color: 'text-secondary', bg: 'bg-secondary-fixed-dim/30', icon: CloudRain },
  angry: { label: 'Angry', color: 'text-error', bg: 'bg-error-container', icon: CloudLightning },
  anxious: { label: 'Anxious', color: 'text-coral-muted', bg: 'bg-coral-muted/30', icon: Activity },
  overwhelmed: { label: 'Overwhelmed', color: 'text-tertiary', bg: 'bg-tertiary-container/30', icon: Wind },
}

export default function InsightsPage() {
  const [logs, setLogs] = useState<MoodLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchInsights() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) setLogs(data)
      setIsLoading(false)
    }

    fetchInsights()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const intensities = logs.map(l => {
    if (!l.note) return 0
    const match = l.note.match(/Intensity: (\d+)/)
    return match ? parseInt(match[1], 10) : 0
  }).filter(v => v > 0)

  const averageIntensity = intensities.length > 0 
    ? (intensities.reduce((acc, curr) => acc + curr, 0) / intensities.length).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-background text-ink-stone font-body-md p-6">
      <div className="max-w-4xl mx-auto space-y-8 mt-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-4 text-on-surface-variant hover:text-ink-stone -ml-3">
              <Link href="/chat">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Chat
              </Link>
            </Button>
            <h1 className="text-3xl font-headline-xl tracking-tight text-sage-deep">Your Insights</h1>
            <p className="text-on-surface-variant mt-1 font-body-md">A reflection of your recent emotional check-ins.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Recent Check-ins</CardDescription>
                  <CardTitle className="text-4xl font-headline-xl text-coral-muted">{logs.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-outline font-label-sm">In the last 30 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Average Intensity</CardDescription>
                  <CardTitle className="text-4xl font-headline-xl text-coral-muted">{averageIntensity}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-outline font-label-sm">Scale of 1 to 10</p>
                </CardContent>
              </Card>
            </div>

            {/* History List */}
            <h2 className="text-xl font-headline-lg-mobile mt-8 mb-4 text-sage-deep">Recent History</h2>
            <div className="space-y-3">
              {logs.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-outline-variant rounded-2xl bg-surface-container-lowest">
                  <p className="text-on-surface-variant font-body-md">No emotional logs found. Check in from the onboarding page!</p>
                </div>
              ) : (
                logs.map((log, index) => {
                  const meta = emotionMap[log.primary_emotion] || { label: log.primary_emotion, color: 'text-on-surface-variant', bg: 'bg-surface-variant', icon: Activity }
                  const Icon = meta.icon
                  
                  let logIntensity = 0;
                  if (log.note) {
                    const match = log.note.match(/Intensity: (\d+)/)
                    if (match) logIntensity = parseInt(match[1], 10)
                  }
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:bg-surface-container transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${meta.bg} ${meta.color}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-label-md">{meta.label}</p>
                              <div className="flex items-center gap-1 text-xs text-outline mt-1 font-label-sm">
                                <Calendar className="h-3 w-3" />
                                {new Date(log.created_at).toLocaleDateString(undefined, { 
                                  weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-surface-variant text-xs font-label-sm text-ink-stone">
                              Intensity: {logIntensity}/10
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
