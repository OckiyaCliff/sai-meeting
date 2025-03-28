import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "firebase/auth"

// User-related functions
export async function createUserProfile(user: User, additionalData = {}) {
  try {
    const userRef = doc(db, "users", user.uid)
    const userSnapshot = await getDoc(userRef)

    if (!userSnapshot.exists()) {
      const { email, displayName, photoURL } = user
      const createdAt = Timestamp.now()

      await setDoc(userRef, {
        email,
        displayName,
        photoURL,
        createdAt,
        ...additionalData,
      })
    }

    return userRef
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

export async function getUserProfile(userId: string) {
  try {
    const userRef = doc(db, "users", userId)
    const userSnapshot = await getDoc(userRef)

    if (userSnapshot.exists()) {
      return { id: userSnapshot.id, ...userSnapshot.data() }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

// Meeting-related functions
export async function createMeeting(meetingData: any) {
  try {
    const meetingRef = await addDoc(collection(db, "meetings"), {
      ...meetingData,
      createdAt: Timestamp.now(),
    })

    return meetingRef.id
  } catch (error) {
    console.error("Error creating meeting:", error)
    throw error
  }
}

export async function getMeeting(meetingId: string) {
  try {
    const meetingRef = doc(db, "meetings", meetingId)
    const meetingSnapshot = await getDoc(meetingRef)

    if (meetingSnapshot.exists()) {
      return { id: meetingSnapshot.id, ...meetingSnapshot.data() }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting meeting:", error)
    throw error
  }
}

export async function updateMeeting(meetingId: string, updateData: any) {
  try {
    const meetingRef = doc(db, "meetings", meetingId)
    await updateDoc(meetingRef, updateData)
    return true
  } catch (error) {
    console.error("Error updating meeting:", error)
    throw error
  }
}

export async function deleteMeeting(meetingId: string) {
  try {
    const meetingRef = doc(db, "meetings", meetingId)
    await deleteDoc(meetingRef)
    return true
  } catch (error) {
    console.error("Error deleting meeting:", error)
    throw error
  }
}

export async function getUserMeetings(userId: string) {
  try {
    // Get meetings where the user is the organizer
    const organizerQuery = query(
      collection(db, "meetings"),
      where("organizer.uid", "==", userId),
      orderBy("date", "desc"),
    )

    const organizerSnapshot = await getDocs(organizerQuery)
    const organizerMeetings = organizerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      role: "organizer",
    }))

    // Get meetings where the user is a participant
    const userEmail = (await getUserProfile(userId))?.email
    if (userEmail) {
      const participantQuery = query(
        collection(db, "meetings"),
        where("participants", "array-contains", userEmail),
        orderBy("date", "desc"),
      )

      const participantSnapshot = await getDocs(participantQuery)
      const participantMeetings = participantSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          role: "participant",
        }))
        // Filter out meetings where the user is also the organizer to avoid duplicates
        .filter((meeting) => meeting.organizer?.uid !== userId)

      // Combine and sort all meetings by date
      return [...organizerMeetings, ...participantMeetings].sort((a, b) => {
        // Convert Firestore timestamps to Date objects for comparison
        const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date)
        const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date)
        return dateB.getTime() - dateA.getTime()
      })
    }

    return organizerMeetings
  } catch (error) {
    console.error("Error getting user meetings:", error)
    throw error
  }
}

export async function getUpcomingMeetings(userId: string, limitCount = 5) {
  try {
    const now = Timestamp.now()
    const allMeetings = await getUserMeetings(userId)

    // Filter for upcoming meetings and sort by date
    const upcomingMeetings = allMeetings
      .filter((meeting) => {
        const meetingDate = meeting.date instanceof Timestamp ? meeting.date.toDate() : new Date(meeting.date)
        return meetingDate >= now.toDate()
      })
      .sort((a, b) => {
        const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date)
        const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
      .slice(0, limitCount)

    return upcomingMeetings
  } catch (error) {
    console.error("Error getting upcoming meetings:", error)
    throw error
  }
}

// User preferences and settings
export async function updateUserSettings(userId: string, settings: any) {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, { settings })
    return true
  } catch (error) {
    console.error("Error updating user settings:", error)
    throw error
  }
}

export async function getUserSettings(userId: string) {
  try {
    const userProfile = await getUserProfile(userId)
    return userProfile?.settings || {}
  } catch (error) {
    console.error("Error getting user settings:", error)
    throw error
  }
}

