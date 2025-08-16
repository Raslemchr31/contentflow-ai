import { ContentRequest, GeneratedArticle, ResearchData } from './types'
import { ResearchEngine } from './research-engine'
import { ContentGenerator } from './content-generator'

export class AutomationEngine {
  private researchEngine: ResearchEngine
  private contentGenerator: ContentGenerator
  private activeRequests: Map<string, ContentRequest> = new Map()
  private generatedArticles: Map<string, GeneratedArticle> = new Map()

  constructor() {
    this.researchEngine = new ResearchEngine()
    this.contentGenerator = new ContentGenerator()
  }

  async processRequest(
    input: string,
    type: 'keyword' | 'url' | 'topic',
    options: {
      targetKeywords?: string[]
      wordCount?: number
      tone?: 'professional' | 'casual' | 'authoritative' | 'friendly'
    } = {}
  ): Promise<string> {
    const request: ContentRequest = {
      id: `req-${Date.now()}`,
      type,
      input,
      targetKeywords: options.targetKeywords,
      wordCount: options.wordCount || 1500,
      tone: options.tone || 'professional',
      createdAt: new Date(),
      status: 'pending',
    }

    this.activeRequests.set(request.id, request)

    try {
      // Step 1: Research
      this.updateRequestStatus(request.id, 'researching')
      const research = await this.conductResearch(request)

      // Step 2: Generate Content
      this.updateRequestStatus(request.id, 'generating')
      const article = await this.generateContent(request, research)

      // Step 3: Complete
      this.updateRequestStatus(request.id, 'completed')
      this.generatedArticles.set(article.id, article)

      return article.id
    } catch (error) {
      this.updateRequestStatus(request.id, 'error')
      throw error
    }
  }

  private async conductResearch(request: ContentRequest): Promise<ResearchData> {
    const url = request.type === 'url' ? request.input : undefined
    const query = request.type === 'url' ? this.extractTopicFromUrl(request.input) : request.input
    
    return this.researchEngine.conductResearch(query, url)
  }

  private async generateContent(
    request: ContentRequest,
    research: ResearchData
  ): Promise<GeneratedArticle> {
    return this.contentGenerator.generateArticle(request, research)
  }

  private updateRequestStatus(
    requestId: string,
    status: ContentRequest['status']
  ): void {
    const request = this.activeRequests.get(requestId)
    if (request) {
      request.status = status
      this.activeRequests.set(requestId, request)
    }
  }

  private extractTopicFromUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname
      return path
        .split('/')
        .filter(segment => segment.length > 0)
        .join(' ')
        .replace(/[-_]/g, ' ')
    } catch {
      return 'article analysis'
    }
  }

  getRequest(requestId: string): ContentRequest | undefined {
    return this.activeRequests.get(requestId)
  }

  getArticle(articleId: string): GeneratedArticle | undefined {
    return this.generatedArticles.get(articleId)
  }

  getAllRequests(): ContentRequest[] {
    return Array.from(this.activeRequests.values())
  }

  getAllArticles(): GeneratedArticle[] {
    return Array.from(this.generatedArticles.values())
  }
}

// Global instance
export const automationEngine = new AutomationEngine()