import type { Patient } from "@/types/patient"

const RECENT_PATIENTS_KEY = "healthconnect_recent_patients"
const MAX_RECENT = 5

export function addRecentPatient(patient: Patient): void {
  if (typeof window === "undefined") return

  const recent = getRecentPatients()

  // Remove if already exists
  const filtered = recent.filter((p) => p.id !== patient.id)

  // Add to front
  filtered.unshift({
    id: patient.id,
    name: patient.name,
    age: patient.age,
    avatar: patient.avatar,
    lastViewed: new Date().toISOString(),
  })

  // Keep only MAX_RECENT
  const trimmed = filtered.slice(0, MAX_RECENT)

  localStorage.setItem(RECENT_PATIENTS_KEY, JSON.stringify(trimmed))
}

export function getRecentPatients(): Array<{
  id: string
  name: string
  age: number
  avatar: string
  lastViewed: string
}> {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(RECENT_PATIENTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function clearRecentPatients(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(RECENT_PATIENTS_KEY)
}
