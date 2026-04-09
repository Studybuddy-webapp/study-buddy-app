"use client"

import { 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  CalendarOff,
  BookOpen,
  FlaskConical,
  FileText,
  Calculator,
  ScrollText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Link from "next/link"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// Subject colors and icons - consistent across the app
// English = red/rose, Maths = blue, Science = green/emerald, History = yellow/amber
const subjectColors = {
  English: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", dot: "bg-rose-400", icon: BookOpen },
  Maths: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-400", icon: Calculator },
  Science: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-400", icon: FlaskConical },
  History: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400", icon: ScrollText },
}

// Default fallback for subjects not in the list
const defaultSubjectColors = { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700", dot: "bg-slate-400", icon: FileText }

const calendarData = [
  {
    date: 9,
    day: "Mon",
    isToday: true,
    tasks: [
      { title: "Essay Draft", duration: "45 min", subject: "English" as keyof typeof subjectColors, priority: "High" },
      { title: "Algebra Revision", duration: "30 min", subject: "Maths" as keyof typeof subjectColors },
    ],
  },
  {
    date: 10,
    day: "Tue",
    tasks: [
      { title: "Lab Report Research", duration: "45 min", subject: "Science" as keyof typeof subjectColors },
      { title: "Chapter Reading", duration: "25 min", subject: "History" as keyof typeof subjectColors },
      { title: "Equations Practice", duration: "20 min", subject: "Maths" as keyof typeof subjectColors },
    ],
    overflow: 1,
  },
  {
    date: 11,
    day: "Wed",
    tasks: [
      { title: "Project Planning", duration: "40 min", subject: "History" as keyof typeof subjectColors },
      { title: "Exam Review", duration: "35 min", subject: "Science" as keyof typeof subjectColors },
    ],
  },
  {
    date: 12,
    day: "Thu",
    tasks: [
      { title: "Speech Rehearsal", duration: "25 min", subject: "English" as keyof typeof subjectColors },
    ],
  },
  {
    date: 13,
    day: "Fri",
    tasks: [
      { title: "Essay Final Draft", duration: "40 min", subject: "English" as keyof typeof subjectColors, priority: "High" },
      { title: "Practice Problems", duration: "30 min", subject: "Maths" as keyof typeof subjectColors },
    ],
  },
  {
    date: 14,
    day: "Sat",
    tasks: [
      { title: "Presentation Prep", duration: "50 min", subject: "Science" as keyof typeof subjectColors },
    ],
  },
  {
    date: 15,
    day: "Sun",
    tasks: [
      { title: "Weekly Review", duration: "20 min", subject: "History" as keyof typeof subjectColors },
    ],
  },
]

const upcomingDeadlines = [
  { title: "English Essay", due: "Due Tuesday", subject: "English" as keyof typeof subjectColors },
  { title: "Maths Exam", due: "In 9 days", subject: "Maths" as keyof typeof subjectColors },
  { title: "History Project", due: "Due Friday", subject: "History" as keyof typeof subjectColors },
  { title: "Science Presentation", due: "3 sessions left", subject: "Science" as keyof typeof subjectColors },
]

// Helper to get subject config with fallback
function getSubjectConfig(subject: string) {
  return subjectColors[subject as keyof typeof subjectColors] || defaultSubjectColors
}

export function CalendarContent() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex-1 overflow-auto">
        {/* Soft pastel gradient background */}
        <div className="min-h-full bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-violet-50/50">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Planning</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Your study plan is automatically organised around deadlines, workload, and priority.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 bg-white/80 border-border/50 shadow-sm">
                Today
              </Button>
              <div className="flex rounded-xl bg-white/80 border border-border/50 shadow-sm overflow-hidden">
                <Button variant="ghost" size="sm" className="rounded-none h-9 px-4 bg-primary/10 text-primary font-medium">
                  Week
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none h-9 px-4 text-muted-foreground">
                  Month
                </Button>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 gap-2 bg-white/80 border-border/50 shadow-sm">
                <RefreshCw className="w-3.5 h-3.5" />
                Auto-reschedule
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 gap-2 bg-white/80 border-border/50 shadow-sm">
                <CalendarOff className="w-3.5 h-3.5" />
                Add unavailable time
              </Button>
            </div>
          </div>

          {/* Upcoming Deadlines Strip */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {upcomingDeadlines.map((deadline, index) => {
              const config = getSubjectConfig(deadline.subject)
              const IconComponent = config.icon
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-2xl px-4 py-3 border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md",
                    config.bg,
                    config.border
                  )}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className={cn("w-4 h-4 shrink-0", config.text)} />
                    <p className={cn("font-medium text-sm", config.text)}>{deadline.title}</p>
                  </div>
                  <p className={cn("text-xs mt-1 opacity-75 ml-6", config.text)}>{deadline.due}</p>
                </div>
              )
            })}
          </div>

          {/* Full-Width Weekly Calendar */}
          <Card className="border border-border/40 shadow-sm bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden mb-5">
            <CardContent className="p-0">
              {/* Calendar Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h2 className="font-semibold text-foreground">This Week</h2>
                    <p className="text-xs text-muted-foreground">9 - 15 March</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", subjectColors.English.dot)} />
                    <span>English</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", subjectColors.Maths.dot)} />
                    <span>Maths</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", subjectColors.Science.dot)} />
                    <span>Science</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", subjectColors.History.dot)} />
                    <span>History</span>
                  </div>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-border/30">
                {days.map((day) => (
                  <div
                    key={day}
                    className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid - Auto-height based on tasks */}
              <div className="grid grid-cols-7">
                {calendarData.map((dayData) => {
                  return (
                    <div
                      key={dayData.date}
                      className={cn(
                        "min-h-[180px] p-3 border-r border-border/20 last:border-r-0",
                        dayData.isToday && "bg-gradient-to-b from-primary/5 to-transparent"
                      )}
                    >
                      <div
                        className={cn(
                          "mb-3 flex h-8 w-8 items-center justify-center rounded-xl text-sm font-semibold",
                          dayData.isToday
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                            : "text-foreground"
                        )}
                      >
                        {dayData.date}
                      </div>
                      <div className="space-y-2">
                        {dayData.tasks.map((task, taskIndex) => {
                          const config = getSubjectConfig(task.subject)
                          const IconComponent = config.icon
                          // Generate workspace link based on subject
                          const workspaceHref = `/subject-workspace?subject=${task.subject.toLowerCase()}`
                          return (
                            <Tooltip key={taskIndex}>
                              <TooltipTrigger asChild>
                                <Link
                                  href={workspaceHref}
                                  className={cn(
                                    "block group cursor-pointer rounded-xl p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg border",
                                    config.bg,
                                    config.border
                                  )}
                                >
                                  <div className="flex items-start gap-2">
                                    <IconComponent className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", config.text)} />
                                    <div className="flex-1 min-w-0">
                                      {/* Allow text to wrap to two lines */}
                                      <p className={cn("text-xs font-medium leading-tight line-clamp-2", config.text)}>
                                        {task.title}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className={cn("text-[10px] opacity-75", config.text)}>
                                          {task.duration}
                                        </span>
                                        {task.priority && (
                                          <span className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded-full",
                                            task.priority === "High" 
                                              ? "bg-rose-100 text-rose-600" 
                                              : "bg-amber-100 text-amber-600"
                                          )}>
                                            {task.priority}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent 
                                side="top" 
                                className="max-w-[200px] text-center"
                              >
                                <p className="font-medium">{task.title}</p>
                                <p className="text-xs text-muted-foreground">{task.subject} • {task.duration}</p>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

        </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
