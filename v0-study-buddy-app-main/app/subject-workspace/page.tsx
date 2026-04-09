import { AppSidebar } from "@/components/app-sidebar"
import { SubjectWorkspaceContent } from "@/components/subject-workspace-content"

export default function SubjectWorkspacePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <SubjectWorkspaceContent />
      </main>
    </div>
  )
}
