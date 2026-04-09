"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  BookOpen, 
  Calendar, 
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  X,
  Sparkles,
  Rocket,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { 
  getAssignment, 
  subjectColors, 
  updateAssignment, 
  typeToWorkspace,
  type Assignment 
} from "@/lib/assignments"
import { cn } from "@/lib/utils"

// Simplified 3-step flow
const steps = [
  { id: "understand", label: "Understand" },
  { id: "included", label: "What's Included" },
  { id: "start", label: "Start" },
]

export function ProjectReviewPlanContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const assignmentId = searchParams.get("id")
  
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  
  // Step 1: Understand
  const [understandConfirmed, setUnderstandConfirmed] = useState(false)
  const [showExample, setShowExample] = useState(false)
  
  // Right panel state
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

  useEffect(() => {
    if (assignmentId) {
      const found = getAssignment(assignmentId)
      setAssignment(found)
    }
    setIsLoading(false)
  }, [assignmentId])

  // Check if current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 0: return understandConfirmed
      case 1: return true // View step - can always proceed after viewing
      case 2: return true // Start step - can always proceed
      default: return false
    }
  }

  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Final step - save and navigate to project workspace
      if (assignment) {
        updateAssignment(assignment.id, {
          progress: 10,
        })
        const workspaceRoute = typeToWorkspace[assignment.type.toLowerCase()] || "/project-workspace"
        router.push(`${workspaceRoute}?id=${assignment.id}`)
      }
    }
  }

  // Handle back
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // CTA button text for each step
  const ctaText = [
    "Next: See what's included",
    "Next: Ready to start",
    "Start Project"
  ]

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
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-violet-50/60">
        <div className="px-6 py-8 max-w-2xl mx-auto lg:mx-0 lg:max-w-none lg:px-8">
        
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
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                    index < currentStep
                      ? "bg-emerald-500 text-white"
                      : index === currentStep
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1.5 font-medium",
                  index === currentStep ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-12 h-0.5 mx-3",
                  index < currentStep ? "bg-emerald-500" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-lg bg-white rounded-2xl mb-6">
          <CardContent className="p-6">
            
            {/* STEP 1: UNDERSTAND */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Understand Your Project</h2>
                  <p className="text-muted-foreground">
                    Make sure you know what you need to do.
                  </p>
                </div>

                {/* Project Overview Card */}
                <Card className="border border-primary/20 bg-primary/5 rounded-xl">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary mb-1">Project Overview</p>
                        <p className="text-xs text-muted-foreground">Here&apos;s what you need to know</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">What you&apos;re doing</p>
                        <p className="text-foreground font-medium">{assignment.title}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">What you need to create</p>
                        <p className="text-foreground">A project that shows your understanding of {assignment.subject.toLowerCase()} through research and creative work.</p>
                      </div>
                      
                      <div className="pt-3 border-t border-primary/10">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">What success looks like</p>
                        <p className="text-foreground">Someone can clearly understand your topic and see that you&apos;ve done proper research.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Example card */}
                {showExample && (
                  <Card className="border border-amber-200 bg-amber-50/50 rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">Example Project</span>
                        </div>
                        <button onClick={() => setShowExample(false)} className="text-amber-600 hover:text-amber-800">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-xs font-medium text-amber-700 mb-0.5">Project:</p>
                          <p className="text-amber-900">&quot;Design a Sustainable City&quot;</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-amber-700 mb-0.5">What they created:</p>
                          <p className="text-amber-900">A model city showing sustainable features with written explanations</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-amber-700 mb-0.5">What they included:</p>
                          <ul className="text-amber-900 space-y-0.5">
                            <li>• Research on renewable energy</li>
                            <li>• Diagram of their city layout</li>
                            <li>• Explanation of each sustainable feature</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Confirmation buttons */}
                {!understandConfirmed && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setUnderstandConfirmed(true)}
                      className="flex-1 rounded-xl gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      This makes sense
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowExample(true)}
                      className="flex-1 rounded-xl gap-2"
                    >
                      <Lightbulb className="w-4 h-4" />
                      I&apos;m still confused
                    </Button>
                  </div>
                )}

                {understandConfirmed && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-xl p-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Great! Let&apos;s see what your project needs to include.</span>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: WHAT YOUR PROJECT NEEDS TO SHOW */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">What your project needs to show</h2>
                  <p className="text-muted-foreground">
                    Your city needs these 4 parts
                  </p>
                </div>

                {/* Section header */}
                <h3 className="text-base font-semibold text-foreground">Your City needs these 4 parts</h3>

                {/* 2x2 Grid of category cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Energy */}
                  <Card className="border border-border/50 bg-white rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                          <span className="text-xl">☀️</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-0.5">Energy</h4>
                          <p className="text-sm text-muted-foreground mb-2">How your city gets power</p>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>solar panels</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>wind turbines</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transport */}
                  <Card className="border border-border/50 bg-white rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                          <span className="text-xl">🚌</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-0.5">Transport</h4>
                          <p className="text-sm text-muted-foreground mb-2">How people move around your city</p>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>trains</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>buses</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>bike paths</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Waste */}
                  <Card className="border border-border/50 bg-white rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0">
                          <span className="text-xl">♻️</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-0.5">Waste</h4>
                          <p className="text-sm text-muted-foreground mb-2">How your city manages waste</p>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>recycling systems</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>waste reduction</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Environment */}
                  <Card className="border border-border/50 bg-white rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                          <span className="text-xl">🌿</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-0.5">Environment</h4>
                          <p className="text-sm text-muted-foreground mb-2">How your city helps the environment</p>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>green spaces</span>
                            </li>
                            <li className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>clean air</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom section with two columns */}
                <Card className="border border-border/30 bg-muted/20 rounded-xl">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* What you will submit */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">What you will submit</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            <span>Model of your city</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            <span>Short explanation</span>
                          </li>
                        </ul>
                      </div>

                      {/* A good project will clearly show */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">A good project will clearly show:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            <span>how your city works</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            <span>why it is sustainable</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                              </div>
            )}

            {/* STEP 3: START */}
            {currentStep === 2 && (
              <div className="space-y-6 text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Ready to start your project?</h2>
                  <p className="text-muted-foreground">
                    You&apos;ll be guided step by step as you work.
                  </p>
                </div>

                {/* Summary card */}
                <Card className="border border-primary/20 bg-primary/5 rounded-xl text-left">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Quick summary</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-foreground">You understand what the project is about</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-foreground">You know what to include</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground">Due {formatDueDate(assignment.dueDate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <p className="text-sm text-muted-foreground">
                  The workspace will guide you through: Research, Design, Create, and Write up.
                </p>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {currentStep > 0 ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className={cn(
              "rounded-xl gap-2 px-6 h-11 shadow-md",
              currentStep === 2 && "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            {ctaText[currentStep]}
            {currentStep < 2 ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <Rocket className="w-4 h-4" />
            )}
          </Button>
        </div>

        </div>
      </div>

      {/* Right Panel - Project Brief (Desktop only) */}
      <div 
        className={cn(
          "hidden lg:flex flex-col border-l border-border/20 bg-white/80 backdrop-blur-sm transition-all duration-300",
          isPanelCollapsed ? "w-12" : "w-[320px]"
        )}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          className="absolute top-6 -left-3 w-6 h-6 bg-white border border-border/30 rounded-full flex items-center justify-center shadow-sm hover:bg-muted/50 transition-colors z-10"
          style={{ position: 'relative', left: isPanelCollapsed ? '3px' : '-12px', top: '16px' }}
        >
          {isPanelCollapsed ? (
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {!isPanelCollapsed && (
          <div className="p-6 sticky top-0">
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
                  <p className="text-sm font-medium text-foreground mb-1">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">{subjectDisplay}</p>
                </div>

                {/* What you need to do */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">What you need to do:</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {assignment.description || `Create a project that demonstrates your understanding of ${assignment.subject.toLowerCase()}.`}
                  </p>
                </div>

                {/* Key requirements */}
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key requirements:</p>
                  <ul className="space-y-1.5">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      Research on your topic
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      Clear explanations
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      Creative presentation
                    </li>
                  </ul>
                </div>

                {/* Tip */}
                <div className="pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>You&apos;ll work through this step by step in the workspace.</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Due Date Card */}
            <Card className="border-0 shadow-sm bg-white/80 rounded-2xl mt-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Due {formatDueDate(assignment.dueDate)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
