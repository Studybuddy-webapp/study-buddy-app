"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Target, 
  Sparkles,
  ListChecks,
  Play,
  Pause,
  RotateCcw,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Lightbulb,
  BookOpen,
  MessageCircle,
  HelpCircle,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const requirements = [
  { id: 1, text: "1000-1200 words", checked: true },
  { id: 2, text: "Include 3 literary devices", checked: true },
  { id: 3, text: "Cite at least 5 quotes", checked: false },
  { id: 4, text: "MLA format with works cited", checked: false },
]

const studyPlanStages = [
  { 
    id: 1, 
    title: "Research", 
    status: "completed",
    tasks: [
      { text: "Find 3 sources about the American Dream", status: "completed" }
    ]
  },
  { 
    id: 2, 
    title: "Plan", 
    status: "completed",
    tasks: [
      { text: "Write thesis statement", status: "completed" }
    ]
  },
  { 
    id: 3, 
    title: "First Draft", 
    status: "current",
    tasks: [
      { text: "Write body paragraph 1", status: "current" },
      { text: "Write body paragraph 2", status: "current" },
      { text: "Write conclusion", status: "current" }
    ]
  },
  { 
    id: 4, 
    title: "Edit", 
    status: "upcoming",
    tasks: [
      { text: "Improve clarity", status: "upcoming" },
      { text: "Check citations", status: "upcoming" }
    ]
  },
]

const studyBuddyHelpers = [
  { icon: ListChecks, label: "Generate paragraph outline", color: "text-blue-600" },
  { icon: BookOpen, label: "Suggest supporting quotes", color: "text-emerald-600" },
  { icon: Sparkles, label: "Improve my paragraph", color: "text-violet-600" },
  { icon: HelpCircle, label: "Explain this topic", color: "text-amber-600" },
]

export function WorkspaceContent() {
  const [editorContent, setEditorContent] = useState(
    "The American Dream, as depicted in F. Scott Fitzgerald's The Great Gatsby, serves as both a beacon of hope and a destructive illusion. Through the tragic story of Jay Gatsby, Fitzgerald critiques the corruption of this ideal in the 1920s.\n\nGatsby's relentless pursuit of wealth and status, symbolized by the green light at the end of Daisy's dock, represents..."
  )
  const [focusTimer, setFocusTimer] = useState(25 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showHelper, setShowHelper] = useState(true)
  
  const wordCount = editorContent.split(/\s+/).filter(Boolean).length
  const progressPercent = 44

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleTaskClick = (taskText: string) => {
    // In a real app, this would scroll/navigate to the relevant section
    console.log("Navigate to:", taskText)
  }

return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Back Navigation */}
      <div className="shrink-0 px-6 pt-4 pb-2">
        <Link 
          href="/subject-workspace?subject=english"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to English
        </Link>
      </div>
      
      {/* Full-Width Assignment Header - spans across both left panel and editor */}
      <header className="shrink-0 border-b border-border/30 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">The Great Gatsby Essay</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Write body paragraphs</p>
            <div className="mt-2.5 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Due Mar 15
              </span>
              <span className="font-medium text-amber-600">5 days left</span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                Progress: <span className="font-semibold text-primary">{progressPercent}%</span>
              </span>
            </div>
          </div>
          
          {/* Focus Timer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-border/40">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-lg font-bold text-foreground">{formatTime(focusTimer)}</span>
              <span className="text-xs text-muted-foreground">Focus Session</span>
            </div>
            <Button 
              size="sm" 
              variant={isTimerRunning ? "secondary" : "default"}
              className="h-10 gap-2 rounded-xl px-4"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? (
                <><Pause className="h-4 w-4" /> Pause</>
              ) : (
                <><Play className="h-4 w-4" /> Start Focus</>
              )}
            </Button>
            <Button size="sm" variant="ghost" className="h-10 w-10 rounded-xl p-0" onClick={() => setFocusTimer(25 * 60)}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Two Columns below the header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Guidance */}
        <div className="flex w-[300px] shrink-0 flex-col border-r border-border/30 bg-white/60 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto p-5">
            {/* Requirements Section */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-600" />
                <h2 className="text-sm font-semibold text-foreground">Requirements</h2>
              </div>
              <div className="space-y-1">
                {requirements.map((req) => (
                  <div 
                    key={req.id} 
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all",
                      req.checked ? "bg-emerald-50/50" : "hover:bg-accent/40"
                    )}
                  >
                    {req.checked ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                    )}
                    <span className={cn(
                      "text-sm",
                      req.checked ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Plan Section */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Study Plan</h2>
              </div>
              <div className="space-y-3">
                {studyPlanStages.map((stage) => {
                  const isCompleted = stage.status === "completed"
                  const isCurrent = stage.status === "current"
                  
                  return (
                    <div key={stage.id} className={cn(
                      "rounded-xl p-3 transition-all",
                      isCurrent ? "bg-primary/5 ring-1 ring-primary/20" : ""
                    )}>
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {stage.id}
                        </span>
                        <span className={cn(
                          "text-sm font-semibold",
                          isCompleted ? "text-muted-foreground" : isCurrent ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {stage.title}
                        </span>
                        {isCurrent && (
                          <span className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="mt-2 ml-7 space-y-1.5">
                        {stage.tasks.map((task, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleTaskClick(task.text)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent/50",
                              task.status === "completed" && "text-muted-foreground"
                            )}
                          >
                            {task.status === "completed" ? (
                              <span className="text-emerald-500">&#10003;</span>
                            ) : task.status === "current" ? (
                              <span className="text-foreground">&#8226;</span>
                            ) : (
                              <span className="text-muted-foreground/50">&#9675;</span>
                            )}
                            <span className={cn(
                              task.status === "completed" && "line-through"
                            )}>
                              {task.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Study Buddy Help Section */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-foreground">Study Buddy Help</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {studyBuddyHelpers.map((helper, idx) => (
                  <button
                    key={idx}
                    className="flex flex-col items-center gap-2 rounded-xl bg-white p-3 text-center shadow-sm ring-1 ring-border/40 transition-all hover:shadow-md hover:ring-primary/30"
                  >
                    <helper.icon className={cn("h-5 w-5", helper.color)} />
                    <span className="text-xs font-medium text-foreground leading-tight">{helper.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex flex-1 flex-col">
          {/* Editor Toolbar */}
          <div className="flex items-center gap-1 border-b border-border/30 bg-white/40 px-8 py-2">
            <div className="flex items-center gap-0.5 rounded-lg bg-white p-1 shadow-sm ring-1 ring-border/40">
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-md p-0 hover:bg-accent">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-md p-0 hover:bg-accent">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-md p-0 hover:bg-accent">
                <Underline className="h-4 w-4" />
              </Button>
            </div>
            <div className="mx-1 h-6 w-px bg-border/40" />
            <div className="flex items-center gap-0.5 rounded-lg bg-white p-1 shadow-sm ring-1 ring-border/40">
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-md p-0 hover:bg-accent">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-md p-0 hover:bg-accent">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-md p-0 hover:bg-accent">
                <Quote className="h-4 w-4" />
              </Button>
            </div>
            <div className="mx-1 h-6 w-px bg-border/40" />
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-lg px-3 text-xs hover:bg-white">
              <FileText className="h-4 w-4" />
              Insert Citation
            </Button>
            
            <div className="ml-auto">
              <Button className="gap-2 rounded-xl font-semibold shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
                Mark Complete
              </Button>
            </div>
          </div>

          {/* Writing Canvas */}
          <div className="relative flex flex-1 justify-center overflow-y-auto p-8">
            <Card className="h-fit w-full max-w-4xl border-0 bg-white shadow-lg shadow-black/5">
              <CardContent className="p-0">
                <Textarea
                  placeholder="Start writing here..."
                  className="min-h-[600px] resize-none rounded-2xl border-0 px-12 py-10 text-base leading-relaxed shadow-none focus-visible:ring-0"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                />
              </CardContent>
            </Card>
            
            {/* Contextual Helper Card */}
            {showHelper && (
              <div className="absolute bottom-24 right-12 w-64 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="border-0 bg-white/95 shadow-lg shadow-black/10 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Need help?</span>
                      </div>
                      <button 
                        onClick={() => setShowHelper(false)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Dismiss
                      </button>
                    </div>
                    <p className="mb-3 text-xs text-muted-foreground">It looks like you paused. Would you like some guidance?</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button className="rounded-lg bg-accent/60 px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent">
                        Continue idea
                      </button>
                      <button className="rounded-lg bg-accent/60 px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent">
                        Find evidence
                      </button>
                      <button className="rounded-lg bg-accent/60 px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent">
                        Expand this
                      </button>
                      <button className="rounded-lg bg-accent/60 px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent">
                        Explain topic
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Bottom Status Bar */}
          <div className="flex items-center justify-between border-t border-border/30 bg-white/60 backdrop-blur-sm px-8 py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  wordCount >= 1000 ? "bg-emerald-500" : wordCount >= 500 ? "bg-amber-500" : "bg-muted-foreground/30"
                )} />
                <span className="text-sm font-semibold text-foreground">{wordCount} words</span>
                <Progress 
                  value={Math.min((wordCount / 1200) * 100, 100)} 
                  className="h-1.5 w-24"
                />
                <span className="text-xs text-muted-foreground">/ 1000-1200</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{Math.ceil(wordCount / 200)} min read</span>
              <span className="text-muted-foreground/40">|</span>
              <span>{editorContent.split(/\n\n+/).filter(Boolean).length} paragraphs</span>
              <span className="text-muted-foreground/40">|</span>
              <span className="text-emerald-600">Auto-saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
