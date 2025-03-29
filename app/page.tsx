"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarClock, Menu, X } from "lucide-react"
import { useState } from "react"
// Import Image component
import Image from "next/image"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* Replace it with this updated version that includes the logo */}
          <div className="flex items-center gap-2">
            <Image src="/sai-logo.png" alt="SAi Meeting Logo" width={32} height={32} />
            <span className="text-xl font-bold">Meeting</span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
          </nav>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] hover:from-[#9d5bfe] hover:to-[#6356f6]">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-background border-b z-50 md:hidden">
              <div className="flex flex-col p-4 space-y-4">
                <Link
                  href="#features"
                  className="text-sm font-medium hover:underline underline-offset-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] hover:from-[#9d5bfe] hover:to-[#6356f6]">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Schedule Meetings Intelligently with SAi Meeting
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Let AI handle the complexity of finding the perfect meeting time. SAi Meeting analyzes calendars,
                  preferences, and patterns to suggest optimal meeting slots.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] hover:from-[#9d5bfe] hover:to-[#6356f6]"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto">
                <div className="rounded-xl overflow-hidden shadow-xl">
                  <img
                    alt="SAi Meeting Dashboard"
                    className="aspect-video overflow-hidden rounded-xl object-cover"
                    src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Smart Features for Effortless Scheduling
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                SAi Meeting combines powerful AI with intuitive design to make scheduling meetings a breeze.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">AI-Powered Suggestions</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes past meetings, preferences, and availability to suggest optimal meeting times for all
                  participants.
                </p>
              </div>
              <div className="border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">Smart Calendar Integration</h3>
                <p className="text-muted-foreground">
                  Seamlessly integrates with your existing calendars to find available slots without the back-and-forth.
                </p>
              </div>
              <div className="border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">Time Zone Intelligence</h3>
                <p className="text-muted-foreground">
                  Automatically handles time zone differences, ensuring everyone sees meeting times in their local time
                  zone.
                </p>
              </div>
              <div className="border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-2">Team Availability</h3>
                <p className="text-muted-foreground">
                  Visualize team availability at a glance and find the perfect time for everyone to meet.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-10">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SAi Meeting</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms & Conditions
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SAi Meeting. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

