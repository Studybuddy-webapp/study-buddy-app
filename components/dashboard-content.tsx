"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Play, ArrowRight, BookOpen, FlaskConical, Globe, Calculator, CheckCircle2, Sparkles, Search, Plus } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

// Types for assignment data
interface Task {
  id: string
  title: string
  assignment: string
  subject: string
  estimatedTime: string
  completed: boolean
}

interface Assignment {
  id: string
  title: string
  subject: string
  progress: number
  nextTask: string
  dueDate: string
}

// Subject configuration for colors and icons
const subjectConfig: Record<string, { color: string; lightColor: string; borderColor: string; textColor: string; icon: typeof BookOpen }> = {
  History: { color: "bg-amber-400", lightColor: "bg-amber-50", borderColor: "border-amber-100", textColor: "text-amber-600", icon: Globe },
  Biology: { color: "bg-emerald-400", lightColor: "bg-emerald-50", borderColor: "border-emerald-100", textColor: "text-emerald-600", icon: FlaskConical },
  Science: { color: "bg-emerald-400", lightColor: "bg-emerald-50", borderColor: "border-emerald-100", textColor: "text-emerald-600", icon: FlaskConical },
  Maths: { color: "bg-blue-400", lightColor: "bg-blue-50", borderColor: "border-blue-100", textColor: "text-blue-600", icon: Calculator },
  English: { color: "bg-rose-400", lightColor: "bg-rose-50", borderColor: "border-rose-100", textColor: "text-rose-600", icon: BookOpen },
}

const getSubjectConfig = (subject: string) => {
  return subjectConfig[subject] || { color: "bg-slate-400", lightColor: "bg-slate-50", borderColor: "border-slate-100", textColor: "text-slate-600", icon: BookOpen }
}

export function DashboardContent() {
  // In a real app, this would come from a database/API
  // Empty arrays = no assignments, show empty state
  const [tasks] = useState<Task[]>([])
  const [assignments] = useState<Assignment[]>([])

  const hasAssignments = assignments.length > 0 || tasks.length > 0

  return (
    <div className="flex-1 overflow-auto">
      {/* Soft pastel gradient background */}
      <div className="min-h-full bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-violet-50/60">
        {hasAssignments ? (
          /* Normal State - Has Assignments */
          <div className="max-w-[1600px] mx-auto px-6 py-6">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-amber-500">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Welcome back!
                </h1>
                <div className="flex gap-1 ml-1">
                  <span className="w-2 h-2 rounded-full bg-rose-300"></span>
                  <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                </div>
                <div className="text-amber-400 ml-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9 h-10 rounded-xl bg-white/80 border-border/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="flex gap-6">
              {/* Left Column - Today's Focus */}
              <div className="flex-1 min-w-0 space-y-5">
                {/* Today's Focus Section - Single Priority Task */}
                {tasks.length > 0 && (() => {
                  // Get the highest priority task (first non-completed task)
                  const priorityTask = tasks.find(t => !t.completed)
                  if (!priorityTask) return null
                  
                  const config = getSubjectConfig(priorityTask.subject)
                  const IconComponent = config.icon
                  
                  return (
                    <div>
                      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Today's Focus</h2>
                      <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex">
                            {/* Color accent bar */}
                            <div className={`w-2 self-stretch ${config.color} shrink-0`} />
                            
                            <div className="flex-1 p-6">
                              {/* Header */}
                              <div className="flex items-start gap-4 mb-5">
                                <div className={`w-14 h-14 rounded-2xl ${config.lightColor} border ${config.borderColor} flex items-center justify-center shrink-0`}>
                                  <IconComponent className={`w-7 h-7 ${config.textColor}`} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                    Here's what to focus on right now
                                  </p>
                                  <h3 className="text-xl font-semibold text-foreground leading-tight">
                                    {priorityTask.title}
                                  </h3>
                                  <p className="text-muted-foreground mt-1">
                                    {priorityTask.assignment}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Footer with time and CTA */}
                              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="w-5 h-5" />
                                  <span className="text-sm font-medium">{priorityTask.estimatedTime} estimated</span>
                                </div>
                                
                                <Button 
                                  asChild
                                  size="lg"
                                  className="rounded-xl gap-2 shadow-md px-6 bg-primary hover:bg-primary/90"
                                >
                                  <Link href={`/assignment-workspace?id=${priorityTask.id}`}>
                                    <Play className="w-5 h-5" />
                                    Continue Task
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })()}
              </div>

              {/* Right Column - Assignments */}
              <div className="w-80 shrink-0 space-y-5">
                {assignments.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assignments</h2>
                      <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground gap-1 -mr-2 h-auto p-1.5 text-xs">
                        <Link href="/workspace">
                          See all
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {assignments.map((assignment) => {
                        const config = getSubjectConfig(assignment.subject)
                        const IconComponent = config.icon
                        return (
                          <Card 
                            key={assignment.id} 
                            className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200"
                          >
                            <CardContent className="p-4">
                              {/* Title and Subject */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center shrink-0 shadow-sm`}>
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-foreground text-sm truncate leading-tight">
                                    {assignment.title}
                                  </h3>
                                  <p className="text-xs text-muted-foreground">
                                    {assignment.subject}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Progress */}
                              <div className="flex items-center gap-2.5 mb-3">
                                <Progress value={assignment.progress} className="h-2 flex-1" />
                                <span className="text-xs font-medium text-muted-foreground w-10 text-right">{assignment.progress}%</span>
                              </div>
                              
                              {/* Next Task + Continue */}
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-muted-foreground truncate flex-1">
                                  Next: {assignment.nextTask}
                                </p>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  className="rounded-lg h-7 px-3 text-xs shrink-0 bg-secondary/80 hover:bg-secondary"
                                  asChild
                                >
                                  <Link href={`/assignment-workspace?id=${assignment.id}`}>
                                    Continue Task
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State - No Assignments */
          <div className="min-h-full flex items-center justify-center px-6 py-12">
            <Card className="border-0 shadow-lg bg-white rounded-2xl max-w-md w-full">
              <CardContent className="p-8 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                
                {/* Title */}
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Welcome to Study Buddy
                </h2>
                
                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Let&apos;s get your first school work organised so you know exactly what to do.
                </p>
                
                {/* CTA Button */}
                <Button asChild className="rounded-xl gap-2 px-6 h-11 shadow-sm">
                  <Link href="/add-schoolwork">
                    <Plus className="w-4 h-4" />
                    Add School Work
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
