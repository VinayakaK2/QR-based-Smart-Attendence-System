"use client"

import { useState } from "react"
import { GraduationCap, BookOpen, QrCode, BarChart3, Users, Clock, ScanFace, History, Award } from "lucide-react"
import { cn } from "@/lib/utils"

const roles = [
  {
    id: "lecturer",
    label: "For Lecturers",
    icon: GraduationCap,
    description: "Streamline attendance management and focus on teaching",
    features: [
      {
        icon: QrCode,
        title: "One-Click Session Start",
        description: "Generate QR codes instantly and start tracking attendance in seconds.",
      },
      {
        icon: BarChart3,
        title: "Real-time Monitoring",
        description: "Watch attendance roll in live with detailed analytics dashboard.",
      },
      {
        icon: Users,
        title: "Section Management",
        description: "Organize students into sections with individual tracking.",
      },
      {
        icon: Clock,
        title: "Session History",
        description: "Access complete attendance records with one-click export.",
      },
    ],
    mockup: {
      title: "Lecturer Dashboard",
      stats: [
        { label: "Active Sessions", value: "3" },
        { label: "Students Present", value: "127" },
        { label: "Avg. Attendance", value: "94%" },
      ],
    },
  },
  {
    id: "student",
    label: "For Students",
    icon: BookOpen,
    description: "Mark attendance effortlessly and track your progress",
    features: [
      {
        icon: ScanFace,
        title: "Quick Check-in",
        description: "Mark attendance in under 10 seconds with our streamlined flow.",
      },
      {
        icon: History,
        title: "Attendance History",
        description: "View your complete attendance record and identify patterns.",
      },
      {
        icon: Award,
        title: "Streak Tracking",
        description: "Build attendance streaks and stay motivated to attend.",
      },
      {
        icon: BarChart3,
        title: "Personal Analytics",
        description: "Visualize your attendance with heatmaps and statistics.",
      },
    ],
    mockup: {
      title: "Student Profile",
      stats: [
        { label: "Attendance Rate", value: "96%" },
        { label: "Current Streak", value: "14 days" },
        { label: "Classes This Week", value: "8" },
      ],
    },
  },
]

export function Roles() {
  const [activeRole, setActiveRole] = useState("lecturer")
  const currentRole = roles.find((r) => r.id === activeRole)!

  return (
    <section id="roles" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Built for <span className="text-primary text-glow-purple">Everyone</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tailored experiences for lecturers and students
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex justify-center mb-12">
          <div className="glass rounded-2xl p-1.5 inline-flex">
            {roles.map((role) => {
              const Icon = role.icon
              const isActive = activeRole === role.id

              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground glow-purple-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {role.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features */}
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">{currentRole.description}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              {currentRole.features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="glass rounded-xl p-5 group hover:border-primary/30 transition-all"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-3 group-hover:bg-primary/20 transition-all">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mockup */}
          <div className="relative">
            <div className="glass rounded-3xl p-6 glow-purple-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-secondary/60" />
                </div>
                <span className="text-sm text-muted-foreground">{currentRole.mockup.title}</span>
              </div>

              <div className="space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  {currentRole.mockup.stats.map((stat) => (
                    <div key={stat.label} className="glass rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Placeholder Content */}
                <div className="space-y-3">
                  <div className="h-4 bg-muted/30 rounded-full w-3/4" />
                  <div className="h-4 bg-muted/30 rounded-full w-1/2" />
                  <div className="h-32 bg-muted/20 rounded-xl mt-4 flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
