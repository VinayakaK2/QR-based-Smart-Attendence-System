import { StudentSidebar } from "@/components/dashboard/student-sidebar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <main className="pl-20 lg:pl-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
