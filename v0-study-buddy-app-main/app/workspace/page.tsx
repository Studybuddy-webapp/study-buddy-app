import { AppSidebar } from "@/components/app-sidebar"
import { AssignmentsContent } from "@/components/assignments-content"

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <AssignmentsContent />
      </main>
    </div>
  )
}
