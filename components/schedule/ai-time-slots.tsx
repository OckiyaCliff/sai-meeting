"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Clock, Check, Loader2 } from "lucide-react"

interface AITimeSlotsProps {
  suggestions: string[]
  isLoading: boolean
  selectedSlot: string | null
  onSelectSlot: (slot: string) => void
}

export default function AITimeSlots({ suggestions, isLoading, selectedSlot, onSelectSlot }: AITimeSlotsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-[#ad6bfe]" />
            AI Suggestions
          </CardTitle>
          <CardDescription>Analyzing calendars and preferences...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#ad6bfe]" />
            <p className="mt-4 text-sm text-muted-foreground">Our AI is finding the best time slots for your meeting</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-[#ad6bfe]" />
            AI Suggestions
          </CardTitle>
          <CardDescription>Smart time slot recommendations</CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <Clock className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="font-medium">No Suggestions Yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the meeting details and click "Generate AI Suggestions" to get smart time slot recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BrainCircuit className="mr-2 h-5 w-5 text-[#ad6bfe]" />
          AI Suggestions
        </CardTitle>
        <CardDescription>Recommended time slots based on availability and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {suggestions.map((slot, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full justify-start h-auto py-3 px-4 ${
                selectedSlot === slot ? "border-[#7366f6] bg-[#7366f6]/10" : ""
              }`}
              onClick={() => onSelectSlot(slot)}
            >
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-[#ad6bfe]" />
                <span>{slot}</span>
                {selectedSlot === slot && <Check className="h-4 w-4 ml-2 text-[#7366f6]" />}
              </div>
            </Button>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>These suggestions are based on:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Participant availability</li>
            <li>Previous meeting patterns</li>
            <li>Optimal productivity times</li>
            <li>Time zone considerations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

