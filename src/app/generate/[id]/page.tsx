'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Zap,
  Brain,
  Target,
  BarChart3,
  ArrowLeft
} from 'lucide-react'

interface ProgressStep {
  id: string
  title: string
  status: 'pending' | 'active' | 'completed' | 'error'
  description?: string
  progress?: number
  data?: any
}

interface ResearchSource {
  url: string
  title: string
  excerpt: string
  relevance: number
  timestamp: Date
}

interface GenerationProgress {
  id: string
  input: string
  type: 'keyword' | 'url' | 'topic'
  currentStep: number
  steps: ProgressStep[]
  sources: ResearchSource[]
  keyPoints: string[]
  statistics: string[]
  articlePreview?: string
  finalArticle?: any
  error?: string
}

export default function GenerationProgressPage() {
  const params = useParams()
  const router = useRouter()
  const [progress, setProgress] = useState<GenerationProgress | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!params.id) return

    // Get input parameters from URL
    const urlParams = new URLSearchParams(window.location.search)
    const input = urlParams.get('input') || 'artificial intelligence'
    const type = (urlParams.get('type') as 'keyword' | 'url' | 'topic') || 'keyword'

    // Start real-time progress polling
    const pollProgress = async () => {
      try {
        const response = await fetch(`/api/generation-progress/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProgress(data)
          
          // Check if generation is complete
          if (data.status === 'completed') {
            setIsComplete(true)
          } else if (data.status === 'error') {
            console.error('Generation failed:', data.error)
          }
        } else {
          console.error('Failed to fetch progress')
        }
      } catch (error) {
        console.error('Progress polling error:', error)
      }
    }

    // Initialize with input from URL
    const initialProgress: GenerationProgress = {
      id: params.id as string,
      input,
      type,
      currentStep: 0,
      steps: [
        { id: 'init', title: 'Initializing Research', status: 'active', description: 'Setting up MCP automation pipeline...' },
        { id: 'search', title: 'Web Research', status: 'pending', description: 'Using Perplexity MCP for latest information' },
        { id: 'analysis', title: 'Content Analysis', status: 'pending', description: 'Analyzing sources with Claude MCP' },
        { id: 'generation', title: 'Content Generation', status: 'pending', description: 'Creating optimized article content' },
        { id: 'seo', title: 'SEO Optimization', status: 'pending', description: 'Optimizing for search engines' },
        { id: 'completion', title: 'Finalizing', status: 'pending', description: 'Completing generation process' }
      ],
      sources: [],
      keyPoints: [],
      statistics: []
    }
    setProgress(initialProgress)

    // Start polling for real progress updates
    const pollInterval = setInterval(pollProgress, 2000)
    
    // Initial poll
    pollProgress()

    return () => clearInterval(pollInterval)
  }, [params.id])


  const getStepIcon = (step: ProgressStep) => {
    const iconProps = { className: 'h-5 w-5' }
    
    switch (step.status) {
      case 'completed':
        return <CheckCircle {...iconProps} className="h-5 w-5 text-green-500" />
      case 'active':
        return <Clock {...iconProps} className="h-5 w-5 text-blue-500 animate-pulse" />
      case 'error':
        return <Clock {...iconProps} className="h-5 w-5 text-red-500" />
      default:
        return <Clock {...iconProps} className="h-5 w-5 text-gray-400" />
    }
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'active': return 'text-blue-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-500'
    }
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading generation progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Generating: "{progress.input}"
                </h1>
                <p className="text-gray-500">
                  {isComplete ? 'Generation Complete!' : 'AI automation in progress...'}
                </p>
              </div>
            </div>
            {isComplete && (
              <Button onClick={() => router.push(`/article/${progress.id}`)}>
                View Article
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Steps */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Automation Progress
                </CardTitle>
                <CardDescription>
                  Watch the AI automation pipeline in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {progress.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStepIcon(step)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${getStepStatusColor(step.status)}`}>
                          {step.title}
                        </h3>
                        {step.progress !== undefined && step.status === 'active' && (
                          <span className="text-sm text-gray-500">
                            {Math.round(step.progress)}%
                          </span>
                        )}
                      </div>
                      {step.description && (
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      )}
                      {step.progress !== undefined && step.status === 'active' && (
                        <div className="mt-2">
                          <Progress value={step.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Article Preview */}
            {progress.articlePreview && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Article Preview
                  </CardTitle>
                  <CardDescription>
                    Live preview as content is being generated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {progress.articlePreview}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Research Sources
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({progress.sources.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {progress.sources.length === 0 ? (
                  <p className="text-sm text-gray-500">No sources discovered yet...</p>
                ) : (
                  progress.sources.map((source, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900 mb-1">
                            {source.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {source.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center"
                            >
                              View source
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                            <span className="text-xs text-gray-500">
                              {Math.round(source.relevance * 100)}% relevant
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Key Insights */}
            {progress.keyPoints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {progress.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        • {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            {progress.statistics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Statistics Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {progress.statistics.map((stat, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}