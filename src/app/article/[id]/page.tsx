'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  Share, 
  BarChart3, 
  Clock, 
  Target,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react'

interface ArticleData {
  id: string
  title: string
  content: string
  metaDescription: string
  wordCount: number
  seoScore: number
  readabilityScore?: number
  sources: Array<{
    url: string
    title: string
    excerpt: string
    relevance: number
  }>
  keyPoints: string[]
  statistics: string[]
  seoData: {
    keywordDensity: Record<string, number>
    suggestions: string[]
  }
  createdAt: Date
  input: string
  type: string
}

export default function ArticleResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!params.id) return

    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/generation-progress/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          
          if (data.status === 'completed' && data.article) {
            setArticle({
              id: data.id,
              title: data.article.title,
              content: data.article.content,
              metaDescription: data.seoData?.metaDescription || 'Generated article',
              wordCount: data.article.wordCount,
              seoScore: data.seoData?.seoScore || 85,
              readabilityScore: 78,
              sources: data.sources,
              keyPoints: data.keyPoints,
              statistics: data.statistics,
              seoData: data.seoData || { keywordDensity: {}, suggestions: [] },
              createdAt: new Date(data.startTime),
              input: data.input,
              type: data.type
            })
          } else {
            // Redirect back to progress if not complete
            router.push(`/generate/${params.id}`)
          }
        }
      } catch (error) {
        console.error('Failed to fetch article:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.id, router])

  const handleExport = (format: 'html' | 'markdown' | 'json') => {
    if (!article) return

    let content = ''
    let filename = ''
    let mimeType = 'text/plain'

    const sanitizedTitle = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    switch (format) {
      case 'html':
        content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <meta name="description" content="${article.metaDescription}">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
        h1, h2, h3 { color: #2c3e50; }
        .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="meta">
        Generated: ${article.createdAt.toLocaleDateString()} | Word Count: ${article.wordCount} | SEO Score: ${article.seoScore}/100
    </div>
    ${article.content}
</body>
</html>`
        filename = `${sanitizedTitle}.html`
        mimeType = 'text/html'
        break

      case 'markdown':
        content = `---
title: "${article.title}"
description: "${article.metaDescription}"
created: ${article.createdAt.toISOString()}
wordCount: ${article.wordCount}
seoScore: ${article.seoScore}
---

${article.content.replace(/<h1[^>]*>([^<]+)<\/h1>/gi, '# $1\n')}

## Sources
${article.sources.map(s => `- [${s.title}](${s.url})`).join('\n')}`
        filename = `${sanitizedTitle}.md`
        mimeType = 'text/markdown'
        break

      case 'json':
        content = JSON.stringify(article, null, 2)
        filename = `${sanitizedTitle}.json`
        mimeType = 'application/json'
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopyContent = async () => {
    if (!article) return

    try {
      await navigator.clipboard.writeText(article.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy content:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Button onClick={() => router.push('/')}>
            Return to Dashboard
          </Button>
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
                onClick={() => router.push('/')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Generated Article
                </h1>
                <p className="text-gray-500">
                  Created {article.createdAt.toLocaleDateString()} • {article.wordCount} words
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleCopyContent}>
                {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <div className="relative group">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button 
                    onClick={() => handleExport('html')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    HTML
                  </button>
                  <button 
                    onClick={() => handleExport('markdown')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Markdown
                  </button>
                  <button 
                    onClick={() => handleExport('json')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    JSON
                  </button>
                </div>
              </div>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{article.title}</CardTitle>
                <CardDescription className="text-lg">
                  {article.metaDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">SEO Score</span>
                  <span className="text-lg font-bold text-green-600">{article.seoScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Readability</span>
                  <span className="text-lg font-bold text-blue-600">{article.readabilityScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Word Count</span>
                  <span className="text-lg font-bold">{article.wordCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Sources</span>
                  <span className="text-lg font-bold">{article.sources.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            {article.keyPoints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {article.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        • {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            {article.statistics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {article.statistics.map((stat, index) => (
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

            {/* SEO Optimization */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(article.seoData.keywordDensity).map(([keyword, density]) => (
                  <div key={keyword} className="flex justify-between text-sm">
                    <span>{keyword}</span>
                    <span className="font-medium">{density.toFixed(1)}%</span>
                  </div>
                ))}
                
                {article.seoData.suggestions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Suggestions:</h4>
                    <ul className="space-y-1">
                      {article.seoData.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-xs text-gray-600">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Sources ({article.sources.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {article.sources.map((source, index) => (
                  <div key={index} className="text-sm">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium flex items-center"
                    >
                      {source.title}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                    <p className="text-gray-600 text-xs mt-1">{source.excerpt}</p>
                    <span className="text-xs text-gray-500">
                      Relevance: {Math.round(source.relevance * 100)}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}