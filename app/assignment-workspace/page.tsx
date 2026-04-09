import { AppSidebar } from "@/components/app-sidebar"
import { AssignmentWorkspaceContent } from "@/components/assignment-workspace-content"

export default function AssignmentWorkspacePage() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 ml-64">
        <AssignmentWorkspaceContent />
      </main>
    </div>
  )
}
