"use client"

import { useState } from "react"
import Link from "next/link"
import {
  PlayCircle,
  Users,
  Clock,
  TrendingUp,
  Plus,
  ChevronRight,
  Calendar,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Total Students", value: "324", change: "+12%", icon: Users, color: "primary" },
  { label: "Active Sessions", value: "2", change: "Live", icon: PlayCircle, color: "secondary" },
  { label: "Avg. Attendance", value: "94%", change: "+3%", icon: TrendingUp, color: "primary" },
  { label: "Sessions Today", value: "5", change: "2 left", icon: Clock, color: "secondary" },
]

const recentSessions = [
  { id: 1, name: "CS101 - Intro to Programming", section: "Section A", attendance: 45, total: 48, time: "10:00 AM", status: "completed" },
  { id: 2, name: "CS201 - Data Structures", section: "Section B", attendance: 38, total: 42, time: "11:30 AM", status: "active" },
  { id: 3, name: "CS301 - Algorithms", section: "Section A", attendance: 0, total: 35, time: "2:00 PM", status: "upcoming" },
  { id: 4, name: "CS101 - Intro to Programming", section: "Section B", attendance: 42, total: 45, time: "Yesterday", status: "completed" },
]

const sections = [
  { id: 1, name: "CS101 - Section A", students: 48, avgAttendance: 96 },
  { id: 2, name: "CS101 - Section B", students: 45, avgAttendance: 92 },
  { id: 3, name: "CS201 - Section A", students: 42, avgAttendance: 88 },
  { id: 4, name: "CS301 - Section A", students: 35, avgAttendance: 94 },
]

export default function LecturerOverview() {
  const [activeSession, setActiveSession] = useState<number | null>(2)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, Dr. Doe</h1>
          <p className="text-muted-foreground mt-1">Here is an overview of your attendance data</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 glow-purple-sm group">
          <Link href="/lecturer/session">
            <Plus className="mr-2 h-5 w-5" />
            Start New Session
          </Link>
        </Button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stats Cards */}
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={cn(
                "glass rounded-2xl p-6 group hover:scale-[1.02] transition-all",
                stat.color === "primary" ? "hover:glow-purple-sm" : "hover:glow-green-sm"
              )}
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center",
                    stat.color === "primary"
                      ? "bg-primary/20 border border-primary/30"
                      : "bg-secondary/20 border border-secondary/30"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6",
                      stat.color === "primary" ? "text-primary" : "text-secondary"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    stat.change === "Live"
                      ? "bg-secondary/20 text-secondary"
                      : stat.change.startsWith("+")
                      ? "bg-secondary/20 text-secondary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </div>
          )
        })}

        {/* Active Session Card - Large */}
        <div className="md:col-span-2 glass rounded-2xl p-6 glow-purple-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
              Active Session
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/lecturer/session">
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {activeSession ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold">CS201 - Data Structures</h4>
                <p className="text-muted-foreground">Section B</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-secondary">38</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary">90%</p>
                  <p className="text-xs text-muted-foreground">Rate</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  End Session
                </Button>
                <Button variant="outline" className="flex-1">
                  View QR Code
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                <PlayCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No active session</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/lecturer/session">Start Session</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Quick Sections */}
        <div className="md:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Your Sections</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/lecturer/sections">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {sections.slice(0, 3).map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{section.name}</p>
                    <p className="text-sm text-muted-foreground">{section.students} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary">{section.avgAttendance}%</p>
                  <p className="text-xs text-muted-foreground">Avg. Attendance</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="md:col-span-2 lg:col-span-4 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Sessions</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/lecturer/history">
                View History
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Session</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Section</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Attendance</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr key={session.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium">{session.name}</p>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{session.section}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(session.attendance / session.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">
                          {session.attendance}/{session.total}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{session.time}</td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          session.status === "active"
                            ? "bg-secondary/20 text-secondary"
                            : session.status === "completed"
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/20 text-primary"
                        )}
                      >
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Overview Chart Placeholder */}
        <div className="md:col-span-2 lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Overview
            </h3>
          </div>
          <div className="h-48 flex items-center justify-center">
            <div className="flex items-end gap-3 h-full pt-8">
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
                const heights = [85, 92, 78, 95, 88]
                return (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <div
                      className="w-10 rounded-t-lg bg-gradient-to-t from-primary/50 to-primary transition-all hover:from-primary/70 hover:to-primary"
                      style={{ height: `${heights[i]}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{day}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="md:col-span-2 lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary" />
              Upcoming Today
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { time: "2:00 PM", name: "CS301 - Algorithms", section: "Section A" },
              { time: "4:00 PM", name: "CS101 - Lab", section: "Section C" },
            ].map((session, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/20">
                <div className="text-center">
                  <p className="text-lg font-bold">{session.time.split(" ")[0]}</p>
                  <p className="text-xs text-muted-foreground">{session.time.split(" ")[1]}</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <p className="font-medium">{session.name}</p>
                  <p className="text-sm text-muted-foreground">{session.section}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
