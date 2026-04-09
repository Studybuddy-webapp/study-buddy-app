import { AppSidebar } from "@/components/app-sidebar"
import { ProjectWorkspaceContent } from "@/components/project-workspace-content"

export default function ProjectWorkspacePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <ProjectWorkspaceContent />
      </main>
    </div>
  )
}
