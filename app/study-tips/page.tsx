import { AppSidebar } from "@/components/app-sidebar"
import { StudyTipsContent } from "@/components/study-tips-content"

export default function StudyTipsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <StudyTipsContent />
      </main>
    </div>
  )
}
