'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Link, 
  FileText, 
  Zap, 
  BarChart3, 
  Download,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface GenerationRequest {
  id: string
  input: string
  type: 'keyword' | 'url' | 'topic'
  status: 'pending' | 'researching' | 'generating' | 'completed' | 'error'
  progress: number
  createdAt: Date
}

interface GeneratedArticle {
  id: string
  title: string
  content: string
  wordCount: number
  seoScore: number
  createdAt: Date
}

export default function ContentFlowDashboard() {
  const [activeTab, setActiveTab] = useState('create')
  const [input, setInput] = useState('')
  const [inputType, setInputType] = useState<'keyword' | 'url' | 'topic'>('keyword')
  const [keywords, setKeywords] = useState('')
  const [wordCount, setWordCount] = useState(1500)
  const [tone, setTone] = useState('professional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [requests, setRequests] = useState<GenerationRequest[]>([])
  const [articles, setArticles] = useState<GeneratedArticle[]>([])

  const handleGenerate = async () => {
    if (!input.trim()) return

    setIsGenerating(true)
    
    const newRequest: GenerationRequest = {
      id: `req-${Date.now()}`,
      input,
      type: inputType,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
    }

    setRequests(prev => [newRequest, ...prev])

    try {
      // Simulate progress updates
      const updateProgress = (progress: number, status: GenerationRequest['status']) => {
        setRequests(prev => prev.map(req => 
          req.id === newRequest.id 
            ? { ...req, progress, status }
            : req
        ))
      }

      updateProgress(10, 'researching')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      updateProgress(40, 'researching')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      updateProgress(70, 'generating')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      updateProgress(90, 'generating')
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Call the automation API
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          type: inputType,
          options: {
            targetKeywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
            wordCount,
            tone,
          },
        }),
      })

      if (response.ok) {
        const result = await response.json()
        updateProgress(100, 'completed')
        
        // Mock article data
        const newArticle: GeneratedArticle = {
          id: result.articleId,
          title: `The Ultimate Guide to ${input}`,
          content: `<h1>Generated article about ${input}</h1><p>This is a high-quality, SEO-optimized article...</p>`,
          wordCount: wordCount,
          seoScore: 85,
          createdAt: new Date(),
        }
        
        setArticles(prev => [newArticle, ...prev])
      } else {
        updateProgress(0, 'error')
      }
    } catch (error) {
      setRequests(prev => prev.map(req => 
        req.id === newRequest.id 
          ? { ...req, status: 'error', progress: 0 }
          : req
      ))
    }

    setIsGenerating(false)
    setInput('')
    setKeywords('')
  }

  const getStatusIcon = (status: GenerationRequest['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: GenerationRequest['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">ContentFlow AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {articles.length} articles generated
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Content</TabsTrigger>
            <TabsTrigger value="history">Generation History</TabsTrigger>
            <TabsTrigger value="articles">Generated Articles</TabsTrigger>
          </TabsList>

          {/* Create Content Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate New Article</CardTitle>
                <CardDescription>
                  Enter a keyword, topic, or article URL to generate a well-researched blog post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Type Selection */}
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={inputType === 'keyword' ? 'default' : 'outline'}
                    onClick={() => setInputType('keyword')}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Keyword</span>
                  </Button>
                  <Button
                    variant={inputType === 'topic' ? 'default' : 'outline'}
                    onClick={() => setInputType('topic')}
                    className="flex items-center justify-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Topic</span>
                  </Button>
                  <Button
                    variant={inputType === 'url' ? 'default' : 'outline'}
                    onClick={() => setInputType('url')}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Link className="h-4 w-4" />
                    <span>URL</span>
                  </Button>
                </div>

                {/* Main Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {inputType === 'keyword' && 'Main Keyword'}
                    {inputType === 'topic' && 'Topic or Subject'}
                    {inputType === 'url' && 'Article or News URL'}
                  </label>
                  <Input
                    placeholder={
                      inputType === 'keyword' ? 'e.g., artificial intelligence' :
                      inputType === 'topic' ? 'e.g., The future of remote work' :
                      'e.g., https://example.com/article'
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>

                {/* Additional Keywords */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Keywords (optional)</label>
                  <Input
                    placeholder="e.g., SEO, content marketing, automation"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>

                {/* Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Word Count</label>
                    <Input
                      type="number"
                      value={wordCount}
                      onChange={(e) => setWordCount(Number(e.target.value))}
                      min={500}
                      max={5000}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tone</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="authoritative">Authoritative</option>
                      <option value="friendly">Friendly</option>
                    </select>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!input.trim() || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? 'Generating...' : 'Generate Article'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No generation requests yet</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(request.status)}
                          <span className="font-medium">{request.input}</span>
                          <span className="text-sm text-gray-500">({request.type})</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                          <span>{request.createdAt.toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {request.status !== 'completed' && request.status !== 'error' && (
                          <div className="w-32">
                            <Progress value={request.progress} />
                          </div>
                        )}
                        {request.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            View Article
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-4">
            {articles.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No articles generated yet</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              articles.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <CardDescription>
                          {article.wordCount} words • SEO Score: {article.seoScore}/100 • 
                          {article.createdAt.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="prose max-w-none text-sm text-gray-600"
                      dangerouslySetInnerHTML={{ 
                        __html: article.content.substring(0, 300) + '...' 
                      }}
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}