import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ReviewPlanContent } from "@/components/review-plan-content"

function ReviewPlanInner() {
  return <ReviewPlanContent />
}

export default function ReviewPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <Suspense fallback={<div>Loading...</div>}>
          <ReviewPlanInner />
        </Suspense>
      </main>
    </div>
  )
}