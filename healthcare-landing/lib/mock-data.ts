import type { Patient } from "@/types/patient"

// Mock login credentials for easy demo
export const MOCK_CREDENTIALS = {
  patients: [
    { email: "john@patient.com", password: "patient123", id: "patient-1" },
    { email: "sarah@patient.com", password: "patient123", id: "patient-2" },
    { email: "mike@patient.com", password: "patient123", id: "patient-3" },
    { email: "emma@patient.com", password: "patient123", id: "patient-4" },
    { email: "david@patient.com", password: "patient123", id: "patient-5" },
  ],
  clinicians: [
    { email: "dr.smith@clinic.com", password: "doctor123", id: "clinician-1" },
    { email: "dr.jones@clinic.com", password: "doctor123", id: "clinician-2" },
    { email: "dr.wilson@clinic.com", password: "doctor123", id: "clinician-3" },
  ],
}

// Mock patient data with comprehensive medical information
export const MOCK_PATIENTS: Patient[] = [
  {
    id: "patient-1",
    name: "John Smith",
    age: 45,
    avatar: "JS",
    qrCode: "QR-JOHN-SMITH-001",
    allergies: ["Penicillin", "Peanuts", "Latex"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime" },
    ],
    appointments: [
      { type: "Cardiology Follow-up", doctor: "Dr. Smith", date: "2025-01-15", time: "10:00 AM" },
      { type: "Annual Physical", doctor: "Dr. Wilson", date: "2025-02-20", time: "2:30 PM" },
    ],
    lastVisit: "2024-12-10",
    bloodType: "A+",
    emergencyContact: { name: "Jane Smith", phone: "(555) 123-4567", relation: "Spouse" },
    medicalHistory: {
      conditions: ["Hypertension", "Pre-diabetic", "High Cholesterol"],
      surgeries: [
        { procedure: "Appendectomy", date: "2010-05-15", hospital: "City General Hospital" },
        { procedure: "Knee Arthroscopy", date: "2018-11-20", hospital: "Sports Medicine Center" },
      ],
      familyHistory: ["Heart disease (father)", "Type 2 Diabetes (mother)", "Stroke (grandfather)"],
      lifestyle: {
        smoking: "former",
        alcohol: "occasional",
        exercise: "light",
      },
    },
  },
  {
    id: "patient-2",
    name: "Sarah Johnson",
    age: 32,
    avatar: "SJ",
    qrCode: "QR-SARAH-JOHNSON-002",
    allergies: ["Sulfa drugs", "Shellfish"],
    medications: [
      { name: "Levothyroxine", dosage: "75mcg", frequency: "Once daily in morning" },
      { name: "Vitamin D3", dosage: "2000 IU", frequency: "Once daily" },
    ],
    appointments: [{ type: "Endocrinology", doctor: "Dr. Jones", date: "2025-01-22", time: "11:00 AM" }],
    lastVisit: "2024-11-28",
    bloodType: "O-",
    emergencyContact: { name: "Michael Johnson", phone: "(555) 234-5678", relation: "Brother" },
    medicalHistory: {
      conditions: ["Hypothyroidism", "Vitamin D Deficiency"],
      surgeries: [],
      familyHistory: ["Thyroid disorders (mother)", "Autoimmune diseases (aunt)"],
      lifestyle: {
        smoking: "never",
        alcohol: "none",
        exercise: "moderate",
      },
    },
  },
  {
    id: "patient-3",
    name: "Mike Chen",
    age: 28,
    avatar: "MC",
    qrCode: "QR-MIKE-CHEN-003",
    allergies: ["None known"],
    medications: [
      { name: "Albuterol Inhaler", dosage: "90mcg", frequency: "As needed for asthma" },
      { name: "Fluticasone", dosage: "110mcg", frequency: "Twice daily" },
    ],
    appointments: [{ type: "Pulmonology", doctor: "Dr. Smith", date: "2025-01-18", time: "3:00 PM" }],
    lastVisit: "2024-12-05",
    bloodType: "B+",
    emergencyContact: { name: "Lisa Chen", phone: "(555) 345-6789", relation: "Mother" },
    medicalHistory: {
      conditions: ["Asthma (moderate persistent)"],
      surgeries: [],
      familyHistory: ["Asthma (brother)", "Allergies (mother)"],
      lifestyle: {
        smoking: "never",
        alcohol: "occasional",
        exercise: "active",
      },
    },
  },
  {
    id: "patient-4",
    name: "Emma Davis",
    age: 56,
    avatar: "ED",
    qrCode: "QR-EMMA-DAVIS-004",
    allergies: ["Aspirin", "Codeine", "Iodine"],
    medications: [
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily" },
      { name: "Omeprazole", dosage: "20mg", frequency: "Once daily before breakfast" },
      { name: "Calcium + Vitamin D", dosage: "600mg/400IU", frequency: "Twice daily" },
      { name: "Gabapentin", dosage: "300mg", frequency: "Three times daily" },
    ],
    appointments: [
      { type: "Rheumatology", doctor: "Dr. Wilson", date: "2025-01-25", time: "9:00 AM" },
      { type: "Pain Management", doctor: "Dr. Jones", date: "2025-02-08", time: "1:00 PM" },
    ],
    lastVisit: "2024-12-15",
    bloodType: "AB+",
    emergencyContact: { name: "Robert Davis", phone: "(555) 456-7890", relation: "Husband" },
    medicalHistory: {
      conditions: ["Rheumatoid Arthritis", "GERD", "Osteoporosis", "Chronic Pain Syndrome"],
      surgeries: [
        { procedure: "Total Hip Replacement", date: "2020-03-10", hospital: "Orthopedic Specialty Hospital" },
        { procedure: "Carpal Tunnel Release", date: "2019-07-22", hospital: "Outpatient Surgery Center" },
      ],
      familyHistory: ["Arthritis (mother)", "Osteoporosis (grandmother)"],
      lifestyle: {
        smoking: "never",
        alcohol: "none",
        exercise: "light",
      },
    },
  },
  {
    id: "patient-5",
    name: "David Martinez",
    age: 41,
    avatar: "DM",
    qrCode: "QR-DAVID-MARTINEZ-005",
    allergies: ["Morphine", "Bee stings"],
    medications: [
      { name: "Sertraline", dosage: "50mg", frequency: "Once daily" },
      { name: "Losartan", dosage: "50mg", frequency: "Once daily" },
      { name: "EpiPen", dosage: "0.3mg", frequency: "Emergency use only" },
    ],
    appointments: [{ type: "Psychiatry", doctor: "Dr. Smith", date: "2025-01-30", time: "4:00 PM" }],
    lastVisit: "2024-12-01",
    bloodType: "O+",
    emergencyContact: { name: "Maria Martinez", phone: "(555) 567-8901", relation: "Sister" },
    medicalHistory: {
      conditions: ["Generalized Anxiety Disorder", "Hypertension", "Severe Bee Sting Allergy"],
      surgeries: [],
      familyHistory: ["Anxiety disorders (mother)", "Hypertension (father)"],
      lifestyle: {
        smoking: "never",
        alcohol: "moderate",
        exercise: "moderate",
      },
    },
  },
  {
    id: "patient-6",
    name: "Lisa Anderson",
    age: 67,
    avatar: "LA",
    qrCode: "QR-LISA-ANDERSON-006",
    allergies: ["Penicillin", "Sulfa drugs", "Eggs"],
    medications: [
      { name: "Warfarin", dosage: "5mg", frequency: "Once daily" },
      { name: "Digoxin", dosage: "0.125mg", frequency: "Once daily" },
      { name: "Furosemide", dosage: "40mg", frequency: "Once daily in morning" },
      { name: "Potassium Chloride", dosage: "20mEq", frequency: "Once daily" },
    ],
    appointments: [{ type: "Cardiology", doctor: "Dr. Wilson", date: "2025-01-12", time: "10:30 AM" }],
    lastVisit: "2024-12-18",
    bloodType: "A-",
    emergencyContact: { name: "Tom Anderson", phone: "(555) 678-9012", relation: "Son" },
    medicalHistory: {
      conditions: ["Atrial Fibrillation", "Congestive Heart Failure", "Chronic Kidney Disease (Stage 2)"],
      surgeries: [
        { procedure: "Pacemaker Implantation", date: "2022-06-15", hospital: "Cardiac Care Center" },
        { procedure: "Cataract Surgery (both eyes)", date: "2021-09-10", hospital: "Eye Institute" },
        { procedure: "Coronary Angioplasty", date: "2019-02-28", hospital: "Heart Hospital" },
      ],
      familyHistory: ["Heart disease (both parents)", "Stroke (father)", "Kidney disease (brother)"],
      lifestyle: {
        smoking: "former",
        alcohol: "none",
        exercise: "light",
      },
    },
  },
  {
    id: "patient-7",
    name: "Robert Taylor",
    age: 52,
    avatar: "RT",
    qrCode: "QR-ROBERT-TAYLOR-007",
    allergies: ["Latex", "Adhesive tape"],
    medications: [
      { name: "Insulin Glargine", dosage: "30 units", frequency: "Once daily at bedtime" },
      { name: "Insulin Lispro", dosage: "Variable", frequency: "Before meals" },
      { name: "Metformin", dosage: "1000mg", frequency: "Twice daily" },
    ],
    appointments: [{ type: "Endocrinology", doctor: "Dr. Jones", date: "2025-01-20", time: "2:00 PM" }],
    lastVisit: "2024-12-08",
    bloodType: "B-",
    emergencyContact: { name: "Nancy Taylor", phone: "(555) 789-0123", relation: "Wife" },
    medicalHistory: {
      conditions: ["Type 2 Diabetes Mellitus", "Diabetic Neuropathy", "Hypertension", "Obesity"],
      surgeries: [{ procedure: "Gastric Bypass Surgery", date: "2015-08-12", hospital: "Bariatric Surgery Center" }],
      familyHistory: ["Type 2 Diabetes (both parents)", "Heart disease (father)", "Obesity (family history)"],
      lifestyle: {
        smoking: "former",
        alcohol: "none",
        exercise: "light",
      },
    },
  },
  {
    id: "patient-8",
    name: "Jennifer White",
    age: 39,
    avatar: "JW",
    qrCode: "QR-JENNIFER-WHITE-008",
    allergies: ["None known"],
    medications: [
      { name: "Escitalopram", dosage: "10mg", frequency: "Once daily" },
      { name: "Birth Control Pills", dosage: "Standard", frequency: "Once daily" },
    ],
    appointments: [{ type: "OB/GYN", doctor: "Dr. Smith", date: "2025-02-05", time: "11:30 AM" }],
    lastVisit: "2024-11-15",
    bloodType: "O+",
    emergencyContact: { name: "Mark White", phone: "(555) 890-1234", relation: "Husband" },
    medicalHistory: {
      conditions: ["Depression (mild)", "Polycystic Ovary Syndrome (PCOS)"],
      surgeries: [{ procedure: "Laparoscopic Ovarian Cyst Removal", date: "2020-04-18", hospital: "Women's Hospital" }],
      familyHistory: ["Depression (mother)", "PCOS (sister)"],
      lifestyle: {
        smoking: "never",
        alcohol: "occasional",
        exercise: "moderate",
      },
    },
  },
]

// Helper function to validate mock credentials
export function validateMockCredentials(
  email: string,
  password: string,
  role: "patient" | "clinician",
): { valid: boolean; userId?: string } {
  const credentials = role === "patient" ? MOCK_CREDENTIALS.patients : MOCK_CREDENTIALS.clinicians
  const user = credentials.find((cred) => cred.email === email && cred.password === password)

  if (user) {
    return { valid: true, userId: user.id }
  }
  return { valid: false }
}

// Helper function to get mock patient by ID
export function getMockPatientById(patientId: string): Patient | null {
  return MOCK_PATIENTS.find((p) => p.id === patientId) || null
}

// Helper function to get all mock patients
export function getAllMockPatients(): Patient[] {
  return MOCK_PATIENTS
}
