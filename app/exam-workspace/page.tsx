import { AppSidebar } from "@/components/app-sidebar"
import { ExamWorkspaceContent } from "@/components/exam-workspace-content"

export default function ExamWorkspacePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <ExamWorkspaceContent />
      </main>
    </div>
  )
}
