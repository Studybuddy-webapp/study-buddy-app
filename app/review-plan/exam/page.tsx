import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { TypeReviewPlanContent } from "@/components/type-review-plan-content"

function ExamReviewPlanInner() {
  return <TypeReviewPlanContent planType="exam" />
}

export default function ExamReviewPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <Suspense fallback={<div>Loading...</div>}>
          <ExamReviewPlanInner />
        </Suspense>
      </main>
    </div>
  )
}