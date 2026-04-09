import { AppSidebar } from "@/components/app-sidebar"
import { WorkspaceContent } from "@/components/workspace-content"

export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <WorkspaceContent />
      </main>
    </div>
  )
}
