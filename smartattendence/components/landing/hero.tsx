"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { QrCode, ScanFace, MapPin, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const verificationSteps = [
  { icon: QrCode, label: "Scan QR", color: "text-primary", delay: 0 },
  { icon: ScanFace, label: "Face ID", color: "text-secondary", delay: 1 },
  { icon: MapPin, label: "GPS Check", color: "text-primary", delay: 2 },
]

export function Hero() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">AI-Powered Attendance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="text-balance">The Future of</span>
              <br />
              <span className="text-primary text-glow-purple">Smart Attendance</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Triple-verified attendance tracking with QR codes, facial recognition, and GPS. 
              Eliminate fraud, save time, and get real-time insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 glow-purple text-lg px-8 group">
                <Link href="/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border hover:border-primary/50 hover:bg-primary/5 text-lg">
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              {[
                "No hardware required",
                "Setup in 5 minutes",
                "99.9% accuracy",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:pl-8">
            {/* Main Verification Card */}
            <div className="relative glass rounded-3xl p-8 glow-purple-sm">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />

              <div className="relative space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">3-Step Verification</h3>
                  <p className="text-sm text-muted-foreground">Secure & Instant</p>
                </div>

                {/* Verification Steps */}
                <div className="flex justify-between items-center">
                  {verificationSteps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = activeStep === index
                    const isCompleted = activeStep > index

                    return (
                      <div key={step.label} className="flex flex-col items-center gap-3">
                        <div
                          className={`
                            relative flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500
                            ${isActive ? "glass glow-purple scale-110" : isCompleted ? "bg-secondary/20 border border-secondary/30" : "bg-muted/30 border border-border"}
                          `}
                        >
                          {isActive && (
                            <div className="absolute inset-0 rounded-2xl animate-glow-ring" />
                          )}
                          <Icon className={`h-7 w-7 ${isActive || isCompleted ? step.color : "text-muted-foreground"} transition-colors`} />
                          {isCompleted && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-secondary rounded-full flex items-center justify-center">
                              <CheckCircle2 className="h-3 w-3 text-secondary-foreground" />
                            </div>
                          )}
                        </div>
                        <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Connection Lines */}
                <div className="absolute top-[45%] left-[25%] right-[25%] h-0.5">
                  <div className="h-full bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 rounded-full" />
                </div>

                {/* Status */}
                <div className="glass rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
                    <span className="text-sm font-medium">Verification Active</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Step {activeStep + 1}/3</span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-8 -left-8 glass rounded-2xl p-4 animate-float" style={{ animationDelay: "-2s" }}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Attendance Marked</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 glass rounded-2xl p-4 animate-float" style={{ animationDelay: "-4s" }}>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">99.9%</p>
                <p className="text-xs text-muted-foreground">Accuracy Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
