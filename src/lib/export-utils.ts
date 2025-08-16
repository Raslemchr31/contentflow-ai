import { GeneratedArticle } from './types'

export class ExportUtils {
  static exportToHtml(article: GeneratedArticle): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <meta name="description" content="${article.metaDescription}">
    <meta name="keywords" content="${article.keywords.join(', ')}">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        h1 { font-size: 2.5rem; }
        h2 { font-size: 2rem; }
        h3 { font-size: 1.5rem; }
        p { margin-bottom: 1rem; }
        ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
        li { margin-bottom: 0.5rem; }
        .meta {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="meta">
        <strong>Generated:</strong> ${article.createdAt.toLocaleDateString()} | 
        <strong>Word Count:</strong> ${article.wordCount} | 
        <strong>SEO Score:</strong> ${article.seoScore}/100
    </div>
    ${article.content}
    
    <hr style="margin: 3rem 0;">
    <div class="meta">
        <h4>Sources:</h4>
        <ul>
            ${article.sources.map(source => 
                `<li><a href="${source.url}" target="_blank">${source.title}</a></li>`
            ).join('')}
        </ul>
    </div>
</body>
</html>`
  }

  static exportToMarkdown(article: GeneratedArticle): string {
    const htmlToMarkdown = (html: string): string => {
      return html
        .replace(/<h1[^>]*>([^<]+)<\/h1>/gi, '# $1\n\n')
        .replace(/<h2[^>]*>([^<]+)<\/h2>/gi, '## $1\n\n')
        .replace(/<h3[^>]*>([^<]+)<\/h3>/gi, '### $1\n\n')
        .replace(/<h4[^>]*>([^<]+)<\/h4>/gi, '#### $1\n\n')
        .replace(/<h5[^>]*>([^<]+)<\/h5>/gi, '##### $1\n\n')
        .replace(/<h6[^>]*>([^<]+)<\/h6>/gi, '###### $1\n\n')
        .replace(/<p[^>]*>([^<]+)<\/p>/gi, '$1\n\n')
        .replace(/<strong[^>]*>([^<]+)<\/strong>/gi, '**$1**')
        .replace(/<em[^>]*>([^<]+)<\/em>/gi, '*$1*')
        .replace(/<ul[^>]*>/gi, '')
        .replace(/<\/ul>/gi, '\n')
        .replace(/<ol[^>]*>/gi, '')
        .replace(/<\/ol>/gi, '\n')
        .replace(/<li[^>]*>([^<]+)<\/li>/gi, '- $1\n')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi, '[$2]($1)')
        .replace(/<[^>]*>/g, '')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim()
    }

    const frontMatter = `---
title: "${article.title}"
description: "${article.metaDescription}"
keywords: [${article.keywords.map(k => `"${k}"`).join(', ')}]
created: ${article.createdAt.toISOString()}
wordCount: ${article.wordCount}
seoScore: ${article.seoScore}
---

`

    const content = htmlToMarkdown(article.content)
    
    const sources = `
## Sources

${article.sources.map(source => `- [${source.title}](${source.url})`).join('\n')}
`

    return frontMatter + content + sources
  }

  static exportToJson(article: GeneratedArticle): string {
    return JSON.stringify(article, null, 2)
  }

  static downloadFile(content: string, filename: string, contentType: string = 'text/plain') {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  static generateFilename(article: GeneratedArticle, extension: string): string {
    const title = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    const date = article.createdAt.toISOString().split('T')[0]
    return `${date}-${title}.${extension}`
  }
}