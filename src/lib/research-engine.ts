import { ResearchData, Source } from './types'

export class ResearchEngine {
  constructor(private perplexityApiKey?: string) {}

  async conductResearch(query: string, url?: string): Promise<ResearchData> {
    try {
      let searchQuery = query
      
      // If URL is provided, enhance the query with URL content
      if (url) {
        searchQuery = `${query} ${url} latest information trends statistics`
      }

      // Use Perplexity for comprehensive research
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!response.ok) {
        throw new Error('Research failed')
      }

      const result = await response.json()
      
      return {
        sources: this.extractSources(result.sources || []),
        keyPoints: this.extractKeyPoints(result.content || ''),
        relatedTopics: this.extractRelatedTopics(result.content || ''),
        statistics: this.extractStatistics(result.content || ''),
        quotes: this.extractQuotes(result.content || ''),
      }
    } catch (error) {
      console.error('Research error:', error)
      return {
        sources: [],
        keyPoints: [],
        relatedTopics: [],
        statistics: [],
        quotes: [],
      }
    }
  }

  private extractSources(sources: any[]): Source[] {
    return sources.map((source, index) => ({
      url: source.url || `https://example.com/source-${index}`,
      title: source.title || `Source ${index + 1}`,
      excerpt: source.excerpt || source.description || '',
      relevance: 0.8,
      publishDate: source.publishDate,
    }))
  }

  private extractKeyPoints(content: string): string[] {
    // Extract key points using simple heuristics
    const sentences = content.split(/[.!?]+/)
    return sentences
      .filter(s => s.length > 50 && s.length < 200)
      .slice(0, 8)
      .map(s => s.trim())
  }

  private extractRelatedTopics(content: string): string[] {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
    const words = content.toLowerCase().split(/\W+/)
    const wordCount: Record<string, number> = {}

    words.forEach(word => {
      if (word.length > 4 && !commonWords.includes(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  private extractStatistics(content: string): string[] {
    const statRegex = /\d+[%]|\d+\.\d+[%]|\d{1,3}(,\d{3})*|\$\d+/g
    const matches = content.match(statRegex) || []
    return [...new Set(matches)].slice(0, 5)
  }

  private extractQuotes(content: string): string[] {
    const quoteRegex = /"([^"]+)"/g
    const matches = []
    let match

    while ((match = quoteRegex.exec(content)) !== null) {
      if (match[1].length > 20 && match[1].length < 200) {
        matches.push(match[1])
      }
    }

    return matches.slice(0, 3)
  }
}