"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Brain,
  FileText,
  CreditCard,
  Clock,
  Target,
  Award,
  BookOpen,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  Sparkles,
} from "lucide-react"

interface StudySession {
  id: string
  type: "summary" | "flashcards" | "quiz" | "explanation"
  title: string
  date: string
  duration: number
  score?: number
  totalQuestions?: number
  difficulty: "easy" | "medium" | "hard"
  category: string
  completed: boolean
}

interface LearningStats {
  totalSessions: number
  totalTimeSpent: number
  averageScore: number
  streakDays: number
  masteredTopics: number
  documentsProcessed: number
}

// Sample data
const sampleSessions: StudySession[] = [
  {
    id: "1",
    type: "quiz",
    title: "Cell Biology Quiz",
    date: "2024-01-15",
    duration: 480,
    score: 85,
    totalQuestions: 10,
    difficulty: "medium",
    category: "Biology",
    completed: true,
  },
  {
    id: "2",
    type: "flashcards",
    title: "Photosynthesis Flashcards",
    date: "2024-01-14",
    duration: 720,
    difficulty: "easy",
    category: "Biology",
    completed: true,
  },
  {
    id: "3",
    type: "summary",
    title: "Evolution Chapter Summary",
    date: "2024-01-13",
    duration: 300,
    difficulty: "hard",
    category: "Biology",
    completed: true,
  },
  {
    id: "4",
    type: "quiz",
    title: "Biochemistry Quiz",
    date: "2024-01-12",
    duration: 600,
    score: 92,
    totalQuestions: 12,
    difficulty: "hard",
    category: "Chemistry",
    completed: true,
  },
  {
    id: "5",
    type: "explanation",
    title: "DNA Replication Explained",
    date: "2024-01-11",
    duration: 420,
    difficulty: "medium",
    category: "Biology",
    completed: true,
  },
]

const sampleStats: LearningStats = {
  totalSessions: 15,
  totalTimeSpent: 7200, // in seconds
  averageScore: 87,
  streakDays: 5,
  masteredTopics: 8,
  documentsProcessed: 12,
}

export default function ResultsPage() {
  const [sessions] = useState<StudySession[]>(sampleSessions)
  const [stats] = useState<LearningStats>(sampleStats)
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("week")

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return <Brain className="w-4 h-4" />
      case "flashcards":
        return <CreditCard className="w-4 h-4" />
      case "summary":
        return <FileText className="w-4 h-4" />
      case "explanation":
        return <Sparkles className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "quiz":
        return "bg-primary/10 text-primary border-primary/20"
      case "flashcards":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "summary":
        return "bg-accent/10 text-accent border-accent/20"
      case "explanation":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const quizSessions = sessions.filter((s) => s.type === "quiz" && s.score !== undefined)
  const averageQuizScore =
    quizSessions.length > 0
      ? Math.round(quizSessions.reduce((sum, s) => sum + (s.score || 0), 0) / quizSessions.length)
      : 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Learning Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and insights from your study sessions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" className="bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{stats.totalSessions}</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Time</p>
                  <p className="text-2xl font-bold">{formatDuration(stats.totalTimeSpent)}</p>
                </div>
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Quiz Score</p>
                  <p className="text-2xl font-bold">{averageQuizScore}%</p>
                </div>
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                  <p className="text-2xl font-bold">{stats.streakDays} days</p>
                </div>
                <div className="w-8 h-8 bg-chart-2/10 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Performance Summary
                  </CardTitle>
                  <CardDescription>Your learning performance over time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Quiz Performance</span>
                      <span className="text-sm text-muted-foreground">{averageQuizScore}%</span>
                    </div>
                    <Progress value={averageQuizScore} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Study Consistency</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Topic Mastery</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Study Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-secondary" />
                    Study Categories
                  </CardTitle>
                  <CardDescription>Distribution of your study topics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(sessions.map((s) => s.category))).map((category) => {
                      const categoryCount = sessions.filter((s) => s.category === category).length
                      const percentage = Math.round((categoryCount / sessions.length) * 100)

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{category}</span>
                            <span className="text-sm text-muted-foreground">{categoryCount} sessions</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Your latest learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Quiz Master</p>
                      <p className="text-sm text-green-600">Scored 90%+ on 3 quizzes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Consistent Learner</p>
                      <p className="text-sm text-blue-600">5-day study streak</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-800">Topic Explorer</p>
                      <p className="text-sm text-purple-600">Studied 4 different topics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Study Sessions</CardTitle>
                <CardDescription>Your latest learning activities and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(session.type)}`}
                        >
                          {getTypeIcon(session.type)}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{session.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatDate(session.date)}</span>
                            <span>•</span>
                            <span>{formatDuration(session.duration)}</span>
                            {session.score && (
                              <>
                                <span>•</span>
                                <span className="text-primary font-medium">{session.score}%</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getDifficultyColor(session.difficulty)}>
                          {session.difficulty}
                        </Badge>
                        <Badge variant="outline">{session.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Learning Goals
                  </CardTitle>
                  <CardDescription>Track your progress towards learning objectives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Complete 20 Quiz Sessions</span>
                      <span className="text-sm text-muted-foreground">4/20</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Master 10 Topics</span>
                      <span className="text-sm text-muted-foreground">8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Study 30 Days Straight</span>
                      <span className="text-sm text-muted-foreground">5/30</span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Recommendations
                  </CardTitle>
                  <CardDescription>Personalized suggestions to improve your learning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-medium text-blue-800 text-sm">Focus on Hard Topics</p>
                      <p className="text-blue-600 text-xs">Spend more time on difficult concepts to improve mastery</p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="font-medium text-green-800 text-sm">Review Flashcards</p>
                      <p className="text-green-600 text-xs">
                        Revisit flashcards from previous sessions for better retention
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="font-medium text-purple-800 text-sm">Try New Categories</p>
                      <p className="text-purple-600 text-xs">
                        Explore chemistry and physics topics to broaden knowledge
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
