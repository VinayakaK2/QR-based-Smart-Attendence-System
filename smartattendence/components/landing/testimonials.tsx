"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    content: "SmartAttend has completely transformed how we handle attendance. The fraud prevention is incredible - we have eliminated proxy attendance entirely.",
    author: "Dr. Sarah Chen",
    role: "Professor of Computer Science",
    institution: "MIT University",
    rating: 5,
    avatar: "SC",
  },
  {
    id: 2,
    content: "The 10-second check-in is a game changer. My students love it, and I get real-time insights into attendance patterns I never had before.",
    author: "Prof. Michael Roberts",
    role: "Department Head",
    institution: "Stanford Engineering",
    rating: 5,
    avatar: "MR",
  },
  {
    id: 3,
    content: "As a student, I appreciate how quick and seamless the process is. The streak feature actually motivates me to attend more classes!",
    author: "Emily Zhang",
    role: "Graduate Student",
    institution: "Berkeley University",
    rating: 5,
    avatar: "EZ",
  },
  {
    id: 4,
    content: "Implementing SmartAttend across our 50+ departments was surprisingly easy. The analytics alone have saved us countless hours of manual work.",
    author: "James Wilson",
    role: "IT Director",
    institution: "Harvard University",
    rating: 5,
    avatar: "JW",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Trusted by <span className="text-primary text-glow-purple">Educators</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of institutions already using SmartAttend
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="glass rounded-3xl p-8 sm:p-12 glow-purple-sm">
            <Quote className="h-12 w-12 text-primary/30 mb-6" />

            <div className="min-h-[200px] flex flex-col justify-between">
              <p className="text-xl sm:text-2xl leading-relaxed mb-8">
                {testimonials[currentIndex].content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-lg font-semibold text-primary">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonials[currentIndex].author}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                    <p className="text-sm text-primary">{testimonials[currentIndex].institution}</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrev}
              className="h-10 w-10 rounded-full glass flex items-center justify-center hover:border-primary/30 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    setCurrentIndex(index)
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    currentIndex === index
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="h-10 w-10 rounded-full glass flex items-center justify-center hover:border-primary/30 transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Logos */}
        <div className="mt-16 pt-16 border-t border-border/30">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by leading institutions worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {["MIT", "Stanford", "Harvard", "Berkeley", "Oxford", "Cambridge"].map((name) => (
              <div key={name} className="text-xl font-bold text-muted-foreground">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
