import { ResearchData, GeneratedArticle, ContentRequest } from './types'

export class ContentGenerator {
  async generateArticle(
    request: ContentRequest,
    research: ResearchData
  ): Promise<GeneratedArticle> {
    try {
      const prompt = this.buildPrompt(request, research)
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          wordCount: request.wordCount || 1500,
          tone: request.tone || 'professional',
        }),
      })

      if (!response.ok) {
        throw new Error('Content generation failed')
      }

      const result = await response.json()
      
      return {
        id: `article-${Date.now()}`,
        requestId: request.id,
        title: result.title || this.generateTitle(request, research),
        content: result.content || '',
        metaDescription: result.metaDescription || '',
        keywords: request.targetKeywords || [],
        wordCount: this.countWords(result.content || ''),
        seoScore: 85, // Mock score - would be calculated
        readabilityScore: 75, // Mock score - would be calculated
        sources: research.sources,
        createdAt: new Date(),
      }
    } catch (error) {
      console.error('Content generation error:', error)
      throw error
    }
  }

  private buildPrompt(request: ContentRequest, research: ResearchData): string {
    const keyPointsText = research.keyPoints.join('\n- ')
    const sourcesText = research.sources.map(s => `${s.title}: ${s.excerpt}`).join('\n')
    const statsText = research.statistics.join(', ')

    return `
Write a comprehensive, well-researched blog article about "${request.input}".

RESEARCH DATA:
Key Points:
- ${keyPointsText}

Statistics: ${statsText}

Sources:
${sourcesText}

REQUIREMENTS:
- Word count: ${request.wordCount || 1500} words
- Tone: ${request.tone || 'professional'}
- Include proper headings (H1, H2, H3)
- Make it SEO-optimized with natural keyword usage
- Include factual information and statistics
- Add a compelling introduction and conclusion
- Use bullet points and numbered lists where appropriate
- Ensure content is original and engaging

TARGET KEYWORDS: ${request.targetKeywords?.join(', ') || request.input}

Format the response as JSON with:
{
  "title": "Article Title",
  "content": "Full article content with HTML formatting",
  "metaDescription": "150-character meta description"
}
`
  }

  private generateTitle(request: ContentRequest, research: ResearchData): string {
    const keywords = request.targetKeywords || [request.input]
    const mainKeyword = keywords[0]
    
    const titleTemplates = [
      `The Complete Guide to ${mainKeyword}`,
      `${mainKeyword}: Everything You Need to Know`,
      `How to Master ${mainKeyword} in 2024`,
      `${mainKeyword} Explained: Tips, Tricks, and Best Practices`,
    ]
    
    return titleTemplates[Math.floor(Math.random() * titleTemplates.length)]
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length
  }
}