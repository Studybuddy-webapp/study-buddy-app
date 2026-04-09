import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { TypeReviewPlanContent } from "@/components/type-review-plan-content"

function PresentationReviewPlanInner() {
  return <TypeReviewPlanContent planType="presentation" />
}

export default function PresentationReviewPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <Suspense fallback={<div>Loading...</div>}>
          <PresentationReviewPlanInner />
        </Suspense>
      </main>
    </div>
  )
}