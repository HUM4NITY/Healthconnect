"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassmorphicCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassmorphicCard({ children, className, hover = false }: GlassmorphicCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-3xl p-6",
        "bg-white/10 dark:bg-white/5",
        "backdrop-blur-2xl",
        "border border-white/20 dark:border-white/10",
        "shadow-2xl shadow-black/5 dark:shadow-black/40",
        className,
      )}
      whileHover={
        hover
          ? {
              scale: 1.02,
              y: -4,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
              },
            }
          : undefined
      }
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  )
}
