"use client"

// Assignment type definition
export interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: string
  type: string
  section: "assignments" | "projects" | "presentations" | "exams"
  description?: string
  steps: { title: string; description: string; time: string }[]
  createdAt: string
  progress: number
}

// Map work type to section and workspace route
export const typeToSection: Record<string, "assignments" | "projects" | "presentations" | "exams"> = {
  essay: "assignments",
  report: "assignments",
  project: "projects",
  "group project": "projects",
  presentation: "presentations",
  speech: "presentations",
  exam: "exams",
}

export const typeToWorkspace: Record<string, string> = {
  essay: "/assignment-workspace",
  report: "/report-workspace",
  project: "/project-workspace",
  "group project": "/project-workspace",
  presentation: "/presentation-workspace",
  speech: "/presentation-workspace",
  exam: "/exam-workspace",
}

// Map work type to review plan route
// Essay uses the original /review-plan route, other types have their own pages
export const typeToReviewRoute: Record<string, string> = {
  essay: "/review-plan",
  report: "/review-plan/report",
  project: "/review-plan/project",
  "group project": "/review-plan/project",
  presentation: "/review-plan/presentation",
  speech: "/review-plan/presentation",
  exam: "/review-plan/exam",
}

// Get assignments filtered by subject and section
export function getAssignmentsBySubjectAndSection(subject: string, section: string): Assignment[] {
  const assignments = getAssignments()
  return assignments.filter(a => 
    a.subject.toLowerCase() === subject.toLowerCase() && 
    a.section === section
  )
}

// Get count of assignments by subject grouped by section
export function getAssignmentCountsBySubject(subject: string): Record<string, number> {
  const assignments = getAssignments()
  const filtered = assignments.filter(a => a.subject.toLowerCase() === subject.toLowerCase())
  
  return {
    assignments: filtered.filter(a => a.section === "assignments").length,
    projects: filtered.filter(a => a.section === "projects").length,
    presentations: filtered.filter(a => a.section === "presentations").length,
    exams: filtered.filter(a => a.section === "exams").length,
  }
}

// Study plan steps by assignment type (6-9 clear, actionable steps)
export const plansByType: Record<string, { title: string; description: string; time: string; editable?: boolean }[]> = {
  essay: [
    { title: "Understand the question", description: "Read the question carefully. Underline key words and make sure you know what you're being asked to do.", time: "10 min", editable: true },
    { title: "Decide your argument", description: "What's your main point? Write one sentence that sums up what you want to say.", time: "15 min", editable: true },
    { title: "Find quotes and evidence", description: "Find 2-3 pieces of evidence that support your argument. Note where each comes from.", time: "25 min", editable: true },
    { title: "Plan your structure", description: "Sketch out your introduction, body paragraphs, and conclusion. Just bullet points.", time: "15 min", editable: true },
    { title: "Write your introduction", description: "Hook the reader, give context, and state your argument clearly.", time: "20 min", editable: true },
    { title: "Write your body paragraphs", description: "One main point per paragraph. Use your evidence. Explain why it matters.", time: "40 min", editable: true },
    { title: "Write your conclusion", description: "Summarise your argument. Don't add new points. End with impact.", time: "15 min", editable: true },
    { title: "Edit and refine", description: "Read it out loud. Fix awkward sentences. Check spelling and grammar.", time: "20 min", editable: true },
  ],
  report: [
    { title: "Understand the topic", description: "What exactly do you need to report on? Make sure you know the scope.", time: "10 min", editable: true },
    { title: "Decide section headings", description: "Break your report into clear sections. Think about what order makes sense.", time: "15 min", editable: true },
    { title: "Gather key facts", description: "Research each section. Note down the most important information.", time: "30 min", editable: true },
    { title: "Write introduction", description: "Explain what the report is about and what the reader will learn.", time: "15 min", editable: true },
    { title: "Write each section", description: "Fill in each section with facts and explanations. Use clear language.", time: "45 min", editable: true },
    { title: "Compare or explain findings", description: "If needed, analyse what the facts mean or compare different viewpoints.", time: "20 min", editable: true },
    { title: "Write conclusion", description: "Sum up the main findings. What should the reader take away?", time: "15 min", editable: true },
    { title: "Edit and check structure", description: "Make sure it flows well. Check facts, headings, and formatting.", time: "15 min", editable: true },
  ],
  project: [
    { title: "Understand the project goal", description: "What exactly do you need to create or submit? Be clear on requirements.", time: "10 min", editable: true },
    { title: "Break into tasks", description: "List all the small tasks that make up this project. Be specific.", time: "15 min", editable: true },
    { title: "Assign or plan steps", description: "Decide the order. Which tasks depend on others? What comes first?", time: "10 min", editable: true },
    { title: "Research required info", description: "Gather the knowledge you need before you start building.", time: "30 min", editable: true },
    { title: "Create components", description: "Build each part of your project: model, slides, poster, code, etc.", time: "60 min", editable: true },
    { title: "Review progress", description: "Check what you've made against the requirements. What's missing?", time: "15 min", editable: true },
    { title: "Finalise and prepare submission", description: "Polish everything. Make sure it's ready to hand in.", time: "20 min", editable: true },
  ],
  "group project": [
    { title: "Understand the project goal", description: "As a team, clarify what you're creating and the deadline.", time: "10 min", editable: true },
    { title: "Break into tasks", description: "List everything that needs to be done. Don't miss anything.", time: "15 min", editable: true },
    { title: "Assign roles", description: "Divide tasks fairly based on strengths. Write down who does what.", time: "15 min", editable: true },
    { title: "Individual work time", description: "Each person completes their assigned tasks.", time: "45 min", editable: true },
    { title: "Check-in and combine", description: "Meet to review progress and start putting pieces together.", time: "20 min", editable: true },
    { title: "Review as a team", description: "Look at the full project together. Does it all fit?", time: "15 min", editable: true },
    { title: "Finalise and prepare submission", description: "Polish the final product and make sure everyone's happy.", time: "20 min", editable: true },
  ],
  presentation: [
    { title: "Understand topic and goal", description: "What are you presenting and why? Who's your audience?", time: "10 min", editable: true },
    { title: "Decide key points", description: "Pick 3-5 main ideas you want to communicate.", time: "15 min", editable: true },
    { title: "Structure the flow", description: "Plan your intro, middle sections, and conclusion.", time: "15 min", editable: true },
    { title: "Create slides or outline", description: "Build visual slides with key words, not paragraphs.", time: "30 min", editable: true },
    { title: "Add examples and visuals", description: "Use images, charts, or stories to make points clear.", time: "20 min", editable: true },
    { title: "Practice delivery", description: "Say it out loud. Practice transitions between slides.", time: "20 min", editable: true },
    { title: "Refine timing and clarity", description: "Cut anything unnecessary. Make sure you fit the time limit.", time: "15 min", editable: true },
  ],
  speech: [
    { title: "Understand topic and goal", description: "What's your speech about? What should the audience feel or do after?", time: "10 min", editable: true },
    { title: "Decide key points", description: "Choose 2-3 main messages. Don't try to say everything.", time: "15 min", editable: true },
    { title: "Structure your flow", description: "Plan a clear beginning, middle, and end.", time: "15 min", editable: true },
    { title: "Write your speech", description: "Draft the full speech or detailed notes.", time: "30 min", editable: true },
    { title: "Add examples and stories", description: "Make it memorable with real examples.", time: "15 min", editable: true },
    { title: "Practice delivery", description: "Say it out loud. Work on pace and expression.", time: "20 min", editable: true },
    { title: "Refine timing and clarity", description: "Cut filler words. Make sure it fits the time.", time: "15 min", editable: true },
  ],
  exam: [
    { title: "Identify topics to study", description: "List every topic that might be on the exam.", time: "15 min", editable: true },
    { title: "Break into study sessions", description: "Divide topics into manageable chunks. Plan when to study each.", time: "15 min", editable: true },
    { title: "Review notes", description: "Read through your notes. Highlight key concepts.", time: "30 min", editable: true },
    { title: "Create summaries or flashcards", description: "Make study aids for things you need to memorise.", time: "25 min", editable: true },
    { title: "Practice questions", description: "Test yourself with past papers or practice problems.", time: "40 min", editable: true },
    { title: "Identify weak areas", description: "What do you still not understand? Focus on those.", time: "15 min", editable: true },
    { title: "Revise again", description: "Go back over weak areas until you feel confident.", time: "30 min", editable: true },
    { title: "Final review before exam", description: "Quick run through of everything. Get a good night's sleep!", time: "20 min", editable: true },
  ],
}

// Approach explanation by type
export const approachByType: Record<string, string> = {
  essay: "We've broken your essay into four manageable steps. Each step builds on the last, so by the time you reach the final edit, you'll have a complete, polished piece of writing.",
  report: "We've structured your report into four clear phases. Starting with solid research will make writing each section much easier.",
  speech: "We've organised your speech preparation into four clear steps. Starting with your core message will make everything else easier to write.",
  presentation: "We've split your presentation into four steps. Planning your slides first means you'll know exactly what content you need before you start building.",
  project: "We've divided your project into four phases. Good research at the start will make the rest of your project much smoother.",
  "group project": "We've organised your group project into four collaborative phases. Clear role assignment at the start helps everyone contribute effectively.",
  exam: "We've structured your revision into four focused sessions. Active practice is more effective than just reading, so we've included plenty of it.",
}

// What the assignment is asking - explanation by type
export const explanationByType: Record<string, string> = {
  essay: "This assignment is asking you to write an essay. That means you need to present your ideas clearly, support them with evidence, and organise your thoughts into a logical structure with an introduction, main body, and conclusion.",
  report: "This assignment is asking you to write a report. You'll need to research your topic, present factual information clearly, and organise your findings into sections with headings.",
  speech: "This assignment is asking you to prepare and deliver a speech. You need to communicate one clear message to your audience in an engaging way that keeps their attention.",
  presentation: "This assignment is asking you to create a presentation. You'll need to organise information into visual slides and be ready to explain each slide to your audience.",
  project: "This assignment is asking you to complete a project. You'll need to research, plan, and create something that demonstrates your understanding of the topic.",
  "group project": "This assignment is asking your team to work together on a project. Success depends on clear communication, fair division of work, and combining everyone's contributions into one finished piece.",
  exam: "This assignment is asking you to prepare for an exam. You need to review key concepts, practice applying your knowledge, and make sure you understand the most important topics.",
}

// How to approach it - tips by type
export const tipsByType: Record<string, string[]> = {
  essay: [
    "Start by making sure you understand the question. Underline the key words and think about what you're being asked to do.",
    "Plan before you write. A quick outline will save you time and help you stay focused.",
    "Don't try to be perfect on the first draft. Get your ideas down first, then improve them."
  ],
  report: [
    "Gather your facts first. Good research makes writing much easier.",
    "Use clear headings to organise your report. This helps both you and your reader.",
    "Check that every statement you make is backed up by evidence."
  ],
  speech: [
    "Focus on one main idea. If your audience remembers just one thing, what should it be?",
    "Use stories and examples to make your points memorable.",
    "Practice out loud. A speech that sounds good in your head might feel different when you say it."
  ],
  presentation: [
    "Keep slides simple. Use images and keywords, not walls of text.",
    "Know what you'll say for each slide before you present.",
    "Practice your timing. Most people talk faster when nervous, so build in pauses."
  ],
  project: [
    "Break the project into smaller tasks. It's less overwhelming and easier to track progress.",
    "Start with research to build a strong foundation of knowledge.",
    "Leave time at the end to review and improve your work."
  ],
  "group project": [
    "Agree on who does what at the very beginning. Write it down so everyone is clear.",
    "Check in regularly with your team to make sure everyone is on track.",
    "Combine your work early enough to fix any issues before the deadline."
  ],
  exam: [
    "Active recall is more effective than re-reading. Test yourself frequently.",
    "Focus more time on topics you find difficult, not just the ones you enjoy.",
    "Get enough sleep before the exam. A rested brain performs better."
  ],
}

// Subject colors
export const subjectColors: Record<string, string> = {
  english: "bg-rose-400",
  history: "bg-amber-400",
  science: "bg-emerald-400",
  maths: "bg-blue-400",
  geography: "bg-cyan-400",
  art: "bg-pink-400",
  music: "bg-orange-400",
  other: "bg-slate-400",
}

const STORAGE_KEY = "study-buddy-assignments"

// Get all assignments
export function getAssignments(): Assignment[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Get a single assignment by ID
export function getAssignment(id: string): Assignment | null {
  const assignments = getAssignments()
  return assignments.find(a => a.id === id) || null
}

// Save a new assignment
export function saveAssignment(assignment: Omit<Assignment, "id" | "createdAt" | "progress" | "steps" | "section">): Assignment {
  const assignments = getAssignments()
  
  // Generate steps based on assignment type
  const typeKey = assignment.type.toLowerCase()
  const steps = plansByType[typeKey] || plansByType.essay
  
  // Automatically assign section based on type
  const section = typeToSection[typeKey] || "assignments"
  
  const newAssignment: Assignment = {
    ...assignment,
    id: `assignment-${Date.now()}`,
    section,
    steps,
    createdAt: new Date().toISOString(),
    progress: 0,
  }
  
  assignments.push(newAssignment)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments))
  
  return newAssignment
}

// Update an assignment
export function updateAssignment(id: string, updates: Partial<Assignment>): Assignment | null {
  const assignments = getAssignments()
  const index = assignments.findIndex(a => a.id === id)
  
  if (index === -1) return null
  
  assignments[index] = { ...assignments[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments))
  
  return assignments[index]
}

// Delete an assignment
export function deleteAssignment(id: string): boolean {
  const assignments = getAssignments()
  const filtered = assignments.filter(a => a.id !== id)
  
  if (filtered.length === assignments.length) return false
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}
