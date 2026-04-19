"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Zap, ArrowRight, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<"lecturer" | "student">("student")
  const cardRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect based on role
    if (role === "lecturer") {
      router.push("/lecturer")
    } else {
      router.push("/student")
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Login Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-md transition-transform duration-200 ease-out"
      >
        <div className="glass rounded-3xl p-8 sm:p-10 glow-purple-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
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

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue to your dashboard</p>
          </div>

          {/* Role Toggle */}
          <div className="flex justify-center mb-6">
            <div className="glass rounded-xl p-1 inline-flex">
              {(["student", "lecturer"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "px-6 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                    role === r
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  required
                  className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="pl-10 pr-10 h-12 bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 glow-purple-sm hover:glow-purple transition-all text-base font-medium group"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account?"}{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -left-4 h-20 w-20 bg-secondary/10 rounded-full blur-2xl" />
      </div>
    </div>
  )
}
