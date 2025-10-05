"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDarkMode } from "@/contexts/dark-mode-context"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { QrCode, Download, Share2, X, Pill, Calendar, Shield, Clock, AlertTriangle, ArrowLeft } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { getPatientById } from "@/lib/firebase-service"
import { generateQRData } from "@/lib/qr-utils"
import type { Patient, QRAccessLevel } from "@/types/patient"
import { useRouter } from "next/navigation"

export default function PatientDashboard() {
  const router = useRouter()
  const [showQRModal, setShowQRModal] = useState(false)
  const [patientData, setPatientData] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<QRAccessLevel>("full")
  const [timeLimitHours, setTimeLimitHours] = useState(24)
  const [qrCodeValue, setQrCodeValue] = useState("")
  const { isDark } = useDarkMode()

  useEffect(() => {
    async function fetchPatient() {
      setLoading(true)
      const patientId = localStorage.getItem("currentPatientId") || "patient-1"
      const data = await getPatientById(patientId)
      setPatientData(data)
      setLoading(false)
    }
    fetchPatient()
  }, [])

  const handleGenerateQR = () => {
    if (!patientData) return
    const qrData = generateQRData(patientData, selectedAccessLevel, timeLimitHours)
    setQrCodeValue(qrData)
    setShowQRModal(true)
  }

  const downloadQR = () => {
    const canvas = document.querySelector("canvas")
    if (canvas) {
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `patient-qr-${selectedAccessLevel}.png`
      link.href = url
      link.click()
    }
  }

  const shareQR = () => {
    if (qrCodeValue) {
      navigator.clipboard.writeText(qrCodeValue)
      alert("QR Code data copied to clipboard!")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentPatientId")
    router.push("/login")
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-slate-950" : "bg-gradient-to-br from-blue-50 via-white to-teal-50"
        }`}
      >
        <div className={`text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Loading patient data...</div>
      </div>
    )
  }

  if (!patientData) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-slate-950" : "bg-gradient-to-br from-blue-50 via-white to-teal-50"
        }`}
      >
        <div className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>Patient data not found</div>
      </div>
    )
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-2xl rounded-3xl p-8 backdrop-blur-xl border shadow-2xl ${
            isDark ? "bg-white/5 border-white/10 shadow-blue-500/10" : "bg-white/70 border-white/20 shadow-blue-500/20"
          }`}
        >
          {/* Patient Info */}
          <div className="flex items-center gap-6 mb-8">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${
                isDark
                  ? "bg-gradient-to-br from-blue-500 to-teal-500 text-white"
                  : "bg-gradient-to-br from-blue-400 to-teal-400 text-white"
              }`}
            >
              {patientData.avatar}
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{patientData.name}</h1>
              <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>Age: {patientData.age}</p>
            </div>
          </div>

          {/* Allergies */}
          <div className="mb-6">
            <h2
              className={`text-xl font-semibold mb-3 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <Pill className="w-5 h-5" />
              Allergies
            </h2>
            <div className="flex flex-wrap gap-2">
              {patientData.allergies.map((allergy, index) => (
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

          {/* Medications */}
          <div className="mb-6">
            <h2 className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              Current Medications
            </h2>
            <div className="space-y-3">
              {patientData.medications.map((med, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl backdrop-blur-sm border ${
                    isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-gray-200"
                  }`}
                >
                  <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{med.name}</div>
                  <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {med.dosage} - {med.frequency}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical History Section */}
          {patientData.medicalHistory && (
            <div className="mb-6">
              <h2 className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                Medical History
              </h2>
              <div className="space-y-4">
                {/* Conditions */}
                {patientData.medicalHistory.conditions.length > 0 && (
                  <div
                    className={`p-4 rounded-xl backdrop-blur-sm border ${
                      isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-gray-200"
                    }`}
                  >
                    <div className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      Current Conditions
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {patientData.medicalHistory.conditions.map((condition, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm ${
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
                )}

                {/* Surgeries */}
                {patientData.medicalHistory.surgeries.length > 0 && (
                  <div
                    className={`p-4 rounded-xl backdrop-blur-sm border ${
                      isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-gray-200"
                    }`}
                  >
                    <div className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      Past Surgeries
                    </div>
                    <div className="space-y-2">
                      {patientData.medicalHistory.surgeries.map((surgery, index) => (
                        <div key={index} className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          <span className="font-medium">{surgery.procedure}</span> - {surgery.date}
                          {surgery.hospital && (
                            <span className={`block text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              {surgery.hospital}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blood Type & Emergency Contact */}
                <div className="grid grid-cols-2 gap-4">
                  {patientData.bloodType && (
                    <div
                      className={`p-4 rounded-xl backdrop-blur-sm border ${
                        isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-gray-200"
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Blood Type
                      </div>
                      <div className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {patientData.bloodType}
                      </div>
                    </div>
                  )}
                  {patientData.emergencyContact && (
                    <div
                      className={`p-4 rounded-xl backdrop-blur-sm border ${
                        isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-gray-200"
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Emergency Contact
                      </div>
                      <div className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {patientData.emergencyContact.name}
                      </div>
                      <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {patientData.emergencyContact.phone}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Appointments */}
          {patientData.appointments && patientData.appointments.length > 0 && (
            <div className="mb-8">
              <h2
                className={`text-xl font-semibold mb-3 flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <Calendar className="w-5 h-5" />
                Upcoming Appointments
              </h2>
              <div className="space-y-3">
                {patientData.appointments.map((apt, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl backdrop-blur-sm border ${
                      isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-gray-200"
                    }`}
                  >
                    <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {apt.type} - {apt.doctor}
                    </div>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {apt.date} at {apt.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate QR Button */}
          <motion.button
            onClick={handleGenerateQR}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
          >
            <QrCode className="w-5 h-5" />
            Generate My QR Code
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-3xl p-8 backdrop-blur-xl border shadow-2xl ${
                isDark ? "bg-slate-900/90 border-white/10" : "bg-white/90 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Your QR Code</h2>
                <button
                  onClick={() => setShowQRModal(false)}
                  className={`p-2 rounded-full transition-colors ${
                    isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Access Level Selection */}
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Select Access Level
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedAccessLevel("emergency")}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedAccessLevel === "emergency"
                        ? "border-red-500 bg-red-500/10"
                        : isDark
                          ? "border-white/10 hover:border-white/20"
                          : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={`w-5 h-5 ${selectedAccessLevel === "emergency" ? "text-red-500" : isDark ? "text-gray-400" : "text-gray-600"}`}
                      />
                      <div>
                        <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Emergency Only</div>
                        <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          Critical info only (allergies, medications)
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedAccessLevel("full")}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedAccessLevel === "full"
                        ? "border-blue-500 bg-blue-500/10"
                        : isDark
                          ? "border-white/10 hover:border-white/20"
                          : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Shield
                        className={`w-5 h-5 ${selectedAccessLevel === "full" ? "text-blue-500" : isDark ? "text-gray-400" : "text-gray-600"}`}
                      />
                      <div>
                        <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Full Access</div>
                        <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          Complete medical history
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedAccessLevel("time-limited")}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedAccessLevel === "time-limited"
                        ? "border-teal-500 bg-teal-500/10"
                        : isDark
                          ? "border-white/10 hover:border-white/20"
                          : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock
                        className={`w-5 h-5 ${selectedAccessLevel === "time-limited" ? "text-teal-500" : isDark ? "text-gray-400" : "text-gray-600"}`}
                      />
                      <div className="flex-1">
                        <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Time-Limited</div>
                        <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          Expires after set duration
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {selectedAccessLevel === "time-limited" && (
                  <div className="mt-4">
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Valid for (hours)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="168"
                      value={timeLimitHours}
                      onChange={(e) => setTimeLimitHours(Number(e.target.value))}
                      className={`w-full px-4 py-2 rounded-xl border ${
                        isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-center mb-6 p-6 bg-white rounded-2xl">
                <QRCodeSVG value={qrCodeValue || patientData.qrCode} size={200} />
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={downloadQR}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <Download className="w-5 h-5" />
                  Download
                </motion.button>
                <motion.button
                  onClick={shareQR}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
