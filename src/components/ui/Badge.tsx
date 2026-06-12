import * as React from "react"
import { cn } from "../../utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "positive" | "neutral" | "negative"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80": variant === "default",
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80": variant === "destructive",
          "text-foreground": variant === "outline",
          "border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20": variant === "positive",
          "border-transparent bg-slate-500/10 text-slate-400 hover:bg-slate-500/20": variant === "neutral",
          "border-transparent bg-rose-500/10 text-rose-500 hover:bg-rose-500/20": variant === "negative",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
