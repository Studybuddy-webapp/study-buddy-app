"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2, 
  Circle,
  Clock,
  Sparkles,
  ChevronRight,
  FileText,
  Mic,
  Target,
  Lightbulb,
  ImageIcon,
  MessageSquare,
  AlertCircle,
  ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"

// Presentation data
const presentationData = {
  title: "Renewable Energy Presentation",
  subject: "Science",
  dueDate: "May 20",
  daysLeft: 12,
  progress: 35,
  estimatedTime: "4 minutes",
  team: [
    { name: "Jamie", initials: "JS", color: "bg-blue-400" },
    { name: "Alex", initials: "AK", color: "bg-emerald-400" },
  ],
}

const slides = [
  { id: 1, name: "Title / Topic", status: "complete", title: "Renewable Energy: Our Future", message: "Introduce the topic and grab attention" },
  { id: 2, name: "Background", status: "complete", title: "What is Renewable Energy?", message: "Define key terms and context" },
  { id: 3, name: "Main Point", status: "current", title: "Why Renewable Energy Matters", message: "Renewable energy reduces carbon emissions significantly" },
  { id: 4, name: "Evidence", status: "todo", title: "Statistics & Data", message: "Present supporting statistics and research" },
  { id: 5, name: "Conclusion", status: "todo", title: "Call to Action", message: "Summarize and inspire action" },
]

const speakerNotes = {
  3: [
    "Explain why this statistic matters",
    "Mention Australia's increase in solar adoption",
    "Transition to the next slide by linking evidence to solutions",
  ]
}

const feedbackTips = [
  { type: "warning", message: "Slide 2 has too much text" },
  { type: "suggestion", message: "Your conclusion needs a stronger final message" },
  { type: "tip", message: "Slow down when explaining your evidence" },
  { type: "suggestion", message: "Make Slide 4 more visual" },
  { type: "tip", message: "Use fewer words on your title slide" },
]

const tabs = ["Slide Plan", "Speaker Notes", "Practice Mode", "Feedback Tips"]

export function PresentationWorkspaceContent() {
  const [activeTab, setActiveTab] = useState("Slide Plan")
  const [selectedSlide, setSelectedSlide] = useState(3)
  const [isPracticing, setIsPracticing] = useState(false)
  const [practiceTime, setPracticeTime] = useState(220) // 3:40 in seconds
  
  const currentSlide = slides.find(s => s.id === selectedSlide) || slides[2]
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-violet-50/30 to-fuchsia-50/20">
      {/* Back Navigation */}
      <div className="shrink-0 px-6 pt-4 pb-2">
        <Link 
          href={`/subject-workspace?subject=${presentationData.subject.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {presentationData.subject}
        </Link>
      </div>
      
      {/* Full-Width Header */}
      <header className="shrink-0 border-b border-border/30 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Title & Meta */}
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{presentationData.title}</h1>
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                  {presentationData.subject}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Due {presentationData.dueDate}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                  {presentationData.daysLeft} days left
                </span>
                <span className="flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5" />
                  {presentationData.estimatedTime}
                </span>
              </div>
            </div>
            
            {/* Team Avatars */}
            <div className="flex -space-x-2 ml-4">
              {presentationData.team.map((member, i) => (
                <Avatar key={i} className={`h-8 w-8 border-2 border-white ${member.color}`}>
                  <AvatarFallback className="text-xs font-medium text-white bg-transparent">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          {/* Center: Progress */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Progress</span>
              <div className="w-32">
                <Progress value={presentationData.progress} className="h-2" />
              </div>
              <span className="text-sm font-semibold text-foreground">{presentationData.progress}%</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 gap-2 rounded-xl border-border/50">
              <Play className="h-4 w-4" />
              Start Practice
            </Button>
            <Button className="h-10 gap-2 rounded-xl bg-primary shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
              Mark Complete
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 px-6 pb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors",
                activeTab === tab
                  ? "bg-white text-foreground border-t border-l border-r border-border/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Support Panel */}
        <div className="w-72 shrink-0 overflow-y-auto border-r border-border/30 bg-white/50 p-4 space-y-4">
          {/* Presentation Brief */}
          <Card className="border border-border/40 shadow-sm bg-white/90">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Presentation Brief
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground leading-relaxed">
                Explain how renewable energy reduces carbon emissions
              </p>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Requirements</p>
                <ul className="space-y-1">
                  <li className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                    4-5 minute presentation
                  </li>
                  <li className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                    Include 5 slides
                  </li>
                  <li className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                    Use at least 2 statistics
                  </li>
                  <li className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                    Speak clearly and confidently
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Slide Checklist */}
          <Card className="border border-border/40 shadow-sm bg-white/90">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Slide Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {slides.map((slide) => (
                  <button
                    key={slide.id}
                    onClick={() => setSelectedSlide(slide.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors",
                      selectedSlide === slide.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50"
                    )}
                  >
                    {slide.status === "complete" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : slide.status === "current" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/20 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={cn(
                      "text-sm truncate",
                      slide.status === "complete" && "text-muted-foreground",
                      slide.status === "current" && "font-medium"
                    )}>
                      Slide {slide.id} — {slide.name}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Buddy Help */}
          <Card className="border border-border/40 shadow-sm bg-white/90">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Study Buddy Help
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {[
                "Suggest slide structure",
                "Improve slide flow",
                "Turn notes into points",
                "Suggest stronger evidence",
                "Make this simpler",
                "Check presentation flow"
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 justify-start text-xs font-normal text-muted-foreground hover:text-foreground hover:bg-primary/5"
                >
                  <ChevronRight className="w-3 h-3 mr-1.5" />
                  {action}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center Active Work Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "Slide Plan" && (
            <div className="space-y-5">
              {/* Current Slide Editor */}
              <Card className="border border-border/40 shadow-md bg-white">
                <CardHeader className="pb-3 border-b border-border/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      Slide {currentSlide.id} — {currentSlide.name}
                    </CardTitle>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      currentSlide.status === "complete" && "bg-emerald-100 text-emerald-700",
                      currentSlide.status === "current" && "bg-blue-100 text-blue-700",
                      currentSlide.status === "todo" && "bg-muted text-muted-foreground"
                    )}>
                      {currentSlide.status === "complete" ? "Complete" : currentSlide.status === "current" ? "In Progress" : "To Do"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Slide Title</label>
                    <Input 
                      defaultValue={currentSlide.title}
                      className="mt-1.5 h-10 rounded-lg border-border/50"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Main Message</label>
                    <Textarea 
                      defaultValue={currentSlide.message}
                      className="mt-1.5 min-h-[80px] rounded-lg border-border/50 resize-none"
                      placeholder="What's the key point of this slide?"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Bullet Points</label>
                    <Textarea 
                      defaultValue={currentSlide.id === 3 ? "• Solar and wind create cleaner electricity\n• Adoption is increasing in Australia\n• Costs have fallen over time" : ""}
                      className="mt-1.5 min-h-[100px] rounded-lg border-border/50 resize-none"
                      placeholder="Add your main points..."
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Visual / Image Idea</label>
                      <div className="mt-1.5 flex items-center gap-2 p-3 rounded-lg border border-dashed border-border/50 bg-muted/30">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Add image or describe visual</span>
                      </div>
                    </div>
                    <div className="w-40">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
                      <select className="mt-1.5 w-full h-10 rounded-lg border border-border/50 bg-white px-3 text-sm">
                        <option>To Do</option>
                        <option selected={currentSlide.status === "current"}>In Progress</option>
                        <option>Complete</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Slide Overview */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">All Slides</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {slides.map((slide) => (
                    <button
                      key={slide.id}
                      onClick={() => setSelectedSlide(slide.id)}
                      className={cn(
                        "shrink-0 w-40 p-3 rounded-xl border transition-all text-left",
                        selectedSlide === slide.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/40 bg-white hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium text-muted-foreground">Slide {slide.id}</span>
                        {slide.status === "complete" && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{slide.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Speaker Notes" && (
            <Card className="border border-border/40 shadow-md bg-white">
              <CardHeader className="pb-3 border-b border-border/30">
                <CardTitle className="text-base font-semibold">
                  Speaker Notes — Slide {currentSlide.id}: {currentSlide.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-4">
                  Keep these brief - they are prompts to guide you, not a full script.
                </p>
                <Textarea 
                  defaultValue={speakerNotes[3]?.join("\n• ") ? "• " + speakerNotes[3].join("\n• ") : ""}
                  className="min-h-[300px] rounded-lg border-border/50 resize-none"
                  placeholder="• Add speaking prompts here...&#10;• Remember to pause after key points&#10;• Make eye contact with audience"
                />
              </CardContent>
            </Card>
          )}

          {activeTab === "Practice Mode" && (
            <div className="flex flex-col items-center justify-center h-full">
              <Card className="border border-border/40 shadow-lg bg-white w-full max-w-lg">
                <CardContent className="p-8 text-center space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Practice Run</h2>
                    <p className="text-muted-foreground">Target: 4-5 minutes</p>
                  </div>
                  
                  <div className="text-6xl font-bold text-primary tracking-tight">
                    {formatTime(practiceTime)}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>Current Slide:</span>
                    <span className="font-semibold text-foreground">{selectedSlide} of {slides.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      size="lg"
                      onClick={() => setIsPracticing(!isPracticing)}
                      className="h-12 w-32 gap-2 rounded-xl"
                    >
                      {isPracticing ? (
                        <>
                          <Pause className="h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5" />
                          Start
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setPracticeTime(0)}
                      className="h-12 w-12 rounded-xl p-0"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200/50">
                    <p className="text-sm text-amber-800">
                      <Lightbulb className="w-4 h-4 inline mr-1.5" />
                      You are slightly under time. Spend more time explaining Slide 4.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "Feedback Tips" && (
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm text-muted-foreground mb-4">
                Suggestions to improve your presentation
              </p>
              {feedbackTips.map((tip, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border",
                    tip.type === "warning" && "bg-amber-50/50 border-amber-200/50",
                    tip.type === "suggestion" && "bg-blue-50/50 border-blue-200/50",
                    tip.type === "tip" && "bg-emerald-50/50 border-emerald-200/50"
                  )}
                >
                  {tip.type === "warning" ? (
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  ) : tip.type === "suggestion" ? (
                    <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm text-foreground">{tip.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Support Panel */}
        <div className="w-64 shrink-0 overflow-y-auto border-l border-border/30 bg-white/50 p-4 space-y-4">
          {/* Speaker Prompts */}
          <Card className="border border-border/40 shadow-sm bg-white/90">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Mic className="w-4 h-4 text-primary" />
                Speaker Prompts
              </CardTitle>
              <p className="text-xs text-muted-foreground">Slide {currentSlide.id} — {currentSlide.name}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  Explain the statistic simply
                </li>
                <li className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  Emphasise environmental impact
                </li>
                <li className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  Pause before moving on
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Practice Summary */}
          <Card className="border border-border/40 shadow-sm bg-white/90">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Practice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sessions completed</span>
                <span className="font-medium text-foreground">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Best run</span>
                <span className="font-medium text-foreground">3:48</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target</span>
                <span className="font-medium text-foreground">4-5 min</span>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Next Step */}
          <Card className="border border-primary/20 shadow-sm bg-gradient-to-br from-primary/5 to-violet-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Next Best Step
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-foreground mb-1">
                Strengthen Slide 4
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your evidence is good, but this slide needs a clearer visual and fewer words.
              </p>
              <Button size="sm" className="w-full mt-3 h-8 rounded-lg text-xs">
                Go to Slide 4
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
