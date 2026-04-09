import { AppSidebar } from "@/components/app-sidebar"
import { StudyInsightsContent } from "@/components/study-insights-content"

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <StudyInsightsContent />
      </main>
    </div>
  )
}
