'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 p-4 text-center">
      <div className="flex flex-col items-center max-w-md rounded-2xl border border-rose-500/20 bg-rose-500/10 p-8 backdrop-blur-sm">
        <div className="rounded-full bg-rose-500/20 p-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-rose-400" />
        </div>
        <h2 className="text-xl font-semibold text-rose-100 mb-2">Something went wrong</h2>
        <p className="text-sm text-rose-300/80 mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        <Button
          variant="outline"
          onClick={() => reset()}
          className="w-full border-rose-500/30 hover:bg-rose-500/20 text-rose-200"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}
