"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import SchedulingForm from "@/components/schedule/scheduling-form"
import NaturalLanguageScheduler from "@/components/schedule/natural-language-scheduler"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarPlus, MessageSquare } from "lucide-react"

export default function SchedulePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("form")
  const [nlpDetails, setNlpDetails] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    // Check if we're coming from NLP processing
    const isNlp = searchParams.get("nlp") === "true"

    if (isNlp) {
      // Get the meeting details from session storage
      const details = sessionStorage.getItem("schedulingDetails")

      if (details) {
        setNlpDetails(JSON.parse(details))
        setActiveTab("form")
      }
    }
  }, [searchParams])

  if (loading) {
    return <ScheduleSkeleton />
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Schedule Meeting" text="Create a new meeting with AI-powered scheduling suggestions." />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <CalendarPlus className="h-4 w-4" />
            <span>Form</span>
          </TabsTrigger>
          <TabsTrigger value="nlp" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Natural Language</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-0">
          <div className="grid gap-8">
            <SchedulingForm user={user} initialData={nlpDetails} />
          </div>
        </TabsContent>

        <TabsContent value="nlp" className="mt-0">
          <div className="grid gap-8 md:grid-cols-2">
            <NaturalLanguageScheduler />
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-medium mb-2">How to use Natural Language Scheduling</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Simply describe your meeting in natural language, and our AI will extract the details and set up the
                  meeting for you.
                </p>
                <div className="space-y-2">
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm italic">
                      "Schedule a 30-minute team meeting next Tuesday at 2 PM with marketing@example.com and
                      design@example.com to discuss the new product launch."
                    </p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm italic">
                      "Set up a 1-hour Zoom call with john@example.com tomorrow morning to review the quarterly
                      results."
                    </p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm italic">
                      "I need a 45-minute meeting with the design team on Friday afternoon to finalize the website
                      mockups."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

function ScheduleSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Skeleton className="h-8 w-40" />
          <div className="ml-auto flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-8">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </main>
    </div>
  )
}

