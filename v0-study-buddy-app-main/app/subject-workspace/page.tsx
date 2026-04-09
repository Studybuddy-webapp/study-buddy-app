import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SubjectWorkspaceContent } from "@/components/subject-workspace-content"

function SubjectWorkspaceInner() {
  return <SubjectWorkspaceContent />
}

export default function SubjectWorkspacePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <Suspense fallback={<div>Loading...</div>}>
          <SubjectWorkspaceInner />
        </Suspense>
      </main>
    </div>
  )
}