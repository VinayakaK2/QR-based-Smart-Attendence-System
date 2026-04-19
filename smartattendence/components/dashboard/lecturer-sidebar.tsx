"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  PlayCircle,
  History,
  Settings,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/lecturer", icon: LayoutDashboard, label: "Overview" },
  { href: "/lecturer/sections", icon: Users, label: "Sections" },
  { href: "/lecturer/session", icon: PlayCircle, label: "Live Session" },
  { href: "/lecturer/history", icon: History, label: "History" },
  { href: "/lecturer/settings", icon: Settings, label: "Settings" },
]

export function LecturerSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen glass-strong z-40 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/30">
          <Link href="/" className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold">
                Smart<span className="text-primary">Attend</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors",
              isCollapsed && "hidden"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                  isActive
                    ? "bg-primary/20 border border-primary/30 text-primary glow-purple-sm"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Button (when collapsed) */}
        {isCollapsed && (
          <div className="px-3 py-2">
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full h-10 rounded-xl flex items-center justify-center hover:bg-muted/50 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* User Section */}
        <div className="px-3 py-4 border-t border-border/30">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2",
              isCollapsed && "justify-center px-0"
            )}
          >
            <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
              JD
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Dr. John Doe</p>
                <p className="text-xs text-muted-foreground truncate">Computer Science</p>
              </div>
            )}
          </div>

          <Link
            href="/login"
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl mt-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all",
              isCollapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </Link>
        </div>
      </div>
    </aside>
  )
}
