"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, 
  Calendar, 
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Lightbulb,
  FileText,
  Sparkles,
  X,
  Plus
} from "lucide-react"
import Link from "next/link"
import { getAssignment, subjectColors, updateAssignment, type Assignment } from "@/lib/assignments"
import { cn } from "@/lib/utils"

// Phase definitions for Report
const phases = [
  { id: "understand", label: "Understand" },
  { id: "topic", label: "Topic" },
  { id: "sections", label: "Sections" },
  { id: "information", label: "Information" },
  { id: "plan", label: "Plan" },
]

// Default section suggestions for reports
const defaultSectionSuggestions = [
  "Introduction",
  "Background/Context",
  "Main Findings",
  "Analysis",
  "Conclusion",
]

export function ReportReviewPlanContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const assignmentId = searchParams.get("id")
  
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPhase, setCurrentPhase] = useState(0)
  
  // Step 1: Understand
  const [understandConfirmed, setUnderstandConfirmed] = useState(false)
  const [showHelpChat, setShowHelpChat] = useState(false)
  const [helpMessage, setHelpMessage] = useState("")
  
  // Step 2: Topic
  const [topicExplanation, setTopicExplanation] = useState("")
  
  // Step 3: Sections
  const [sections, setSections] = useState<string[]>(["", "", ""])
  const [showMoreSections, setShowMoreSections] = useState(false)
  
  // Step 4: Information
  const [sectionInfo, setSectionInfo] = useState<{
    [key: number]: { info: string; facts: string; examples: string }
  }>({})
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)

  useEffect(() => {
    if (assignmentId) {
      const found = getAssignment(assignmentId)
      setAssignment(found)
    }
    setIsLoading(false)
  }, [assignmentId])

  // Get filled sections (non-empty)
  const filledSections = sections.filter(s => s.trim().length > 0)

  // Check if current phase is complete
  const isPhaseComplete = () => {
    switch (currentPhase) {
      case 0: return understandConfirmed
      case 1: return topicExplanation.trim().length >= 10
      case 2: return filledSections.length >= 2 // At least 2 sections
      case 3: {
        // Only require the main "info" field - facts and examples are optional
        // Check that all filled sections have at least some explanation
        return filledSections.every((_, idx) => {
          const data = sectionInfo[idx]
          return data?.info?.trim().length > 0
        })
      }
      case 4: return true // Plan is just a preview
      default: return false
    }
  }

  // Handle next phase
  const handleNext = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(prev => prev + 1)
    } else {
      // Final phase - save and navigate to report workspace
      if (assignment) {
        updateAssignment(assignment.id, {
          progress: 10,
        })
        router.push(`/report-workspace?id=${assignment.id}`)
      }
    }
  }

  // Handle back - preserves all state
  const handleBack = () => {
    if (currentPhase > 0) {
      setCurrentPhase(prev => prev - 1)
    }
  }

  // Update section at index
  const updateSection = (index: number, value: string) => {
    setSections(prev => {
      const newSections = [...prev]
      newSections[index] = value
      return newSections
    })
  }

  // Add new section
  const addSection = () => {
    setSections(prev => [...prev, ""])
  }

  // Update section info
  const updateSectionInfo = (field: "info" | "facts" | "examples", value: string) => {
    setSectionInfo(prev => ({
      ...prev,
      [currentSectionIndex]: {
        ...prev[currentSectionIndex],
        [field]: value,
      },
    }))
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

  // Empty state - no assignment found
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

  // Format due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { 
      weekday: "long",
      day: "numeric", 
      month: "long" 
    })
  }

  // Get subject color
  const subjectColor = subjectColors[assignment.subject.toLowerCase()] || "bg-slate-400"
  const subjectDisplay = assignment.subject.charAt(0).toUpperCase() + assignment.subject.slice(1)

  // CTA button text for each phase
  const ctaText = [
    "Next: Define your topic",
    "Next: Build your sections",
    "Next: Add information",
    "Next: Review your plan",
    "Start Writing"
  ]

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-violet-50/60">
      <div className="px-6 py-8 max-w-3xl mx-auto">
        
        {/* Header Card */}
        <Card className="border-0 shadow-lg bg-white rounded-2xl mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${subjectColor} flex items-center justify-center shrink-0 shadow-sm`}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    {subjectDisplay}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    Report
                  </span>
                </div>
                <h1 className="text-lg font-semibold text-foreground truncate">
                  {assignment.title}
                </h1>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 text-sm text-muted-foreground shrink-0">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Due {formatDueDate(assignment.dueDate)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentPhase + 1} of {phases.length}
            </span>
          </div>
          <div className="flex gap-2">
            {phases.map((phase, index) => (
              <button
                key={phase.id}
                disabled={index > currentPhase}
                onClick={() => index < currentPhase && setCurrentPhase(index)}
                className={cn(
                  "flex-1 relative py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all",
                  index === currentPhase 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : index < currentPhase
                      ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200"
                      : "bg-white/60 text-muted-foreground border border-border/30"
                )}
              >
                <span className="flex items-center justify-center gap-1 sm:gap-2">
                  {index < currentPhase && <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  {index > currentPhase && <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-50" />}
                  <span className="hidden sm:inline">{phase.label}</span>
                  <span className="sm:hidden">{index + 1}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Phase Content */}
        <Card className="border-0 shadow-lg bg-white rounded-2xl mb-6">
          <CardContent className="p-6">
            
            {/* PHASE 1: UNDERSTAND */}
            {currentPhase === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Understand Your Report</h2>
                  <p className="text-muted-foreground">
                    Let&apos;s make sure you know exactly what this report is asking you to do.
                  </p>
                </div>

                {/* Study Buddy Breakdown Card */}
                <Card className="border border-primary/20 bg-primary/5 rounded-xl">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Study Buddy Breakdown</h3>
                    </div>
                    
                    <p className="text-sm text-foreground leading-relaxed">
                      This report will explain the key aspects of <span className="font-medium">{assignment.title.toLowerCase()}</span>. 
                      You&apos;ll need to research the topic, organise your findings into clear sections, and present the information in a logical order.
                    </p>
                  </CardContent>
                </Card>

                {/* Simple explanation */}
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">What this means:</p>
                  <p className="text-sm text-foreground">
                    You need to research and explain information about your topic in an organised way. A report presents facts and findings, not opinions.
                  </p>
                </div>

                {/* Confirmation buttons */}
                {!understandConfirmed && !showHelpChat && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => setUnderstandConfirmed(true)}
                      className="flex-1 rounded-xl gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      This makes sense
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowHelpChat(true)}
                      className="flex-1 rounded-xl gap-2"
                    >
                      I&apos;m still confused
                    </Button>
                  </div>
                )}

                {/* Help chat */}
                {showHelpChat && !understandConfirmed && (
                  <Card className="border border-amber-200 bg-amber-50/50 rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">Let me help</span>
                        </div>
                        <button onClick={() => setShowHelpChat(false)} className="text-amber-600 hover:text-amber-800">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-amber-700 mb-3">
                        What part is confusing? I can explain it differently.
                      </p>
                      <Textarea
                        value={helpMessage}
                        onChange={(e) => setHelpMessage(e.target.value)}
                        placeholder="Tell me what you're unsure about..."
                        className="min-h-[80px] rounded-lg border-amber-200 bg-white resize-none text-sm mb-3"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="rounded-lg gap-1"
                          onClick={() => {
                            setUnderstandConfirmed(true)
                            setShowHelpChat(false)
                          }}
                        >
                          Got it now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Confirmed state */}
                {understandConfirmed && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-xl p-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Great! You understand what the report is asking. Let&apos;s move on.</span>
                  </div>
                )}
              </div>
            )}

            {/* PHASE 2: TOPIC */}
            {currentPhase === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Your Topic</h2>
                  <p className="text-muted-foreground">
                    Define what your report will explain.
                  </p>
                </div>

                {/* Topic display */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Your topic:</p>
                  <p className="text-foreground font-medium">{assignment.title}</p>
                </div>

                {/* Topic explanation input */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    In this report I will explain...
                  </label>
                  <Textarea
                    value={topicExplanation}
                    onChange={(e) => setTopicExplanation(e.target.value)}
                    placeholder="What will your report explain? Write a sentence or two..."
                    className="min-h-[100px] rounded-xl border-border/50 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    This helps you focus on what your report is really about.
                  </p>
                </div>

                {/* Helper */}
                <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/30 rounded-xl p-4">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    Try to be specific. Instead of &quot;I will explain energy&quot;, try &quot;I will explain the differences between renewable and non-renewable energy sources and their environmental impact.&quot;
                  </p>
                </div>
              </div>
            )}

            {/* PHASE 3: SECTIONS */}
            {currentPhase === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Build Your Sections</h2>
                  <p className="text-muted-foreground">
                    These are the main parts of your report. Each one will become a section.
                  </p>
                </div>

                {/* Section inputs */}
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <Card key={index} className="border border-border/30 rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {index + 1}
                          </span>
                          <h3 className="font-medium text-foreground">Section {index + 1}</h3>
                          {index >= 3 && (
                            <span className="text-xs text-muted-foreground ml-auto">(optional)</span>
                          )}
                        </div>
                        <Input
                          value={section}
                          onChange={(e) => updateSection(index, e.target.value)}
                          placeholder={defaultSectionSuggestions[index] || "Add another section..."}
                          className="rounded-lg border-border/50"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add more button */}
                {sections.length < 6 && (
                  <button
                    onClick={addSection}
                    className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-border/50 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add another section
                  </button>
                )}

                {/* Helper */}
                <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/30 rounded-xl p-4">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    Think about breaking your topic into logical parts. What questions does your report need to answer?
                  </p>
                </div>
              </div>
            )}

            {/* PHASE 4: INFORMATION */}
            {currentPhase === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Add Information to Each Section</h2>
                  <p className="text-muted-foreground">
                    For each section, note what information you&apos;ll include.
                  </p>
                </div>

                {/* Sections progress */}
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Your sections:</p>
                  <div className="space-y-1.5">
                    {filledSections.map((section, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center gap-2 text-sm",
                          idx === currentSectionIndex ? "text-foreground font-medium" : "text-muted-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                            idx < currentSectionIndex
                              ? "bg-emerald-100 text-emerald-700"
                              : idx === currentSectionIndex
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                          )}
                        >
                          {idx < currentSectionIndex ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                        </span>
                        <span className="truncate">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current section card */}
                {filledSections[currentSectionIndex] && (
                  <Card className="border-2 border-primary/20 bg-white rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white">
                          {currentSectionIndex + 1}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Section {currentSectionIndex + 1}</p>
                          <p className="text-foreground font-medium">{filledSections[currentSectionIndex]}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            What will you explain in this section?
                          </label>
                          <Textarea
                            value={sectionInfo[currentSectionIndex]?.info || ""}
                            onChange={(e) => updateSectionInfo("info", e.target.value)}
                            placeholder="Describe what this section will cover..."
                            className="min-h-[80px] rounded-xl border-border/50 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Key facts (optional)
                          </label>
                          <Input
                            value={sectionInfo[currentSectionIndex]?.facts || ""}
                            onChange={(e) => updateSectionInfo("facts", e.target.value)}
                            placeholder="Any important facts or statistics..."
                            className="rounded-lg border-border/50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Examples (optional)
                          </label>
                          <Input
                            value={sectionInfo[currentSectionIndex]?.examples || ""}
                            onChange={(e) => updateSectionInfo("examples", e.target.value)}
                            placeholder="Any examples you'll use..."
                            className="rounded-lg border-border/50"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation within sections */}
                {currentSectionIndex < filledSections.length - 1 && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setCurrentSectionIndex(prev => prev + 1)}
                      disabled={!(sectionInfo[currentSectionIndex]?.info?.trim().length > 0)}
                      className="rounded-xl gap-2"
                    >
                      Next section
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Completed indicator */}
                {currentSectionIndex === filledSections.length - 1 && sectionInfo[currentSectionIndex]?.info?.trim().length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-xl p-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Great! You&apos;ve added information for all sections. Click Next to see your plan.</span>
                  </div>
                )}
              </div>
            )}

            {/* PHASE 5: PLAN (Preview) */}
            {currentPhase === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Your Report Plan</h2>
                  <p className="text-muted-foreground">
                    Here&apos;s how your report will come together. You&apos;re ready to start writing.
                  </p>
                </div>

                {/* Report structure preview */}
                <div className="space-y-4">
                  {/* Introduction */}
                  <div className="bg-white border border-border/30 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">1</span>
                      <h3 className="font-medium text-foreground">Introduction</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You will introduce your topic: <span className="text-foreground font-medium">&quot;{topicExplanation || assignment.title}&quot;</span>
                    </p>
                  </div>

                  {/* Sections */}
                  {filledSections.map((section, idx) => (
                    <div key={idx} className="bg-white border border-border/30 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{idx + 2}</span>
                        <h3 className="font-medium text-foreground">{section}</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        {sectionInfo[idx]?.info && (
                          <p><span className="text-muted-foreground">Content:</span> <span className="text-foreground">{sectionInfo[idx].info}</span></p>
                        )}
                        {sectionInfo[idx]?.facts && (
                          <p><span className="text-muted-foreground">Key facts:</span> <span className="text-foreground">{sectionInfo[idx].facts}</span></p>
                        )}
                        {sectionInfo[idx]?.examples && (
                          <p><span className="text-muted-foreground">Examples:</span> <span className="text-foreground">{sectionInfo[idx].examples}</span></p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Conclusion */}
                  <div className="bg-white border border-border/30 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{filledSections.length + 2}</span>
                      <h3 className="font-medium text-foreground">Conclusion</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You will summarise your key findings and main points.
                    </p>
                  </div>
                </div>

                {/* Confidence message */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-sm text-emerald-700">
                    Your report is planned. You know what to write in each section.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            {currentPhase > 0 ? (
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
              disabled={!isPhaseComplete()}
              className="rounded-xl gap-2 px-6 h-11 shadow-md"
            >
              {ctaText[currentPhase]}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        
      </div>
    </div>
  )
}
