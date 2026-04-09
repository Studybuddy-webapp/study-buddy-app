import { AppSidebar } from "@/components/app-sidebar"
import { TypeReviewPlanContent } from "@/components/type-review-plan-content"

export default function ExamReviewPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <TypeReviewPlanContent planType="exam" />
      </main>
    </div>
  )
}
