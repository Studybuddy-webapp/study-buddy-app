"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Lightbulb, 
  MessageCircle,
  Plus,
  Clock,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock conversation history data
const conversationHistory = [
  {
    id: "conv-1",
    title: "How should I structure my essay introduction?",
    timestamp: "2 hours ago",
    preview: "Start with a hook that grabs attention...",
    messages: [
      { role: "user" as const, content: "How should I structure my essay introduction?" },
      { role: "assistant" as const, content: "Great question! A strong essay introduction typically has three key parts:\n\n1. **Hook** - Start with something that grabs the reader's attention. This could be a surprising fact, a thought-provoking question, or a relevant quote.\n\n2. **Context** - Provide some background information that helps the reader understand your topic. Don't go into too much detail here.\n\n3. **Thesis Statement** - End with a clear thesis that states your main argument or the purpose of your essay.\n\nWould you like me to help you write an introduction for a specific essay?" },
    ],
  },
  {
    id: "conv-2",
    title: "Explain cell mitosis in simple terms",
    timestamp: "Yesterday",
    preview: "Mitosis is how cells divide to create copies...",
    messages: [
      { role: "user" as const, content: "Can you explain cell mitosis in simple terms?" },
      { role: "assistant" as const, content: "Of course! Think of mitosis as a cell making a photocopy of itself.\n\n**Here's the simple version:**\n\nA cell needs to divide to help you grow or repair damage. Before it splits, it makes a copy of all its important information (DNA). Then it organises everything neatly and splits into two identical cells.\n\n**The 4 main stages:**\n1. **Prophase** - DNA coils up into visible chromosomes\n2. **Metaphase** - Chromosomes line up in the middle\n3. **Anaphase** - Chromosomes get pulled apart to opposite ends\n4. **Telophase** - Two new nuclei form and the cell divides\n\nWant me to explain any of these stages in more detail?" },
    ],
  },
  {
    id: "conv-3",
    title: "Best way to study for a maths exam",
    timestamp: "3 days ago",
    preview: "Practice problems are key for maths...",
    messages: [
      { role: "user" as const, content: "What's the best way to study for a maths exam?" },
      { role: "assistant" as const, content: "Maths is all about practice! Here's my recommended approach:\n\n**1. Review your notes and textbook**\nMake sure you understand the concepts before diving into problems.\n\n**2. Practice, practice, practice**\nWork through example problems. Start with easier ones and gradually increase difficulty.\n\n**3. Focus on your weak areas**\nSpend extra time on topics you find challenging.\n\n**4. Use past papers**\nIf available, practice with previous exam papers to get familiar with the format.\n\n**5. Teach it to someone else**\nExplaining a concept helps solidify your understanding.\n\nHow long until your exam? I can help you create a study schedule!" },
    ],
  },
]

const suggestedQuestions = [
  {
    icon: Lightbulb,
    text: "How should I structure my essay introduction?",
    color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
  },
  {
    icon: BookOpen,
    text: "Can you explain cell mitosis in simple terms?",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
  },
  {
    icon: HelpCircle,
    text: "What's the best way to study for a maths exam?",
    color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
  },
  {
    icon: MessageCircle,
    text: "Help me create a study schedule for this week",
    color: "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100",
  },
]

type Message = {
  role: "user" | "assistant"
  content: string
}

type Conversation = {
  id: string
  title: string
  timestamp: string
  preview: string
  messages: Message[]
}

export function AskStudyBuddyContent() {
  const [message, setMessage] = useState("")
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [currentMessages, setCurrentMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>(conversationHistory)

  const handleNewQuestion = () => {
    setActiveConversation(null)
    setCurrentMessages([])
    setMessage("")
  }

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv)
    setCurrentMessages(conv.messages)
    setMessage("")
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    const userMessage: Message = { role: "user", content: message }
    const newMessages = [...currentMessages, userMessage]
    setCurrentMessages(newMessages)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "I'm here to help! Let me think about your question...\n\nThis is a simulated response. In a real implementation, this would connect to an AI service to provide helpful study assistance."
      }
      setCurrentMessages(prev => [...prev, assistantMessage])
    }, 500)

    // If this is a new conversation, add it to history
    if (!activeConversation) {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        timestamp: "Just now",
        preview: "New conversation...",
        messages: newMessages,
      }
      setConversations(prev => [newConv, ...prev])
      setActiveConversation(newConv)
    }

    setMessage("")
  }

  const handleSuggestionClick = (text: string) => {
    setMessage(text)
  }

  const isEmptyState = currentMessages.length === 0

  return (
    <div className="flex h-full">
      {/* Chat History Column (Middle Column) */}
      <div className="w-[280px] shrink-0 border-r border-border/30 bg-white/60 backdrop-blur-sm flex flex-col">
        {/* History Header */}
        <div className="p-4 border-b border-border/20">
          <Button 
            onClick={handleNewQuestion}
            className="w-full gap-2 rounded-xl h-10"
          >
            <Plus className="w-4 h-4" />
            New Question
          </Button>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="p-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">
              Your Questions
            </p>
            <div className="space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl transition-all duration-200",
                    activeConversation?.id === conv.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50"
                  )}
                >
                  <p className={cn(
                    "text-sm font-medium line-clamp-2 leading-snug",
                    activeConversation?.id === conv.id ? "text-primary" : "text-foreground"
                  )}>
                    {conv.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area (Right Panel) */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-violet-50/50 overflow-auto">
        {/* Page Header - Centered */}
        <div className="shrink-0 py-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 mb-4">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">
            Ask Study Buddy
          </h1>
          <p className="text-muted-foreground">
            Get help with your homework, study tips, or any questions about your assignments.
          </p>
        </div>

        {/* Two Column Layout: Chat Card + Suggestions */}
        <div className="flex-1 px-6 pb-6">
          <div className="flex gap-5 h-full max-w-[1200px] mx-auto">
            {/* Main Chat Card */}
            <Card className="flex-1 flex flex-col border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
              {/* Chat Card Header */}
              <div className="shrink-0 px-5 py-4 border-b border-border/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Ask Study Buddy</h2>
                    <p className="text-xs text-muted-foreground">Get help with your homework, study tips, or any questions about your assignments.</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages Area */}
              <ScrollArea className="flex-1">
                <div className="p-5 min-h-[350px]">
                  {isEmptyState ? (
                    /* Empty State */
                    <div className="flex items-center justify-center h-full min-h-[300px]">
                      <p className="text-muted-foreground">Ask a question to get started</p>
                    </div>
                  ) : (
                    /* Active Chat - Messages */
                    <div className="space-y-5">
                      {currentMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex gap-3",
                            msg.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          {msg.role === "assistant" && (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0">
                              <Sparkles className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-3 max-w-[85%]",
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50"
                            )}
                          >
                            <div className={cn(
                              "text-sm leading-relaxed whitespace-pre-wrap",
                              msg.role === "assistant" && "prose prose-sm max-w-none"
                            )}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area - Inside Card Bottom */}
              <div className="shrink-0 px-5 py-4 border-t border-border/20 bg-muted/30">
                <div className="flex gap-3">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your question..."
                    className="flex-1 rounded-xl border-border/50 bg-white h-11"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="rounded-xl gap-2 px-5 h-11"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>

            {/* Suggestions Panel (Right Column) */}
            <div className="w-[260px] shrink-0">
              <h3 className="font-semibold text-foreground mb-4">Try Asking</h3>
              <div className="space-y-3">
                {suggestedQuestions.map((question, i) => {
                  const IconComponent = question.icon
                  return (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(question.text)}
                      className={cn(
                        "w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-md",
                        question.color
                      )}
                    >
                      <IconComponent className="w-5 h-5 mt-0.5 shrink-0" />
                      <span className="text-sm font-medium">{question.text}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
