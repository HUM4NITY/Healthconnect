import type { Patient, QRCodeData, QRAccessLevel } from "@/types/patient"

export function generateQRData(patient: Patient, accessLevel: QRAccessLevel, hours?: number): string {
  const qrData: QRCodeData = {
    patientId: patient.id,
    accessLevel,
  }

  if (accessLevel === "time-limited" && hours) {
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + hours)
    qrData.expiresAt = expiresAt.toISOString()
  }

  if (accessLevel === "emergency") {
    qrData.allowedFields = ["name", "age", "allergies", "medications"]
  }

  return JSON.stringify(qrData)
}

export function parseQRData(qrString: string): QRCodeData | null {
  try {
    const data = JSON.parse(qrString) as QRCodeData

    // Check if time-limited access has expired
    if (data.accessLevel === "time-limited" && data.expiresAt) {
      const expiryDate = new Date(data.expiresAt)
      if (expiryDate < new Date()) {
        return null // Access expired
      }
    }

    return data
  } catch {
    return null
  }
}

export function filterPatientDataByAccess(patient: Patient, accessLevel: QRAccessLevel): Partial<Patient> {
  if (accessLevel === "full") {
    return patient
  }

  if (accessLevel === "emergency") {
    return {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      avatar: patient.avatar,
      allergies: patient.allergies,
      medications: patient.medications,
      qrCode: patient.qrCode,
      lastVisit: patient.lastVisit,
    }
  }

  return patient
}
