"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarClock, LayoutDashboard, Calendar, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardNavProps {
  isMobile?: boolean
}

export default function DashboardNav({ isMobile = false }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Schedule",
      href: "/schedule",
      icon: Calendar,
    },
    {
      title: "Meetings",
      href: "/meetings",
      icon: CalendarClock,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2">
        <Link href="/" className="flex items-center space-x-2 mb-6">
          <CalendarClock className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block">SAi Meeting</span>
        </Link>
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <CalendarClock className="h-6 w-6 text-primary" />
        <span className="font-bold inline-block">SAi Meeting</span>
      </Link>
      <nav className="flex items-center space-x-4 lg:space-x-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
              )}
            >
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

