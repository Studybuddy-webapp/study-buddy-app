import { AppSidebar } from "@/components/app-sidebar"
import { AskStudyBuddyContent } from "@/components/ask-study-buddy-content"

export default function AskStudyBuddyPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <AskStudyBuddyContent />
      </main>
    </div>
  )
}
