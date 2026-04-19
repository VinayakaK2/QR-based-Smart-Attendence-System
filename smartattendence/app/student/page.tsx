"use client"

import Link from "next/link"
import {
  QrCode,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Flame,
  Calendar,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Total Classes", value: "48", icon: Calendar, color: "primary" },
  { label: "Present", value: "45", icon: CheckCircle2, color: "secondary" },
  { label: "Absent", value: "3", icon: XCircle, color: "destructive" },
  { label: "Attendance Rate", value: "94%", icon: TrendingUp, color: "primary" },
]

const recentAttendance = [
  { id: 1, course: "CS101 - Intro to Programming", date: "Today, 10:02 AM", status: "present" },
  { id: 2, course: "CS201 - Data Structures", date: "Today, 11:35 AM", status: "present" },
  { id: 3, course: "CS301 - Algorithms", date: "Yesterday, 2:00 PM", status: "present" },
  { id: 4, course: "CS101 - Intro to Programming", date: "Mar 13, 10:00 AM", status: "present" },
  { id: 5, course: "CS201 - Data Structures", date: "Mar 12, 11:30 AM", status: "absent" },
]

// Generate heatmap data for the calendar
const generateHeatmapData = () => {
  const data: { date: string; value: number }[] = []
  const today = new Date()

  for (let i = 0; i < 90; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const value = Math.random() > 0.1 ? (Math.random() > 0.3 ? 2 : 1) : 0
    data.push({
      date: date.toISOString().split("T")[0],
      value,
    })
  }

  return data.reverse()
}

const heatmapData = generateHeatmapData()

export default function StudentDashboard() {
  const attendanceRate = 94
  const currentStreak = 14

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Profile Card */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl p-6 glow-purple-sm">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full bg-secondary/20 border-2 border-secondary/30 flex items-center justify-center text-3xl font-bold text-secondary">
                  EZ
                </div>
                {/* Attendance Ring */}
                <svg className="absolute inset-0 h-24 w-24 -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-muted/20"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={276}
                    strokeDashoffset={276 - (attendanceRate / 100) * 276}
                    className="text-secondary"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold">Emily Zhang</h2>
              <p className="text-muted-foreground">CS101 - Section A</p>

              {/* Attendance Rate */}
              <div className="mt-4 glass rounded-xl p-4 w-full">
                <p className="text-3xl font-bold text-secondary">{attendanceRate}%</p>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
              </div>

              {/* Streak Badge */}
              <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full">
                <Flame className="h-5 w-5 text-primary" />
                <span className="font-semibold">{currentStreak} Day Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className={cn(
                    "glass rounded-2xl p-5 group hover:scale-[1.02] transition-all",
                    stat.color === "primary"
                      ? "hover:glow-purple-sm"
                      : stat.color === "secondary"
                      ? "hover:glow-green-sm"
                      : ""
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center mb-3",
                      stat.color === "primary"
                        ? "bg-primary/20 border border-primary/30"
                        : stat.color === "secondary"
                        ? "bg-secondary/20 border border-secondary/30"
                        : "bg-destructive/20 border border-destructive/30"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        stat.color === "primary"
                          ? "text-primary"
                          : stat.color === "secondary"
                          ? "text-secondary"
                          : "text-destructive"
                      )}
                    />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              )
            })}
          </div>

          {/* Scan QR Button */}
          <Link href="/student/attendance">
            <Button className="w-full h-16 bg-primary hover:bg-primary/90 glow-purple text-lg group animate-pulse-glow">
              <QrCode className="mr-3 h-6 w-6" />
              Scan QR to Mark Attendance
              <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Heatmap and Recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance Heatmap */}
        <div className="lg:col-span-2 glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Attendance Heatmap
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="h-3 w-3 rounded-sm bg-muted/30" />
                <div className="h-3 w-3 rounded-sm bg-secondary/30" />
                <div className="h-3 w-3 rounded-sm bg-secondary/60" />
                <div className="h-3 w-3 rounded-sm bg-secondary" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-[600px]">
              {/* Weeks */}
              {Array.from({ length: 13 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {/* Days of week */}
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex
                    const data = heatmapData[dataIndex]

                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "h-4 w-4 rounded-sm transition-colors",
                          !data
                            ? "bg-transparent"
                            : data.value === 0
                            ? "bg-destructive/30"
                            : data.value === 1
                            ? "bg-secondary/40"
                            : "bg-secondary"
                        )}
                        title={data ? `${data.date}: ${data.value === 0 ? "Absent" : data.value === 1 ? "1 class" : "2 classes"}` : ""}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Month Labels */}
          <div className="flex justify-between mt-2 text-xs text-muted-foreground px-1">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="lg:col-span-1 glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Attendance</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/student/history">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {recentAttendance.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      item.status === "present"
                        ? "bg-secondary/20 border border-secondary/30"
                        : "bg-destructive/20 border border-destructive/30"
                    )}
                  >
                    {item.status === "present" ? (
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{item.course}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold text-primary">{currentStreak}</p>
          <p className="text-muted-foreground mt-1">Day Streak</p>
          <p className="text-xs text-secondary mt-2">Personal Best: 21 days</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold text-secondary">12</p>
          <p className="text-muted-foreground mt-1">Classes This Month</p>
          <p className="text-xs text-primary mt-2">+3 from last month</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold text-primary">#5</p>
          <p className="text-muted-foreground mt-1">Section Ranking</p>
          <p className="text-xs text-secondary mt-2">Top 10% of class</p>
        </div>
      </div>
    </div>
  )
}
