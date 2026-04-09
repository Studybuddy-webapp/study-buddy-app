import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { TypeReviewPlanContent } from "@/components/type-review-plan-content"

function ProjectReviewPlanInner() {
  return <TypeReviewPlanContent planType="project" />
}

export default function ProjectReviewPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectReviewPlanInner />
        </Suspense>
      </main>
    </div>
  )
}