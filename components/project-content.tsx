"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  FlaskConical, 
  Calendar, 
  GripVertical, 
  Plus, 
  Users, 
  FileText, 
  Link2, 
  Quote, 
  Lightbulb,
  Search,
  GitCompare,
  List,
  Sparkles,
  ExternalLink,
  X
} from "lucide-react"

// Sample project data
const projectData = {
  title: "Climate Change Science Project",
  dueDate: "May 20",
  subject: "Science",
  progress: 30,
  team: [
    { name: "Jamie", initials: "JS", color: "bg-blue-400", textColor: "text-blue-600", dotColor: "bg-blue-500", role: "Research" },
    { name: "Alex", initials: "AK", color: "bg-emerald-400", textColor: "text-emerald-600", dotColor: "bg-emerald-500", role: "Slides" },
    { name: "Mia", initials: "MR", color: "bg-violet-400", textColor: "text-violet-600", dotColor: "bg-violet-500", role: "Presentation" },
  ],
}

// Helper to get team member colors by name
const getTeamMemberColors = (assignee: string) => {
  const member = projectData.team.find(m => m.name === assignee)
  if (member) {
    return { textColor: member.textColor, dotColor: member.dotColor }
  }
  // Default for "Team" or unknown assignees
  return { textColor: "text-muted-foreground", dotColor: "bg-muted-foreground" }
}

const projectOverview = {
  goal: "Create a presentation explaining the impact of climate change on coral reefs.",
  instructions: "Work with your team to research, create slides, and deliver a 10-minute class presentation. Include at least 5 credible sources.",
  deliverables: [
    "Slides presentation (15-20 slides)",
    "Research notes document",
    "Class presentation (10 min)",
  ],
}

const initialTasks = {
  research: [
    { id: "r1", title: "Find 3 sources", assignee: "Jamie" },
    { id: "r2", title: "Save key statistics", assignee: "Jamie" },
    { id: "r3", title: "Take research notes", assignee: "Jamie" },
  ],
  planning: [
    { id: "p1", title: "Create slide outline", assignee: "Alex" },
    { id: "p2", title: "Assign slide topics", assignee: "Team" },
  ],
  create: [
    { id: "c1", title: "Write introduction slide", assignee: "Alex" },
    { id: "c2", title: "Add data slides", assignee: "Alex" },
  ],
  present: [
    { id: "pr1", title: "Practice presentation", assignee: "Mia" },
    { id: "pr2", title: "Final review", assignee: "Team" },
  ],
}

const researchNotes = [
  { 
    id: 1, 
    source: "Climate.gov", 
    type: "Website",
    summary: "Explains coral bleaching causes and ocean temperature data",
    quote: "Rising ocean temperatures are the main driver of coral bleaching events worldwide.",
    url: "https://climate.gov"
  },
  { 
    id: 2, 
    source: "National Geographic", 
    type: "Article",
    summary: "Great Barrier Reef case study with before/after imagery",
    quote: "50% of the Great Barrier Reef has been lost since 1995.",
    url: "https://nationalgeographic.com"
  },
]

const columns = [
  { id: "research", title: "Research", color: "bg-blue-400" },
  { id: "planning", title: "Planning", color: "bg-amber-400" },
  { id: "create", title: "Create Slides", color: "bg-emerald-400" },
  { id: "present", title: "Present", color: "bg-violet-400" },
]

export function ProjectContent() {
  const [tasks, setTasks] = useState(initialTasks)
  const [sources, setSources] = useState(researchNotes)
  const [showAddSource, setShowAddSource] = useState(false)
  const [newSource, setNewSource] = useState({ source: "", type: "Website", summary: "", quote: "" })

  const addSource = () => {
    if (newSource.source.trim()) {
      setSources([...sources, { ...newSource, id: sources.length + 1, url: "" }])
      setNewSource({ source: "", type: "Website", summary: "", quote: "" })
      setShowAddSource(false)
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-violet-50/50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          
          {/* Project Header */}
          <div className="mb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                      {projectData.title}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Due {projectData.dueDate}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                        {projectData.subject}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress and Team */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Progress</p>
                  <div className="flex items-center gap-2">
                    <Progress value={projectData.progress} className="w-24 h-2" />
                    <span className="text-sm font-medium">{projectData.progress}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Team</p>
                  <div className="flex -space-x-2">
                    {projectData.team.map((member, i) => (
                      <Avatar key={i} className={`w-8 h-8 border-2 border-white ${member.color}`}>
                        <AvatarFallback className="text-xs text-white bg-transparent">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-12 gap-5">
            
            {/* Left Column - Project Overview + Task Board stacked */}
            <div className="col-span-8 space-y-5">
              
              {/* Project Overview - Full width above task board */}
              <Card className="border border-border/40 shadow-sm bg-white/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Goal</p>
                      <p className="text-sm text-foreground leading-relaxed">{projectOverview.goal}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Instructions</p>
                      <p className="text-sm text-foreground leading-relaxed">{projectOverview.instructions}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Deliverables</p>
                      <ul className="space-y-1.5">
                        {projectOverview.deliverables.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Task Board - Below overview */}
              <Card className="border border-border/40 shadow-sm bg-white/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <List className="w-4 h-4 text-primary" />
                    Project Task Board
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    {columns.map((column) => (
                      <div key={column.id} className="space-y-2">
                        <div className="pb-2 border-b border-border/30">
                          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                            {column.title}
                          </span>
                        </div>
                        
                        <div className="space-y-2 min-h-[200px]">
                          {tasks[column.id as keyof typeof tasks]?.map((task) => {
                            const { textColor, dotColor } = getTeamMemberColors(task.assignee)
                            return (
                              <div
                                key={task.id}
                                className="group p-2.5 rounded-lg bg-white border border-border/50 shadow-sm hover:shadow-md hover:border-border transition-all cursor-grab"
                              >
                                <div className="flex items-start gap-2">
                                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground leading-tight">{task.title}</p>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                      <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                                      <span className={`text-xs font-medium ${textColor}`}>{task.assignee}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full h-8 text-xs text-muted-foreground hover:text-foreground justify-start gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add task
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Team, Sources, Study Buddy */}
            <div className="col-span-4 space-y-4">
              
              {/* Team Members */}
              <Card className="border border-border/40 shadow-sm bg-white/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {projectData.team.map((member, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <Avatar className={`w-8 h-8 ${member.color}`}>
                        <AvatarFallback className="text-xs text-white bg-transparent">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-muted-foreground hover:text-foreground justify-start gap-1.5 mt-2">
                    <Plus className="w-3.5 h-3.5" />
                    Add team member
                  </Button>
                </CardContent>
              </Card>

              {/* Sources & Evidence */}
              <Card className="border border-border/40 shadow-sm bg-white/80">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-primary" />
                      Sources & Evidence
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={() => setShowAddSource(true)}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {showAddSource && (
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Add New Source</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowAddSource(false)}>
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <Input 
                        placeholder="Source name..."
                        value={newSource.source}
                        onChange={(e) => setNewSource({ ...newSource, source: e.target.value })}
                        className="h-8 text-sm"
                      />
                      <Input 
                        placeholder="Summary..."
                        value={newSource.summary}
                        onChange={(e) => setNewSource({ ...newSource, summary: e.target.value })}
                        className="h-8 text-sm"
                      />
                      <Textarea 
                        placeholder="Key quote or evidence..."
                        value={newSource.quote}
                        onChange={(e) => setNewSource({ ...newSource, quote: e.target.value })}
                        className="text-sm min-h-[60px] resize-none"
                      />
                      <Button size="sm" className="w-full h-8 text-xs" onClick={addSource}>
                        Save Source
                      </Button>
                    </div>
                  )}
                  
                  {sources.map((source) => (
                    <div key={source.id} className="p-2.5 rounded-lg bg-muted/20 border border-border/30 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{source.source}</p>
                          <span className="text-xs text-muted-foreground">{source.type}</span>
                        </div>
                        {source.url && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{source.summary}</p>
                      {source.quote && (
                        <div className="flex gap-1.5 mt-1">
                          <Quote className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                          <p className="text-xs text-foreground italic leading-relaxed">"{source.quote}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Study Buddy Help */}
              <Card className="border border-border/40 shadow-sm bg-gradient-to-br from-primary/5 to-violet-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Study Buddy Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="secondary" size="sm" className="w-full h-9 justify-start gap-2 text-sm">
                    <Search className="w-4 h-4" />
                    Suggest research angles
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full h-9 justify-start gap-2 text-sm">
                    <Lightbulb className="w-4 h-4" />
                    Explain this source simply
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full h-9 justify-start gap-2 text-sm">
                    <GitCompare className="w-4 h-4" />
                    Help me compare sources
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full h-9 justify-start gap-2 text-sm">
                    <List className="w-4 h-4" />
                    Turn notes into an outline
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
