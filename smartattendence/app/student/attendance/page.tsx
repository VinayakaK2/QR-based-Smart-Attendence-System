"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  QrCode,
  ScanFace,
  MapPin,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Camera,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, title: "Scan QR Code", icon: QrCode, description: "Scan the session QR code" },
  { id: 2, title: "Face Verification", icon: ScanFace, description: "Verify your identity" },
  { id: 3, title: "GPS Check", icon: MapPin, description: "Confirm your location" },
  { id: 4, title: "Result", icon: CheckCircle2, description: "Attendance marked" },
]

export default function AttendanceFlowPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [result, setResult] = useState<"success" | "failed" | null>(null)

  // Simulate scanning/processing progress
  useEffect(() => {
    if (!isProcessing) return

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)

          // Move to next step after processing
          if (currentStep < 4) {
            setTimeout(() => {
              if (currentStep === 3) {
                // Random success/fail for demo (mostly success)
                setResult(Math.random() > 0.1 ? "success" : "failed")
              }
              setCurrentStep(currentStep + 1)
            }, 300)
          }
          return 100
        }
        return prev + 10
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isProcessing, currentStep])

  const startProcessing = () => {
    setIsProcessing(true)
    setScanProgress(0)
  }

  const resetFlow = () => {
    setCurrentStep(1)
    setResult(null)
    setScanProgress(0)
    setIsProcessing(false)
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <button
          onClick={() => router.push("/student")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Cancel</span>
        </button>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {steps.slice(0, -1).map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  currentStep > step.id
                    ? "bg-secondary text-secondary-foreground"
                    : currentStep === step.id
                    ? "bg-primary text-primary-foreground glow-purple-sm"
                    : "bg-muted/50 text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              {index < 2 && (
                <div
                  className={cn(
                    "h-0.5 w-8 mx-1 transition-all",
                    currentStep > step.id ? "bg-secondary" : "bg-muted/30"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Step 1: Scan QR Code */}
          {currentStep === 1 && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Scan QR Code</h2>
                <p className="text-muted-foreground">Point your camera at the session QR code</p>
              </div>

              {/* Scanner View */}
              <div className="relative aspect-square max-w-[300px] mx-auto">
                <div className="absolute inset-0 glass rounded-3xl overflow-hidden">
                  {/* Scanner Frame */}
                  <div className="absolute inset-4 border-2 border-primary/50 rounded-2xl">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

                    {/* Scanning Line */}
                    {isProcessing && (
                      <div
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                        style={{
                          top: `${scanProgress}%`,
                          transition: "top 0.2s linear",
                        }}
                      />
                    )}
                  </div>

                  {/* QR Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <QrCode className={cn("h-16 w-16 text-primary/50", isProcessing && "animate-pulse")} />
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-primary/10 rounded-[40px] blur-2xl -z-10" />
              </div>

              {isProcessing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Scanning...</span>
                  </div>
                  <div className="w-48 h-2 bg-muted/30 rounded-full mx-auto overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <Button
                  onClick={startProcessing}
                  className="bg-primary hover:bg-primary/90 glow-purple h-14 px-8 text-lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Start Scanning
                </Button>
              )}
            </div>
          )}

          {/* Step 2: Face Verification */}
          {currentStep === 2 && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Face Verification</h2>
                <p className="text-muted-foreground">Position your face in the center</p>
              </div>

              {/* Face Scanner View */}
              <div className="relative aspect-square max-w-[300px] mx-auto">
                <div className="absolute inset-0 glass rounded-full overflow-hidden">
                  {/* Face Outline */}
                  <div className="absolute inset-8 border-2 border-dashed border-secondary/50 rounded-full flex items-center justify-center">
                    <ScanFace className={cn("h-24 w-24 text-secondary/50", isProcessing && "animate-pulse")} />
                  </div>

                  {/* Scanning Ring */}
                  {isProcessing && (
                    <svg className="absolute inset-0 h-full w-full -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={`${scanProgress * 2.83}, 283`}
                        className="text-secondary"
                      />
                    </svg>
                  )}
                </div>

                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-secondary/10 rounded-full blur-2xl -z-10" />
              </div>

              {isProcessing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-secondary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {scanProgress < 30 && "Detecting face..."}
                    {scanProgress >= 30 && scanProgress < 70 && "Checking liveness..."}
                    {scanProgress >= 70 && "Verifying identity..."}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={startProcessing}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground glow-green h-14 px-8 text-lg"
                >
                  <ScanFace className="mr-2 h-5 w-5" />
                  Capture Face
                </Button>
              )}
            </div>
          )}

          {/* Step 3: GPS Check */}
          {currentStep === 3 && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Location Verification</h2>
                <p className="text-muted-foreground">Verifying you are in the classroom</p>
              </div>

              {/* GPS View */}
              <div className="relative aspect-square max-w-[300px] mx-auto">
                <div className="absolute inset-0 glass rounded-3xl overflow-hidden flex items-center justify-center">
                  {/* Map Grid Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

                  {/* Location Ping */}
                  <div className="relative">
                    <div className={cn(
                      "h-20 w-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center",
                      isProcessing && "animate-ping"
                    )}>
                      <MapPin className="h-10 w-10 text-primary" />
                    </div>
                    {isProcessing && (
                      <div className="absolute inset-0 h-20 w-20 rounded-full border-2 border-primary/50 animate-[ping_1.5s_ease-in-out_infinite]" />
                    )}
                  </div>

                  {/* Radius Circles */}
                  <div className="absolute inset-8 rounded-full border border-dashed border-primary/20" />
                  <div className="absolute inset-16 rounded-full border border-dashed border-primary/30" />
                </div>

                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-primary/10 rounded-[40px] blur-2xl -z-10" />
              </div>

              {isProcessing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Checking location...</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {scanProgress < 50 && "Getting GPS coordinates..."}
                    {scanProgress >= 50 && "Verifying classroom radius..."}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={startProcessing}
                  className="bg-primary hover:bg-primary/90 glow-purple h-14 px-8 text-lg"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Verify Location
                </Button>
              )}
            </div>
          )}

          {/* Step 4: Result */}
          {currentStep === 4 && (
            <div className="text-center space-y-8">
              {result === "success" ? (
                <>
                  <div className="relative">
                    <div className="h-32 w-32 mx-auto rounded-full bg-secondary/20 border-4 border-secondary flex items-center justify-center glow-green">
                      <CheckCircle2 className="h-16 w-16 text-secondary" />
                    </div>
                    <div className="absolute -inset-8 bg-secondary/10 rounded-full blur-3xl -z-10 animate-pulse" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold mb-2 text-secondary text-glow-green">
                      Attendance Marked!
                    </h2>
                    <p className="text-muted-foreground">
                      Your attendance for CS101 - Intro to Programming has been recorded.
                    </p>
                  </div>

                  <div className="glass rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Course</span>
                      <span className="font-medium">CS101 - Intro to Programming</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-secondary font-medium">Verified</span>
                    </div>
                  </div>

                  <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground h-14 px-8 text-lg">
                    <Link href="/student">
                      Back to Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <div className="h-32 w-32 mx-auto rounded-full bg-destructive/20 border-4 border-destructive flex items-center justify-center">
                      <XCircle className="h-16 w-16 text-destructive" />
                    </div>
                    <div className="absolute -inset-8 bg-destructive/10 rounded-full blur-3xl -z-10" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold mb-2 text-destructive">
                      Verification Failed
                    </h2>
                    <p className="text-muted-foreground">
                      We could not verify your attendance. Please try again or contact your lecturer.
                    </p>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <p className="text-sm text-muted-foreground">
                      Possible reasons: Location out of range, face not recognized, or session expired.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={resetFlow}
                      className="flex-1 bg-primary hover:bg-primary/90 h-14 text-lg"
                    >
                      Try Again
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 h-14 text-lg"
                    >
                      <Link href="/student">Cancel</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Step Info Footer */}
      {currentStep < 4 && (
        <div className="p-4 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of 3: {steps[currentStep - 1].description}
          </p>
        </div>
      )}
    </div>
  )
}
