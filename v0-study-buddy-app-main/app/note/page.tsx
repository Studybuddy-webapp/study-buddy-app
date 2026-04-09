import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { NoteContent } from "@/components/note-content"

function NoteInner() {
  return <NoteContent />
}

export default function NotePage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="pl-64">
        <Suspense fallback={<div>Loading...</div>}>
          <NoteInner />
        </Suspense>
      </main>
    </div>
  )
}