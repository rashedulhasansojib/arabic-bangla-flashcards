"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Moon, Sun, Monitor, Download, Upload, Trash2 } from "lucide-react"
import { getSettings, setSettings, exportData, importData, clearAllData } from "@/lib/storage"
import { useTheme } from "@/components/theme-provider"
import { useToast } from "@/hooks/use-toast"
import type { Settings } from "@/lib/types"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [settings, setSettingsState] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadedSettings = getSettings()
    setSettingsState(loadedSettings)
    setIsLoading(false)
  }, [])

  const handleSettingChange = (key: keyof Settings, value: any) => {
    if (!settings) return

    const updated = { ...settings, [key]: value }
    setSettingsState(updated)
    setSettings({ [key]: value })

    toast({
      title: "Settings updated",
      description: "Your preferences have been saved.",
    })
  }

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `arabic-words-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Data exported",
      description: "Your vocabulary data has been downloaded.",
    })
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        const success = importData(content)

        if (success) {
          toast({
            title: "Data imported",
            description: "Your vocabulary data has been restored.",
          })
          window.location.reload()
        } else {
          toast({
            title: "Import failed",
            description: "The file could not be imported. Please check the format.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to delete all data? This action cannot be undone. Make sure to export your data first!",
      )
    ) {
      clearAllData()
      toast({
        title: "Data cleared",
        description: "All your vocabulary data has been deleted.",
      })
      window.location.reload()
    }
  }

  if (isLoading || !settings) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">Customize your learning experience</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline"} size="icon" onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Settings</CardTitle>
            <CardDescription>Configure your study sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="quiz-mode">Quiz Mode</Label>
              <Select value={settings.quizMode} onValueChange={(value: any) => handleSettingChange("quizMode", value)}>
                <SelectTrigger id="quiz-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="type-answer">Type Answer</SelectItem>
                  <SelectItem value="flashcard">Flashcard Flip</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Choose how you want to review cards</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cards-per-session">Cards per Session</Label>
                <span className="text-sm font-medium">{settings.cardsPerSession}</span>
              </div>
              <Slider
                id="cards-per-session"
                min={5}
                max={50}
                step={5}
                value={[settings.cardsPerSession]}
                onValueChange={([value]) => handleSettingChange("cardsPerSession", value)}
              />
              <p className="text-sm text-muted-foreground">Number of cards to review in each session</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="daily-goal">Daily Goal</Label>
                <span className="text-sm font-medium">{settings.dailyGoal}</span>
              </div>
              <Slider
                id="daily-goal"
                min={10}
                max={200}
                step={10}
                value={[settings.dailyGoal]}
                onValueChange={([value]) => handleSettingChange("dailyGoal", value)}
              />
              <p className="text-sm text-muted-foreground">Target number of cards to review daily</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-transliteration">Show Transliteration</Label>
                <p className="text-sm text-muted-foreground">Display romanized Arabic text</p>
              </div>
              <Switch
                id="show-transliteration"
                checked={settings.showTransliteration}
                onCheckedChange={(checked) => handleSettingChange("showTransliteration", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-enabled">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sounds for correct/incorrect answers</p>
              </div>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Backup and restore your flashcard data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleImport}>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </div>
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="flex items-start gap-3">
                <Trash2 className="mt-0.5 h-5 w-5 text-destructive" />
                <div className="flex-1">
                  <p className="font-medium text-destructive">Danger Zone</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Permanently delete all your flashcard data. This action cannot be undone.
                  </p>
                  <Button variant="destructive" size="sm" className="mt-3" onClick={handleClearData}>
                    Clear All Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
