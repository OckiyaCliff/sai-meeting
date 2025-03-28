export interface Meeting {
  id: string
  title: string
  description: string
  date: string
  timeSlot: string
  location: string
  participants: string[]
  organizer: {
    uid: string
    email: string
    name: string
  }
}

