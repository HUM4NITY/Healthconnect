"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useDarkMode } from "@/contexts/dark-mode-context"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { Mail, Lock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { validateMockCredentials } from "@/lib/mock-data"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const searchParams = useSearchParams()
  const roleFromUrl = searchParams.get("role") as "patient" | "clinician" | null
  const [role, setRole] = useState<"patient" | "clinician">(roleFromUrl || "patient")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()
  const { isDark } = useDarkMode()

  useEffect(() => {
    if (roleFromUrl) {
      setRole(roleFromUrl)
    }
  }, [roleFromUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { valid, userId } = validateMockCredentials(formData.email, formData.password, role)

    if (valid) {
      if (role === "patient" && userId) {
        localStorage.setItem("currentPatientId", userId)
      }

      if (role === "patient") {
        router.push("/patient/dashboard")
      } else {
        router.push("/clinician/dashboard")
      }
    } else {
      setError("Invalid email or password. Try demo credentials.")
    }
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-slate-950" : "bg-gradient-to-br from-blue-50 via-white to-teal-50"
      }`}
    >
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
        <motion.div
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? "bg-teal-500" : "bg-teal-400"}`}
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ bottom: "10%", right: "10%" }}
        />
      </div>

      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border transition-all duration-300 ${
            isDark
              ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
              : "bg-white/50 border-white/20 text-gray-700 hover:bg-white/70"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-md rounded-3xl p-8 backdrop-blur-xl border shadow-2xl ${
            isDark ? "bg-white/5 border-white/10 shadow-blue-500/10" : "bg-white/70 border-white/20 shadow-blue-500/20"
          }`}
        >
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {role === "patient" ? "Patient Portal" : "Clinician Portal"}
            </h2>
            <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {isLogin ? "Sign in to continue" : "Create your account"}
            </p>
          </div>

          <div
            className={`mb-4 p-3 rounded-xl text-xs ${
              isDark
                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            <div className="font-semibold mb-1">Demo Credentials:</div>
            {role === "patient" ? <div>john@patient.com / patient123</div> : <div>dr.smith@clinic.com / doctor123</div>}
          </div>

          {error && (
            <div
              className={`mb-4 p-3 rounded-xl text-sm ${
                isDark
                  ? "bg-red-500/10 text-red-300 border border-red-500/20"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {error}
            </div>
          )}

          <div className={`flex gap-2 p-1 rounded-2xl mb-8 ${isDark ? "bg-white/5" : "bg-gray-100/50"}`}>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                isLogin
                  ? isDark
                    ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg"
                    : "bg-white text-blue-600 shadow-md"
                  : isDark
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                !isLogin
                  ? isDark
                    ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg"
                    : "bg-white text-blue-600 shadow-md"
                  : isDark
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-blue-500/50"
                        : "bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500"
                    }`}
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Email
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-blue-500/50"
                      : "bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500"
                  }`}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-blue-500/50"
                      : "bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500"
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className={`text-sm font-medium transition-colors ${
                    isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLogin ? "Continue" : "Create Account"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
