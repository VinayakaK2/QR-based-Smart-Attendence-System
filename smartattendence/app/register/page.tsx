"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Zap, ArrowRight, ArrowLeft, Mail, Lock, User, Building2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, title: "Account Type" },
  { id: 2, title: "Personal Info" },
  { id: 3, title: "Security" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    role: "" as "lecturer" | "student" | "",
    firstName: "",
    lastName: "",
    email: "",
    institution: "",
    password: "",
    confirmPassword: "",
  })

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect based on role
    if (formData.role === "lecturer") {
      router.push("/lecturer")
    } else {
      router.push("/student")
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.role !== ""
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.institution
      case 3:
        return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Register Card */}
      <div className="relative w-full max-w-lg">
        <div className="glass rounded-3xl p-8 sm:p-10 glow-purple-sm">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/50 transition-all" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 group-hover:border-primary/50 transition-all">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Smart<span className="text-primary text-glow-purple">Attend</span>
              </span>
            </Link>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
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
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-12 mx-2 transition-all",
                      currentStep > step.id ? "bg-secondary" : "bg-muted/30"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold mb-1">{steps[currentStep - 1].title}</h1>
            <p className="text-sm text-muted-foreground">
              {currentStep === 1 && "Choose your account type to get started"}
              {currentStep === 2 && "Tell us a bit about yourself"}
              {currentStep === 3 && "Create a secure password"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Type */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {(["student", "lecturer"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => updateFormData("role", role)}
                    className={cn(
                      "w-full p-5 rounded-xl text-left transition-all",
                      formData.role === role
                        ? "glass border-primary/50 glow-purple-sm"
                        : "glass hover:border-border/50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl transition-all",
                          formData.role === role
                            ? "bg-primary/20 border border-primary/30"
                            : "bg-muted/30 border border-border/50"
                        )}
                      >
                        {role === "student" ? (
                          <User className={cn("h-6 w-6", formData.role === role ? "text-primary" : "text-muted-foreground")} />
                        ) : (
                          <Building2 className={cn("h-6 w-6", formData.role === role ? "text-primary" : "text-muted-foreground")} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold capitalize">{role}</p>
                        <p className="text-sm text-muted-foreground">
                          {role === "student"
                            ? "Mark attendance and track your progress"
                            : "Create sessions and manage students"}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className="h-12 bg-muted/30 border-border/50 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@university.edu"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="institution"
                      placeholder="University of Technology"
                      value={formData.institution}
                      onChange={(e) => updateFormData("institution", e.target.value)}
                      className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Security */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className="pl-10 pr-10 h-12 bg-muted/30 border-border/50 focus:border-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary/50"
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-destructive">Passwords do not match</p>
                  )}
                </div>

                <div className="glass rounded-xl p-4 space-y-2">
                  <p className="text-sm font-medium">Password Requirements:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {[
                      "At least 8 characters",
                      "One uppercase letter",
                      "One lowercase letter",
                      "One number",
                    ].map((req) => (
                      <div key={req} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-12"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 glow-purple-sm group"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!canProceed() || isLoading}
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 glow-purple-sm group"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 h-24 w-24 bg-secondary/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-primary/10 rounded-full blur-2xl" />
      </div>
    </div>
  )
}
