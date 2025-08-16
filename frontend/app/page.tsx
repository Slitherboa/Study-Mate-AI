import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CreditCard, Brain, Sparkles, ArrowRight, BookOpen, Zap, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Learning Assistant
            </Badge>

            {/* Main Heading */}
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-foreground leading-tight">
                Your AI-Powered
                <span className="text-primary block">Study Companion</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Transform your study materials into personalized learning experiences. Upload PDFs, notes, or text and
                let AI generate summaries, flashcards, and quizzes tailored just for you.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="px-8 py-3 text-base font-medium">
                <Link href="/upload">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Material to Start Learning
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-base font-medium bg-transparent">
                <Link href="/about">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 text-center">
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Documents Processed</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Flashcards Generated</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Learning Improvement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Powerful Learning Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to transform your study materials into an engaging learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Summaries Feature */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">Smart Summaries</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Get concise, intelligent summaries of your study materials that highlight key concepts and important
                  information.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Flashcards Feature */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <CreditCard className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-xl font-semibold">Interactive Flashcards</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Automatically generated flashcards with questions and answers to help reinforce your learning through
                  active recall.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Quizzes Feature */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-semibold">Adaptive Quizzes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Test your knowledge with AI-generated quizzes that adapt to your learning progress and focus on weak
                  areas.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Explanations Feature */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-chart-2/10 flex items-center justify-center group-hover:bg-chart-2/20 transition-colors">
                  <Sparkles className="w-6 h-6 text-chart-2" />
                </div>
                <CardTitle className="text-xl font-semibold">Simple Explanations</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Complex topics broken down into easy-to-understand explanations that make learning accessible for
                  everyone.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">How StudyMate AI Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps and transform your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold font-serif">1. Upload Your Materials</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload PDFs, text files, or paste your study notes directly into the platform.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-secondary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold font-serif">2. AI Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI analyzes your content and generates personalized learning materials.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold font-serif">3. Start Learning</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access your summaries, flashcards, and quizzes to enhance your understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who are already using StudyMate AI to improve their learning outcomes and study
              more effectively.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="px-8 py-3 text-base font-medium">
                <Link href="/upload">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Get Started for Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
