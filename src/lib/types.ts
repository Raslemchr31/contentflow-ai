export interface ContentRequest {
  id: string
  type: 'keyword' | 'url' | 'topic'
  input: string
  targetKeywords?: string[]
  wordCount?: number
  tone?: 'professional' | 'casual' | 'authoritative' | 'friendly'
  createdAt: Date
  status: 'pending' | 'researching' | 'generating' | 'completed' | 'error'
}

export interface ResearchData {
  sources: Source[]
  keyPoints: string[]
  relatedTopics: string[]
  statistics: string[]
  quotes: string[]
}

export interface Source {
  url: string
  title: string
  excerpt: string
  relevance: number
  publishDate?: string
}

export interface GeneratedArticle {
  id: string
  requestId: string
  title: string
  content: string
  metaDescription: string
  keywords: string[]
  wordCount: number
  seoScore: number
  readabilityScore: number
  sources: Source[]
  createdAt: Date
}

export interface SEOAnalysis {
  score: number
  keywordDensity: Record<string, number>
  suggestions: string[]
  metaTitle: string
  metaDescription: string
  headingStructure: HeadingAnalysis[]
}

export interface HeadingAnalysis {
  level: number
  text: string
  keywords: string[]
}

export interface AutomationConfig {
  perplexityApiKey: string
  defaultWordCount: number
  defaultTone: string
  seoOptimization: boolean
  factChecking: boolean
}