import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Using a manual approach for variants instead of class-variance-authority for simplicity and strict control
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-label-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-coral-muted text-surface-container-lowest shadow-[0_2px_0_0_#934932] squishy-btn hover:opacity-90",
      destructive: "bg-error text-on-error hover:opacity-90 shadow-[0_2px_0_0_#93000a] squishy-btn",
      outline: "border border-outline-variant bg-transparent hover:bg-surface-container text-ink-stone",
      secondary: "bg-sage-light/20 text-sage-deep hover:bg-sage-light/30",
      ghost: "hover:bg-surface-container hover:text-ink-stone text-on-surface-variant",
      link: "text-sage-deep underline-offset-4 hover:underline",
    }
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }
    
    return (
      <Comp
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
