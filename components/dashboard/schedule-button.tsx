"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ScheduleButton() {
  return (
    <Link href="/schedule">
      <Button className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] hover:from-[#9d5bfe] hover:to-[#6356f6]">
        <PlusCircle className="mr-2 h-4 w-4" />
        Schedule Meeting
      </Button>
    </Link>
  )
}

