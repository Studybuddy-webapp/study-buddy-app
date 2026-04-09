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
  BookOpen,
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

// Essay sections
const essaySections = [
  { id: "intro", label: "Introduction" },
  { id: "body1", label: "Body Paragraph 1" },
  { id: "body2", label: "Body Paragraph 2" },
  { id: "body3", label: "Body Paragraph 3" },
  { id: "conclusion", label: "Conclusion" },
]

// Mock data from Review Plan (would come from stored data in real app)
const reviewPlanData = {
  argument: "Gatsby represents the failure of the American Dream because his wealth cannot buy genuine happiness or acceptance.",
  reasons: [
    { text: "Gatsby's parties show his loneliness despite wealth", evidence: "He throws lavish parties but stands apart from the crowd", explanation: "This shows that wealth does not create genuine connection" },
    { text: "His pursuit of Daisy represents chasing an impossible past", evidence: "So we beat on, boats against the current...", explanation: "Gatsby cannot accept that time has moved on" },
    { text: "His death goes largely unmourned", evidence: "Very few people came to Gatsby's funeral", explanation: "Despite his wealth and fame, he had no real friends" },
  ],
}



// Section-specific coaching content
const getSectionCoaching = (sectionId: string) => {
  const { argument, reasons } = reviewPlanData
  
  switch (sectionId) {
    case "intro":
      return {
        context: { label: "Your argument", content: argument },
        prompt: "Explain what your essay will prove",
        tip: "Keep it clear and simple (1-2 sentences)",
        starters: [
          "This essay will argue that...",
          "In The Great Gatsby, Fitzgerald shows...",
          "The central question this essay explores is...",
        ],
      }
    case "body1":
      return {
        context: { label: "Reason 1", content: reasons[0]?.text },
        evidence: reasons[0]?.evidence,
        prompt: "Explain how this example proves your idea",
        tip: "State the point, give evidence, then explain",
        starters: [
          "One way this is shown is through...",
          "This is evident when...",
          "For example, [character] demonstrates...",
        ],
      }
    case "body2":
      return {
        context: { label: "Reason 2", content: reasons[1]?.text },
        evidence: reasons[1]?.evidence,
        prompt: "Explain how this example proves your idea",
        tip: "Connect this paragraph to the previous one",
        starters: [
          "Furthermore, this is also shown through...",
          "Another significant example appears when...",
          "This is further reinforced by...",
        ],
      }
    case "body3":
      return reasons[2] ? {
        context: { label: "Reason 3", content: reasons[2]?.text },
        evidence: reasons[2]?.evidence,
        prompt: "Explain how this example proves your idea",
        tip: "Build on your previous points",
        starters: [
          "Additionally, we see that...",
          "A further example of this is...",
          "This point is also supported by...",
        ],
      } : null
    case "conclusion":
      return {
        context: { label: "Your argument", content: argument },
        prompt: "Restate your argument and summarise your key ideas",
        tip: "Don't add new points - wrap up what you've said",
        starters: [
          "In conclusion, this essay has shown that...",
          "Ultimately, [author/text] demonstrates...",
          "The significance of this is...",
        ],
      }
    default:
      return null
  }
}

// Assignment data
const assignmentData = {
  title: "The Great Gatsby Essay",
  subject: "English",
  dueDate: "Mar 18",
  daysLeft: 5,
  progress: 40,
}

// Subject colors
const subjectColors: Record<string, { bg: string; text: string; icon: string }> = {
  English: { bg: "bg-rose-400", text: "text-rose-600", icon: "bg-rose-50" },
  Maths: { bg: "bg-blue-400", text: "text-blue-600", icon: "bg-blue-50" },
  Science: { bg: "bg-emerald-400", text: "text-emerald-600", icon: "bg-emerald-50" },
  History: { bg: "bg-amber-400", text: "text-amber-600", icon: "bg-amber-50" },
}

// Review suggestions for Improve Mode - Actionable feedback structure
const reviewSuggestions = [
  {
    id: 1,
    type: "improvement",
    title: "Add more explanation after quotes",
    section: "body1",
    whatToDo: "Explain what the quote means and how it supports your idea",
    tryThis: "This shows that...",
    thinkAbout: "What does this quote prove about your argument?",
    highlightStart: 200,
    highlightEnd: 250,
  },
  {
    id: 2,
    type: "improvement", 
    title: "Strengthen your conclusion",
    section: "conclusion",
    whatToDo: "Add a sentence about why your argument matters",
    tryThis: "The significance of this is...",
    thinkAbout: "What should the reader take away from your essay?",
    highlightStart: 800,
    highlightEnd: 850,
  },
  {
    id: 3,
    type: "improvement",
    title: "Improve paragraph transitions",
    section: "body2",
    whatToDo: "Add a transition word or phrase to connect your ideas",
    tryThis: "This connects to...",
    thinkAbout: "How does this paragraph build on the previous one?",
    highlightStart: 400,
    highlightEnd: 450,
  },
]

// Review summary checklist
const reviewChecklist = [
  { label: "Clear overall argument", status: "good" },
  { label: "Add more explanation after quotes", status: "improve" },
  { label: "Conclusion could be stronger", status: "improve" },
]

export function AssignmentWorkspaceContent() {
  const [editorContent, setEditorContent] = useState("")
  const [activeSection, setActiveSection] = useState("intro")
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [showCoach, setShowCoach] = useState(true)
  
  // Improve Mode state
  const [mode, setMode] = useState<"writing" | "improve">("writing")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null)
  const [completedTasks, setCompletedTasks] = useState<number[]>([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [highlightedRange, setHighlightedRange] = useState<{start: number; end: number} | null>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  
  // Inline help state
  const [showInlineHint, setShowInlineHint] = useState(false)
  const [showNeedHelp, setShowNeedHelp] = useState(false)
  const lastTypeTime = useRef<number>(Date.now())
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const subjectColor = subjectColors[assignmentData.subject] || subjectColors.English
  const wordCount = editorContent.split(/\s+/).filter(Boolean).length
  const currentCoaching = getSectionCoaching(activeSection)
  
  const remainingTasks = reviewSuggestions.filter(s => !completedTasks.includes(s.id))
  const currentTask = remainingTasks[0] ?? null

  

  // Detect which section user is in based on cursor position / content
  useEffect(() => {
    const lines = editorContent.split('\n')
    let currentLineCount = 0
    
    // Simple heuristic: check which section header appears last before end of content
    const contentLower = editorContent.toLowerCase()
    
    if (contentLower.includes('conclusion:') && contentLower.indexOf('conclusion:') < editorContent.length - 100) {
      setActiveSection('conclusion')
    } else if (contentLower.includes('body paragraph 3:') && contentLower.indexOf('body paragraph 3:') < editorContent.length - 100) {
      setActiveSection('body3')
    } else if (contentLower.includes('body paragraph 2:') && contentLower.indexOf('body paragraph 2:') < editorContent.length - 100) {
      setActiveSection('body2')
    } else if (contentLower.includes('body paragraph 1:') && contentLower.indexOf('body paragraph 1:') < editorContent.length - 100) {
      setActiveSection('body1')
    }
  }, [editorContent])

  // Handle typing pause for inline hint (subtle, non-intrusive)
  useEffect(() => {
    if (mode !== "writing") return
    
    // Clear existing timer
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current)
    }
    
    // Set new timer - show hint after 5 seconds of inactivity
    hintTimerRef.current = setTimeout(() => {
      // Only show if user has typed something but hasn't typed recently
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
    setShowInlineHint(false) // Hide hint when user starts typing again
  }

  const handleMarkComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId])
    }
    const currentIndex = essaySections.findIndex(s => s.id === sectionId)
    if (currentIndex < essaySections.length - 1) {
      setActiveSection(essaySections[currentIndex + 1].id)
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
    
    // Scroll editor to relevant section
    if (editorRef.current) {
      editorRef.current.focus()
      editorRef.current.setSelectionRange(task.highlightStart, task.highlightEnd)
      // Scroll into view
      const lineHeight = 24
      const scrollPosition = Math.max(0, (task.highlightStart / 50) * lineHeight - 100)
      editorRef.current.scrollTop = scrollPosition
    }
  }

  const handleInsertStarter = (starter: string) => {
    // Insert starter at cursor position or at end
    setEditorContent(prev => prev + "\n" + starter)
    setShowNeedHelp(false)
  }

  // Filter sections - remove body3 if no third reason
  const visibleSections = reviewPlanData.reasons.length >= 3 
    ? essaySections 
    : essaySections.filter(s => s.id !== "body3")

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
                <h2 className="text-xl font-semibold text-foreground">Ready to review your essay?</h2>
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
            href={`/subject-workspace?subject=${assignmentData.subject.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {assignmentData.subject}
          </Link>
        </div>
        
        {/* Assignment Info Bar */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Assignment info */}
            <div className="flex items-center gap-4">
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", subjectColor.icon)}>
                <BookOpen className={cn("w-5 h-5", subjectColor.text)} />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  {assignmentData.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full", subjectColor.bg)} />
                    {assignmentData.subject}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Due {assignmentData.dueDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {assignmentData.daysLeft} days left
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
              
              <Progress value={assignmentData.progress} className="h-2.5 flex-1" />
              <span className="text-sm font-semibold text-foreground">{assignmentData.progress}%</span>
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
        {/* LEFT: Writing Coach Panel (Writing Mode) OR Improve Panel (Improve Mode) */}
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
                    {mode === "writing" ? "Writing Coach" : "Improve Your Essay"}
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
                /* WRITING MODE CONTENT - Contextual based on section */
                <>
                  {/* Section 1: Current Section Selection */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Working On
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {visibleSections.map((section) => (
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

                  {/* Section 2: Context from Plan */}
                  {currentCoaching?.context && (
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        From Your Plan
                      </h3>
                      <Card className="border border-border/30 bg-gradient-to-br from-primary/5 to-violet-50/50 rounded-xl">
                        <CardContent className="p-4">
                          <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                            {currentCoaching.context.label}
                          </p>
                          <p className="text-sm text-foreground font-medium">
                            {currentCoaching.context.content}
                          </p>
                          {currentCoaching.evidence && (
                            <div className="mt-3 pt-3 border-t border-border/30">
                              <p className="text-xs text-muted-foreground mb-1">Your evidence:</p>
                              <p className="text-sm text-foreground italic">
                                &quot;{currentCoaching.evidence}&quot;
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Section 3: What to do */}
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

                  {/* Section 4: Need Help - Collapsed by default */}
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
                      Mark {visibleSections.find(s => s.id === activeSection)?.label} complete
                    </Button>
                  )}
                </>
              ) : (
                /* IMPROVE MODE CONTENT - Guided Feedback System */
                <>
                  {/* Section 1: Summary Feedback */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Essay Feedback
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

                  {/* Section 2: Current Task - ONE at a time */}
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
                          {/* Task Title */}
                          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Edit3 className="w-4 h-4 text-amber-600" />
                            {currentTask.title}
                          </h4>
                          
                          {/* What to do */}
                          <div className="mb-4">
                            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1.5">
                              What to do
                            </p>
                            <p className="text-sm text-foreground">
                              {currentTask.whatToDo}
                            </p>
                          </div>
                          
                          {/* Try this - Sentence starter */}
                          <div className="mb-4 p-3 bg-white rounded-lg border border-amber-200">
                            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1.5">
                              Try this
                            </p>
                            <p className="text-sm text-foreground italic">
                              &quot;{currentTask.tryThis}&quot;
                            </p>
                          </div>
                          
                          {/* Think about - Guiding question */}
                          <div className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{currentTask.thinkAbout}</span>
                          </div>
                          
                          {/* Actions */}
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

                  {/* All tasks completed message */}
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

              {/* Ask Study Buddy (Writing Mode only) */}
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
            {/* Editor Card - Full height */}
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
                
                {/* Word count & status on right */}
                <div className="ml-auto flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{wordCount} words</span>
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <Circle className="w-2 h-2 fill-current" />
                    Auto-saved
                  </span>
                </div>
              </div>
              
              {/* Editor Content - Takes remaining space */}
              <div className="flex-1 overflow-y-auto relative">
                {/* Subtle Inline Hint (appears after pause) */}
                {mode === "writing" && showInlineHint && (
                  <div className="absolute bottom-4 right-4 z-10">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700 shadow-sm">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Try explaining what this example shows</span>
                      <button 
                        onClick={() => setShowInlineHint(false)}
                        className="ml-1 p-0.5 hover:bg-amber-100 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Inline Prompt Bubble (Improve Mode) - Simple, non-intrusive */}
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
                  placeholder="Start writing your essay here..."
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
