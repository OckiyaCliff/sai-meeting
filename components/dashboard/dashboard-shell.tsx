"use client"

import { type ReactNode, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardNav from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardShellProps {
  children: ReactNode
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const { user, loading } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Mobile menu */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-4">
                  <DashboardNav isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex">
            <DashboardNav />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] text-white">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => router.push("/settings")}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={isSigningOut}
                    onSelect={handleSignOut}
                    className="text-red-600 focus:text-red-600"
                  >
                    {isSigningOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing out...
                      </>
                    ) : (
                      "Sign out"
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => router.push("/auth/login")}>
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-4 md:pt-6">{children}</main>
    </div>
  )
}

