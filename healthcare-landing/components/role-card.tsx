"use client"

import type { LucideIcon } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { useDarkMode } from "@/contexts/dark-mode-context"

interface RoleCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  gradient: string
}

export function RoleCard({ title, description, icon: Icon, href, gradient }: RoleCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { isDark } = useDarkMode()

  return (
    <a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative block"
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
      />

      <div
        className={`relative h-full backdrop-blur-xl border rounded-3xl p-8 md:p-10 shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl ${
          isDark ? "bg-white/10 border-white/20" : "bg-white/40 border-white/20"
        }`}
      >
        {/* Icon container */}
        <div
          className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${gradient} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
        </div>

        <h2
          className={`text-3xl md:text-4xl font-bold mb-4 text-balance transition-colors duration-500 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-base md:text-lg mb-6 leading-relaxed text-pretty transition-colors duration-500 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {description}
        </p>

        {/* Arrow indicator */}
        <div
          className={`flex items-center gap-2 font-semibold transition-colors duration-500 ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`}
        >
          <span>Get Started</span>
          <ArrowRight
            className={`w-5 h-5 transition-transform duration-500 ${isHovered ? "translate-x-2" : "translate-x-0"}`}
          />
        </div>

        {/* Decorative gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500 pointer-events-none`}
        />
      </div>
    </a>
  )
}
