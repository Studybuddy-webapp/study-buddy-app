"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, ArrowRight, Sparkles, Users, Presentation, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { saveAssignment, typeToReviewRoute } from "@/lib/assignments"

const subjects = [
  { name: "English", color: "bg-rose-400" },
  { name: "History", color: "bg-amber-400" },
  { name: "Science", color: "bg-emerald-400" },
  { name: "Maths", color: "bg-blue-400" },
  { name: "Geography", color: "bg-cyan-400" },
  { name: "Art", color: "bg-pink-400" },
  { name: "Music", color: "bg-orange-400" },
  { name: "Other", color: "bg-slate-400" },
]

const assignmentTypes = [
  { name: "Essay", icon: "pencil" },
  { name: "Report", icon: "file" },
  { name: "Project", icon: "folder" },
  { name: "Group Project", icon: "users" },
  { name: "Presentation", icon: "slides" },
  { name: "Speech", icon: "mic" },
  { name: "Exam", icon: "book" },
]

export function NewAssignmentContent() {
  const router = useRouter()
  const [inputMethod, setInputMethod] = useState<"upload" | "paste" | null>(null)
  const [selectedType, setSelectedType] = useState<string>("Essay")
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!title.trim() || !subject || !dueDate) {
      return
    }

    setIsSubmitting(true)

    // Save the assignment
    const newAssignment = saveAssignment({
      title: title.trim(),
      subject,
      dueDate,
      type: selectedType,
      description: description.trim() || undefined,
    })

    // Navigate to review plan with the assignment ID
    // Essay uses original /review-plan, other types have their own pages
    const reviewRoute = typeToReviewRoute[selectedType.toLowerCase()] || "/review-plan"
    router.push(`${reviewRoute}?id=${newAssignment.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-violet-50/60">
      <div className="px-6 py-6 lg:px-8">
        {/* Header */}
        <div className="mb-5">
          <div className="mb-1.5 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary">New work</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            What are you working on?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste or upload your instructions and Study Buddy will guide you through it.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Main Form */}
          <div className="space-y-4">
            {/* Upload Options Card */}
            <Card className="border-0 bg-white/80 shadow-sm">
              <CardContent className="p-4">
                <Label className="mb-2.5 block text-xs font-semibold text-foreground">
                  1. Add your instructions
                </Label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200",
                      inputMethod === "paste" 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 bg-muted/20 hover:bg-muted/40"
                    )}
                    onClick={() => setInputMethod("paste")}
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      inputMethod === "paste" ? "bg-primary/15" : "bg-white"
                    )}>
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Paste Instructions</p>
                      <p className="text-xs text-muted-foreground">Copy from anywhere</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200",
                      inputMethod === "upload" 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 bg-muted/20 hover:bg-muted/40"
                    )}
                    onClick={() => setInputMethod("upload")}
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      inputMethod === "upload" ? "bg-primary/15" : "bg-white"
                    )}>
                      <Upload className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Upload Sheet</p>
                      <p className="text-xs text-muted-foreground">Photo or PDF</p>
                    </div>
                  </button>
                </div>

                {inputMethod === "paste" && (
                  <div className="mt-3">
                    <Textarea
                      placeholder="Paste your assignment instructions here..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[80px] rounded-xl border-input/50 bg-white text-sm"
                    />
                  </div>
                )}

                {inputMethod === "upload" && (
                  <div className="mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 text-center">
                    <Upload className="mb-1.5 h-6 w-6 text-primary/60" />
                    <p className="text-sm font-medium text-foreground">Drop your file here</p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assignment Details Card */}
            <Card className="border-0 bg-white/80 shadow-sm">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-xs font-semibold text-foreground">2. A few quick details</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="title" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Title <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., The Great Gatsby Essay"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-10 rounded-xl border-input/50 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Subject <span className="text-rose-500">*</span>
                    </Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger id="subject" className="h-10 rounded-xl border-input/50 bg-white text-sm">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {subjects.map((subj) => (
                          <SelectItem key={subj.name} value={subj.name.toLowerCase()} className="rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className={cn("h-2 w-2 rounded-full", subj.color)} />
                              {subj.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="due-date" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Due Date <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-10 w-full max-w-[200px] rounded-xl border-input/50 bg-white text-sm"
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Type of Work
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {assignmentTypes.map((type) => (
                      <Button
                        key={type.name}
                        type="button"
                        variant={selectedType === type.name ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 rounded-lg px-3 text-xs font-medium transition-all",
                          selectedType === type.name
                            ? "shadow-sm"
                            : "border-input/50 bg-white text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        )}
                        onClick={() => setSelectedType(type.name)}
                      >
                        {type.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Fields Based on Assignment Type */}
            {(selectedType === "Project" || selectedType === "Group Project") && (
              <Card className="border-0 bg-white/80 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <h3 className="text-xs font-semibold text-foreground">Project Details</h3>
                  </div>
                  
                  {selectedType === "Group Project" && (
                    <div>
                      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Team Members
                      </Label>
                      <Input
                        placeholder="e.g., Sarah, Mike, Emma"
                        className="h-10 rounded-xl border-input/50 bg-white text-sm"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Key Deliverables
                    </Label>
                    <Textarea
                      placeholder="What do you need to submit? e.g., Report, Poster, Model..."
                      className="min-h-[60px] rounded-xl border-input/50 bg-white text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {(selectedType === "Presentation" || selectedType === "Speech") && (
              <Card className="border-0 bg-white/80 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Presentation className="h-3.5 w-3.5 text-primary" />
                    <h3 className="text-xs font-semibold text-foreground">
                      {selectedType === "Presentation" ? "Presentation" : "Speech"} Details
                    </h3>
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Time Limit
                      </Label>
                      <Input
                        placeholder="e.g., 5 minutes"
                        className="h-10 rounded-xl border-input/50 bg-white text-sm"
                      />
                    </div>
                    {selectedType === "Presentation" && (
                      <div>
                        <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                          Number of Slides
                        </Label>
                        <Input
                          placeholder="e.g., 10-15 slides"
                          className="h-10 rounded-xl border-input/50 bg-white text-sm"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Audience
                    </Label>
                    <Input
                      placeholder="e.g., Class, Teachers, School assembly"
                      className="h-10 rounded-xl border-input/50 bg-white text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedType === "Exam" && (
              <Card className="border-0 bg-white/80 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    <h3 className="text-xs font-semibold text-foreground">Exam Details</h3>
                  </div>
                  
                  <div>
                    <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Exam Date
                    </Label>
                    <Input
                      type="date"
                      className="h-10 w-full max-w-[200px] rounded-xl border-input/50 bg-white text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Topics to Revise
                    </Label>
                    <Textarea
                      placeholder="List the main topics you need to study..."
                      className="min-h-[60px] rounded-xl border-input/50 bg-white text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Study Materials
                    </Label>
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-input/50 bg-white/50 p-4 text-center">
                      <Upload className="mb-1 h-5 w-5 text-muted-foreground/60" />
                      <p className="text-xs text-muted-foreground">Upload notes or study materials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              disabled={!title.trim() || !subject || !dueDate || isSubmitting}
              size="lg" 
              className="h-11 w-full gap-2 rounded-xl bg-primary text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {isSubmitting ? "Creating..." : "Start breaking it down"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
