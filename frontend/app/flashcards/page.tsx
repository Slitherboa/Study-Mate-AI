"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, RotateCcw, Grid3X3, Play, Shuffle, BookOpen, CheckCircle } from "lucide-react"
import { apiFlashcards } from "@/lib/api"

interface Flashcard {
  id: string
  question: string
  answer: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  mastered: boolean
}

const sampleFlashcards: Flashcard[] = []

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(sampleFlashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [viewMode, setViewMode] = useState<"study" | "grid">("study")
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const docId = localStorage.getItem("studymate_doc_id")
    if (!docId) {
      setLoadError("No document found. Please upload a PDF or text first.")
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        setLoading(true)
        setLoadError(null)
        const res = await apiFlashcards(docId, 10)
        const mapped: Flashcard[] = res.flashcards.map((c, idx) => ({
          id: String(idx + 1),
          question: c.question,
          answer: c.answer,
          category: "General",
          difficulty: "medium",
          mastered: false,
        }))
        setFlashcards(mapped)
      } catch (e) {
        console.error(e)
        setLoadError((e as Error).message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center text-muted-foreground">Loading flashcards...</div>
      </div>
    )
  }

  // Error state
  if (loadError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-4 text-center">
          <div className="text-red-600">Failed to load flashcards: {loadError}</div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => (window.location.href = "/upload")} className="bg-transparent">
              Upload Another Document
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="bg-transparent">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Empty state after load
  if (flashcards.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Flashcards</h1>
          <p className="text-muted-foreground">No flashcards were generated. Try a different document or re-upload.</p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => (window.location.href = "/upload")} className="bg-transparent">
              Upload Another Document
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="bg-transparent">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    setIsFlipped(false)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setIsFlipped(false)
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const shuffleCards = () => {
    // In a real app, this would shuffle the array
    setCurrentIndex(Math.floor(Math.random() * flashcards.length))
    setIsFlipped(false)
  }

  const toggleMastered = (cardId: string) => {
    setMasteredCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
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

  if (viewMode === "grid") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">All Flashcards</h1>
              <p className="text-muted-foreground">Browse and review all your flashcards</p>
            </div>
            <Button onClick={() => setViewMode("study")} className="px-6">
              <Play className="w-4 h-4 mr-2" />
              Start Studying
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{flashcards.length}</div>
                <div className="text-sm text-muted-foreground">Total Cards</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{masteredCards.size}</div>
                <div className="text-sm text-muted-foreground">Mastered</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{flashcards.length - masteredCards.size}</div>
                <div className="text-sm text-muted-foreground">To Review</div>
              </CardContent>
            </Card>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcards.map((card, index) => (
              <Card
                key={card.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setCurrentIndex(index)
                  setViewMode("study")
                  setIsFlipped(false)
                }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className={getDifficultyColor(card.difficulty)}>
                      {card.difficulty}
                    </Badge>
                    {masteredCards.has(card.id) && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-sm line-clamp-3">{card.question}</p>
                    <p className="text-xs text-muted-foreground">{card.category}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Flashcards</h1>
            <p className="text-muted-foreground">Study with AI-generated flashcards</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode("grid")} className="bg-transparent">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid View
            </Button>
            <Button variant="outline" onClick={shuffleCards} className="bg-transparent">
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-muted-foreground">
              {currentIndex + 1} of {flashcards.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Flashcard */}
        <div className="relative">
          <div className="relative w-full h-96 cursor-pointer perspective-1000" onClick={flipCard}>
            <div
              className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
            >
              {/* Front of card (Question) */}
              <Card className="absolute inset-0 backface-hidden border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-8 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className={getDifficultyColor(currentCard.difficulty)}>
                        {currentCard.difficulty}
                      </Badge>
                      <Badge variant="secondary">{currentCard.category}</Badge>
                    </div>
                    <div className="flex items-center justify-center flex-1">
                      <p className="text-lg md:text-xl font-medium text-center leading-relaxed">
                        {currentCard.question}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Click to reveal answer</p>
                  </div>
                </CardContent>
              </Card>

              {/* Back of card (Answer) */}
              <Card className="absolute inset-0 backface-hidden rotate-y-180 border-2 border-primary/50 bg-primary/5">
                <CardContent className="p-8 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-primary text-primary-foreground">Answer</Badge>
                      <Badge variant="secondary">{currentCard.category}</Badge>
                    </div>
                    <div className="flex items-center justify-center flex-1">
                      <p className="text-base md:text-lg text-center leading-relaxed">{currentCard.answer}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Click to see question</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={prevCard} disabled={flashcards.length <= 1} className="bg-transparent">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={flipCard} className="px-6 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Flip Card
            </Button>
            <Button variant="outline" onClick={nextCard} disabled={flashcards.length <= 1} className="bg-transparent">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Mastery Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleMastered(currentCard.id)}
              className={`${masteredCards.has(currentCard.id) ? "bg-green-50 border-green-200 text-green-700" : "bg-transparent"}`}
            >
              {masteredCards.has(currentCard.id) ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mastered
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Mastered
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Study Tips */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-primary mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold">Study Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground mb-1">Active Recall:</p>
                    <p>Try to answer before flipping the card</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Spaced Repetition:</p>
                    <p>Review difficult cards more frequently</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
