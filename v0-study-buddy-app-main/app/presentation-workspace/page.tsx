import { AppSidebar } from "@/components/app-sidebar"
import { PresentationWorkspaceContent } from "@/components/presentation-workspace-content"

export default function PresentationWorkspacePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <PresentationWorkspaceContent />
      </main>
    </div>
  )
}
