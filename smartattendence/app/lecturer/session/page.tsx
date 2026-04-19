"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { QrCode, Users, Clock, X, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const mockAttendees = [
  { id: 1, name: "Alice Johnson", time: "10:02 AM", status: "verified" },
  { id: 2, name: "Bob Smith", time: "10:03 AM", status: "verified" },
  { id: 3, name: "Charlie Brown", time: "10:04 AM", status: "verified" },
  { id: 4, name: "Diana Prince", time: "10:05 AM", status: "pending" },
  { id: 5, name: "Edward Norton", time: "10:05 AM", status: "verified" },
]

const sections = [
  { id: 1, name: "CS101 - Section A", students: 48 },
  { id: 2, name: "CS101 - Section B", students: 45 },
  { id: 3, name: "CS201 - Section A", students: 42 },
  { id: 4, name: "CS301 - Section A", students: 35 },
]

export default function LiveSessionPage() {
  const [sessionActive, setSessionActive] = useState(false)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(30)
  const [attendees, setAttendees] = useState(mockAttendees)
  const [showQRModal, setShowQRModal] = useState(false)

  // Countdown timer for QR refresh
  useEffect(() => {
    if (!sessionActive) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 30
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionActive])

  // Simulate new attendees
  useEffect(() => {
    if (!sessionActive) return

    const interval = setInterval(() => {
      const names = ["Frank Miller", "Grace Lee", "Henry Ford", "Iris West", "Jack Ryan"]
      const randomName = names[Math.floor(Math.random() * names.length)]

      if (!attendees.find((a) => a.name === randomName)) {
        setAttendees((prev) => [
          {
            id: prev.length + 1,
            name: randomName,
            time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            status: Math.random() > 0.1 ? "verified" : "pending",
          },
          ...prev,
        ])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [sessionActive, attendees])

  const startSession = () => {
    if (selectedSection) {
      setSessionActive(true)
      setAttendees([])
      setShowQRModal(true)
    }
  }

  const endSession = () => {
    setSessionActive(false)
    setSelectedSection(null)
    setAttendees([])
    setShowQRModal(false)
  }

  const section = sections.find((s) => s.id === selectedSection)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Live Session</h1>
          <p className="text-muted-foreground mt-1">
            {sessionActive ? "Session in progress" : "Start a new attendance session"}
          </p>
        </div>
        {sessionActive && (
          <Button variant="destructive" onClick={endSession}>
            <X className="mr-2 h-5 w-5" />
            End Session
          </Button>
        )}
      </div>

      {!sessionActive ? (
        /* Section Selection */
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">Select a Section</h2>
          <div className="space-y-3">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSection(s.id)}
                className={cn(
                  "w-full p-5 rounded-2xl text-left transition-all",
                  selectedSection === s.id
                    ? "glass border-primary/50 glow-purple-sm"
                    : "glass hover:border-border/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                        selectedSection === s.id
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-muted/30 border border-border/50"
                      )}
                    >
                      <Users
                        className={cn(
                          "h-6 w-6",
                          selectedSection === s.id ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.students} students enrolled</p>
                    </div>
                  </div>
                  {selectedSection === s.id && (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={startSession}
            disabled={!selectedSection}
            className="w-full mt-6 h-14 bg-primary hover:bg-primary/90 glow-purple text-lg group"
          >
            <QrCode className="mr-2 h-6 w-6" />
            Start Session
          </Button>
        </div>
      ) : (
        /* Active Session View */
        <div className="grid lg:grid-cols-3 gap-6">
          {/* QR Code Panel */}
          <div className="lg:col-span-1">
            <div className="glass rounded-3xl p-6 glow-purple-sm sticky top-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold">{section?.name}</h3>

                {/* QR Code Display */}
                <button
                  onClick={() => setShowQRModal(true)}
                  className="relative w-full aspect-square max-w-[240px] mx-auto bg-foreground rounded-2xl p-4 group"
                >
                  {/* Simulated QR Code Pattern */}
                  <div className="w-full h-full grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-sm",
                          Math.random() > 0.5 ? "bg-background" : "bg-transparent"
                        )}
                      />
                    ))}
                  </div>

                  {/* Center Logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                      <QrCode className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 rounded-2xl transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-background font-medium bg-foreground/80 px-4 py-2 rounded-lg">
                      Click to Enlarge
                    </span>
                  </div>
                </button>

                {/* Countdown Timer */}
                <div className="flex items-center justify-center gap-3">
                  <div className="relative h-16 w-16">
                    <svg className="h-full w-full -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-muted/30"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={176}
                        strokeDashoffset={176 - (countdown / 30) * 176}
                        className="text-primary transition-all"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{countdown}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">QR Refreshes</p>
                    <p className="text-sm text-muted-foreground">in {countdown} seconds</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCountdown(30)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Now
                </Button>
              </div>
            </div>
          </div>

          {/* Attendee Feed */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-secondary">{attendees.filter((a) => a.status === "verified").length}</p>
                <p className="text-sm text-muted-foreground">Present</p>
              </div>
              <div className="glass rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold">{section?.students || 0}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="glass rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-primary">
                  {section ? Math.round((attendees.filter((a) => a.status === "verified").length / section.students) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Rate</p>
              </div>
            </div>

            {/* Live Feed */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
                  Live Attendee Feed
                </h3>
                <span className="text-sm text-muted-foreground">
                  {attendees.length} marked
                </span>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {attendees.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">Waiting for students to mark attendance...</p>
                  </div>
                ) : (
                  attendees.map((attendee, index) => (
                    <div
                      key={attendee.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl transition-all",
                        index === 0 ? "bg-secondary/10 border border-secondary/20" : "bg-muted/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                          {attendee.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{attendee.name}</p>
                          <p className="text-xs text-muted-foreground">{attendee.time}</p>
                        </div>
                      </div>
                      {attendee.status === "verified" ? (
                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && sessionActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="glass rounded-3xl p-8 max-w-lg w-full mx-4 glow-purple">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{section?.name}</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-muted/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Large QR Code */}
            <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-foreground rounded-2xl p-6 mb-6">
              <div className="w-full h-full grid grid-cols-12 gap-1">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-sm",
                      Math.random() > 0.5 ? "bg-background" : "bg-transparent"
                    )}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center">
                  <QrCode className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative h-20 w-20">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-muted/30"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={226}
                    strokeDashoffset={226 - (countdown / 30) * 226}
                    className="text-primary transition-all"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{countdown}</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold">QR Code Expires</p>
                <p className="text-muted-foreground">Refreshes automatically</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-secondary">
                  {attendees.filter((a) => a.status === "verified").length}
                </p>
                <p className="text-sm text-muted-foreground">Present</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {section ? Math.round((attendees.filter((a) => a.status === "verified").length / section.students) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
