"use client"

import { useState } from "react"
import { Search, Filter, Calendar, CheckCircle2, XCircle, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const historyData = [
  { id: 1, date: "2024-03-15", course: "CS101 - Intro to Programming", time: "10:02 AM", status: "present", verificationMethod: "QR + Face + GPS" },
  { id: 2, date: "2024-03-15", course: "CS201 - Data Structures", time: "11:35 AM", status: "present", verificationMethod: "QR + Face + GPS" },
  { id: 3, date: "2024-03-14", course: "CS301 - Algorithms", time: "2:05 PM", status: "present", verificationMethod: "QR + Face + GPS" },
  { id: 4, date: "2024-03-14", course: "CS101 - Intro to Programming", time: "10:00 AM", status: "present", verificationMethod: "QR + Face + GPS" },
  { id: 5, date: "2024-03-13", course: "CS201 - Data Structures", time: "-", status: "absent", verificationMethod: "-" },
  { id: 6, date: "2024-03-13", course: "CS101 - Intro to Programming", time: "10:01 AM", status: "present", verificationMethod: "QR + Face + GPS" },
  { id: 7, date: "2024-03-12", course: "CS301 - Algorithms", time: "2:03 PM", status: "present", verificationMethod: "QR + Face + GPS" },
  { id: 8, date: "2024-03-12", course: "CS101 - Intro to Programming", time: "10:05 AM", status: "present", verificationMethod: "QR + Face + GPS" },
]

const filters = ["All", "Present", "Absent"]

export default function StudentHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  const filteredData = historyData.filter((item) => {
    const matchesSearch = item.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "All" || item.status === selectedFilter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const presentCount = historyData.filter((h) => h.status === "present").length
  const totalCount = historyData.length

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Attendance History</h1>
        <p className="text-muted-foreground mt-1">View your complete attendance record</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold">{totalCount}</p>
          <p className="text-sm text-muted-foreground">Total Classes</p>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-secondary">{presentCount}</p>
          <p className="text-sm text-muted-foreground">Present</p>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">{Math.round((presentCount / totalCount) * 100)}%</p>
          <p className="text-sm text-muted-foreground">Rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
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
            <div className="absolute top-full mt-2 w-40 glass rounded-xl p-2 z-10">
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
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className={cn(
              "glass rounded-2xl p-5 transition-all hover:scale-[1.01]",
              item.status === "present" ? "hover:border-secondary/30" : "hover:border-destructive/30"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center",
                    item.status === "present"
                      ? "bg-secondary/20 border border-secondary/30"
                      : "bg-destructive/20 border border-destructive/30"
                  )}
                >
                  {item.status === "present" ? (
                    <CheckCircle2 className="h-6 w-6 text-secondary" />
                  ) : (
                    <XCircle className="h-6 w-6 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{item.course}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {item.time !== "-" && <span>at {item.time}</span>}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    item.status === "present"
                      ? "bg-secondary/20 text-secondary"
                      : "bg-destructive/20 text-destructive"
                  )}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
                {item.verificationMethod !== "-" && (
                  <p className="text-xs text-muted-foreground mt-2">{item.verificationMethod}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="text-center py-12 glass rounded-2xl">
            <p className="text-muted-foreground">No attendance records found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {historyData.length} records
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-primary/20 border-primary/30">
            1
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
