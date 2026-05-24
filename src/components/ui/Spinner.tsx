import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: "sm" | "default" | "lg"
}

export function Spinner({ className, size = "default", ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <Loader2
      className={cn("animate-spin text-sage-deep", sizeClasses[size], className)}
      {...props}
      aria-label="Loading"
    />
  )
}
