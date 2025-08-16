import { SEOAnalysis, HeadingAnalysis } from './types'

export class SEOAnalyzer {
  analyzeContent(content: string, targetKeywords: string[] = []): SEOAnalysis {
    const text = this.stripHtml(content)
    const words = this.extractWords(text)
    const headings = this.extractHeadings(content)
    
    return {
      score: this.calculateOverallScore(content, targetKeywords),
      keywordDensity: this.calculateKeywordDensity(words, targetKeywords),
      suggestions: this.generateSuggestions(content, targetKeywords, headings),
      metaTitle: this.generateMetaTitle(content, targetKeywords),
      metaDescription: this.generateMetaDescription(content, targetKeywords),
      headingStructure: this.analyzeHeadingStructure(headings, targetKeywords),
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  private extractWords(text: string): string[] {
    return text.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2)
  }

  private extractHeadings(html: string): Array<{ level: number; text: string }> {
    const headingRegex = /<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/gi
    const headings: Array<{ level: number; text: string }> = []
    let match

    while ((match = headingRegex.exec(html)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        text: match[2].trim(),
      })
    }

    return headings
  }

  private calculateOverallScore(content: string, keywords: string[]): number {
    let score = 0
    const text = this.stripHtml(content)
    const wordCount = text.split(/\s+/).length

    // Word count score (30%)
    if (wordCount >= 1000) score += 30
    else if (wordCount >= 500) score += 20
    else score += 10

    // Heading structure score (20%)
    const headings = this.extractHeadings(content)
    if (headings.some(h => h.level === 1)) score += 10
    if (headings.some(h => h.level === 2)) score += 10

    // Keyword usage score (30%)
    keywords.forEach(keyword => {
      const keywordCount = (text.match(new RegExp(keyword, 'gi')) || []).length
      const density = (keywordCount / wordCount) * 100
      
      if (density >= 1 && density <= 3) score += 10
      else if (density > 0) score += 5
    })

    // Content structure score (20%)
    if (content.includes('<ul>') || content.includes('<ol>')) score += 5
    if (content.includes('<p>')) score += 5
    if (content.length > 2000) score += 10

    return Math.min(score, 100)
  }

  private calculateKeywordDensity(words: string[], keywords: string[]): Record<string, number> {
    const density: Record<string, number> = {}
    const totalWords = words.length

    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase()
      const count = words.filter(word => word.includes(keywordLower)).length
      density[keyword] = (count / totalWords) * 100
    })

    return density
  }

  private generateSuggestions(
    content: string,
    keywords: string[],
    headings: Array<{ level: number; text: string }>
  ): string[] {
    const suggestions: string[] = []
    const text = this.stripHtml(content)
    const wordCount = text.split(/\s+/).length

    // Word count suggestions
    if (wordCount < 500) {
      suggestions.push('Consider expanding the content to at least 500 words for better SEO')
    }

    // Heading suggestions
    if (!headings.some(h => h.level === 1)) {
      suggestions.push('Add an H1 heading for better content structure')
    }

    if (headings.filter(h => h.level === 2).length < 2) {
      suggestions.push('Add more H2 headings to improve content organization')
    }

    // Keyword suggestions
    keywords.forEach(keyword => {
      const keywordCount = (text.match(new RegExp(keyword, 'gi')) || []).length
      const density = (keywordCount / wordCount) * 100

      if (density === 0) {
        suggestions.push(`Include the keyword "${keyword}" in your content`)
      } else if (density > 3) {
        suggestions.push(`Reduce keyword density for "${keyword}" (currently ${density.toFixed(1)}%)`)
      }
    })

    // Structure suggestions
    if (!content.includes('<ul>') && !content.includes('<ol>')) {
      suggestions.push('Add bullet points or numbered lists to improve readability')
    }

    return suggestions
  }

  private generateMetaTitle(content: string, keywords: string[]): string {
    const headings = this.extractHeadings(content)
    const h1 = headings.find(h => h.level === 1)
    
    if (h1) {
      return h1.text.length <= 60 ? h1.text : h1.text.substring(0, 57) + '...'
    }

    const primaryKeyword = keywords[0] || 'Guide'
    return `The Complete ${primaryKeyword} Guide`
  }

  private generateMetaDescription(content: string, keywords: string[]): string {
    const text = this.stripHtml(content)
    const firstParagraph = text.split('\n')[0] || text.substring(0, 160)
    
    return firstParagraph.length <= 160 
      ? firstParagraph 
      : firstParagraph.substring(0, 157) + '...'
  }

  private analyzeHeadingStructure(
    headings: Array<{ level: number; text: string }>,
    keywords: string[]
  ): HeadingAnalysis[] {
    return headings.map(heading => ({
      level: heading.level,
      text: heading.text,
      keywords: keywords.filter(keyword => 
        heading.text.toLowerCase().includes(keyword.toLowerCase())
      ),
    }))
  }
}