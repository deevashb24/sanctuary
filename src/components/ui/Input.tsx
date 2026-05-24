import * as React from "react"
import { cn } from "@/utils/cn"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2 font-body-md text-ink-stone ring-offset-background file:border-0 file:bg-transparent file:font-label-md placeholder:text-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
