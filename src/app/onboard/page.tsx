'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ArrowRight, Activity, Moon, Sun, CloudRain, CloudLightning, Wind } from 'lucide-react'

type Emotion = {
  id: string
  label: string
  color: string
  icon: React.ElementType
}

const emotions: Emotion[] = [
  { id: 'calm', label: 'Calm', color: 'bg-sage-light', icon: Moon },
  { id: 'happy', label: 'Happy', color: 'bg-amber-soft', icon: Sun },
  { id: 'sad', label: 'Sad', color: 'bg-secondary-fixed-dim', icon: CloudRain },
  { id: 'angry', label: 'Angry', color: 'bg-error', icon: CloudLightning },
  { id: 'anxious', label: 'Anxious', color: 'bg-coral-muted', icon: Activity },
  { id: 'overwhelmed', label: 'Overwhelmed', color: 'bg-tertiary-container', icon: Wind },
]

export default function OnboardPage() {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null)
  const [intensity, setIntensity] = useState<number>(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleContinue = async () => {
    if (!selectedEmotion) return
    setLoading(true)
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: dbError } = await supabase.from('mood_logs').insert({
        user_id: user.id,
        primary_emotion: selectedEmotion.id,
        note: `Intensity: ${intensity}`,
      })
      
      if (dbError) throw dbError
      
      router.push('/chat')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save emotion log.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-ink-stone relative overflow-hidden">
      {/* Dynamic Background based on selection */}
      <AnimatePresence>
        {selectedEmotion && (
          <motion.div
            key={selectedEmotion.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 pointer-events-none ${selectedEmotion.color.replace('bg-', 'bg-')} blur-[150px] opacity-20`}
          />
        )}
      </AnimatePresence>

      <div className="max-w-xl w-full z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-headline-xl mb-2 text-ink-stone">How are you feeling right now?</h1>
          <p className="text-on-surface-variant mb-12 font-body-md">Select the emotion that best matches your current state.</p>
        </motion.div>

        {/* Emotion Wheel / Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {emotions.map((emotion) => {
            const isSelected = selectedEmotion?.id === emotion.id
            const Icon = emotion.icon
            return (
              <button
                key={emotion.id}
                onClick={() => setSelectedEmotion(emotion)}
                aria-label={`Select emotion: ${emotion.label}`}
                className={`
                  relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300
                  ${isSelected 
                    ? `bg-surface-container-low border border-sage-deep shadow-md shadow-sage-deep/10 ambient-shadow` 
                    : `bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low`
                  }
                `}
              >
                <div className={`
                  h-12 w-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300
                  ${isSelected ? emotion.color : 'bg-surface-variant'}
                `}>
                  <Icon className={`h-6 w-6 ${isSelected ? 'text-on-primary' : 'text-outline'}`} />
                </div>
                <span className={`font-label-md mt-2 ${isSelected ? 'text-ink-stone' : 'text-on-surface-variant'}`}>
                  {emotion.label}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Intensity Slider */}
        <AnimatePresence>
          {selectedEmotion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <h3 className="text-lg font-headline-lg-mobile mb-4 text-ink-stone">How intense is this feeling?</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-on-surface-variant font-label-sm">Mild</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="flex-1 h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-sage-deep"
                  aria-label="Emotion intensity slider"
                />
                <span className="text-sm text-on-surface-variant font-label-sm">Strong</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-error mb-4 font-label-sm">{error}</p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedEmotion ? 1 : 0 }}
          className="flex justify-center"
        >
          <Button 
            size="lg" 
            onClick={handleContinue} 
            disabled={!selectedEmotion || loading}
            className="rounded-full px-8 text-lg"
          >
            {loading ? <Spinner size="sm" className="mr-2 text-surface-container-lowest" /> : null}
            Continue to Sanctuary
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
