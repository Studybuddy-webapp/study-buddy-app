"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, ChevronRight, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const yearOptions = [
  "Year 5", "Year 6", "Year 7", "Year 8", 
  "Year 9", "Year 10", "Year 11", "Year 12", "Other"
]

const subjectOptions = [
  { name: "English", color: "bg-rose-400" },
  { name: "Maths", color: "bg-blue-400" },
  { name: "Science", color: "bg-emerald-400" },
  { name: "History", color: "bg-amber-400" },
  { name: "Geography", color: "bg-teal-400" },
  { name: "Biology", color: "bg-green-400" },
  { name: "Chemistry", color: "bg-rose-300" },
  { name: "Physics", color: "bg-indigo-400" },
  { name: "Art", color: "bg-pink-400" },
  { name: "Music", color: "bg-purple-400" },
]

const studyTimeOptions = [
  { label: "After school", description: "Right when I get home" },
  { label: "After dinner", description: "Evening study session" },
  { label: "Weekends", description: "Saturday or Sunday" },
  { label: "Flexible", description: "Varies day to day" },
]

const studyDurationOptions = [
  { label: "20–30 minutes", description: "Short focused sessions" },
  { label: "30–45 minutes", description: "Balanced study time" },
  { label: "45–60 minutes", description: "Longer deep work" },
]

export function OnboardingContent() {
  const [step, setStep] = useState(1)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedStudyTime, setSelectedStudyTime] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null)

  const totalSteps = 6

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    )
  }

  const canProceed = () => {
    switch (step) {
      case 1: return true
      case 2: return selectedYear !== null
      case 3: return selectedSubjects.length > 0
      case 4: return selectedStudyTime !== null
      case 5: return selectedDuration !== null
      case 6: return true
      default: return false
    }
  }

  const nextStep = () => {
    if (step < totalSteps && canProceed()) {
      setStep(step + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-violet-50/30 flex flex-col items-center justify-center p-6">
      {/* Progress Indicator */}
      {step > 1 && step < 6 && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {[2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 w-8 rounded-full transition-all duration-300",
                s < step ? "bg-primary" : s === step ? "bg-primary/60" : "bg-border"
              )}
            />
          ))}
        </div>
      )}

      {/* Step 1: Welcome */}
      {step === 1 && (
        <Card className="w-full max-w-md border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
          <CardContent className="p-8 text-center">
            {/* Logo */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              Welcome to Study Buddy
            </h1>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              Study Buddy helps you break assignments into smaller steps and automatically plans when you should study.
            </p>

            <Button 
              onClick={nextStep}
              size="lg" 
              className="w-full h-12 rounded-xl text-base font-semibold gap-2"
            >
              Get Started
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Year Selection */}
      {step === 2 && (
        <Card className="w-full max-w-md border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-2 text-center">
              What year are you in?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              This helps us tailor your experience
            </p>

            <div className="grid grid-cols-3 gap-2.5 mb-8">
              {yearOptions.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    selectedYear === year
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "bg-muted/50 text-foreground hover:bg-muted"
                  )}
                >
                  {year}
                </button>
              ))}
            </div>

            <Button 
              onClick={nextStep}
              disabled={!canProceed()}
              size="lg" 
              className="w-full h-12 rounded-xl text-base font-semibold gap-2"
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Subject Selection */}
      {step === 3 && (
        <Card className="w-full max-w-lg border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-2 text-center">
              What subjects are you studying?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Select all that apply
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-8">
              {subjectOptions.map((subject) => {
                const isSelected = selectedSubjects.includes(subject.name)
                return (
                  <button
                    key={subject.name}
                    onClick={() => toggleSubject(subject.name)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 text-primary ring-2 ring-primary/30"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    )}
                  >
                    <div className={cn("w-3 h-3 rounded-full shrink-0", subject.color)} />
                    <span className="flex-1 text-left">{subject.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </button>
                )
              })}
            </div>

            <Button 
              onClick={nextStep}
              disabled={!canProceed()}
              size="lg" 
              className="w-full h-12 rounded-xl text-base font-semibold gap-2"
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Study Time */}
      {step === 4 && (
        <Card className="w-full max-w-md border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-2 text-center">
              When do you usually study?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              We will schedule tasks around your preferences
            </p>

            <div className="space-y-2.5 mb-8">
              {studyTimeOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedStudyTime(option.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200",
                    selectedStudyTime === option.label
                      ? "bg-primary/10 ring-2 ring-primary/30"
                      : "bg-muted/50 hover:bg-muted"
                  )}
                >
                  <div className="text-left">
                    <p className={cn(
                      "text-sm font-medium",
                      selectedStudyTime === option.label ? "text-primary" : "text-foreground"
                    )}>
                      {option.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  {selectedStudyTime === option.label && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <Button 
              onClick={nextStep}
              disabled={!canProceed()}
              size="lg" 
              className="w-full h-12 rounded-xl text-base font-semibold gap-2"
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Study Duration */}
      {step === 5 && (
        <Card className="w-full max-w-md border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-2 text-center">
              How long do you prefer to study on school nights?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              We will size your tasks to fit
            </p>

            <div className="space-y-2.5 mb-8">
              {studyDurationOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedDuration(option.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200",
                    selectedDuration === option.label
                      ? "bg-primary/10 ring-2 ring-primary/30"
                      : "bg-muted/50 hover:bg-muted"
                  )}
                >
                  <div className="text-left">
                    <p className={cn(
                      "text-sm font-medium",
                      selectedDuration === option.label ? "text-primary" : "text-foreground"
                    )}>
                      {option.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  {selectedDuration === option.label && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <Button 
              onClick={nextStep}
              disabled={!canProceed()}
              size="lg" 
              className="w-full h-12 rounded-xl text-base font-semibold gap-2"
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Add First Assignment */}
      {step === 6 && (
        <Card className="w-full max-w-md border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
              You are all set!
            </h2>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              Let us add your first assignment and create a study plan together.
            </p>

            <Button 
              asChild
              size="lg" 
              className="w-full h-12 rounded-xl text-base font-semibold gap-2"
            >
              <Link href="/add-schoolwork">
                Add School Work
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>

            <Button 
              asChild
              variant="ghost"
              size="lg" 
              className="w-full h-12 rounded-xl text-base mt-3"
            >
              <Link href="/">
                Skip for now
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
