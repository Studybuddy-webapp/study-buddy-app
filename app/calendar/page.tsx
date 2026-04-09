import { AppSidebar } from "@/components/app-sidebar"
import { CalendarContent } from "@/components/calendar-content"

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <CalendarContent />
      </main>
    </div>
  )
}
