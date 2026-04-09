"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { 
  BookOpen, 
  Upload, 
  FileText, 
  FolderKanban, 
  Presentation, 
  GraduationCap, 
  File,
  Plus,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileType,
  FileImage,
  MoreHorizontal,
  Search,
  StickyNote,
  PenLine,
  FileUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { 
  getAssignmentsBySubjectAndSection, 
  getAssignmentCountsBySubject,
  typeToWorkspace,
  type Assignment 
} from "@/lib/assignments"

// Subject configuration
const subjectConfig: Record<string, { color: string; lightColor: string; textColor: string }> = {
  biology: { color: "bg-emerald-500", lightColor: "bg-emerald-50", textColor: "text-emerald-600" },
  english: { color: "bg-rose-500", lightColor: "bg-rose-50", textColor: "text-rose-600" },
  history: { color: "bg-amber-500", lightColor: "bg-amber-50", textColor: "text-amber-600" },
  science: { color: "bg-emerald-500", lightColor: "bg-emerald-50", textColor: "text-emerald-600" },
  maths: { color: "bg-blue-500", lightColor: "bg-blue-50", textColor: "text-blue-600" },
  geography: { color: "bg-cyan-500", lightColor: "bg-cyan-50", textColor: "text-cyan-600" },
  art: { color: "bg-pink-500", lightColor: "bg-pink-50", textColor: "text-pink-600" },
  music: { color: "bg-orange-500", lightColor: "bg-orange-50", textColor: "text-orange-600" },
  other: { color: "bg-slate-500", lightColor: "bg-slate-50", textColor: "text-slate-600" },
}

// Sample notes data (static for now)
const studyNotes = [
  { 
    id: "cell-division-summary", 
    title: "Cell Division Summary", 
    excerpt: "Mitosis and meiosis are two types of cell division. Mitosis produces two identical daughter cells...",
    lastEdited: "Today, 2:30 PM",
    type: "Class Notes",
    icon: PenLine
  },
  { 
    id: "genetics-chapter-5", 
    title: "Genetics - Chapter 5 Notes", 
    excerpt: "DNA replication is semiconservative. Each strand serves as a template for a new complementary strand...",
    lastEdited: "Yesterday",
    type: "Revision Notes",
    icon: StickyNote
  },
]

// Sample files data (static for now)
const files = [
  { id: 1, name: "Biology Lecture Slides.pdf", type: "pdf", size: "2.4 MB", date: "Mar 1" },
  { id: 2, name: "DNA Study Guide.pdf", type: "pdf", size: "1.1 MB", date: "Feb 28" },
  { id: 3, name: "Class Worksheet.png", type: "image", size: "850 KB", date: "Feb 25" },
]

// Type badge colors
const typeBadgeColors: Record<string, string> = {
  essay: "bg-blue-50 text-blue-600",
  report: "bg-indigo-50 text-indigo-600",
  project: "bg-violet-50 text-violet-600",
  "group project": "bg-purple-50 text-purple-600",
  presentation: "bg-amber-50 text-amber-600",
  speech: "bg-orange-50 text-orange-600",
  exam: "bg-rose-50 text-rose-600",
}

export function SubjectWorkspaceContent() {
  const searchParams = useSearchParams()
  const subjectParam = searchParams.get("subject") || "biology"
  const subjectName = subjectParam.charAt(0).toUpperCase() + subjectParam.slice(1)
  const config = subjectConfig[subjectParam.toLowerCase()] || subjectConfig.other

  const [activeSection, setActiveSection] = useState("notes")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Dynamic data from assignments store
  const [sectionCounts, setSectionCounts] = useState({ assignments: 0, projects: 0, presentations: 0, exams: 0 })
  const [sectionItems, setSectionItems] = useState<Assignment[]>([])

  // Load counts on mount and when subject changes
  useEffect(() => {
    const counts = getAssignmentCountsBySubject(subjectParam)
    setSectionCounts(counts)
  }, [subjectParam])

  // Load items when section changes
  useEffect(() => {
    if (activeSection === "notes" || activeSection === "files") {
      setSectionItems([])
    } else {
      const items = getAssignmentsBySubjectAndSection(subjectParam, activeSection)
      setSectionItems(items)
    }
  }, [activeSection, subjectParam])

  // Navigation sections with dynamic counts
  const sections = [
    { id: "notes", name: "Study Notes", icon: FileText, count: studyNotes.length },
    { id: "assignments", name: "Assignments", icon: FolderKanban, count: sectionCounts.assignments },
    { id: "projects", name: "Projects", icon: FolderKanban, count: sectionCounts.projects },
    { id: "presentations", name: "Presentations", icon: Presentation, count: sectionCounts.presentations },
    { id: "exams", name: "Exams", icon: GraduationCap, count: sectionCounts.exams },
    { id: "files", name: "Files", icon: File, count: files.length },
  ]

  // Filter notes based on search
  const filteredNotes = studyNotes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get workspace route for an assignment
  const getWorkspaceRoute = (assignment: Assignment) => {
    const typeKey = assignment.type.toLowerCase()
    const basePath = typeToWorkspace[typeKey] || "/assignment-workspace"
    return `${basePath}?id=${assignment.id}`
  }

  // Format due date
  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Render empty state for a section
  const renderEmptyState = (sectionName: string, sectionId: string) => (
    <Card className="border-0 bg-white shadow-sm rounded-2xl">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground">No {sectionName.toLowerCase()} yet</h3>
        <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
          Add your first {sectionId === "exams" ? "exam" : sectionId.slice(0, -1)} to start tracking your progress
        </p>
        <Button asChild className="mt-4 gap-2 rounded-xl">
          <Link href="/add-schoolwork">
            <Plus className="h-4 w-4" />
            Add {sectionId === "exams" ? "Exam" : sectionName.slice(0, -1)}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )

  // Render assignment/project/presentation/exam items
  const renderSectionItems = (sectionName: string, sectionId: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-foreground">{sectionName}</h2>
        <Button asChild size="sm" variant="outline" className="gap-2 rounded-lg">
          <Link href="/add-schoolwork">
            <Plus className="h-4 w-4" />
            Add {sectionId === "exams" ? "Exam" : sectionName.slice(0, -1)}
          </Link>
        </Button>
      </div>
      
      {sectionItems.length === 0 ? (
        renderEmptyState(sectionName, sectionId)
      ) : (
        <div className="grid gap-4">
          {sectionItems.map((item) => (
            <Link 
              key={item.id} 
              href={getWorkspaceRoute(item)}
              className="block"
            >
              <Card className="border-0 bg-white shadow-sm rounded-2xl hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <span className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          typeBadgeColors[item.type.toLowerCase()] || "bg-slate-50 text-slate-600"
                        )}>
                          {item.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Due {formatDueDate(item.dueDate)}
                        </span>
                        <span>•</span>
                        <span>{item.progress === 0 ? "Not started" : item.progress === 100 ? "Complete" : "In progress"}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={item.progress} className="h-2 flex-1" />
                        <span className="text-xs font-medium text-muted-foreground">{item.progress}%</span>
                      </div>
                    </div>
                    <Button className="gap-2 rounded-xl ml-6">
                      Continue Task
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-violet-50/50">
      {/* Back Navigation */}
      <div className="px-6 pt-4 pb-2">
        <Link 
          href="/workspace"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workspace
        </Link>
      </div>
      
      {/* Full-Width Header */}
      <header className="border-b border-border/30 bg-white/80 backdrop-blur-sm px-8 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${config.color} shadow-lg`}>
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{subjectName}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Your study notebook for this subject</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{studyNotes.length} notes</span>
              <span className="text-border">•</span>
              <span>{sectionCounts.assignments + sectionCounts.projects + sectionCounts.presentations} tasks</span>
              <span className="text-border">•</span>
              <span>{sectionCounts.exams} exam{sectionCounts.exams !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="flex">
        {/* Left Column - Subject Navigation */}
        <aside className="w-64 shrink-0 border-r border-border/30 bg-white/50 min-h-[calc(100vh-5rem)]">
          <nav className="p-4 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all",
                  activeSection === section.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <section.icon className={cn("h-4 w-4", activeSection === section.id && "text-primary")} />
                  {section.name}
                </div>
                <span className={cn(
                  "text-xs",
                  activeSection === section.id ? "text-primary" : "text-muted-foreground/60"
                )}>
                  ({section.count})
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Column - Workspace Area */}
        <main className="flex-1 p-6">
          {/* Notes Library Section */}
          {activeSection === "notes" && (
            <div className="space-y-5">
              {/* Header with Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Study Notes</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{studyNotes.length} notes in {subjectName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
                    />
                    <Button variant="outline" className="gap-2 rounded-xl" asChild>
                      <span>
                        <Upload className="h-4 w-4" />
                        Upload File
                      </span>
                    </Button>
                  </label>
                  <Button asChild className="gap-2 rounded-xl">
                    <Link href={`/note?subject=${subjectParam}&new=true`}>
                      <Plus className="h-4 w-4" />
                      Create New Note
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-border/50 bg-white"
                />
              </div>

              {/* Notes Grid */}
              <div className="grid gap-4">
                {filteredNotes.map((note) => {
                  const NoteIcon = note.icon
                  return (
                    <Link 
                      key={note.id} 
                      href={`/note?subject=${subjectParam}&id=${note.id}`}
                      className="block"
                    >
                      <Card className="border-0 bg-white shadow-sm rounded-2xl hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            {/* Note Icon */}
                            <div className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                              note.type === "Uploaded File" ? "bg-amber-50" : "bg-primary/10"
                            )}>
                              <NoteIcon className={cn(
                                "h-5 w-5",
                                note.type === "Uploaded File" ? "text-amber-600" : "text-primary"
                              )} />
                            </div>
                            
                            {/* Note Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-semibold text-foreground">{note.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{note.excerpt}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 rounded-lg" onClick={(e) => e.preventDefault()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {/* Meta Info */}
                              <div className="flex items-center gap-3 mt-3">
                                <span className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                                  note.type === "Class Notes" && "bg-blue-50 text-blue-600",
                                  note.type === "Revision Notes" && "bg-violet-50 text-violet-600",
                                  note.type === "Uploaded File" && "bg-amber-50 text-amber-600"
                                )}>
                                  {note.type}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {note.lastEdited}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>

              {/* Empty State */}
              {filteredNotes.length === 0 && (
                <Card className="border-0 bg-white shadow-sm rounded-2xl">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mb-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">No notes found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchQuery ? "Try a different search term" : "Create your first note to get started"}
                    </p>
                    {!searchQuery && (
                      <Button asChild className="mt-4 gap-2 rounded-xl">
                        <Link href={`/note?subject=${subjectParam}&new=true`}>
                          <Plus className="h-4 w-4" />
                          Create New Note
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Assignments Section */}
          {activeSection === "assignments" && renderSectionItems("Assignments", "assignments")}

          {/* Projects Section */}
          {activeSection === "projects" && renderSectionItems("Projects", "projects")}

          {/* Presentations Section */}
          {activeSection === "presentations" && renderSectionItems("Presentations", "presentations")}

          {/* Exams Section */}
          {activeSection === "exams" && renderSectionItems("Exams", "exams")}

          {/* Files Section */}
          {activeSection === "files" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-foreground">Files</h2>
                <label>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
                    multiple
                  />
                  <Button size="sm" variant="outline" className="gap-2 rounded-lg cursor-pointer" asChild>
                    <span>
                      <Upload className="h-4 w-4" />
                      Upload Files
                    </span>
                  </Button>
                </label>
              </div>
              
              {files.length === 0 ? (
                <Card className="border-0 bg-white shadow-sm rounded-2xl">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mb-4">
                      <File className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">No files yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">Upload files to keep everything in one place</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 bg-white shadow-sm rounded-2xl">
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/30">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl",
                              file.type === "pdf" && "bg-rose-50",
                              file.type === "doc" && "bg-blue-50",
                              file.type === "image" && "bg-emerald-50"
                            )}>
                              {file.type === "pdf" && <FileType className="h-5 w-5 text-rose-500" />}
                              {file.type === "doc" && <FileText className="h-5 w-5 text-blue-500" />}
                              {file.type === "image" && <FileImage className="h-5 w-5 text-emerald-500" />}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
