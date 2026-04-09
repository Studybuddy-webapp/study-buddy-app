import { AppSidebar } from "@/components/app-sidebar"
import { ReviewPlanContent } from "@/components/review-plan-content"

export default function ReviewPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <ReviewPlanContent />
      </main>
    </div>
  )
}
