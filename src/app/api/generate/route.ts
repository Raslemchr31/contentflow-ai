import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, wordCount, tone } = await request.json()

    // Mock content generation - in production, integrate with Claude API
    const mockArticle = {
      title: generateTitle(prompt),
      content: generateContent(prompt, wordCount, tone),
      metaDescription: generateMetaDescription(prompt),
    }

    return NextResponse.json(mockArticle)
  } catch (error) {
    console.error('Generation API error:', error)
    return NextResponse.json(
      { error: 'Content generation failed' },
      { status: 500 }
    )
  }
}

function generateTitle(prompt: string): string {
  const topic = extractMainTopic(prompt)
  const titles = [
    `The Ultimate Guide to ${topic}`,
    `${topic}: Complete Analysis and Best Practices`,
    `Everything You Need to Know About ${topic}`,
    `${topic} Explained: Tips, Strategies, and Insights`,
    `Mastering ${topic}: A Comprehensive Guide`,
  ]
  return titles[Math.floor(Math.random() * titles.length)]
}

function generateContent(prompt: string, wordCount: number, tone: string): string {
  const topic = extractMainTopic(prompt)
  
  return `
<h1>The Ultimate Guide to ${topic}</h1>

<p>In today's rapidly evolving digital landscape, understanding ${topic} has become crucial for businesses and individuals alike. This comprehensive guide will walk you through everything you need to know about ${topic}, from basic concepts to advanced strategies.</p>

<h2>What is ${topic}?</h2>

<p>${topic} represents a fundamental shift in how we approach modern challenges. With its growing importance in various industries, mastering ${topic} can provide significant advantages for your business or personal development.</p>

<h3>Key Benefits of ${topic}</h3>

<ul>
<li>Improved efficiency and productivity</li>
<li>Enhanced user experience and satisfaction</li>
<li>Better decision-making capabilities</li>
<li>Increased competitive advantage</li>
<li>Scalable solutions for long-term growth</li>
</ul>

<h2>Getting Started with ${topic}</h2>

<p>Beginning your journey with ${topic} requires careful planning and understanding of core principles. Here are the essential steps to get you started:</p>

<ol>
<li><strong>Research and Planning:</strong> Conduct thorough research to understand the landscape and identify opportunities.</li>
<li><strong>Strategy Development:</strong> Create a comprehensive strategy that aligns with your goals and resources.</li>
<li><strong>Implementation:</strong> Execute your plan with careful attention to detail and best practices.</li>
<li><strong>Monitoring and Optimization:</strong> Continuously monitor performance and optimize for better results.</li>
</ol>

<h2>Best Practices for ${topic}</h2>

<p>To achieve success with ${topic}, it's essential to follow proven best practices:</p>

<h3>1. Focus on User Experience</h3>
<p>Always prioritize the end-user experience when implementing ${topic} solutions. This ensures higher adoption rates and better outcomes.</p>

<h3>2. Data-Driven Decision Making</h3>
<p>Leverage analytics and data insights to make informed decisions about your ${topic} strategy. Regular monitoring helps identify areas for improvement.</p>

<h3>3. Continuous Learning and Adaptation</h3>
<p>The ${topic} landscape is constantly evolving. Stay updated with the latest trends, technologies, and best practices to maintain your competitive edge.</p>

<h2>Common Challenges and Solutions</h2>

<p>While implementing ${topic}, you may encounter several challenges. Here are common issues and their solutions:</p>

<ul>
<li><strong>Resource Constraints:</strong> Start small and scale gradually to manage resources effectively.</li>
<li><strong>Technical Complexity:</strong> Invest in proper training and consider partnering with experts.</li>
<li><strong>Change Management:</strong> Communicate benefits clearly and provide adequate support during transitions.</li>
</ul>

<h2>Future Trends in ${topic}</h2>

<p>Looking ahead, several trends are shaping the future of ${topic}:</p>

<ul>
<li>Increased automation and AI integration</li>
<li>Enhanced personalization capabilities</li>
<li>Greater emphasis on sustainability and efficiency</li>
<li>Improved security and privacy measures</li>
</ul>

<h2>Conclusion</h2>

<p>Understanding and implementing ${topic} effectively can transform your approach to modern challenges. By following the strategies and best practices outlined in this guide, you'll be well-equipped to leverage ${topic} for success.</p>

<p>Remember that success with ${topic} requires continuous learning, adaptation, and optimization. Stay committed to your goals, monitor your progress, and don't hesitate to adjust your strategy as needed.</p>

<p>Ready to get started? Begin by assessing your current situation, defining clear objectives, and developing a comprehensive implementation plan. With dedication and the right approach, you can achieve remarkable results with ${topic}.</p>
`
}

function generateMetaDescription(prompt: string): string {
  const topic = extractMainTopic(prompt)
  return `Discover everything you need to know about ${topic}. Complete guide with best practices, strategies, and expert insights for success.`
}

function extractMainTopic(prompt: string): string {
  // Simple extraction - in production, use more sophisticated NLP
  const words = prompt.split(' ')
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'write', 'article']
  const meaningfulWords = words.filter(word => 
    word.length > 3 && !stopWords.includes(word.toLowerCase())
  )
  return meaningfulWords[0] || 'Technology'
}