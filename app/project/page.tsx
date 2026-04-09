import { AppSidebar } from "@/components/app-sidebar"
import { ProjectContent } from "@/components/project-content"

export default function ProjectPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <ProjectContent />
      </main>
    </div>
  )
}
