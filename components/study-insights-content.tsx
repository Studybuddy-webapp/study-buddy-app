"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Clock, Target, Flame, BookOpen } from "lucide-react"

export function StudyInsightsContent() {
  const stats = [
    { label: "Tasks Completed", value: "24", change: "+8 this week", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Study Hours", value: "12.5h", change: "+3h from last week", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Current Streak", value: "5 days", change: "Personal best!", icon: Flame, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Assignments Done", value: "3/5", change: "2 in progress", icon: BookOpen, color: "text-violet-600", bg: "bg-violet-50" },
  ]

  const subjects = [
    { name: "English", hours: 4.5, progress: 75, color: "bg-rose-400" },
    { name: "Science", hours: 3.2, progress: 60, color: "bg-emerald-400" },
    { name: "History", hours: 2.8, progress: 45, color: "bg-amber-400" },
    { name: "Maths", hours: 2.0, progress: 30, color: "bg-blue-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-violet-50/50">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Study Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your progress and see how you are doing</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-border/40 shadow-sm bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    {stat.change}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-5">
        {/* Study Time by Subject */}
        <Card className="border border-border/40 shadow-sm bg-white/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Study Time by Subject
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{subject.name}</span>
                  <span className="text-xs text-muted-foreground">{subject.hours}h</span>
                </div>
                <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${subject.color}`} 
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Overview */}
        <Card className="border border-border/40 shadow-sm bg-white/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80">
                <div>
                  <p className="text-sm font-medium text-emerald-900">Great progress!</p>
                  <p className="text-xs text-emerald-700/70">You completed 8 tasks this week</p>
                </div>
                <div className="text-2xl">+40%</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">{day}</p>
                    <div className={`h-16 rounded-lg ${i < 5 ? "bg-primary/20" : "bg-muted/30"}`} 
                         style={{ height: `${20 + Math.random() * 60}px` }} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
