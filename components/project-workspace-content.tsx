"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ChevronDown,
  ChevronRight,
  FileText,
  Calendar,
  Lightbulb,
  BookOpen,
  Sparkles,
  Search,
  Palette,
  Hammer,
  PenTool,
  ArrowLeft,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Project data
const projectData = {
  title: "Sustainable City Project",
  subject: "Science",
  dueDate: "Friday, March 22",
  daysLeft: 8,
  requirements: [
    "Model of a sustainable city",
    "Energy systems explanation",
    "Transport solutions",
    "Written explanation of design choices"
  ]
}

// Phase definitions with tasks - the 5-phase model
const projectPhases = [
  {
    id: "understand",
    label: "Understand",
    icon: BookOpen,
    description: "Make sure you understand what you need to do",
    tasks: [
      { id: "u1", question: "What is the main goal of this project?", placeholder: "In my own words, this project is about..." },
      { id: "u2", question: "What does 'sustainable' mean for a city?", placeholder: "Sustainable means..." },
      { id: "u3", question: "What will my finished project look like?", placeholder: "My finished project will include..." },
    ]
  },
  {
    id: "research",
    label: "Research",
    icon: Search,
    description: "Find information to help with your project",
    tasks: [
      { id: "r1", question: "What are some examples of sustainable cities?", placeholder: "Some examples I found are..." },
      { id: "r2", question: "What types of renewable energy could a city use?", placeholder: "Types of renewable energy include..." },
      { id: "r3", question: "How can transport be made sustainable?", placeholder: "Sustainable transport options are..." },
      { id: "r4", question: "What other features make a city sustainable?", placeholder: "Other sustainable features are..." },
    ]
  },
  {
    id: "design",
    label: "Design",
    icon: Palette,
    description: "Plan what your project will include",
    tasks: [
      { id: "d1", question: "What kind of city will you design?", placeholder: "My city will be..." },
      { id: "d2", question: "What energy systems will your city have?", placeholder: "My city will use..." },
      { id: "d3", question: "How will people get around in your city?", placeholder: "People in my city will travel by..." },
      { id: "d4", question: "What makes your city special or unique?", placeholder: "What makes my city special is..." },
    ]
  },
  {
    id: "create",
    label: "Create",
    icon: Hammer,
    description: "Build your project",
    tasks: [
      { id: "c1", question: "What materials will you use?", placeholder: "I will use..." },
      { id: "c2", question: "What have you built so far?", placeholder: "So far I have made..." },
      { id: "c3", question: "What still needs to be done?", placeholder: "I still need to..." },
      { id: "c4", question: "How does your model show sustainability?", placeholder: "My model shows sustainability because..." },
    ]
  },
  {
    id: "writeup",
    label: "Write up",
    icon: PenTool,
    description: "Explain your project",
    tasks: [
      { id: "w1", question: "Introduction: What is your project about?", placeholder: "My project is about..." },
      { id: "w2", question: "Design choices: Why did you make these decisions?", placeholder: "I chose these designs because..." },
      { id: "w3", question: "How does your city address sustainability?", placeholder: "My city is sustainable because..." },
      { id: "w4", question: "Conclusion: What did you learn?", placeholder: "From this project I learned..." },
    ]
  },
]

export function ProjectWorkspaceContent() {
  // Current phase index
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  
  // Task notes - stores all student inputs
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({})
  
  // Expanded tasks - start with first task expanded
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({
    "u1": true
  })
  
  // Completed tasks
  const [completedTasks, setCompletedTasks] = useState<string[]>([])

  // Current phase
  const currentPhase = projectPhases[currentPhaseIndex]

  // Update task note
  const updateTaskNote = (taskId: string, value: string) => {
    setTaskNotes(prev => ({ ...prev, [taskId]: value }))
  }

  // Toggle task expansion
  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  // Mark task complete
  const toggleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  // Calculate progress
  const totalTasks = projectPhases.reduce((sum, phase) => sum + phase.tasks.length, 0)
  const completedCount = completedTasks.length
  const progressPercent = Math.round((completedCount / totalTasks) * 100)

  // Get phase completion count
  const getPhaseCompletedCount = (phase: typeof projectPhases[0]) => {
    return phase.tasks.filter(t => completedTasks.includes(t.id)).length
  }

  // Go to next phase
  const goToNextPhase = () => {
    if (currentPhaseIndex < projectPhases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1)
      // Expand first task of new phase
      const nextPhase = projectPhases[currentPhaseIndex + 1]
      if (nextPhase.tasks[0]) {
        setExpandedTasks(prev => ({ ...prev, [nextPhase.tasks[0].id]: true }))
      }
    }
  }

  // Go to previous phase
  const goToPreviousPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(prev => prev - 1)
    }
  }

  // Collect all notes for write-up phase
  const getAllNotes = () => {
    return projectPhases.slice(0, -1).flatMap(phase => 
      phase.tasks.map(task => ({
        question: task.question,
        note: taskNotes[task.id] || ""
      })).filter(t => t.note.trim())
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-violet-50/60">
      {/* Back Navigation */}
      <div className="shrink-0 px-6 pt-4 pb-2">
        <Link 
          href={`/subject-workspace?subject=${projectData.subject.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {projectData.subject}
        </Link>
      </div>
      
      {/* Header */}
      <header className="shrink-0 border-b border-border/30 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{projectData.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Due: {projectData.dueDate}
              </span>
              <span className="text-muted-foreground">
                {projectData.daysLeft} days left
              </span>
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold text-primary">{progressPercent}%</p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${progressPercent * 2.51} 251`}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-foreground">{completedCount}/{totalTasks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Progress Tracker */}
        <div className="px-8 pb-4">
          <div className="flex items-center gap-2">
            {projectPhases.map((phase, index) => {
              const PhaseIcon = phase.icon
              const isActive = index === currentPhaseIndex
              const isComplete = getPhaseCompletedCount(phase) === phase.tasks.length
              
              return (
                <button
                  key={phase.id}
                  onClick={() => setCurrentPhaseIndex(index)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
                    isActive 
                      ? "bg-primary text-white shadow-md" 
                      : isComplete
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <PhaseIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{phase.label}</span>
                  {isComplete && <CheckCircle2 className="w-4 h-4" />}
                  {!isComplete && (
                    <span className="text-xs opacity-70">
                      {getPhaseCompletedCount(phase)}/{phase.tasks.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Phase Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Phase Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <currentPhase.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{currentPhase.label}</h2>
                  <p className="text-sm text-muted-foreground">{currentPhase.description}</p>
                </div>
              </div>
            </div>

            {/* Write-up phase special view */}
            {currentPhase.id === "writeup" && (
              <Card className="border-primary/20 bg-primary/5 rounded-xl mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-primary mb-1">Your notes will become your write-up</p>
                      <p className="text-xs text-muted-foreground">
                        Use the notes you made in earlier phases to help you write your explanation. 
                        You&apos;ve captured {getAllNotes().length} notes so far!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tasks */}
            <div className="space-y-3">
              {currentPhase.tasks.map((task, taskIndex) => {
                const isExpanded = expandedTasks[task.id]
                const isCompleted = completedTasks.includes(task.id)
                const hasNote = taskNotes[task.id]?.trim()

                return (
                  <Card 
                    key={task.id}
                    className={cn(
                      "rounded-xl transition-all",
                      isExpanded ? "ring-2 ring-primary/20" : "",
                      isCompleted ? "bg-emerald-50/50" : "bg-white"
                    )}
                  >
                    <CardContent className="p-0">
                      {/* Task Header */}
                      <button
                        onClick={() => toggleTaskExpanded(task.id)}
                        className="w-full flex items-center gap-3 p-4 text-left"
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                          isCompleted 
                            ? "bg-emerald-500 text-white"
                            : hasNote
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                        )}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-medium">{taskIndex + 1}</span>
                          )}
                        </div>
                        <span className={cn(
                          "flex-1 font-medium",
                          isCompleted ? "text-muted-foreground" : "text-foreground"
                        )}>
                          {task.question}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>

                      {/* Task Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="pl-9">
                            {/* Note Input */}
                            <Textarea
                              value={taskNotes[task.id] || ""}
                              onChange={(e) => updateTaskNote(task.id, e.target.value)}
                              placeholder={task.placeholder}
                              className="min-h-[100px] rounded-xl border-border/50 resize-none mb-3"
                            />

                            {/* Show previous notes in write-up phase */}
                            {currentPhase.id === "writeup" && taskIndex < 2 && getAllNotes().length > 0 && (
                              <div className="mb-3 p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                                  <Lightbulb className="w-3 h-3 text-amber-500" />
                                  Notes from earlier:
                                </p>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                  {getAllNotes().slice(0, 3).map((note, idx) => (
                                    <p key={idx}>• {note.note.slice(0, 100)}{note.note.length > 100 ? "..." : ""}</p>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Mark Complete Button */}
                            <Button
                              size="sm"
                              variant={isCompleted ? "outline" : "default"}
                              onClick={() => toggleTaskComplete(task.id)}
                              className="rounded-lg gap-2"
                            >
                              {isCompleted ? (
                                <>
                                  <Circle className="w-4 h-4" />
                                  Mark incomplete
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Mark complete
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Phase Navigation */}
            <div className="flex justify-between items-center mt-8">
              {currentPhaseIndex > 0 ? (
                <Button
                  variant="ghost"
                  onClick={goToPreviousPhase}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {projectPhases[currentPhaseIndex - 1].label}
                </Button>
              ) : (
                <div />
              )}

              {currentPhaseIndex < projectPhases.length - 1 ? (
                <Button
                  onClick={goToNextPhase}
                  className="rounded-xl gap-2 px-6 h-11 shadow-md"
                >
                  Next: {projectPhases[currentPhaseIndex + 1].label}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  className="rounded-xl gap-2 px-6 h-11 shadow-md bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Project
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Project Brief */}
        <div className="w-[320px] shrink-0 border-l border-border/20 bg-white/80 backdrop-blur-sm overflow-y-auto">
          <div className="p-6">
            <Card className="border-0 shadow-md bg-white rounded-2xl">
              <CardContent className="p-5">
                {/* Panel Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Project Brief</h3>
                </div>

                {/* Project Title */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-1">{projectData.title}</p>
                  <p className="text-xs text-muted-foreground">{projectData.subject}</p>
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Requirements</p>
                  <ul className="space-y-1.5">
                    {projectData.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Due Date */}
                <div className="pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Due {projectData.dueDate}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{projectData.daysLeft} days remaining</p>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-0 shadow-sm bg-amber-50/50 rounded-2xl mt-4">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 mb-1">Tip</p>
                    <p className="text-xs text-amber-700">
                      {currentPhase.id === "understand" && "Take time to really understand what you need to do before starting."}
                      {currentPhase.id === "research" && "Write down key facts and where you found them."}
                      {currentPhase.id === "design" && "Think about what makes your city unique and interesting."}
                      {currentPhase.id === "create" && "Check your requirements as you build to make sure you include everything."}
                      {currentPhase.id === "writeup" && "Use your notes from earlier phases to help explain your choices."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
