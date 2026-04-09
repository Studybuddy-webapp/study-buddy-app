"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Clock, Palette, Shield, HelpCircle } from "lucide-react"

export function SettingsContent() {
  const settingSections = [
    {
      title: "Notifications",
      icon: Bell,
      description: "Choose when Study Buddy sends you reminders",
      options: ["Due date reminders", "Daily study goals", "Streak notifications"]
    },
    {
      title: "Study Preferences",
      icon: Clock,
      description: "Set your preferred study times and session lengths",
      options: ["Preferred study time: After school", "Focus session: 25 minutes", "Break length: 5 minutes"]
    },
    {
      title: "Appearance",
      icon: Palette,
      description: "Customize how Study Buddy looks",
      options: ["Theme: Light", "Compact mode: Off", "Animations: On"]
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize your Study Buddy experience</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Profile Card */}
        <Card className="col-span-1 border border-border/40 shadow-sm bg-white/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-20 w-20 ring-4 ring-primary/10 ring-offset-2 ring-offset-white mb-3">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Student" />
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">JS</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="rounded-lg">Change Photo</Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</label>
                <Input defaultValue="Jamie Smith" className="mt-1 rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Grade</label>
                <Input defaultValue="11th Grade" className="mt-1 rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">School</label>
                <Input defaultValue="Lincoln High School" className="mt-1 rounded-lg" />
              </div>
            </div>
            
            <Button className="w-full rounded-lg">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        <div className="col-span-2 space-y-4">
          {settingSections.map((section) => (
            <Card key={section.title} className="border border-border/40 shadow-sm bg-white/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <section.icon className="w-4 h-4 text-primary" />
                  {section.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {section.options.map((option, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <span className="text-sm text-foreground">{option}</span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">Edit</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Help & Support */}
          <Card className="border border-border/40 shadow-sm bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Need help?</p>
                    <p className="text-xs text-muted-foreground">Check out our guides and FAQs</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg">Get Help</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
