"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  GripVertical,
  Pencil,
  Sparkles,
  HelpCircle
} from "lucide-react"
import Link from "next/link"
import { 
  getAssignment, 
  subjectColors, 
  updateAssignment, 
  plansByType,
  typeToWorkspace,
  type Assignment 
} from "@/lib/assignments"
import { cn } from "@/lib/utils"

interface TypeReviewPlanContentProps {
  planType: "essay" | "report" | "project" | "presentation" | "exam"
}

// Type-specific titles and descriptions
const typeConfig: Record<string, { title: string; subtitle: string; ctaText: string }> = {
  essay: {
    title: "Your Essay Plan",
    subtitle: "We've broken your essay into clear, manageable steps.",
    ctaText: "Start Writing"
  },
  report: {
    title: "Your Report Plan",
    subtitle: "Here's how we'll structure your report step by step.",
    ctaText: "Start Writing"
  },
  project: {
    title: "Your Project Plan",
    subtitle: "We've organised your project into clear phases.",
    ctaText: "Start Project"
  },
  presentation: {
    title: "Your Presentation Plan",
    subtitle: "Here's how to prepare and deliver a great presentation.",
    ctaText: "Start Creating"
  },
  exam: {
    title: "Your Study Plan",
    subtitle: "A structured approach to help you prepare effectively.",
    ctaText: "Start Studying"
  }
}

export function TypeReviewPlanContent({ planType }: TypeReviewPlanContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const assignmentId = searchParams.get("id")
  
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [steps, setSteps] = useState<{ title: string; description: string; time: string; completed: boolean; editing: boolean }[]>([])
  const [editingTitle, setEditingTitle] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (assignmentId) {
      const found = getAssignment(assignmentId)
      setAssignment(found)
      
      // Load steps from assignment or use type-specific defaults
      if (found) {
        const typeKey = found.type.toLowerCase()
        const defaultSteps = plansByType[typeKey] || plansByType.essay
        setSteps(defaultSteps.map(step => ({
          ...step,
          completed: false,
          editing: false
        })))
      }
    }
    setIsLoading(false)
  }, [assignmentId])

  // Toggle step completion
  const toggleStep = (index: number) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, completed: !step.completed } : step
    ))
  }

  // Start editing a step
  const startEditing = (index: number) => {
    setSteps(prev => prev.map((step, i) => ({
      ...step,
      editing: i === index
    })))
    setEditingTitle(steps[index].title)
  }

  // Save edited step
  const saveEdit = (index: number) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, title: editingTitle, editing: false } : step
    ))
  }

  // Cancel editing
  const cancelEdit = () => {
    setSteps(prev => prev.map(step => ({ ...step, editing: false })))
    setEditingTitle("")
  }

  // Handle drag start
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    
    const newSteps = [...steps]
    const draggedStep = newSteps[draggedIndex]
    newSteps.splice(draggedIndex, 1)
    newSteps.splice(index, 0, draggedStep)
    setSteps(newSteps)
    setDraggedIndex(index)
  }

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // Calculate total time
  const totalTime = steps.reduce((acc, step) => {
    const match = step.time.match(/(\d+)/)
    return acc + (match ? parseInt(match[1]) : 0)
  }, 0)

  // Start work
  const handleStartWork = () => {
    if (assignment) {
      updateAssignment(assignment.id, { progress: 5 })
      const workspaceRoute = typeToWorkspace[assignment.type.toLowerCase()] || "/assignment-workspace"
      router.push(`${workspaceRoute}?id=${assignment.id}`)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="min-h-full bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-violet-50/60 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!assignment) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="min-h-full bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-violet-50/60 flex items-center justify-center px-6">
          <Card className="border-0 shadow-lg bg-white rounded-2xl max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 mb-5">
                <AlertCircle className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No assignment found
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Please go back and add your school work again.
              </p>
              <Button asChild className="rounded-xl gap-2 px-6 h-11">
                <Link href="/add-schoolwork">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Add School Work
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Get config for this type
  const config = typeConfig[planType] || typeConfig.essay
  const subjectColor = subjectColors[assignment.subject.toLowerCase()] || "bg-slate-400"
  const subjectDisplay = assignment.subject.charAt(0).toUpperCase() + assignment.subject.slice(1)

  // Format due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { 
      weekday: "short",
      day: "numeric", 
      month: "short" 
    })
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-violet-50/60">
        <div className="max-w-3xl mx-auto px-6 py-8">
          
          {/* Back button */}
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/add-schoolwork">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>

          {/* Header Card */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${subjectColor} flex items-center justify-center shrink-0 shadow-sm`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                      {subjectDisplay}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full capitalize">
                      {assignment.type}
                    </span>
                  </div>
                  <h1 className="text-xl font-semibold text-foreground mb-1">
                    {assignment.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Due {formatDueDate(assignment.dueDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      ~{totalTime} min
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Title */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-1">{config.title}</h2>
            <p className="text-muted-foreground">{config.subtitle}</p>
          </div>

          {/* Steps List */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl mb-6">
            <CardContent className="p-4">
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "group flex items-start gap-3 p-4 rounded-xl transition-all cursor-grab active:cursor-grabbing",
                      step.completed ? "bg-emerald-50/50" : "bg-muted/30 hover:bg-muted/50",
                      draggedIndex === index && "opacity-50"
                    )}
                  >
                    {/* Drag handle */}
                    <GripVertical className="w-4 h-4 text-muted-foreground/40 mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Step number / checkbox */}
                    <button
                      onClick={() => toggleStep(index)}
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all",
                        step.completed 
                          ? "bg-emerald-500 text-white" 
                          : "bg-white border-2 border-muted-foreground/30 text-muted-foreground hover:border-primary"
                      )}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-semibold">{index + 1}</span>
                      )}
                    </button>
                    
                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      {step.editing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="h-8 text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(index)
                              if (e.key === "Escape") cancelEdit()
                            }}
                          />
                          <Button size="sm" onClick={() => saveEdit(index)} className="h-8">Save</Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-8">Cancel</Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "font-medium text-foreground",
                              step.completed && "line-through text-muted-foreground"
                            )}>
                              {step.title}
                            </p>
                            <button
                              onClick={() => startEditing(index)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
                            >
                              <Pencil className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                        </>
                      )}
                    </div>
                    
                    {/* Time estimate */}
                    <span className="text-xs font-medium text-muted-foreground bg-white px-2 py-1 rounded-lg shrink-0">
                      {step.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="border-0 shadow-sm bg-amber-50/50 border border-amber-200/50 rounded-2xl mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Need help with a step?</p>
                  <p className="text-sm text-muted-foreground">
                    You can edit any step by clicking the pencil icon, or drag steps to reorder them. Study Buddy will guide you through each step when you start.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <Button 
            onClick={handleStartWork}
            size="lg" 
            className="w-full h-12 rounded-xl gap-2 shadow-md shadow-primary/20 text-base font-semibold"
          >
            <Sparkles className="w-5 h-5" />
            {config.ctaText}
            <ArrowRight className="w-5 h-5" />
          </Button>
          
        </div>
      </div>
    </div>
  )
}
