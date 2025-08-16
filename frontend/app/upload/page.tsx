"use client"

import type React from "react"

import { useState } from "react"
import { apiUploadFile } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Upload, FileText, CreditCard, Brain, Sparkles, CheckCircle, AlertCircle, File, X } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  content?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [processingType, setProcessingType] = useState<string | null>(null)

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }))

    setFiles((prev) => [...prev, ...newFiles])
    setIsUploading(true)
    setUploadProgress(15)
    try {
      // Upload first file only for now
      const file = selectedFiles[0]
      const res = await apiUploadFile(file)
      localStorage.setItem("studymate_doc_id", res.doc_id)
      setUploadProgress(100)
    } catch (e) {
      alert("Upload failed: " + (e as Error).message)
    } finally {
      setTimeout(() => setIsUploading(false), 500)
    }
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleProcessing = (type: string) => {
    setProcessingType(type)
    const docId = localStorage.getItem("studymate_doc_id")
    if (!docId) {
      setProcessingType(null)
      alert("Please upload a document first.")
      return
    }
    // Redirect user to the appropriate page; those pages will call the API using saved doc_id
    if (type === "Flashcards") window.location.href = "/flashcards"
    else if (type === "Quiz") window.location.href = "/quiz"
    else if (type === "Summary") window.location.href = "/results"
    else setProcessingType(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Upload Your Study Materials</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload PDFs, text files, or paste your notes to get started with AI-powered learning
          </p>
        </div>

        {/* Upload Area */}
        <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
          <CardContent className="p-8">
            <div
              className={`text-center space-y-4 ${isDragOver ? "bg-primary/5 rounded-lg p-4" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Drop files here or click to upload</h3>
                <p className="text-muted-foreground">Supports PDF, TXT, DOC, and DOCX files up to 10MB</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => document.getElementById("file-input")?.click()} className="px-6">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
                <Button variant="outline" className="px-6 bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Paste Text
                </Button>
              </div>
              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {isUploading && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uploading files...</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Uploaded Files */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Uploaded Files ({files.length})
              </CardTitle>
              <CardDescription>
                Your files are ready for processing. Choose what you'd like to generate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File List */}
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="h-8 w-8 p-0">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Processing Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Choose what to generate:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Summarize */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/50 bg-transparent"
                    onClick={() => handleProcessing("Summary")}
                    disabled={processingType !== null}
                  >
                    <FileText className="w-6 h-6 text-primary" />
                    <span className="font-medium">Summarize</span>
                    <span className="text-xs text-muted-foreground text-center">Get key insights and main points</span>
                  </Button>

                  {/* Generate Flashcards */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-secondary/5 hover:border-secondary/50 bg-transparent"
                    onClick={() => handleProcessing("Flashcards")}
                    disabled={processingType !== null}
                  >
                    <CreditCard className="w-6 h-6 text-secondary" />
                    <span className="font-medium">Generate Flashcards</span>
                    <span className="text-xs text-muted-foreground text-center">Create Q&A cards for review</span>
                  </Button>

                  {/* Generate Quiz */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/5 hover:border-accent/50 bg-transparent"
                    onClick={() => handleProcessing("Quiz")}
                    disabled={processingType !== null}
                  >
                    <Brain className="w-6 h-6 text-accent" />
                    <span className="font-medium">Generate Quiz</span>
                    <span className="text-xs text-muted-foreground text-center">Test your knowledge</span>
                  </Button>

                  {/* Explain Simply */}
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-chart-2/5 hover:border-chart-2/50 bg-transparent"
                    onClick={() => handleProcessing("Simple Explanation")}
                    disabled={processingType !== null}
                  >
                    <Sparkles className="w-6 h-6 text-chart-2" />
                    <span className="font-medium">Explain Simply</span>
                    <span className="text-xs text-muted-foreground text-center">Break down complex topics</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Processing Status */}
        {processingType && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Generating {processingType}...</p>
                  <p className="text-sm text-muted-foreground">
                    Our AI is analyzing your content and creating personalized learning materials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Tips for Better Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium">File Quality:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Use clear, readable text</li>
                  <li>• Avoid heavily formatted documents</li>
                  <li>• Include headings and structure</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Content Tips:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Focus on key concepts</li>
                  <li>• Include examples when possible</li>
                  <li>• Remove irrelevant information</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
