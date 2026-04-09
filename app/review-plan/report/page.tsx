import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { TypeReviewPlanContent } from "@/components/type-review-plan-content"

function ReportReviewPlanInner() {
  return <TypeReviewPlanContent planType="report" />
}

export default function ReportReviewPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <Suspense fallback={<div>Loading...</div>}>
          <ReportReviewPlanInner />
        </Suspense>
      </main>
    </div>
  )
}