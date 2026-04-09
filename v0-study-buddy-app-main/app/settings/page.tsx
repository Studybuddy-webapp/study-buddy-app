import { AppSidebar } from "@/components/app-sidebar"
import { SettingsContent } from "@/components/settings-content"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <SettingsContent />
      </main>
    </div>
  )
}
