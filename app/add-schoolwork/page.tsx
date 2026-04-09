import { AppSidebar } from "@/components/app-sidebar"
import { NewAssignmentContent } from "@/components/new-assignment-content"

export default function NewAssignmentPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <NewAssignmentContent />
      </main>
    </div>
  )
}
