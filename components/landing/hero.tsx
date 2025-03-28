import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-block rounded-lg bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] px-3 py-1 text-sm text-white mb-2 w-fit">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI-Powered Scheduling</span>
              </div>
            </div>
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
  )
}

