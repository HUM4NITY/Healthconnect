import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"
import type { Patient } from "@/types/patient"
import { getAllMockPatients, getMockPatientById } from "./mock-data"

// Fetch all patients (for clinician)
export async function getAllPatients(): Promise<Patient[]> {
  try {
    const patientsRef = collection(db, "patients")
    const snapshot = await getDocs(patientsRef)
    const firebasePatients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Patient[]

    if (firebasePatients.length === 0) {
      console.log("[v0] No Firebase patients found, using mock data")
      return getAllMockPatients()
    }

    return firebasePatients
  } catch (error) {
    console.error("[v0] Error fetching patients from Firebase, falling back to mock data:", error)
    return getAllMockPatients()
  }
}

// Fetch single patient by ID (for patient dashboard)
export async function getPatientById(patientId: string): Promise<Patient | null> {
  try {
    const patientRef = doc(db, "patients", patientId)
    const snapshot = await getDoc(patientRef)

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as Patient
    }

    console.log("[v0] Patient not found in Firebase, checking mock data")
    return getMockPatientById(patientId)
  } catch (error) {
    console.error("[v0] Error fetching patient from Firebase, falling back to mock data:", error)
    return getMockPatientById(patientId)
  }
}

// Fetch patient by QR code
export async function getPatientByQRCode(qrCode: string): Promise<Patient | null> {
  try {
    const patientsRef = collection(db, "patients")
    const q = query(patientsRef, where("qrCode", "==", qrCode))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
      } as Patient
    }

    console.log("[v0] QR code not found in Firebase, checking mock data")
    const mockPatients = getAllMockPatients()
    return mockPatients.find((p) => p.qrCode === qrCode) || null
  } catch (error) {
    console.error("[v0] Error fetching patient by QR code from Firebase, falling back to mock data:", error)
    const mockPatients = getAllMockPatients()
    return mockPatients.find((p) => p.qrCode === qrCode) || null
  }
}
