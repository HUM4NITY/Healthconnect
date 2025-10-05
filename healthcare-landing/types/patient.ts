export interface Patient {
  id: string
  name: string
  age: number
  avatar: string
  allergies: string[]
  medications: Medication[]
  appointments?: Appointment[]
  lastVisit: string
  qrCode: QRCodeData
  bloodType?: string
  emergencyContact?: EmergencyContact
  medicalHistory?: MedicalHistory
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
}

export interface Appointment {
  date: string
  time: string
  doctor: string
  type: string
}

export interface EmergencyContact {
  name: string
  phone: string
  relation: string
}

export interface MedicalHistory {
  conditions: string[] // e.g., "Hypertension", "Type 2 Diabetes", "Asthma"
  surgeries: Surgery[]
  familyHistory: string[] // e.g., "Heart disease", "Cancer"
  lifestyle: {
    smoking: "never" | "former" | "current"
    alcohol: "none" | "occasional" | "moderate" | "heavy"
    exercise: "sedentary" | "light" | "moderate" | "active"
  }
}

export interface Surgery {
  procedure: string
  date: string
  hospital?: string
  notes?: string
}

export type QRAccessLevel = "emergency" | "full" | "time-limited"

export interface QRCodeData {
  patientId: string
  accessLevel: QRAccessLevel
  expiresAt?: string // ISO timestamp for time-limited access
  allowedFields?: string[] // For emergency access, only show critical fields
}
