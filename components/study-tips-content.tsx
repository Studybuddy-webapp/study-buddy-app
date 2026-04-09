"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, Brain, Target, Coffee, Moon, ListChecks, Headphones, Repeat } from "lucide-react"

const tips = [
  {
    title: "Break it down",
    description: "Large assignments feel overwhelming. Break them into small, 25-minute tasks and focus on just one at a time.",
    icon: ListChecks,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    title: "Use the Pomodoro Technique",
    description: "Study for 25 minutes, then take a 5-minute break. After 4 rounds, take a longer 15-30 minute break.",
    icon: Clock,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
  {
    title: "Find your peak hours",
    description: "Notice when you focus best. Some people are morning learners, others work better at night. Study during your peak time.",
    icon: Target,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    title: "Active recall beats re-reading",
    description: "Instead of re-reading notes, test yourself. Cover your notes and try to recall the information from memory.",
    icon: Brain,
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-700",
  },
  {
    title: "Take real breaks",
    description: "During breaks, step away from screens. Stretch, get a snack, or take a short walk. Your brain needs rest to retain information.",
    icon: Coffee,
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-700",
  },
  {
    title: "Sleep is studying",
    description: "Your brain consolidates memories while you sleep. Getting 8 hours before a test is often better than an all-night cram session.",
    icon: Moon,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-700",
  },
  {
    title: "Find your focus soundtrack",
    description: "Try lo-fi music, ambient sounds, or complete silence. Experiment to find what helps you concentrate best.",
    icon: Headphones,
    color: "bg-teal-500",
    lightColor: "bg-teal-50",
    textColor: "text-teal-700",
  },
  {
    title: "Spaced repetition works",
    description: "Review material over increasing intervals (1 day, 3 days, 1 week). This builds stronger long-term memory than cramming.",
    icon: Repeat,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-700",
  },
]

export function StudyTipsContent() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
            Study Tips
          </h1>
          <p className="text-muted-foreground text-lg">
            Simple techniques to help you learn better and stress less
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip, index) => {
            const IconComponent = tip.icon
            return (
              <Card 
                key={index} 
                className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${tip.lightColor} flex items-center justify-center shrink-0`}>
                      <IconComponent className={`w-5 h-5 ${tip.textColor}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1.5">
                        {tip.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
