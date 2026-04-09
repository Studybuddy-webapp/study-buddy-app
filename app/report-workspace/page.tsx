import { AppSidebar } from "@/components/app-sidebar"
import { ReportWorkspaceContent } from "@/components/report-workspace-content"

export default function ReportWorkspacePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <ReportWorkspaceContent />
      </main>
    </div>
  )
}
