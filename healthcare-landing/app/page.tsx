"use client"

import { RoleCard } from "@/components/role-card"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { PremiumLoading } from "@/components/premium-loading"
import { useDarkMode } from "@/contexts/dark-mode-context"
import { User, Stethoscope } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function HomePage() {
  const { isDark } = useDarkMode()
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>{showLoading && <PremiumLoading />}</AnimatePresence>

      <motion.main
        className="relative min-h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: showLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="fixed inset-0 -z-10">
          <div
            className={`absolute inset-0 transition-colors duration-1000 ${
              isDark
                ? "bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-900"
                : "bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/80"
            }`}
          />

          <motion.div
            className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl transition-colors duration-1000 ${
              isDark ? "bg-blue-500/10" : "bg-blue-400/20"
            }`}
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={`absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full blur-3xl transition-colors duration-1000 ${
              isDark ? "bg-teal-500/10" : "bg-teal-400/20"
            }`}
            animate={{
              scale: [1, 1.15, 1],
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl transition-colors duration-1000 ${
              isDark ? "bg-cyan-500/5" : "bg-cyan-400/15"
            }`}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>

        <DarkModeToggle />

        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            className="text-center mb-16 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <motion.h1
              className={`text-6xl md:text-8xl font-bold mb-6 text-balance tracking-tight ${
                isDark ? "text-gradient-premium-dark" : "text-gradient-premium"
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              HealthConnect
            </motion.h1>
            <motion.p
              className={`text-xl md:text-2xl max-w-2xl mx-auto text-pretty font-light transition-colors duration-500 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Choose your portal to access personalized healthcare services
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <RoleCard
                title="I'm a Patient"
                description="Access your medical records, book appointments, and manage your healthcare journey"
                icon={User}
                href="/login?role=patient"
                gradient="from-blue-500/80 to-cyan-500/80"
              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <RoleCard
                title="I'm a Clinician"
                description="Manage patient care, view schedules, and access clinical tools and resources"
                icon={Stethoscope}
                href="/login?role=clinician"
                gradient="from-teal-500/80 to-blue-500/80"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center mt-16 md:mt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p
              className={`text-sm font-light tracking-wide transition-colors duration-500 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Secure • HIPAA Compliant • Available 24/7
            </p>
          </motion.div>
        </div>
      </motion.main>
    </>
  )
}
