"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDarkMode } from "@/contexts/dark-mode-context"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { Users, QrCode, X, Search, Clock, Download, ArrowLeft } from "lucide-react"
import { getAllPatients } from "@/lib/firebase-service"
import { addRecentPatient, getRecentPatients } from "@/lib/recent-patients"
import { fuzzySearch, sortPatients } from "@/lib/fuzzy-search"
import type { Patient } from "@/types/patient"
import { useRouter } from "next/navigation"

type Tab = "patients" | "scanner"
type SortOption = "name" | "age" | "lastVisit"

export default function ClinicianDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("patients")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [recentPatients, setRecentPatients] = useState<ReturnType<typeof getRecentPatients>>([])
  const { isDark } = useDarkMode()

  useEffect(() => {
    async function fetchPatients() {
      setLoading(true)
      const data = await getAllPatients()
      setPatients(data)
      setFilteredPatients(data)
      setLoading(false)
    }
    fetchPatients()
    setRecentPatients(getRecentPatients())
  }, [])

  useEffect(() => {
    let result = fuzzySearch(patients, searchQuery)
    result = sortPatients(result, sortBy)
    setFilteredPatients(result)
  }, [searchQuery, sortBy, patients])

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    addRecentPatient(patient)
    setRecentPatients(getRecentPatients())
  }

  const exportPatientData = (patient: Patient) => {
    const dataStr = JSON.stringify(patient, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `patient-${patient.name.replace(/\s+/g, "-")}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentClinicianId")
    router.push("/login")
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-slate-950" : "bg-gradient-to-br from-blue-50 via-white to-teal-50"
      }`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? "bg-blue-500" : "bg-blue-400"}`}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "10%" }}
        />
      </div>

      <div className="absolute top-6 left-6 z-50">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border transition-all ${
            isDark
              ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
              : "bg-white/70 border-white/20 text-gray-900 hover:bg-white/90"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              Clinician Dashboard
            </h1>
            <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>Manage your patients efficiently</p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`flex gap-2 p-2 rounded-2xl mb-8 backdrop-blur-xl border shadow-lg w-fit ${
              isDark ? "bg-white/5 border-white/10" : "bg-white/70 border-white/20"
            }`}
          >
            <TabButton
              active={activeTab === "patients"}
              onClick={() => setActiveTab("patients")}
              icon={<Users className="w-5 h-5" />}
              label="Patient Grid"
              isDark={isDark}
            />
            <TabButton
              active={activeTab === "scanner"}
              onClick={() => setActiveTab("scanner")}
              icon={<QrCode className="w-5 h-5" />}
              label="QR Scanner"
              isDark={isDark}
            />
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "patients" && (
              <motion.div
                key="patients"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    />
                    <input
                      type="text"
                      placeholder="Search patients by name, allergy, or medication..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border backdrop-blur-xl transition-all ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white placeholder-gray-500"
                          : "bg-white/70 border-white/20 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className={`px-4 py-3 rounded-xl border backdrop-blur-xl transition-all ${
                        isDark ? "bg-white/5 border-white/10 text-white" : "bg-white/70 border-white/20 text-gray-900"
                      }`}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="age">Sort by Age</option>
                      <option value="lastVisit">Sort by Last Visit</option>
                    </select>
                  </div>
                </div>

                {recentPatients.length > 0 && !searchQuery && (
                  <div className="mb-6">
                    <h2
                      className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      <Clock className="w-5 h-5" />
                      Recently Viewed
                    </h2>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {recentPatients.map((recent) => {
                        const patient = patients.find((p) => p.id === recent.id)
                        if (!patient) return null
                        return (
                          <motion.button
                            key={recent.id}
                            onClick={() => handleSelectPatient(patient)}
                            whileHover={{ scale: 1.05 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl border transition-all whitespace-nowrap ${
                              isDark
                                ? "bg-white/5 border-white/10 hover:bg-white/10"
                                : "bg-white/70 border-white/20 hover:bg-white/90"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                isDark
                                  ? "bg-gradient-to-br from-blue-500 to-teal-500 text-white"
                                  : "bg-gradient-to-br from-blue-400 to-teal-400 text-white"
                              }`}
                            >
                              {recent.avatar}
                            </div>
                            <div className="text-left">
                              <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                                {recent.name}
                              </div>
                              <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                Age {recent.age}
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center min-h-[400px]">
                    <div className={`text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Loading patients...</div>
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="flex justify-center items-center min-h-[400px]">
                    <div className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {searchQuery ? "No patients found matching your search" : "No patients found"}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4 min-w-max">
                      {filteredPatients.map((patient, index) => (
                        <motion.div
                          key={patient.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`w-64 p-6 rounded-2xl backdrop-blur-xl border shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                            isDark
                              ? "bg-white/5 border-white/10 hover:bg-white/10"
                              : "bg-white/70 border-white/20 hover:bg-white/90"
                          }`}
                          onClick={() => handleSelectPatient(patient)}
                        >
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 ${
                              isDark
                                ? "bg-gradient-to-br from-blue-500 to-teal-500 text-white"
                                : "bg-gradient-to-br from-blue-400 to-teal-400 text-white"
                            }`}
                          >
                            {patient.avatar}
                          </div>
                          <h3 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                            {patient.name}
                          </h3>
                          <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Age: {patient.age}
                          </p>
                          <button className="w-full py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:shadow-lg transition-all duration-300">
                            View Details
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "scanner" && (
              <motion.div
                key="scanner"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center min-h-[400px]"
              >
                <div
                  className={`w-full max-w-md p-8 rounded-2xl backdrop-blur-xl border shadow-lg text-center ${
                    isDark ? "bg-white/5 border-white/10" : "bg-white/70 border-white/20"
                  }`}
                >
                  <div
                    className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      isDark
                        ? "bg-gradient-to-br from-blue-500 to-teal-500"
                        : "bg-gradient-to-br from-blue-400 to-teal-400"
                    }`}
                  >
                    <QrCode className="w-12 h-12 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                    QR Code Scanner
                  </h2>
                  <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Click below to activate the camera and scan a patient's QR code
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Scan QR Code
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPatient(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-3xl p-8 backdrop-blur-xl border shadow-2xl max-h-[90vh] overflow-y-auto ${
                isDark ? "bg-slate-900/90 border-white/10" : "bg-white/90 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
                      isDark
                        ? "bg-gradient-to-br from-blue-500 to-teal-500 text-white"
                        : "bg-gradient-to-br from-blue-400 to-teal-400 text-white"
                    }`}
                  >
                    {selectedPatient.avatar}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {selectedPatient.name}
                    </h2>
                    <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>Age: {selectedPatient.age}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportPatientData(selectedPatient)}
                    className={`p-2 rounded-full transition-colors ${
                      isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                    }`}
                    title="Export patient data"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className={`p-2 rounded-full transition-colors ${
                      isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          isDark
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Current Medications
                  </h3>
                  <div className="space-y-2">
                    {selectedPatient.medications.map((med, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-xl ${
                          isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                          {typeof med === "string" ? med : `${med.name} ${med.dosage} - ${med.frequency}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPatient.medicalHistory && (
                  <>
                    <div>
                      <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                        Medical Conditions
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.medicalHistory.conditions.map((condition, index) => (
                          <span
                            key={index}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                              isDark
                                ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                : "bg-orange-100 text-orange-700 border border-orange-200"
                            }`}
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedPatient.medicalHistory.surgeries.length > 0 && (
                      <div>
                        <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                          Surgical History
                        </h3>
                        <div className="space-y-3">
                          {selectedPatient.medicalHistory.surgeries.map((surgery, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-xl ${
                                isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                                {surgery.procedure}
                              </div>
                              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                {surgery.date}
                                {surgery.hospital && ` • ${surgery.hospital}`}
                              </div>
                              {surgery.notes && (
                                <div className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                  {surgery.notes}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedPatient.medicalHistory.familyHistory.length > 0 && (
                      <div>
                        <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                          Family History
                        </h3>
                        <div className="space-y-2">
                          {selectedPatient.medicalHistory.familyHistory.map((history, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-xl ${
                                isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{history}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                        Lifestyle Factors
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div
                          className={`p-3 rounded-xl text-center ${
                            isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Smoking
                          </div>
                          <div
                            className={`text-sm font-semibold capitalize ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            {selectedPatient.medicalHistory.lifestyle.smoking}
                          </div>
                        </div>
                        <div
                          className={`p-3 rounded-xl text-center ${
                            isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Alcohol
                          </div>
                          <div
                            className={`text-sm font-semibold capitalize ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            {selectedPatient.medicalHistory.lifestyle.alcohol}
                          </div>
                        </div>
                        <div
                          className={`p-3 rounded-xl text-center ${
                            isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Exercise
                          </div>
                          <div
                            className={`text-sm font-semibold capitalize ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            {selectedPatient.medicalHistory.lifestyle.exercise}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Blood Type & Emergency Contact */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedPatient.bloodType && (
                    <div>
                      <h3 className={`text-sm font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Blood Type
                      </h3>
                      <div
                        className={`p-3 rounded-xl text-center ${
                          isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <span className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                          {selectedPatient.bloodType}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedPatient.emergencyContact && (
                    <div>
                      <h3 className={`text-sm font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Emergency Contact
                      </h3>
                      <div
                        className={`p-3 rounded-xl ${
                          isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                          {selectedPatient.emergencyContact.name}
                        </div>
                        <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {selectedPatient.emergencyContact.relation}
                        </div>
                        <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {selectedPatient.emergencyContact.phone}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Last Visit
                  </h3>
                  <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>{selectedPatient.lastVisit}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  isDark,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  isDark: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
        active
          ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg"
          : isDark
            ? "text-gray-400 hover:text-gray-200 hover:bg-white/5"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
