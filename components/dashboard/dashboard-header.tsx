import type { ReactNode } from "react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: ReactNode
}

export default function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
      <div className="grid gap-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide">{heading}</h1>
        {text && <p className="text-sm sm:text-base text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}

