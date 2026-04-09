"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles,
  ListChecks,
  Play,
  BookOpen,
  Target,
  Lightbulb,
  Brain,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FileText,
  GraduationCap,
  Zap,
  AlertTriangle,
  MessageCircle,
  NotebookPen,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Exam data
const examData = {
  title: "Biology Exam",
  subject: "Biology",
  dueDate: "Apr 30",
  progress: 45,
  estimatedTimeLeft: "~5 hours remaining",
}

// Study tabs - Notes removed, study path generated from Subject Workspace notes
const studyTabs = [
  { id: "study-path", label: "Study Path", icon: ListChecks },
  { id: "flashcards", label: "Flashcards", icon: Brain },
  { id: "practice", label: "Practice", icon: Target },
  { id: "exam-tips", label: "Exam Tips", icon: Lightbulb },
]

// Study path topics - auto-generated from subject notes
const studyTopics = [
  { id: 1, name: "Meiosis Stages", completed: true, time: "30 min" },
  { id: 2, name: "DNA Structure & Replication", completed: true, time: "45 min" },
  { id: 3, name: "Genetics & Punnett Squares", completed: false, current: true, time: "40 min" },
  { id: 4, name: "Practice Test", completed: false, hasQuiz: true, time: "25 min" },
  { id: 5, name: "Review Key Terms", completed: false, time: "20 min" },
]

// Today's goals
const todaysGoals = [
  { id: 1, text: "Review DNA Structure", completed: false },
  { id: 2, text: "Quiz on Meiosis", completed: false },
]

// Topics needing review
const weakTopics = [
  { name: "Punnett Squares", label: "Needs Practice", color: "text-amber-600", bg: "bg-amber-50" },
  { name: "DNA Replication", label: "Review Again", color: "text-rose-600", bg: "bg-rose-50" },
]

// Flashcard data
const flashcards = [
  { front: "Punnett Square", back: "A diagram used to predict genetic outcomes of a cross." },
  { front: "Meiosis", back: "A type of cell division that reduces chromosome number by half to produce gametes." },
  { front: "DNA Replication", back: "The process by which DNA makes a copy of itself during cell division." },
]

// Practice questions
const practiceQuestions = [
  {
    question: "What is the purpose of meiosis?",
    options: [
      "To produce identical cells for growth",
      "To reduce chromosome number for reproduction",
      "To repair damaged tissue",
      "To increase genetic variation only"
    ],
    correct: 1,
  },
]

// Exam tips
const examTips = [
  { title: "Active Recall", description: "Test yourself without looking at notes first. This strengthens memory more than re-reading." },
  { title: "Spaced Repetition", description: "Review material over increasing intervals: today, tomorrow, in 3 days, in a week." },
  { title: "Practice Testing", description: "Take practice tests under exam conditions. This reduces test anxiety and improves performance." },
  { title: "Avoid Cramming", description: "Spread your study over several days. Your brain needs sleep to consolidate memories." },
]

// AI assist options
const aiAssistOptions = [
  { icon: BookOpen, label: "Explain this concept", color: "text-blue-600" },
  { icon: Brain, label: "Quiz me on this", color: "text-violet-600" },
  { icon: HelpCircle, label: "Give me a hint", color: "text-emerald-600" },
  { icon: Lightbulb, label: "Study tip", color: "text-amber-600" },
]

export function ExamWorkspaceContent() {
  const [activeTab, setActiveTab] = useState("study-path")
  const [flashcardIndex, setFlashcardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(studyTopics.find(t => t.current) || studyTopics[0])

  const currentFlashcard = flashcards[flashcardIndex]
  const currentQuestion = practiceQuestions[0]

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Back Navigation */}
      <div className="shrink-0 px-6 pt-4 pb-2">
        <Link 
          href={`/subject-workspace?subject=${examData.subject.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {examData.subject}
        </Link>
      </div>
      
      {/* Header */}
      <header className="shrink-0 border-b border-border/30 bg-white/80 backdrop-blur-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{examData.title}</h1>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  {examData.subject}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Due {examData.dueDate}</p>
              
              {/* Progress */}
              <div className="mt-3 flex items-center gap-3">
                <Progress value={examData.progress} className="h-2 w-48" />
                <span className="text-sm font-semibold text-primary">{examData.progress}% complete</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Estimated study time left: {examData.estimatedTimeLeft}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button className="gap-2 rounded-xl font-semibold shadow-sm">
                <Play className="h-4 w-4" />
                Continue Studying
              </Button>
              <Button variant="outline" className="gap-2 rounded-xl">
                <CheckCircle2 className="h-4 w-4" />
                Mark Session Complete
              </Button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-5 flex items-center gap-1">
            {studyTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel - Study Guidance (narrower) */}
        <div className="flex w-[260px] shrink-0 flex-col border-r border-border/30 bg-white/60 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto p-4">
            
            {/* Today's Study Goals */}
            <Card className="mb-4 border-border/40 shadow-sm bg-white/80">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="flex items-center gap-2 text-xs font-semibold">
                  <Target className="h-3.5 w-3.5 text-primary" />
                  Today's Study Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-3 pb-3">
                {todaysGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-2">
                    <Circle className="h-3.5 w-3.5 text-muted-foreground/40" />
                    <span className="text-xs text-foreground">{goal.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Study Path - Clickable topics */}
            <Card className="mb-4 border-border/40 shadow-sm bg-white/80">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="flex items-center gap-2 text-xs font-semibold">
                  <ListChecks className="h-3.5 w-3.5 text-emerald-600" />
                  Study Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 px-3 pb-3">
                {studyTopics.map((topic) => (
                  <button 
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-md px-2 py-1.5 transition-all text-left",
                      selectedTopic.id === topic.id && "bg-primary/5 ring-1 ring-primary/20"
                    )}
                  >
                    {topic.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    ) : topic.current ? (
                      <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-primary/20" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                    )}
                    <span className={cn(
                      "text-xs flex-1",
                      topic.completed ? "text-muted-foreground line-through" : "text-foreground"
                    )}>
                      {topic.name}
                    </span>
                    {topic.current && (
                      <span className="text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        CURRENT
                      </span>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Topics to Review */}
            <Card className="border-border/40 shadow-sm bg-white/80">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="flex items-center gap-2 text-xs font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  Topics to Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-3 pb-3">
                {weakTopics.map((topic, idx) => (
                  <div key={idx} className={cn("flex items-center justify-between rounded-md px-2 py-1.5", topic.bg)}>
                    <span className="text-xs font-medium text-foreground">{topic.name}</span>
                    <span className={cn("text-[10px] font-medium", topic.color)}>{topic.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Center Active Study Area - Wider content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5">
            <div className="mx-auto max-w-[900px]">
              
              {/* Generated from notes message */}
              <div className="flex items-center gap-2 mb-5 text-sm text-muted-foreground">
                <NotebookPen className="h-4 w-4 text-primary" />
                <span>Your study plan was generated from your <span className="font-medium text-foreground">{examData.subject}</span> notes.</span>
              </div>

              {/* Study Path Tab - Current Topic */}
              {activeTab === "study-path" && (
                <Card className="border-0 bg-white shadow-lg shadow-black/5 rounded-2xl">
                  <CardHeader className="border-b border-border/30 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{selectedTopic.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedTopic.completed ? "Completed" : selectedTopic.current ? "Current Topic" : "Upcoming"}
                          <span className="ml-2 text-xs">• Est. {selectedTopic.time}</span>
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">Concept Summary</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedTopic.name === "Genetics & Punnett Squares" 
                          ? "Punnett Squares are diagrams used to predict the probability of inheriting specific traits. They show all possible combinations of alleles from two parents, helping us understand dominant and recessive inheritance patterns."
                          : selectedTopic.name === "Meiosis Stages"
                          ? "Meiosis is a type of cell division that reduces the chromosome number by half, creating four haploid cells. It consists of two divisions: Meiosis I (separates homologous pairs) and Meiosis II (separates sister chromatids)."
                          : selectedTopic.name === "DNA Structure & Replication"
                          ? "DNA is a double helix made of nucleotides containing adenine, thymine, guanine, and cytosine. During replication, the helix unwinds and each strand serves as a template for a new complementary strand."
                          : "Review the key concepts covered in this section to reinforce your understanding before the exam."
                        }
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">Key Points</h3>
                      <ul className="space-y-2">
                        {selectedTopic.name === "Genetics & Punnett Squares" ? (
                          <>
                            <li className="flex items-start gap-2 text-sm text-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              Capital letters represent dominant alleles (e.g., B)
                            </li>
                            <li className="flex items-start gap-2 text-sm text-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              Lowercase letters represent recessive alleles (e.g., b)
                            </li>
                            <li className="flex items-start gap-2 text-sm text-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              Homozygous = same alleles (BB or bb)
                            </li>
                            <li className="flex items-start gap-2 text-sm text-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              Heterozygous = different alleles (Bb)
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-start gap-2 text-sm text-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              Understanding the core concept is essential
                            </li>
                            <li className="flex items-start gap-2 text-sm text-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              Practice with examples to reinforce learning
                            </li>
                            <li className="flex items-start gap-2 text-sm text-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              Review diagrams and visual representations
                            </li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="rounded-xl bg-blue-50/80 p-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Next Step:</span> {selectedTopic.hasQuiz 
                          ? "Take the practice test to check your understanding." 
                          : "Complete the quiz to test your knowledge of this topic."}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 gap-2 rounded-xl h-11">
                        <Play className="h-4 w-4" />
                        Start Quiz
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2 rounded-xl h-11">
                        <Brain className="h-4 w-4" />
                        Review Flashcards
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Flashcards Tab */}
              {activeTab === "flashcards" && (
                <div className="space-y-6">
                  <Card className="border-0 bg-white shadow-lg shadow-black/5 rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-border/30 pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Brain className="h-5 w-5 text-violet-600" />
                          Flashcards
                        </CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {flashcardIndex + 1} of {flashcards.length}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      {/* Flashcard */}
                      <button
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="w-full min-h-[240px] rounded-2xl bg-gradient-to-br from-violet-50 to-blue-50 border border-border/30 p-8 flex flex-col items-center justify-center transition-all hover:shadow-md"
                      >
                        {!isFlipped ? (
                          <>
                            <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-3">Term</span>
                            <p className="text-2xl font-bold text-foreground text-center">{currentFlashcard.front}</p>
                            <p className="text-xs text-muted-foreground mt-4">Tap to reveal answer</p>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3">Definition</span>
                            <p className="text-lg text-foreground text-center leading-relaxed">{currentFlashcard.back}</p>
                            <p className="text-xs text-muted-foreground mt-4">Tap to see term</p>
                          </>
                        )}
                      </button>
                      
                      {/* Navigation */}
                      <div className="flex items-center justify-between mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFlashcardIndex(Math.max(0, flashcardIndex - 1))
                            setIsFlipped(false)
                          }}
                          disabled={flashcardIndex === 0}
                          className="gap-1 rounded-lg"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFlashcardIndex(0)
                            setIsFlipped(false)
                          }}
                          className="gap-1 rounded-lg"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Restart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFlashcardIndex(Math.min(flashcards.length - 1, flashcardIndex + 1))
                            setIsFlipped(false)
                          }}
                          disabled={flashcardIndex === flashcards.length - 1}
                          className="gap-1 rounded-lg"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Practice Tab */}
              {activeTab === "practice" && (
                <Card className="border-0 bg-white shadow-lg shadow-black/5 rounded-2xl">
                  <CardHeader className="border-b border-border/30 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Target className="h-5 w-5 text-emerald-600" />
                        Practice Quiz
                      </CardTitle>
                      <span className="text-sm text-muted-foreground">Question 1 of 1</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <p className="text-lg font-medium text-foreground">{currentQuestion.question}</p>
                    
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedAnswer(idx)
                            setShowFeedback(true)
                          }}
                          disabled={showFeedback}
                          className={cn(
                            "w-full text-left rounded-xl border-2 p-4 transition-all",
                            selectedAnswer === idx
                              ? showFeedback
                                ? idx === currentQuestion.correct
                                  ? "border-emerald-500 bg-emerald-50"
                                  : "border-rose-500 bg-rose-50"
                                : "border-primary bg-primary/5"
                              : showFeedback && idx === currentQuestion.correct
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-border/50 hover:border-border hover:bg-accent/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                              selectedAnswer === idx
                                ? showFeedback
                                  ? idx === currentQuestion.correct
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "border-rose-500 bg-rose-500 text-white"
                                  : "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30 text-muted-foreground"
                            )}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-sm text-foreground">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {showFeedback && (
                      <div className={cn(
                        "rounded-xl p-4",
                        selectedAnswer === currentQuestion.correct ? "bg-emerald-50" : "bg-amber-50"
                      )}>
                        <p className={cn(
                          "text-sm font-medium",
                          selectedAnswer === currentQuestion.correct ? "text-emerald-800" : "text-amber-800"
                        )}>
                          {selectedAnswer === currentQuestion.correct 
                            ? "Correct! Well done." 
                            : "Not quite. The correct answer is highlighted above. Review this topic before continuing."}
                        </p>
                      </div>
                    )}

                    <Button 
                      className="w-full gap-2 rounded-xl h-11"
                      onClick={() => {
                        setSelectedAnswer(null)
                        setShowFeedback(false)
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Exam Tips Tab */}
              {activeTab === "exam-tips" && (
                <div className="grid grid-cols-2 gap-4">
                  {examTips.map((tip, idx) => (
                    <Card key={idx} className="border-0 bg-white shadow-sm shadow-black/5 rounded-2xl">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                            <Lightbulb className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Study Buddy Help */}
        <div className="flex w-[260px] shrink-0 flex-col border-l border-border/30 bg-white/60 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto p-4">
            
            {/* Study Buddy AI Help */}
            <Card className="mb-4 border-border/40 shadow-sm bg-white/80">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="flex items-center gap-2 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Study Buddy Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 px-3 pb-3">
                {aiAssistOptions.map((option, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-all hover:bg-accent"
                  >
                    <option.icon className={cn("h-3.5 w-3.5 shrink-0", option.color)} />
                    <span className="text-foreground">{option.label}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mb-4 border-border/40 shadow-sm bg-white/80">
              <CardHeader className="pb-2 px-3 pt-3">
                <CardTitle className="flex items-center gap-2 text-xs font-semibold">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Study Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Topics Covered</span>
                    <span className="text-xs font-semibold text-foreground">2 / 5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Flashcards Reviewed</span>
                    <span className="text-xs font-semibold text-foreground">12 / 24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Quiz Score</span>
                    <span className="text-xs font-semibold text-emerald-600">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Time Studied</span>
                    <span className="text-xs font-semibold text-foreground">2h 15m</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Next Step */}
            <Card className="border-primary/20 shadow-sm bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Recommended Next</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Complete the Punnett Squares quiz</p>
                    <Button size="sm" className="mt-2 h-7 rounded-lg text-xs gap-1">
                      <Play className="h-3 w-3" />
                      Start Now
                    </Button>
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
