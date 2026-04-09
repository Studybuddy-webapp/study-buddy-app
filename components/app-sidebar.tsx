"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Calendar, LayoutGrid, Plus, ChevronRight, Zap, FolderKanban, Sparkles, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutGrid },
  { name: "Workspace", href: "/workspace", icon: FolderKanban },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Ask Study Buddy", href: "/ask", icon: Sparkles },
  { name: "Study Insights", href: "/insights", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/40 bg-gradient-to-b from-white to-blue-50/30">
      {/* Logo - Clickable to navigate to Dashboard */}
      <Link 
        href="/" 
        className="flex h-16 items-center gap-3 px-5 transition-opacity hover:opacity-80 cursor-pointer"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-500 shadow-md shadow-primary/20">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">Study Buddy</span>
      </Link>

      {/* Add School Work Button */}
      <div className="px-4 pb-3 pt-2">
        <Button asChild className="h-11 w-full gap-2 rounded-xl bg-primary font-semibold shadow-sm hover:bg-primary/90 transition-all">
          <Link href="/add-schoolwork">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add School Work
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-white/80 hover:text-foreground hover:shadow-sm"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} strokeWidth={isActive ? 2 : 1.5} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="px-4 pb-3">
        <Link 
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-3 transition-all hover:bg-white/80 hover:shadow-sm"
        >
          <Avatar className="h-10 w-10 ring-2 ring-primary/10 ring-offset-2 ring-offset-white">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Student" />
            <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">JS</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="text-sm font-semibold text-foreground">Jamie Smith</p>
            <p className="text-xs text-muted-foreground">11th Grade</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      {/* Streak Card */}
      <div className="mx-4 mb-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-3.5 border border-amber-100/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-sm">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-800">5 Day Streak</p>
            <p className="text-xs text-amber-600">Keep it going!</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
