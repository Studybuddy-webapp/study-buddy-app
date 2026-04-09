"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { 
  ArrowLeft,
  Save,
  Upload,
  Sparkles,
  Clock,
  FileText,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  MoreHorizontal,
  Trash2,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Sample note data (would come from database in real app)
const notesData: Record<string, { title: string; content: string; lastEdited: string; type: string }> = {
  "cell-division-summary": {
    title: "Cell Division Summary",
    content: `Mitosis and meiosis are two types of cell division.

Mitosis:
• Produces two identical daughter cells
• Used for growth, repair, and asexual reproduction
• Maintains the same chromosome number
• Consists of prophase, metaphase, anaphase, and telophase

Meiosis:
• Produces four genetically different cells
• Used for sexual reproduction
• Reduces chromosome number by half
• Involves two divisions (Meiosis I and II)

Key differences:
1. Number of daughter cells produced
2. Genetic variation in offspring
3. Purpose in the organism`,
    lastEdited: "Today, 2:30 PM",
    type: "Class Notes"
  },
  "genetics-chapter-5": {
    title: "Genetics - Chapter 5 Notes",
    content: `DNA Replication

DNA replication is semiconservative. Each strand serves as a template for a new complementary strand.

Steps:
1. Helicase unwinds the double helix
2. Primase adds RNA primers
3. DNA polymerase III synthesizes new DNA strands
4. DNA polymerase I removes primers and fills gaps
5. Ligase seals the fragments

Leading strand: Synthesized continuously toward the replication fork
Lagging strand: Synthesized in Okazaki fragments away from the fork`,
    lastEdited: "Yesterday",
    type: "Revision Notes"
  }
}

export function NoteContent() {
  const searchParams = useSearchParams()
  const subject = searchParams.get("subject") || "biology"
  const noteId = searchParams.get("id")
  const isNew = searchParams.get("new") === "true"
  
  const existingNote = noteId ? notesData[noteId] : null
  
  const [isEditing, setIsEditing] = useState(isNew || false)
  const [title, setTitle] = useState(existingNote?.title || "")
  const [content, setContent] = useState(existingNote?.content || "")
  const [isSaving, setIsSaving] = useState(false)

  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate save
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
    }, 500)
  }

  const toolbarButtons = [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Underline, label: "Underline" },
    { divider: true },
    { icon: Heading1, label: "Heading 1" },
    { icon: Heading2, label: "Heading 2" },
    { divider: true },
    { icon: List, label: "Bullet List" },
    { icon: ListOrdered, label: "Numbered List" },
    { icon: Quote, label: "Quote" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-violet-50/50">
      {/* Breadcrumb Navigation */}
      <div className="px-6 pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-sm">
          <Link 
            href="/workspace"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Workspace
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <Link 
            href={`/subject-workspace?subject=${subject}`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {subjectName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <Link 
            href={`/subject-workspace?subject=${subject}`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Study Notes
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {isNew ? "New Note" : title || "Untitled"}
          </span>
        </nav>
      </div>

      {/* Header */}
      <header className="border-b border-border/30 bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4">
            <Link 
              href={`/subject-workspace?subject=${subject}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Notes
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {!isNew && existingNote && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Last edited: {existingNote.lastEdited}
              </span>
            )}
            
            <label className="cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
              <Button variant="outline" size="sm" className="gap-2 rounded-lg" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  Upload File
                </span>
              </Button>
            </label>
            
            {!isEditing && !isNew && (
              <Button size="sm" variant="outline" className="gap-2 rounded-lg" onClick={() => setIsEditing(true)}>
                <FileText className="h-4 w-4" />
                Edit Note
              </Button>
            )}
            
            {(isEditing || isNew) && (
              <Button size="sm" className="gap-2 rounded-lg" onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Main Editor */}
          <div className="flex-1">
            <Card className="border-0 bg-white shadow-lg shadow-black/5 rounded-2xl">
              {/* Title */}
              <CardHeader className="border-b border-border/30 pb-4">
                {isEditing || isNew ? (
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title..."
                    className="text-xl font-semibold border-0 p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  />
                ) : (
                  <CardTitle className="text-xl">{title}</CardTitle>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    existingNote?.type === "Class Notes" && "bg-blue-50 text-blue-600",
                    existingNote?.type === "Revision Notes" && "bg-violet-50 text-violet-600",
                    isNew && "bg-emerald-50 text-emerald-600"
                  )}>
                    {existingNote?.type || "New Note"}
                  </span>
                  <span className="text-xs text-muted-foreground">{subjectName}</span>
                </div>
              </CardHeader>
              
              {/* Editor Toolbar */}
              {(isEditing || isNew) && (
                <div className="flex items-center gap-1 border-b border-border/30 px-4 py-2">
                  {toolbarButtons.map((btn, i) => 
                    btn.divider ? (
                      <div key={i} className="w-px h-5 bg-border mx-1" />
                    ) : (
                      <Button key={i} variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <btn.icon className="h-4 w-4" />
                      </Button>
                    )
                  )}
                </div>
              )}
              
              {/* Content */}
              <CardContent className="p-6">
                {isEditing || isNew ? (
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your notes here..."
                    className="min-h-[500px] resize-none border-0 p-0 text-base leading-relaxed focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  />
                ) : (
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground leading-relaxed">
                    {content}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - AI Tools */}
          <aside className="w-72 shrink-0 space-y-4">
            {/* AI Study Tools */}
            <Card className="border-0 bg-white shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Study Buddy AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 rounded-xl text-sm h-10">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  Generate Study Path
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 rounded-xl text-sm h-10">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Summarise Notes
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 rounded-xl text-sm h-10">
                  <List className="h-4 w-4 text-emerald-500" />
                  Create Flashcards
                </Button>
              </CardContent>
            </Card>

            {/* Note Info */}
            {!isNew && existingNote && (
              <Card className="border-0 bg-white shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Note Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subject</span>
                    <span className="font-medium">{subjectName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{existingNote.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last edited</span>
                    <span className="font-medium">{existingNote.lastEdited}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Word count</span>
                    <span className="font-medium">{content.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card className="border-0 bg-white shadow-sm rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 rounded-xl text-sm h-10">
                  <Download className="h-4 w-4" />
                  Export as PDF
                </Button>
                {!isNew && (
                  <Button variant="outline" className="w-full justify-start gap-2 rounded-xl text-sm h-10 text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                    <Trash2 className="h-4 w-4" />
                    Delete Note
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
