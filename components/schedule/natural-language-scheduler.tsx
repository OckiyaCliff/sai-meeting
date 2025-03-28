"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MessageSquare, Calendar } from "lucide-react"
import { processSchedulingRequest } from "@/lib/ai/langchain-service"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "@/hooks/use-toast"

export default function NaturalLanguageScheduler() {
  const [request, setRequest] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleSchedule = async () => {
    if (!request.trim()) {
      toast({
        title: "Empty request",
        description: "Please enter a scheduling request",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Process the natural language request
      const meetingDetails = await processSchedulingRequest(request)

      if (!meetingDetails) {
        throw new Error("Failed to process scheduling request")
      }

      // Store the meeting details in session storage
      sessionStorage.setItem("schedulingDetails", JSON.stringify(meetingDetails))

      // Redirect to the scheduling form with the extracted details
      router.push("/schedule?nlp=true")
    } catch (error) {
      console.error("Error processing scheduling request:", error)
      toast({
        title: "Processing error",
        description: "Failed to process your scheduling request. Please try again or use the form.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#ad6bfe]" />
          Natural Language Scheduling
        </CardTitle>
        <CardDescription>Describe your meeting in natural language and let AI handle the details</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="e.g., Schedule a 30-minute team meeting next Tuesday at 2 PM with marketing@example.com and design@example.com to discuss the new product launch."
          className="min-h-[120px] resize-none"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button
          className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] hover:from-[#9d5bfe] hover:to-[#6356f6]"
          onClick={handleSchedule}
          disabled={isProcessing || !request.trim()}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule with AI
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

