import type { Patient } from "@/types/patient"

export function fuzzySearch(patients: Patient[], query: string): Patient[] {
  if (!query.trim()) return patients

  const lowerQuery = query.toLowerCase()

  return patients.filter((patient) => {
    // Search in name
    if (patient.name.toLowerCase().includes(lowerQuery)) return true

    // Search in allergies
    if (patient.allergies.some((allergy) => allergy.toLowerCase().includes(lowerQuery))) return true

    // Search in medications
    if (patient.medications.some((med) => med.name.toLowerCase().includes(lowerQuery))) return true

    // Fuzzy match for common typos
    const fuzzyName = patient.name.toLowerCase().replace(/[aeiou]/g, "")
    const fuzzyQuery = lowerQuery.replace(/[aeiou]/g, "")
    if (fuzzyName.includes(fuzzyQuery)) return true

    return false
  })
}

export function sortPatients(patients: Patient[], sortBy: "name" | "age" | "lastVisit"): Patient[] {
  const sorted = [...patients]

  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case "age":
      return sorted.sort((a, b) => a.age - b.age)
    case "lastVisit":
      return sorted.sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    default:
      return sorted
  }
}
