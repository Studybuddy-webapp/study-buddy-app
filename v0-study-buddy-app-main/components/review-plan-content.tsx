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
  ChevronRight,
  ChevronLeft,
  FileText,
  MessageCircle,
  Sparkles,
  X
} from "lucide-react"
import Link from "next/link"
import { getAssignment, subjectColors, updateAssignment, type Assignment } from "@/lib/assignments"
import { cn } from "@/lib/utils"

// Phase definitions - Updated labels
const phases = [
  { id: "understand", label: "Understand" },
  { id: "argument", label: "Argument" },
  { id: "reasons", label: "Reasons" },
  { id: "evidence", label: "Evidence" },
  { id: "plan", label: "Plan" },
]

// AI-generated argument suggestions based on common essay topics
const argumentSuggestions = [
  "The American Dream is broken",
  "Wealth does not lead to happiness",
  "The American Dream is unrealistic",
  "Success creates illusion, not fulfilment",
]

// Evidence suggestions
const characterSuggestions = ["Jay Gatsby", "Nick Carraway", "Daisy Buchanan", "Tom Buchanan"]
const themeSuggestions = ["Wealth and class", "The American Dream", "Love and obsession", "Illusion vs reality"]

// Evidence by Reason Step Component - Progressive disclosure
function EvidenceByReasonStep({
  reason1,
  reason2,
  reason3,
  characterSuggestions,
  themeSuggestions,
  evidenceData,
  setEvidenceData,
  currentReasonIndex,
  setCurrentReasonIndex,
}: {
  reason1: string
  reason2: string
  reason3: string
  characterSuggestions: string[]
  themeSuggestions: string[]
  evidenceData: { [key: number]: { whatHappens: string; whatItShows: string } }
  setEvidenceData: React.Dispatch<React.SetStateAction<{ [key: number]: { whatHappens: string; whatItShows: string } }>>
  currentReasonIndex: number
  setCurrentReasonIndex: React.Dispatch<React.SetStateAction<number>>
}) {
  const reasons = [reason1, reason2, reason3].filter(r => r.trim())
  const [showHelp, setShowHelp] = useState<{ [key: number]: boolean }>({})

  const currentReason = reasons[currentReasonIndex]
  const isCurrentComplete = () => {
    const data = evidenceData[currentReasonIndex]
    return data?.whatHappens?.trim().length >= 5 && data?.whatItShows?.trim().length >= 5
  }

  const handleNext = () => {
    if (currentReasonIndex < reasons.length - 1) {
      setCurrentReasonIndex(prev => prev + 1)
    }
  }

  const updateEvidence = (field: "whatHappens" | "whatItShows", value: string) => {
    setEvidenceData(prev => ({
      ...prev,
      [currentReasonIndex]: {
        ...prev[currentReasonIndex],
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Support Each Reason</h2>
        <p className="text-muted-foreground">
          Find evidence from the text to prove each reason. One at a time.
        </p>
      </div>

      {/* Simple reasons summary */}
      <div className="bg-muted/30 rounded-xl p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Your reasons:</p>
        <div className="space-y-1.5">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-2 text-sm",
                idx === currentReasonIndex ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                  idx < currentReasonIndex
                    ? "bg-emerald-100 text-emerald-700"
                    : idx === currentReasonIndex
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {idx < currentReasonIndex ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
              </span>
              <span className="truncate">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current reason card */}
      <Card className="border-2 border-primary/20 bg-white rounded-2xl">
        <CardContent className="p-6">
          {/* Reason header */}
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white">
              {currentReasonIndex + 1}
            </span>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reason {currentReasonIndex + 1}</p>
              <p className="text-foreground font-medium">{currentReason}</p>
            </div>
          </div>

          {/* Field 1: What happens */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground mb-2">
              What happens in the story?
            </label>
            <Textarea
              value={evidenceData[currentReasonIndex]?.whatHappens || ""}
              onChange={(e) => updateEvidence("whatHappens", e.target.value)}
              placeholder="Describe an example or add a quote"
              className="min-h-[80px] rounded-xl border-border/50 resize-none"
            />
          </div>

          {/* Field 2: What it shows */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground mb-2">
              What does this show?
            </label>
            <Textarea
              value={evidenceData[currentReasonIndex]?.whatItShows || ""}
              onChange={(e) => updateEvidence("whatItShows", e.target.value)}
              placeholder="Explain how this supports your reason"
              className="min-h-[80px] rounded-xl border-border/50 resize-none"
            />
          </div>

          {/* Help section - hidden by default */}
          {!showHelp[currentReasonIndex] ? (
            <button
              onClick={() => setShowHelp(prev => ({ ...prev, [currentReasonIndex]: true }))}
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              Need help?
            </button>
          ) : (
            <Card className="border border-amber-200 bg-amber-50/50 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Suggestions</span>
                  </div>
                  <button
                    onClick={() => setShowHelp(prev => ({ ...prev, [currentReasonIndex]: false }))}
                    className="text-amber-600 hover:text-amber-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-amber-700 mb-2">Characters to consider:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {characterSuggestions.map((char) => (
                        <span key={char} className="px-2.5 py-1 rounded-full text-xs bg-white border border-amber-200 text-amber-700">
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-amber-700 mb-2">Themes to explore:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {themeSuggestions.map((theme) => (
                        <span key={theme} className="px-2.5 py-1 rounded-full text-xs bg-white border border-amber-200 text-amber-700">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Navigation within reasons */}
      {currentReasonIndex < reasons.length - 1 && (
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!isCurrentComplete()}
            className="rounded-xl gap-2"
          >
            Next reason
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Completed indicator */}
      {currentReasonIndex === reasons.length - 1 && isCurrentComplete() && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-xl p-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>Great! You have evidence for all your reasons. Click Next to continue.</span>
        </div>
      )}
    </div>
  )
}

export function ReviewPlanContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const assignmentId = searchParams.get("id")
  
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  
  // Step 1: Understand
  const [understandConfirmed, setUnderstandConfirmed] = useState(false)
  const [showHelpChat, setShowHelpChat] = useState(false)
  const [helpMessage, setHelpMessage] = useState("")
  
  // Step 2: Argument
  const [selectedArgument, setSelectedArgument] = useState<string | null>(null)
  const [customArgument, setCustomArgument] = useState("")
  
  // Step 3: Reasons (NEW)
  const [reason1, setReason1] = useState("")
  const [reason2, setReason2] = useState("")
  const [reason3, setReason3] = useState("")
  const [showThirdReason, setShowThirdReason] = useState(false)
  const [showReasonHelp, setShowReasonHelp] = useState(false)
  
  // Step 4: Evidence - reason-based structure
  const [evidenceData, setEvidenceData] = useState<{
    [key: number]: { whatHappens: string; whatItShows: string }
  }>({})
  const [currentEvidenceReason, setCurrentEvidenceReason] = useState(0)
  
  

  useEffect(() => {
    if (assignmentId) {
      const found = getAssignment(assignmentId)
      setAssignment(found)
    }
    setIsLoading(false)
  }, [assignmentId])

  // Check if current phase is complete
  const reasons = [reason1, reason2, reason3].filter(r => r.trim())
  const isPhaseComplete = () => {
    switch (currentPhase) {
      case 0: return understandConfirmed
      case 1: return selectedArgument !== null || customArgument.trim().length >= 10
      case 2: return reason1.trim().length >= 5 && reason2.trim().length >= 5 // Reasons - need at least 2
      case 3: {
        // Check if all reasons have evidence
        return reasons.every((_, idx) => {
          const data = evidenceData[idx]
          return data?.whatHappens?.trim().length >= 5 && data?.whatItShows?.trim().length >= 5
        })
      }
      case 4: return true // Plan is optional, can always proceed
      default: return false
    }
  }

  // Handle next phase
  const handleNext = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(prev => prev + 1)
    } else {
      // Final phase - save and navigate to assignment workspace
      if (assignment) {
        updateAssignment(assignment.id, {
          progress: 10,
        })
        router.push(`/assignment-workspace?id=${assignment.id}`)
      }
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
    "Next: Choose your argument",
    "Next: Build your reasons",
    "Next: Find your evidence",
    "Next: Plan your essay",
    "Start Writing"
  ]

  // Get the current argument (either selected or custom)
  const currentArgument = selectedArgument || customArgument

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* Main content area with gradient background */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-violet-50/60">
        <div className="px-6 py-8 max-w-3xl mx-auto lg:mx-0 lg:max-w-none lg:pr-8">
          
          {/* Header Card */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl mb-6">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${subjectColor} flex items-center justify-center shrink-0 shadow-sm`}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                      {subjectDisplay}
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

          {/* Phase Content - Only show current phase */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl mb-6">
            <CardContent className="p-6">
              
              {/* PHASE 1: UNDERSTAND - AI EXPLAINS FIRST */}
              {currentPhase === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Understand Your Assignment</h2>
                    <p className="text-muted-foreground">
                      Let&apos;s make sure you know exactly what this essay is asking you to do.
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
                      
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <span className="font-medium text-foreground">Topic:</span>
                            <span className="text-muted-foreground ml-1">The American Dream in The Great Gatsby</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <span className="font-medium text-foreground">What you need to do:</span>
                            <span className="text-muted-foreground ml-1">Analyse and argue a position about what Fitzgerald is saying</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <span className="font-medium text-foreground">What to include:</span>
                            <span className="text-muted-foreground ml-1">Characters, themes, and specific evidence from the text</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <span className="font-medium text-foreground">Success looks like:</span>
                            <span className="text-muted-foreground ml-1">A clear argument supported by well-chosen examples</span>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Plain English Summary */}
                  <div className="bg-muted/30 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-2">What this means in simple English</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Pick what you think Fitzgerald is saying about the American Dream, then prove it using examples from the book.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => setUnderstandConfirmed(true)}
                      className={cn(
                        "flex-1 rounded-xl h-12 gap-2",
                        understandConfirmed ? "bg-emerald-600 hover:bg-emerald-700" : ""
                      )}
                    >
                      {understandConfirmed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          This makes sense
                        </>
                      ) : (
                        "This makes sense"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowHelpChat(!showHelpChat)}
                      className="flex-1 rounded-xl h-12 gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <MessageCircle className="w-4 h-4" />
                      I&apos;m still confused
                    </Button>
                  </div>

                  {/* Help Chat Panel */}
                  {showHelpChat && (
                    <Card className="border border-amber-200 bg-amber-50/50 rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Ask Study Buddy</span>
                          </div>
                          <button onClick={() => setShowHelpChat(false)} className="text-amber-600 hover:text-amber-800">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-amber-700 mb-3">
                          What part is confusing? I can explain it differently.
                        </p>
                        <div className="flex gap-2">
                          <Input
                            value={helpMessage}
                            onChange={(e) => setHelpMessage(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-1 rounded-lg border-amber-200 bg-white"
                          />
                          <Button size="sm" className="rounded-lg bg-amber-600 hover:bg-amber-700">
                            Ask
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* PHASE 2: ARGUMENT (RENAMED FROM DECIDE) */}
              {currentPhase === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Choose Your Argument</h2>
                    <p className="text-muted-foreground">
                      What position will you take? Your argument is the main idea your whole essay will prove.
                    </p>
                  </div>

                  {/* AI-suggested argument options */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">Select an argument direction:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {argumentSuggestions.map((arg) => (
                        <button
                          key={arg}
                          onClick={() => {
                            setSelectedArgument(arg)
                            setCustomArgument("")
                          }}
                          className={cn(
                            "p-4 rounded-xl text-left transition-all border-2",
                            selectedArgument === arg
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border/50 bg-white hover:border-primary/50 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className="text-sm font-medium">{arg}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Or write your own */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Or write your own:</p>
                    <Textarea
                      value={customArgument}
                      onChange={(e) => {
                        setCustomArgument(e.target.value)
                        if (e.target.value.trim()) setSelectedArgument(null)
                      }}
                      placeholder="My argument is that..."
                      className="min-h-[100px] rounded-xl border-border/50 resize-none text-base"
                    />
                  </div>

                  {/* Helper text */}
                  <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/30 rounded-xl p-4">
                    <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p>
                      Your argument is the main idea your whole essay will prove. Everything you write should support this.
                    </p>
                  </div>
                </div>
              )}

              {/* PHASE 3: REASONS (NEW) */}
              {currentPhase === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Build Your Reasons</h2>
                    <p className="text-muted-foreground">
                      These are the main reasons that support your argument. Each one will become a body paragraph.
                    </p>
                  </div>

                  {/* Show the student's argument */}
                  {currentArgument && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Your argument:</p>
                      <p className="text-sm text-foreground font-medium">{currentArgument}</p>
                    </div>
                  )}

                  {/* Reason 1 */}
                  <Card className="border border-border/30 rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">1</span>
                        <h3 className="font-medium text-foreground">Reason 1</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">What is one reason your argument is true?</p>
                      <Input
                        value={reason1}
                        onChange={(e) => setReason1(e.target.value)}
                        placeholder="One reason this is true is…"
                        className="rounded-lg border-border/50"
                      />
                    </CardContent>
                  </Card>

                  {/* Reason 2 */}
                  <Card className="border border-border/30 rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">2</span>
                        <h3 className="font-medium text-foreground">Reason 2</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">What is another reason your argument is true?</p>
                      <Input
                        value={reason2}
                        onChange={(e) => setReason2(e.target.value)}
                        placeholder="Another reason is…"
                        className="rounded-lg border-border/50"
                      />
                    </CardContent>
                  </Card>

                  {/* Reason 3 (optional) */}
                  {showThirdReason ? (
                    <Card className="border border-border/30 rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">3</span>
                          <h3 className="font-medium text-foreground">Reason 3</h3>
                          <span className="text-xs text-muted-foreground">(optional)</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Do you have a third reason?</p>
                        <Input
                          value={reason3}
                          onChange={(e) => setReason3(e.target.value)}
                          placeholder="A third reason is…"
                          className="rounded-lg border-border/50"
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <button
                      onClick={() => setShowThirdReason(true)}
                      className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-border/50 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                    >
                      + Add another reason
                    </button>
                  )}

                  {/* Help section */}
                  {!showReasonHelp ? (
                    <button
                      onClick={() => setShowReasonHelp(true)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <Lightbulb className="w-4 h-4" />
                      Need help thinking of a reason?
                    </button>
                  ) : (
                    <Card className="border border-amber-200 bg-amber-50/50 rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Thinking prompts</span>
                          </div>
                          <button onClick={() => setShowReasonHelp(false)} className="text-amber-600 hover:text-amber-800">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <ul className="space-y-2 text-sm text-amber-700">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>Which character shows this idea most clearly?</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>What happens in the story that proves your point?</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>What theme from the book supports your argument?</span>
                          </li>
                        </ul>
                        <div className="mt-3 pt-3 border-t border-amber-200">
                          <p className="text-xs text-amber-600">Sentence starter: &quot;One reason this is true is…&quot;</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* PHASE 4: SUPPORT EACH REASON */}
              {currentPhase === 3 && (
                <EvidenceByReasonStep
                  reason1={reason1}
                  reason2={reason2}
                  reason3={reason3}
                  characterSuggestions={characterSuggestions}
                  themeSuggestions={themeSuggestions}
                  evidenceData={evidenceData}
                  setEvidenceData={setEvidenceData}
                  currentReasonIndex={currentEvidenceReason}
                  setCurrentReasonIndex={setCurrentEvidenceReason}
                />
              )}

              {/* PHASE 5: YOUR ESSAY PLAN (Preview) */}
              {currentPhase === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Your Essay Plan</h2>
                    <p className="text-muted-foreground">
                      Here&apos;s how your essay will come together. You&apos;re ready to start writing.
                    </p>
                  </div>

                  {/* Essay structure preview - single column, clean */}
                  <div className="space-y-4">
                    {/* Introduction */}
                    <div className="bg-white border border-border/30 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">1</span>
                        <h3 className="font-medium text-foreground">Introduction</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        You will introduce your argument: <span className="text-foreground font-medium">&quot;{currentArgument}&quot;</span>
                      </p>
                    </div>

                    {/* Body Paragraph 1 */}
                    <div className="bg-white border border-border/30 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">2</span>
                        <h3 className="font-medium text-foreground">Body Paragraph 1</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Reason:</span> <span className="text-foreground">{reason1}</span></p>
                        {evidenceData[0]?.whatHappens && (
                          <p><span className="text-muted-foreground">Evidence:</span> <span className="text-foreground">{evidenceData[0].whatHappens}</span></p>
                        )}
                        {evidenceData[0]?.whatItShows && (
                          <p><span className="text-muted-foreground">Explanation:</span> <span className="text-foreground">{evidenceData[0].whatItShows}</span></p>
                        )}
                      </div>
                    </div>

                    {/* Body Paragraph 2 */}
                    <div className="bg-white border border-border/30 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">3</span>
                        <h3 className="font-medium text-foreground">Body Paragraph 2</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Reason:</span> <span className="text-foreground">{reason2}</span></p>
                        {evidenceData[1]?.whatHappens && (
                          <p><span className="text-muted-foreground">Evidence:</span> <span className="text-foreground">{evidenceData[1].whatHappens}</span></p>
                        )}
                        {evidenceData[1]?.whatItShows && (
                          <p><span className="text-muted-foreground">Explanation:</span> <span className="text-foreground">{evidenceData[1].whatItShows}</span></p>
                        )}
                      </div>
                    </div>

                    {/* Body Paragraph 3 (if exists) */}
                    {reason3 && (
                      <div className="bg-white border border-border/30 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">4</span>
                          <h3 className="font-medium text-foreground">Body Paragraph 3</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-muted-foreground">Reason:</span> <span className="text-foreground">{reason3}</span></p>
                          {evidenceData[2]?.whatHappens && (
                            <p><span className="text-muted-foreground">Evidence:</span> <span className="text-foreground">{evidenceData[2].whatHappens}</span></p>
                          )}
                          {evidenceData[2]?.whatItShows && (
                            <p><span className="text-muted-foreground">Explanation:</span> <span className="text-foreground">{evidenceData[2].whatItShows}</span></p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Conclusion */}
                    <div className="bg-white border border-border/30 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">{reason3 ? 5 : 4}</span>
                        <h3 className="font-medium text-foreground">Conclusion</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        You will restate your argument and summarise your key ideas.
                      </p>
                    </div>
                  </div>

                  {/* Confidence message */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-sm text-emerald-700">
                      Your essay is planned. You know what to write in each section.
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
                onClick={() => setCurrentPhase(prev => prev - 1)}
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

      {/* Right Panel - Assignment (Desktop only) */}
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
                  <h3 className="font-semibold text-foreground">Assignment</h3>
                </div>

                {/* Assignment Prompt */}
                <div className="mb-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {assignment.description || `Complete the ${assignment.type.toLowerCase()} for ${assignment.title}`}
                  </p>
                </div>

                {/* Key requirements */}
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key requirements:</p>
                  <ul className="space-y-1.5">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      Clear argument
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      Supporting evidence
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      Logical structure
                    </li>
                  </ul>
                </div>

                {/* Tip */}
                <div className="pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Everything you write should connect back to your argument.</span>
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
