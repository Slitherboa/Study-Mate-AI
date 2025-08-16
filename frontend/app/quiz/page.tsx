"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, CheckCircle, XCircle, Clock, Trophy, RotateCcw, Play, Target, TrendingUp, Award } from "lucide-react"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  category: string
}

interface QuizResult {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
}
import { apiQuiz } from "@/lib/api"
const sampleQuestions: QuizQuestion[] = []

type QuizState = "setup" | "active" | "feedback" | "completed"

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>("setup")
  const [questions, setQuestions] = useState<QuizQuestion[]>(sampleQuestions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [results, setResults] = useState<QuizResult[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const score = results.filter((r) => r.isCorrect).length
  const totalQuestions = questions.length

  useEffect(() => {
    if (quizState === "active" && !questionStartTime) {
      setQuestionStartTime(Date.now())
    }
  }, [quizState, currentQuestionIndex])

  const startQuiz = () => {
    if (questions.length === 0) {
      alert("Questions are not ready yet. Please wait a moment or re-upload your document.")
      return
    }
    setQuizState("active")
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setResults([])
    setStartTime(Date.now())
    setQuestionStartTime(Date.now())
    setShowFeedback(false)
  }

  useEffect(() => {
    const docId = typeof window !== 'undefined' ? localStorage.getItem("studymate_doc_id") : null
    if (!docId) return
    ;(async () => {
      try {
        setLoading(true)
        setLoadError(null)
        const res = await apiQuiz(docId, 5)
        const mapped: QuizQuestion[] = res.questions.map((q, idx) => ({
          id: String(idx + 1),
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_index,
          explanation: "",
          difficulty: "medium",
          category: "General",
        }))
        setQuestions(mapped)
      } catch (e) {
        console.error(e)
        setLoadError((e as Error).message)
      }
      finally { setLoading(false) }
    })()
  }, [])

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const timeSpent = Date.now() - questionStartTime
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
    }

    setResults((prev) => [...prev, result])
    setShowFeedback(true)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setQuestionStartTime(Date.now())
    } else {
      setQuizState("completed")
    }
  }

  const restartQuiz = () => {
    setQuizState("setup")
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setResults([])
    setShowFeedback(false)
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

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent! Outstanding performance!"
    if (percentage >= 80) return "Great job! You have a solid understanding."
    if (percentage >= 70) return "Good work! Keep practicing to improve."
    if (percentage >= 60) return "Not bad! Review the material and try again."
    return "Keep studying! Practice makes perfect."
  }

  // Show loading / error / empty states before rendering UI that accesses questions
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center text-muted-foreground">Loading questions...</div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-4 text-center">
          <div className="text-red-600">Failed to load quiz: {loadError}</div>
          <Button variant="outline" onClick={() => (window.location.href = "/upload")} className="bg-transparent">
            Re-upload Document
          </Button>
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-4 text-center">
          <div className="text-muted-foreground">No questions yet. Please upload a document and try again.</div>
          <Button variant="outline" onClick={() => (window.location.href = "/upload")} className="bg-transparent">
            Go to Upload
          </Button>
        </div>
      </div>
    )
  }

  // Setup State
  if (quizState === "setup") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Knowledge Quiz</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test your understanding with AI-generated questions based on your study materials
            </p>
          </div>

          {/* Quiz Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Quiz Overview
              </CardTitle>
              <CardDescription>
                Challenge yourself with questions covering key concepts from your study materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">Mixed</div>
                  <div className="text-sm text-muted-foreground">Difficulty</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">~5 min</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Topics Covered:</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(questions.map((q) => q.category))).map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={startQuiz} size="lg" className="w-full">
                <Play className="w-5 h-5 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Completed State
  if (quizState === "completed") {
    const totalTime = Date.now() - startTime
    const averageTime = totalTime / questions.length
    const scorePercentage = Math.round((score / totalQuestions) * 100)

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Results Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Quiz Complete!</h1>
            <p className="text-lg text-muted-foreground">Here's how you performed</p>
          </div>

          {/* Score Summary */}
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className={`text-6xl font-bold ${getScoreColor(scorePercentage)}`}>{scorePercentage}%</div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold">{getScoreMessage(scorePercentage)}</p>
                  <p className="text-muted-foreground">
                    You got {score} out of {totalQuestions} questions correct
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">
                  {score}/{totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold">{Math.round(averageTime / 1000)}s</div>
                <div className="text-sm text-muted-foreground">Avg. Time per Question</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold">
                  {
                    results.filter(
                      (r) => r.isCorrect && questions.find((q) => q.id === r.questionId)?.difficulty === "hard",
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Hard Questions Correct</div>
              </CardContent>
            </Card>
          </div>

          {/* Question Review */}
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
              <CardDescription>Review your answers and explanations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.map((question, index) => {
                const result = results.find((r) => r.questionId === question.id)
                const isCorrect = result?.isCorrect || false

                return (
                  <div key={question.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Question {index + 1}</span>
                          <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                          {isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <p className="font-medium mb-2">{question.question}</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-green-600">
                            <strong>Correct:</strong> {question.options[question.correctAnswer]}
                          </p>
                          {!isCorrect && result && (
                            <p className="text-red-600">
                              <strong>Your answer:</strong> {question.options[result.selectedAnswer]}
                            </p>
                          )}
                          <p className="text-muted-foreground">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={restartQuiz} variant="outline" className="px-8 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
            <Button className="px-8">
              <Brain className="w-4 h-4 mr-2" />
              Study More
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Active Quiz State
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Progress Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold font-serif">Quiz in Progress</h1>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getDifficultyColor(currentQuestion.difficulty)}>
                    {currentQuestion.difficulty}
                  </Badge>
                  <Badge variant="secondary">{currentQuestion.category}</Badge>
                </div>
                <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Answer Options */}
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
              disabled={showFeedback}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  let optionClass =
                    "flex items-center space-x-2 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"

                  if (showFeedback) {
                    if (index === currentQuestion.correctAnswer) {
                      optionClass += " bg-green-50 border-green-200 text-green-800"
                    } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                      optionClass += " bg-red-50 border-red-200 text-red-800"
                    }
                  }

                  return (
                    <div key={index} className={optionClass}>
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                      {showFeedback && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showFeedback && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )
                })}
              </div>
            </RadioGroup>

            {/* Feedback */}
            {showFeedback && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-700">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="font-medium text-red-700">Incorrect</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Score: {score}/{currentQuestionIndex + (showFeedback ? 1 : 0)}
              </div>
              <div className="space-x-2">
                {!showFeedback ? (
                  <Button onClick={submitAnswer} disabled={selectedAnswer === null} className="px-8">
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={nextQuestion} className="px-8">
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "View Results"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
