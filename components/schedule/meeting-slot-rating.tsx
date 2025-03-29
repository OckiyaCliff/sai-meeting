"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth/auth-provider"

interface MeetingSlotRatingProps {
  meetingId: string
  timeSlot: string
  initialRating?: number
  onRatingChange?: (rating: number) => void
}

export default function MeetingSlotRating({
  meetingId,
  timeSlot,
  initialRating = 0,
  onRatingChange,
}: MeetingSlotRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const handleRating = async (selectedRating: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to rate meeting slots",
        variant: "destructive",
      })
      return
    }

    setRating(selectedRating)

    if (onRatingChange) {
      onRatingChange(selectedRating)
    }

    setIsSubmitting(true)

    try {
      // Store the rating in Firestore
      const userPreferencesRef = doc(db, "userPreferences", user.uid)

      await updateDoc(userPreferencesRef, {
        meetingSlotRatings: arrayUnion({
          meetingId,
          timeSlot,
          rating: selectedRating,
          timestamp: new Date().toISOString(),
        }),
      }).catch(async (error) => {
        // If document doesn't exist, create it
        if (error.code === "not-found") {
          await setDoc(userPreferencesRef, {
            meetingSlotRatings: [
              {
                meetingId,
                timeSlot,
                rating: selectedRating,
                timestamp: new Date().toISOString(),
              },
            ],
          })
        } else {
          throw error
        }
      })

      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      console.error("Error saving rating:", error)
      toast({
        title: "Error",
        description: "Failed to save your rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          className="p-0 h-auto w-auto"
          disabled={isSubmitting}
          onClick={() => handleRating(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star
            className={cn(
              "h-5 w-5",
              (hoveredRating ? hoveredRating >= star : rating >= star)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground",
            )}
          />
        </Button>
      ))}
    </div>
  )
}

