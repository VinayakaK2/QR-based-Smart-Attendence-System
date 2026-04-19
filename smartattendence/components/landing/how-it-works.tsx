"use client"

import { useState } from "react"
import { QrCode, ScanFace, MapPin, CheckCircle2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    number: "01",
    icon: QrCode,
    title: "Scan Session QR",
    description: "Lecturer generates a unique QR code for each session. Students scan it using the SmartAttend app.",
    details: [
      "Dynamic QR that refreshes every 30 seconds",
      "Prevents screenshot sharing",
      "Works offline with sync capability",
    ],
    color: "primary",
  },
  {
    number: "02",
    icon: ScanFace,
    title: "Face Verification",
    description: "AI-powered facial recognition confirms student identity in milliseconds.",
    details: [
      "99.9% accuracy with liveness detection",
      "Anti-spoofing technology",
      "Privacy-first: no data stored externally",
    ],
    color: "secondary",
  },
  {
    number: "03",
    icon: MapPin,
    title: "GPS Confirmation",
    description: "Location verification ensures students are physically present in the classroom.",
    details: [
      "Geofencing with customizable radius",
      "Works indoors with WiFi positioning",
      "Bluetooth beacon support",
    ],
    color: "primary",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Instant Confirmation",
    description: "Attendance is marked instantly and synced across all devices in real-time.",
    details: [
      "Real-time dashboard updates",
      "Push notifications to students",
      "Automatic report generation",
    ],
    color: "secondary",
  },
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] -translate-y-1/2" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How <span className="text-primary text-glow-purple">SmartAttend</span> Works
          </h2>
          <p className="text-lg text-muted-foreground">
            A seamless 4-step process that takes less than 10 seconds
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Steps List */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index

              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "w-full text-left glass rounded-2xl p-6 transition-all duration-300 group",
                    isActive
                      ? "glow-purple-sm border-primary/30"
                      : "hover:border-border/50 border-transparent"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all",
                        isActive
                          ? step.color === "primary"
                            ? "bg-primary/20 border border-primary/30"
                            : "bg-secondary/20 border border-secondary/30"
                          : "bg-muted/50 border border-border"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-6 w-6 transition-colors",
                          isActive
                            ? step.color === "primary"
                              ? "text-primary"
                              : "text-secondary"
                            : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={cn(
                            "text-xs font-mono",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {step.number}
                        </span>
                        <h3 className="font-semibold truncate">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-5 w-5 shrink-0 transition-all",
                        isActive
                          ? "text-primary rotate-90"
                          : "text-muted-foreground group-hover:translate-x-1"
                      )}
                    />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Step Detail */}
          <div className="lg:sticky lg:top-24">
            <div className="glass rounded-3xl p-8 glow-purple-sm">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-2xl",
                      steps[activeStep].color === "primary"
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-secondary/20 border border-secondary/30"
                    )}
                  >
                    {(() => {
                      const Icon = steps[activeStep].icon
                      return (
                        <Icon
                          className={cn(
                            "h-8 w-8",
                            steps[activeStep].color === "primary"
                              ? "text-primary"
                              : "text-secondary"
                          )}
                        />
                      )
                    })()}
                  </div>
                  <div>
                    <span className="text-sm font-mono text-primary">
                      Step {steps[activeStep].number}
                    </span>
                    <h3 className="text-xl font-bold">{steps[activeStep].title}</h3>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {steps[activeStep].description}
                </p>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  {steps[activeStep].details.map((detail) => (
                    <div key={detail} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Progress Indicator */}
                <div className="flex gap-2 pt-4">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        activeStep === index
                          ? "w-8 bg-primary"
                          : "w-4 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
