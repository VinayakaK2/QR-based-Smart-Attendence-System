"use client"

import { QrCode, ScanFace, MapPin, BarChart3, Clock, Shield, Zap, Users, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: QrCode,
    title: "Dynamic QR Codes",
    description: "Auto-refreshing QR codes that prevent screenshot sharing and ensure real-time attendance.",
    color: "primary",
    size: "large",
  },
  {
    icon: ScanFace,
    title: "Facial Recognition",
    description: "AI-powered face verification with liveness detection.",
    color: "secondary",
    size: "small",
  },
  {
    icon: MapPin,
    title: "GPS Geofencing",
    description: "Location-based verification with customizable radius.",
    color: "primary",
    size: "small",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Comprehensive dashboards with attendance patterns, trends, and exportable reports.",
    color: "secondary",
    size: "large",
  },
  {
    icon: Clock,
    title: "Session Management",
    description: "Schedule, start, and manage sessions with ease.",
    color: "primary",
    size: "small",
  },
  {
    icon: Shield,
    title: "Anti-Fraud Protection",
    description: "Multi-layer verification eliminates proxy attendance.",
    color: "secondary",
    size: "small",
  },
]

const additionalFeatures = [
  { icon: Zap, label: "Lightning Fast" },
  { icon: Users, label: "Multi-tenant" },
  { icon: FileText, label: "CSV Export" },
]

export function Features() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Powerful <span className="text-primary text-glow-purple">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need for modern attendance management
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isLarge = feature.size === "large"

            return (
              <div
                key={feature.title}
                className={cn(
                  "group relative glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]",
                  isLarge ? "lg:col-span-2 lg:row-span-1" : "",
                  feature.color === "primary"
                    ? "hover:border-primary/30 hover:glow-purple-sm"
                    : "hover:border-secondary/30 hover:glow-green-sm"
                )}
              >
                {/* Hover Glow */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity",
                    feature.color === "primary"
                      ? "bg-primary/5"
                      : "bg-secondary/5"
                  )}
                />

                <div className="relative h-full flex flex-col">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-all",
                      feature.color === "primary"
                        ? "bg-primary/10 border border-primary/20 group-hover:bg-primary/20"
                        : "bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        feature.color === "primary" ? "text-primary" : "text-secondary"
                      )}
                    />
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1">
                    {feature.description}
                  </p>

                  {/* Decorative Element */}
                  <div
                    className={cn(
                      "absolute bottom-4 right-4 h-20 w-20 rounded-full opacity-10 blur-2xl transition-all group-hover:opacity-20",
                      feature.color === "primary" ? "bg-primary" : "bg-secondary"
                    )}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Features */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {additionalFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2 glass rounded-full"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {feature.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
