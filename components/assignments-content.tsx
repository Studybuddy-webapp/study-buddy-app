"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plus, Globe, Calculator, FlaskConical, BookOpen, Presentation, GraduationCap, ChevronRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const workItems = [
  {
    id: 1,
    title: "World War II Essay",
    subject: "English",
    type: "assignments" as const,
    dueLabel: "Due Tuesday",
    dueUrgency: 2, // days until due (lower = more urgent)
    progress: 40,
    nextTask: "Write introduction paragraph",
    status: "due-soon" as const,
    color: "bg-rose-400",
    lightColor: "bg-rose-50",
    borderColor: "border-rose-100",
    textColor: "text-rose-600",
    icon: BookOpen,
    href: "/workspace",
  },
  {
    id: 2,
    title: "Maths Exam Study",
    subject: "Maths",
    type: "exams" as const,
    dueLabel: "Exam in 9 days",
    dueUrgency: 9,
    progress: 20,
    nextTask: "Practice algebra problems",
    status: "on-track" as const,
    color: "bg-blue-400",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-100",
    textColor: "text-blue-600",
    icon: Calculator,
    href: "/exam-workspace",
  },
  {
    id: 3,
    title: "History Project",
    subject: "History",
    type: "projects" as const,
    dueLabel: "Due Friday",
    dueUrgency: 5,
    progress: 60,
    nextTask: "Research key events",
    status: "on-track" as const,
    color: "bg-amber-400",
    lightColor: "bg-amber-50",
    borderColor: "border-amber-100",
    textColor: "text-amber-600",
    icon: Globe,
    href: "/project-workspace",
  },
  {
    id: 4,
    title: "Speech Presentation",
    subject: "English",
    type: "presentations" as const,
    dueLabel: "3 practice sessions left",
    dueUrgency: 4,
    progress: 45,
    nextTask: "Practice opening section",
    status: "needs-attention" as const,
    color: "bg-rose-400",
    lightColor: "bg-rose-50",
    borderColor: "border-rose-100",
    textColor: "text-rose-600",
    icon: Presentation,
    href: "/presentation-workspace",
  },
  {
    id: 5,
    title: "Cell Biology Reading",
    subject: "Science",
    type: "assignments" as const,
    dueLabel: "Due next Monday",
    dueUrgency: 7,
    progress: 25,
    nextTask: "Read chapter 5 and take notes",
    status: "on-track" as const,
    color: "bg-emerald-400",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    textColor: "text-emerald-600",
    icon: FlaskConical,
    href: "/workspace",
  },
  {
    id: 6,
    title: "Science Final Exam",
    subject: "Science",
    type: "exams" as const,
    dueLabel: "Exam in 3 weeks",
    dueUrgency: 21,
    progress: 10,
    nextTask: "Review unit 1 notes",
    status: "on-track" as const,
    color: "bg-emerald-400",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    textColor: "text-emerald-600",
    icon: GraduationCap,
    href: "/exam-workspace",
  },
  {
    id: 7,
    title: "Lab Report",
    subject: "Science",
    type: "assignments" as const,
    dueLabel: "Due Thursday",
    dueUrgency: 4,
    progress: 55,
    nextTask: "Write conclusion section",
    status: "on-track" as const,
    color: "bg-emerald-400",
    lightColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    textColor: "text-emerald-600",
    icon: FlaskConical,
    href: "/workspace",
  },
]

// Subject configuration with consistent colors
// English = red/rose, Science = green/emerald, History = yellow/amber, Maths = blue
const subjectConfig: Record<string, { color: string; lightColor: string; borderColor: string; textColor: string }> = {
  "English": { color: "bg-rose-400", lightColor: "bg-rose-50", borderColor: "border-rose-200", textColor: "text-rose-600" },
  "Maths": { color: "bg-blue-400", lightColor: "bg-blue-50", borderColor: "border-blue-200", textColor: "text-blue-600" },
  "Science": { color: "bg-emerald-400", lightColor: "bg-emerald-50", borderColor: "border-emerald-200", textColor: "text-emerald-600" },
  "History": { color: "bg-amber-400", lightColor: "bg-amber-50", borderColor: "border-amber-200", textColor: "text-amber-600" },
}

const statusConfig = {
  "on-track": { label: "On track", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  "due-soon": { label: "Due soon", className: "bg-amber-50 text-amber-700 border-amber-100" },
  "needs-attention": { label: "Needs attention", className: "bg-rose-50 text-rose-700 border-rose-100" },
}

export function AssignmentsContent() {
  // Group work items by subject
  const subjectGroups = useMemo(() => {
    const groups: Record<string, typeof workItems> = {}
    
    workItems.forEach(item => {
      if (!groups[item.subject]) {
        groups[item.subject] = []
      }
      groups[item.subject].push(item)
    })
    
    // Sort each subject's items by urgency
    Object.keys(groups).forEach(subject => {
      groups[subject].sort((a, b) => a.dueUrgency - b.dueUrgency)
    })
    
    return groups
  }, [])

  // Get sorted subjects with their most urgent due date
  const sortedSubjects = useMemo(() => {
    return Object.entries(subjectGroups)
      .map(([subject, items]) => ({
        subject,
        items,
        taskCount: items.length,
        mostUrgent: items[0], // First item after sorting is most urgent
        nextDueLabel: items[0].dueLabel,
      }))
      .sort((a, b) => a.mostUrgent.dueUrgency - b.mostUrgent.dueUrgency)
  }, [subjectGroups])

  // Storage key for localStorage
  const STORAGE_KEY = "study-buddy-workspace-expanded"

  // Initialize expanded state - all expanded by default on first visit
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(() => {
    // Default: all subjects expanded
    return new Set(sortedSubjects.map(s => s.subject))
  })

  // Track if we've loaded from storage
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false)

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setExpandedSubjects(new Set(parsed))
        }
      }
    } catch {
      // If localStorage fails, keep default (all expanded)
    }
    setHasLoadedFromStorage(true)
  }, [])

  // Save to localStorage whenever expanded state changes (after initial load)
  useEffect(() => {
    if (hasLoadedFromStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(expandedSubjects)))
      } catch {
        // Silently fail if localStorage is unavailable
      }
    }
  }, [expandedSubjects, hasLoadedFromStorage])

  const toggleSubject = (subject: string) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev)
      if (next.has(subject)) {
        next.delete(subject)
      } else {
        next.add(subject)
      }
      return next
    })
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-violet-50/50">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Workspace
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              All your work organised by subject
            </p>
          </div>

          {/* Subject Sections */}
          <div className="space-y-4">
            {sortedSubjects.map(({ subject, items, taskCount, nextDueLabel }) => {
              const isExpanded = expandedSubjects.has(subject)
              const config = subjectConfig[subject] || subjectConfig["English"]

              return (
                <div key={subject} className="space-y-3">
                  {/* Subject Header Row */}
                  <div
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200",
                      "bg-white/80 backdrop-blur-sm",
                      isExpanded ? "border-border/50 shadow-sm" : "border-border/30"
                    )}
                  >
                    {/* Left side: Clickable expand/collapse area */}
                    <button
                      onClick={() => toggleSubject(subject)}
                      className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity"
                    >
                      {/* Rotating Chevron */}
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0",
                        isExpanded ? "bg-primary/10" : "bg-muted/50"
                      )}>
                        <ChevronRight 
                          className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            isExpanded ? "rotate-90 text-primary" : "text-muted-foreground"
                          )} 
                        />
                      </div>

                      {/* Subject Color Indicator */}
                      <div className={cn(
                        "w-3 h-3 rounded-full shrink-0",
                        config.color
                      )} />
                      
                      {/* Subject Name */}
                      <span className="text-base font-semibold text-foreground">
                        {subject}
                      </span>
                      
                      {/* Task Count & Next Due */}
                      <span className="text-sm text-muted-foreground">
                        {taskCount} {taskCount === 1 ? "task" : "tasks"} • Next {nextDueLabel.toLowerCase()}
                      </span>
                    </button>

                    {/* Open Subject Workspace - Separate navigation action */}
                    <Link 
                      href={`/subject-workspace?subject=${subject.toLowerCase()}`}
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5 shrink-0 ml-4"
                    >
                      Open Subject
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Expanded Work Cards */}
                  {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-2">
                      {items.map((item) => {
                        const IconComponent = item.icon
                        const status = statusConfig[item.status]

                        return (
                          <Card 
                            key={item.id} 
                            className="border border-border/40 shadow-sm bg-white hover:shadow-md hover:border-border/60 transition-all duration-200 rounded-2xl overflow-hidden"
                          >
                            <CardContent className="p-5">
                              {/* Top Row: Icon + Status */}
                              <div className="flex items-start justify-between mb-4">
                                <div className={cn(
                                  "w-11 h-11 rounded-xl flex items-center justify-center",
                                  item.lightColor,
                                  "border",
                                  item.borderColor
                                )}>
                                  <IconComponent className={cn("w-5 h-5", item.textColor)} />
                                </div>
                                <span className={cn(
                                  "text-xs font-medium px-2.5 py-1 rounded-full border",
                                  status.className
                                )}>
                                  {status.label}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="font-semibold text-foreground text-base mb-1 leading-tight">
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground/80 mb-4">
                                {item.dueLabel}
                              </p>

                              {/* Progress Bar */}
                              <div className="flex items-center gap-3 mb-4">
                                <Progress value={item.progress} className="h-2 flex-1" />
                                <span className="text-sm font-medium text-muted-foreground w-10 text-right">
                                  {item.progress}%
                                </span>
                              </div>

                              {/* Next Task */}
                              <div className="mb-4">
                                <p className="text-xs text-muted-foreground mb-1">Next Task</p>
                                <p className="text-sm text-foreground leading-snug">
                                  {item.nextTask}
                                </p>
                              </div>

                              {/* Continue Task Button */}
                              <Button 
                                asChild
                                className="w-full rounded-xl h-10"
                              >
                                <Link href={item.href}>
                                  Continue Task
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
