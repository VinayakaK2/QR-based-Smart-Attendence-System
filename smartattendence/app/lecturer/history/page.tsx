"use client"

import { useState } from "react"
import { Download, Search, Filter, Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const historyData = [
  { id: 1, date: "2024-03-15", course: "CS101 - Intro to Programming", section: "Section A", present: 45, total: 48, duration: "50 min" },
  { id: 2, date: "2024-03-15", course: "CS201 - Data Structures", section: "Section B", present: 38, total: 42, duration: "45 min" },
  { id: 3, date: "2024-03-14", course: "CS301 - Algorithms", section: "Section A", present: 33, total: 35, duration: "55 min" },
  { id: 4, date: "2024-03-14", course: "CS101 - Intro to Programming", section: "Section B", present: 42, total: 45, duration: "50 min" },
  { id: 5, date: "2024-03-13", course: "CS101 - Intro to Programming", section: "Section A", present: 46, total: 48, duration: "48 min" },
  { id: 6, date: "2024-03-13", course: "CS201 - Data Structures", section: "Section A", present: 40, total: 42, duration: "52 min" },
  { id: 7, date: "2024-03-12", course: "CS301 - Algorithms", section: "Section A", present: 32, total: 35, duration: "50 min" },
  { id: 8, date: "2024-03-12", course: "CS101 - Intro to Programming", section: "Section B", present: 44, total: 45, duration: "47 min" },
]

const filters = ["All Courses", "CS101", "CS201", "CS301"]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All Courses")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const filteredData = historyData.filter((item) => {
    const matchesSearch = item.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "All Courses" || item.course.includes(selectedFilter)
    return matchesSearch && matchesFilter
  })

  const handleExport = () => {
    // Create CSV content
    const headers = ["Date", "Course", "Section", "Present", "Total", "Rate", "Duration"]
    const rows = filteredData.map((item) => [
      item.date,
      item.course,
      item.section,
      item.present,
      item.total,
      `${Math.round((item.present / item.total) * 100)}%`,
      item.duration,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "attendance-history.csv"
    a.click()
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Session History</h1>
          <p className="text-muted-foreground mt-1">View and export your past attendance sessions</p>
        </div>
        <Button onClick={handleExport} className="bg-primary hover:bg-primary/90 glow-purple-sm">
          <Download className="mr-2 h-5 w-5" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-muted/30 border-border/50"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 h-12 px-4 glass rounded-xl hover:border-border/50 transition-all"
          >
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span>{selectedFilter}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {showFilterDropdown && (
            <div className="absolute top-full mt-2 w-48 glass rounded-xl p-2 z-10">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter)
                    setShowFilterDropdown(false)
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-lg transition-colors",
                    selectedFilter === filter
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-muted/50"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="flex items-center gap-2 h-12 px-4 glass rounded-xl hover:border-border/50 transition-all">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span>Date Range</span>
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30 bg-muted/20">
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Course</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Section</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Attendance</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Rate</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const rate = Math.round((item.present / item.total) * 100)
                return (
                  <tr key={item.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">{item.course}</td>
                    <td className="py-4 px-6 text-muted-foreground">{item.section}</td>
                    <td className="py-4 px-6">
                      <span className="text-secondary font-medium">{item.present}</span>
                      <span className="text-muted-foreground">/{item.total}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              rate >= 90 ? "bg-secondary" : rate >= 70 ? "bg-primary" : "bg-destructive"
                            )}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className={cn(
                          "font-medium",
                          rate >= 90 ? "text-secondary" : rate >= 70 ? "text-primary" : "text-destructive"
                        )}>
                          {rate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{item.duration}</td>
                    <td className="py-4 px-6">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sessions found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {historyData.length} sessions
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-primary/20 border-primary/30">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
