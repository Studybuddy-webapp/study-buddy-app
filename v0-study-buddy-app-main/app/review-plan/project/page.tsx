import { AppSidebar } from "@/components/app-sidebar"
import { ProjectReviewPlanContent } from "@/components/project-review-plan-content"

export default function ProjectReviewPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <ProjectReviewPlanContent />
      </main>
    </div>
  )
}
