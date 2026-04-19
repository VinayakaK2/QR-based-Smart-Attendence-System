import { LecturerSidebar } from "@/components/dashboard/lecturer-sidebar"

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <LecturerSidebar />
      <main className="pl-20 lg:pl-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
