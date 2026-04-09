import { AppSidebar } from "@/components/app-sidebar"
import { ReportReviewPlanContent } from "@/components/report-review-plan-content"

export default function ReportReviewPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <ReportReviewPlanContent />
      </main>
    </div>
  )
}
