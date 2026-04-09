"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles,
  ArrowLeft,
  Calendar,
  Lightbulb,
  FileText,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  X,
  Edit3,
  HelpCircle,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Report sections - dynamically built from user's plan
// In real app, this would come from stored report plan data
const mockReportSections = [
  { id: "intro", label: "Introduction", isIntro: true },
  { id: "section1", label: "Background/Context", customName: "Background/Context" },
  { id: "section2", label: "Main Findings", customName: "Main Findings" },
  { id: "section3", label: "Analysis", customName: "Analysis" },
  { id: "conclusion", label: "Conclusion", isConclusion: true },
]

// Mock data from Report Plan (would come from stored data in real app)
const reportPlanData = {
  topic: "Renewable and Non-Renewable Energy Sources",
  topicExplanation: "This report will explain the differences between renewable and non-renewable energy sources and their environmental impact.",
  sections: [
    { 
      name: "Background/Context", 
      info: "What energy sources are and why they matter",
      facts: "Definition of energy sources, current global usage",
      examples: "Solar, wind, coal, oil"
    },
    { 
      name: "Main Findings", 
      info: "Comparing renewable vs non-renewable sources",
      facts: "Environmental impact, cost differences, availability",
      examples: "CO2 emissions data, cost per kWh"
    },
    { 
      name: "Analysis", 
      info: "Why renewable energy is becoming more important",
      facts: "Climate change effects, technological improvements",
      examples: "Countries transitioning to renewables"
    },
  ],
}

// Section-specific coaching content for reports
const getSectionCoaching = (sectionId: string, sections: typeof mockReportSections) => {
  const sectionIndex = sections.findIndex(s => s.id === sectionId)
  const currentSection = sections[sectionIndex]
  
  if (sectionId === "intro") {
    return {
      context: { label: "Your topic", content: reportPlanData.topicExplanation },
      prompt: "Introduce what your report is about and what the reader will learn",
      tip: "Keep it brief - tell the reader what to expect",
      starters: [
        "This report will explain...",
        "The purpose of this report is to...",
        "This report explores...",
      ],
    }
  }
  
  if (sectionId === "conclusion") {
    return {
      context: { label: "Your topic", content: reportPlanData.topicExplanation },
      prompt: "Summarise your main findings and what the reader should take away",
      tip: "Don't add new information - wrap up what you've covered",
      starters: [
        "In conclusion, this report has shown that...",
        "The main findings of this report are...",
        "To summarise,...",
      ],
    }
  }
  
  // Body sections - find matching section data
  const planSectionIndex = parseInt(sectionId.replace("section", "")) - 1
  const planSection = reportPlanData.sections[planSectionIndex]
  
  if (planSection) {
    return {
      context: { label: "This section", content: planSection.info },
      facts: planSection.facts,
      examples: planSection.examples,
      prompt: `Explain: ${planSection.info}`,
      tip: "Present facts clearly, then explain what they mean",
      starters: [
        `${planSection.name} involves...`,
        "One key aspect of this is...",
        "This is important because...",
      ],
    }
  }
  
  return null
}

// Report data
const reportData = {
  title: "Energy Sources Report",
  subject: "Science",
  dueDate: "Mar 22",
  daysLeft: 7,
  progress: 25,
}

// Subject colors
const subjectColors: Record<string, { bg: string; text: string; icon: string }> = {
  Science: { bg: "bg-emerald-400", text: "text-emerald-600", icon: "bg-emerald-50" },
  English: { bg: "bg-rose-400", text: "text-rose-600", icon: "bg-rose-50" },
  Maths: { bg: "bg-blue-400", text: "text-blue-600", icon: "bg-blue-50" },
  History: { bg: "bg-amber-400", text: "text-amber-600", icon: "bg-amber-50" },
  Geography: { bg: "bg-cyan-400", text: "text-cyan-600", icon: "bg-cyan-50" },
}

// Review suggestions for Improve Mode - Report-specific feedback
const reviewSuggestions = [
  {
    id: 1,
    type: "improvement",
    title: "Add more detail to your findings",
    section: "section2",
    whatToDo: "Include specific facts or statistics to support your points",
    tryThis: "Research shows that...",
    thinkAbout: "What evidence makes this finding convincing?",
    highlightStart: 300,
    highlightEnd: 350,
  },
  {
    id: 2,
    type: "improvement", 
    title: "Strengthen your introduction",
    section: "intro",
    whatToDo: "Make it clearer what the reader will learn from this report",
    tryThis: "By the end of this report, you will understand...",
    thinkAbout: "What is the main takeaway for your reader?",
    highlightStart: 50,
    highlightEnd: 100,
  },
  {
    id: 3,
    type: "improvement",
    title: "Connect your sections better",
    section: "section3",
    whatToDo: "Add a sentence linking this section to what came before",
    tryThis: "Building on the findings above...",
    thinkAbout: "How does this section relate to the previous one?",
    highlightStart: 500,
    highlightEnd: 550,
  },
]

// Review summary checklist
const reviewChecklist = [
  { label: "Clear introduction", status: "good" },
  { label: "Sections could use more detail", status: "improve" },
  { label: "Conclusion summarises well", status: "good" },
]

export function ReportWorkspaceContent() {
  // Build sections from report plan
  const reportSections = [
    { id: "intro", label: "Introduction", isIntro: true },
    ...reportPlanData.sections.map((s, i) => ({
      id: `section${i + 1}`,
      label: s.name,
      customName: s.name,
    })),
    { id: "conclusion", label: "Conclusion", isConclusion: true },
  ]

  const [editorContent, setEditorContent] = useState("")
  const [activeSection, setActiveSection] = useState("intro")
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [showCoach, setShowCoach] = useState(true)
  
  // Improve Mode state
  const [mode, setMode] = useState<"writing" | "improve">("writing")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null)
  const [completedTasks, setCompletedTasks] = useState<number[]>([])
  const [highlightedRange, setHighlightedRange] = useState<{start: number; end: number} | null>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  
  // Inline help state
  const [showInlineHint, setShowInlineHint] = useState(false)
  const [showNeedHelp, setShowNeedHelp] = useState(false)
  const lastTypeTime = useRef<number>(Date.now())
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const subjectColor = subjectColors[reportData.subject] || subjectColors.Science
  const wordCount = editorContent.split(/\s+/).filter(Boolean).length
  const currentCoaching = getSectionCoaching(activeSection, reportSections)
  
  const remainingTasks = reviewSuggestions.filter(s => !completedTasks.includes(s.id))
  const currentTask = remainingTasks[0] || null

  // Detect which section user is in based on content
  useEffect(() => {
    const contentLower = editorContent.toLowerCase()
    
    // Check from bottom to top
    if (contentLower.includes('conclusion:') && contentLower.indexOf('conclusion:') < editorContent.length - 50) {
      setActiveSection('conclusion')
    } else {
      // Check sections in reverse order
      for (let i = reportPlanData.sections.length - 1; i >= 0; i--) {
        const sectionName = reportPlanData.sections[i].name.toLowerCase()
        if (contentLower.includes(`${sectionName}:`) && contentLower.indexOf(`${sectionName}:`) < editorContent.length - 50) {
          setActiveSection(`section${i + 1}`)
          break
        }
      }
    }
  }, [editorContent])

  // Handle typing pause for inline hint
  useEffect(() => {
    if (mode !== "writing") return
    
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current)
    }
    
    hintTimerRef.current = setTimeout(() => {
      if (wordCount > 20 && Date.now() - lastTypeTime.current > 5000) {
        setShowInlineHint(true)
      }
    }, 5000)
    
    return () => {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current)
      }
    }
  }, [editorContent, mode, wordCount])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(e.target.value)
    lastTypeTime.current = Date.now()
    setShowInlineHint(false)
  }

  const handleMarkComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId])
    }
    const currentIndex = reportSections.findIndex(s => s.id === sectionId)
    if (currentIndex < reportSections.length - 1) {
      setActiveSection(reportSections[currentIndex + 1].id)
    }
  }

  const handleStartReview = () => {
    setShowConfirmModal(false)
    setMode("improve")
    setActiveSuggestion(null)
  }

  const handleMarkTaskDone = (id: number) => {
    setCompletedTasks([...completedTasks, id])
    setActiveSuggestion(null)
    setHighlightedRange(null)
  }

  const handleFocusOnTask = (task: typeof reviewSuggestions[0]) => {
    setActiveSuggestion(task.id)
    setHighlightedRange({ start: task.highlightStart, end: task.highlightEnd })
    
    if (editorRef.current) {
      editorRef.current.focus()
      editorRef.current.setSelectionRange(task.highlightStart, task.highlightEnd)
      const lineHeight = 24
      const scrollPosition = Math.max(0, (task.highlightStart / 50) * lineHeight - 100)
      editorRef.current.scrollTop = scrollPosition
    }
  }

  const handleInsertStarter = (starter: string) => {
    setEditorContent(prev => prev + "\n" + starter)
    setShowNeedHelp(false)
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-slate-50/50">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-md border-0 shadow-2xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Ready to review your report?</h2>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We&apos;ll highlight areas to improve your writing and help you make it stronger.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Keep Writing
                </Button>
                <Button 
                  className="flex-1 rounded-xl gap-2"
                  onClick={handleStartReview}
                >
                  <Sparkles className="w-4 h-4" />
                  Start Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Header - Full Width */}
      <header className="shrink-0 border-b border-border/20 bg-white/80 backdrop-blur-sm">
        {/* Back Navigation */}
        <div className="px-6 pt-3 pb-2">
          <Link 
            href={`/subject-workspace?subject=${reportData.subject.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {reportData.subject}
          </Link>
        </div>
        
        {/* Report Info Bar */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Report info */}
            <div className="flex items-center gap-4">
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", subjectColor.icon)}>
                <FileText className={cn("w-5 h-5", subjectColor.text)} />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  {reportData.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full", subjectColor.bg)} />
                    {reportData.subject}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50">Report</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Due {reportData.dueDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {reportData.daysLeft} days left
                  </span>
                </div>
              </div>
            </div>
            
            {/* Center: Mode Toggle + Progress */}
            <div className="flex items-center gap-4 flex-1 max-w-lg">
              {/* Mode Toggle */}
              <div className="flex items-center rounded-xl bg-muted/50 p-1">
                <button
                  onClick={() => setMode("writing")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    mode === "writing" 
                      ? "bg-white text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Writing Mode
                </button>
                <button
                  onClick={() => setMode("improve")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    mode === "improve" 
                      ? "bg-white text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Improve Mode
                </button>
              </div>
              
              <Progress value={reportData.progress} className="h-2.5 flex-1" />
              <span className="text-sm font-semibold text-foreground">{reportData.progress}%</span>
            </div>
            
            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {mode === "writing" ? (
                <Button 
                  size="sm" 
                  className="rounded-xl h-9 gap-2 shadow-sm"
                  onClick={() => setShowConfirmModal(true)}
                >
                  Finish Draft
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button size="sm" className="rounded-xl h-9 gap-2 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content - Two Column Layout */}
      <div className="flex-1 overflow-hidden flex">
        {/* LEFT: Writing Coach Panel */}
        {showCoach && (
          <div className="w-[320px] shrink-0 border-r border-border/20 bg-white/60 backdrop-blur-sm overflow-y-auto">
            <div className="p-5 space-y-5">
              {/* Panel Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-semibold text-foreground">
                    {mode === "writing" ? "Writing Coach" : "Improve Your Report"}
                  </h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setShowCoach(false)}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>

              {mode === "writing" ? (
                /* WRITING MODE CONTENT */
                <>
                  {/* Section Selection */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Working On
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {reportSections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                            activeSection === section.id
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : completedSections.includes(section.id)
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {completedSections.includes(section.id) && (
                            <CheckCircle2 className="w-3 h-3 inline mr-1" />
                          )}
                          {section.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Context from Plan */}
                  {currentCoaching?.context && (
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        From Your Plan
                      </h3>
                      <Card className="border border-border/30 bg-gradient-to-br from-primary/5 to-emerald-50/50 rounded-xl">
                        <CardContent className="p-4">
                          <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                            {currentCoaching.context.label}
                          </p>
                          <p className="text-sm text-foreground font-medium">
                            {currentCoaching.context.content}
                          </p>
                          {currentCoaching.facts && (
                            <div className="mt-3 pt-3 border-t border-border/30">
                              <p className="text-xs text-muted-foreground mb-1">Key facts to include:</p>
                              <p className="text-sm text-foreground">
                                {currentCoaching.facts}
                              </p>
                            </div>
                          )}
                          {currentCoaching.examples && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Examples:</p>
                              <p className="text-sm text-foreground italic">
                                {currentCoaching.examples}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* What to Write */}
                  {currentCoaching && (
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        What to Write
                      </h3>
                      <div className="bg-white rounded-xl border border-border/30 p-4">
                        <p className="text-sm text-foreground font-medium mb-2">
                          {currentCoaching.prompt}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          {currentCoaching.tip}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Need Help - Collapsed by default */}
                  <div>
                    <button
                      onClick={() => setShowNeedHelp(!showNeedHelp)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Need help getting started?
                      <ChevronDown className={cn("w-4 h-4 transition-transform", showNeedHelp && "rotate-180")} />
                    </button>
                    
                    {showNeedHelp && currentCoaching?.starters && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Sentence starters:</p>
                        {currentCoaching.starters.map((starter, index) => (
                          <button
                            key={index}
                            onClick={() => handleInsertStarter(starter)}
                            className="w-full text-left text-sm text-muted-foreground hover:text-foreground p-3 rounded-lg bg-white/80 hover:bg-white border border-border/30 hover:border-border/50 transition-all hover:shadow-sm"
                          >
                            &quot;{starter}&quot;
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mark Section Complete */}
                  {!completedSections.includes(activeSection) && (
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl gap-2"
                      onClick={() => handleMarkComplete(activeSection)}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark {reportSections.find(s => s.id === activeSection)?.label} complete
                    </Button>
                  )}
                </>
              ) : (
                /* IMPROVE MODE CONTENT */
                <>
                  {/* Summary Feedback */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Report Feedback
                    </h3>
                    <div className="space-y-2">
                      {reviewChecklist.map((item, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg",
                            item.status === "good" ? "bg-emerald-50" : "bg-amber-50"
                          )}
                        >
                          {item.status === "good" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span className={cn(
                            "text-sm",
                            item.status === "good" ? "text-emerald-800" : "text-amber-800"
                          )}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Task */}
                  {currentTask && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Current Task
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {completedTasks.length + 1} of {reviewSuggestions.length}
                        </span>
                      </div>
                      
                      <Card className="border-2 border-amber-200 bg-amber-50/50 rounded-xl">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Edit3 className="w-4 h-4 text-amber-600" />
                            {currentTask.title}
                          </h4>
                          
                          <div className="mb-4">
                            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1.5">
                              What to do
                            </p>
                            <p className="text-sm text-foreground">
                              {currentTask.whatToDo}
                            </p>
                          </div>
                          
                          <div className="mb-4 p-3 bg-white rounded-lg border border-amber-200">
                            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1.5">
                              Try this
                            </p>
                            <p className="text-sm text-foreground italic">
                              &quot;{currentTask.tryThis}&quot;
                            </p>
                          </div>
                          
                          <div className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{currentTask.thinkAbout}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1 rounded-lg gap-2"
                              onClick={() => handleFocusOnTask(currentTask)}
                            >
                              <ArrowRight className="w-4 h-4" />
                              Go to section
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="rounded-lg gap-2"
                              onClick={() => handleMarkTaskDone(currentTask.id)}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Done
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* All tasks completed */}
                  {!currentTask && completedTasks.length > 0 && (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">All improvements complete!</h4>
                      <p className="text-sm text-muted-foreground">
                        You&apos;ve reviewed all the suggestions.
                      </p>
                    </div>
                  )}

                  {/* Progress indicator */}
                  {remainingTasks.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(completedTasks.length / reviewSuggestions.length) * 100} 
                        className="h-2 flex-1" 
                      />
                      <span className="text-xs text-muted-foreground">
                        {completedTasks.length}/{reviewSuggestions.length}
                      </span>
                    </div>
                  )}

                  {/* Ask Study Buddy */}
                  <Card className="border-0 shadow-sm bg-white rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Need more help?</span>
                      </div>
                      <Button asChild variant="outline" size="sm" className="w-full rounded-lg gap-2">
                        <Link href="/ask">
                          <Sparkles className="w-4 h-4" />
                          Ask Study Buddy
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Ask Study Buddy (Writing Mode) */}
              {mode === "writing" && (
                <Card className="border-0 shadow-sm bg-white rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Stuck?</span>
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full rounded-lg gap-2">
                      <Link href="/ask">
                        <Sparkles className="w-4 h-4" />
                        Ask Study Buddy
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
        
        {/* RIGHT: Main Writing Editor */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Collapsed Coach Toggle */}
          {!showCoach && (
            <button
              onClick={() => setShowCoach(true)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-md border border-border/30 hover:shadow-lg transition-all"
            >
              <ChevronUp className="w-4 h-4 rotate-90" />
              <span className="text-sm font-medium">
                {mode === "writing" ? "Show Coach" : "Show Feedback"}
              </span>
            </button>
          )}

          <div className="h-full p-5">
            {/* Editor Card */}
            <Card className="h-full border-0 shadow-lg bg-white rounded-2xl flex flex-col max-w-4xl mx-auto">
              {/* Minimal Toolbar */}
              <div className="shrink-0 flex items-center gap-1 px-5 py-3 border-b border-border/20">
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Bold className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Italic className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Underline className="w-4 h-4 text-muted-foreground" />
                </button>
                <div className="w-px h-5 bg-border/50 mx-2" />
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <List className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <ListOrdered className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Quote className="w-4 h-4 text-muted-foreground" />
                </button>
                <div className="w-px h-5 bg-border/50 mx-2" />
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Link2 className="w-4 h-4 text-muted-foreground" />
                </button>
                
                {/* Word count & status */}
                <div className="ml-auto flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{wordCount} words</span>
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <Circle className="w-2 h-2 fill-current" />
                    Auto-saved
                  </span>
                </div>
              </div>
              
              {/* Editor Content */}
              <div className="flex-1 overflow-y-auto relative">
                {/* Inline Hint */}
                {mode === "writing" && showInlineHint && (
                  <div className="absolute bottom-4 right-4 z-10">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700 shadow-sm">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Include specific facts or examples here</span>
                      <button 
                        onClick={() => setShowInlineHint(false)}
                        className="ml-1 p-0.5 hover:bg-amber-100 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Improve Mode Prompt Bubble */}
                {mode === "improve" && activeSuggestion && (
                  <div className="absolute top-20 right-8 z-20 w-64">
                    <Card className="border-2 border-amber-200 shadow-lg rounded-xl bg-amber-50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2 mb-3">
                          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                          <p className="text-sm text-foreground font-medium">
                            {reviewSuggestions.find(s => s.id === activeSuggestion)?.thinkAbout}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1 rounded-lg text-xs"
                            onClick={() => {
                              setActiveSuggestion(null)
                              setHighlightedRange(null)
                            }}
                          >
                            Got it
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 rounded-lg text-xs gap-1"
                            onClick={() => handleMarkTaskDone(activeSuggestion)}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <textarea
                  ref={editorRef}
                  value={editorContent}
                  onChange={handleContentChange}
                  className={cn(
                    "w-full h-full min-h-[500px] p-8 text-base leading-relaxed text-foreground resize-none focus:outline-none placeholder:text-muted-foreground/50 font-serif",
                    mode === "improve" && "bg-amber-50/20"
                  )}
                  placeholder="Start writing your report here..."
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
