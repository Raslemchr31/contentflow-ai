import { NextRequest, NextResponse } from 'next/server'
import { automationEngine } from '@/lib/automation-engine'

export async function POST(request: NextRequest) {
  try {
    const { input, type, options } = await request.json()

    if (!input || !type) {
      return NextResponse.json(
        { error: 'Input and type are required' },
        { status: 400 }
      )
    }

    const articleId = await automationEngine.processRequest(input, type, options)
    
    return NextResponse.json({ 
      success: true, 
      articleId,
      message: 'Article generation started successfully'
    })
  } catch (error) {
    console.error('Automation API error:', error)
    return NextResponse.json(
      { error: 'Automation process failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('requestId')
    const articleId = searchParams.get('articleId')

    if (requestId) {
      const request = automationEngine.getRequest(requestId)
      return NextResponse.json({ request })
    }

    if (articleId) {
      const article = automationEngine.getArticle(articleId)
      return NextResponse.json({ article })
    }

    // Return all requests and articles
    const requests = automationEngine.getAllRequests()
    const articles = automationEngine.getAllArticles()

    return NextResponse.json({ requests, articles })
  } catch (error) {
    console.error('Automation API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}