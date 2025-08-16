# ContentFlow AI

**Automated Blog Content Generation Platform**

ContentFlow AI is a powerful automation platform that generates well-researched, fact-checked, SEO-optimized blog articles from keywords, topics, or article URLs.

## Features

🔍 **Multi-Input Support**
- Keywords
- Topics/Subjects  
- Article/News URLs

🧠 **AI-Powered Research**
- Real-time web research using Perplexity integration
- Fact-checking and source verification
- Statistical data extraction

✍️ **Content Generation**
- Claude AI integration for high-quality content
- Multiple tone options (Professional, Casual, Authoritative, Friendly)
- Customizable word count (500-5000 words)

📊 **SEO Optimization**
- Keyword density analysis
- SEO score calculation
- Meta title and description generation
- Heading structure optimization

📈 **Dashboard Features**
- Real-time generation progress tracking
- Article history and management
- Export capabilities (HTML, Markdown, JSON)
- Performance metrics

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **AI Integration**: Claude (Anthropic), Perplexity Search
- **Deployment**: Vercel/Railway ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/contentflow-ai.git
cd contentflow-ai
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your API keys:
\`\`\`
ANTHROPIC_API_KEY=your_claude_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating Content

1. **Choose Input Type**: Select between Keyword, Topic, or URL
2. **Enter Your Input**: Provide the main keyword, topic, or article URL
3. **Configure Settings**: Set target keywords, word count, and tone
4. **Generate**: Click "Generate Article" and watch the automation work

### Managing Articles

- View generation history with real-time progress
- Browse generated articles with SEO scores
- Export articles in multiple formats
- Edit and optimize content

## API Endpoints

### POST /api/automation
Generate new content:
\`\`\`json
{
  "input": "artificial intelligence",
  "type": "keyword",
  "options": {
    "targetKeywords": ["AI", "machine learning"],
    "wordCount": 1500,
    "tone": "professional"
  }
}
\`\`\`

### GET /api/automation
Retrieve generation status and articles:
\`\`\`
GET /api/automation?requestId=req-123
GET /api/automation?articleId=article-456
\`\`\`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Railway

1. Connect GitHub repository
2. Add environment variables
3. Deploy with one click

## Architecture

```
ContentFlow AI
├── Research Engine (Perplexity Integration)
├── Content Generator (Claude Integration)  
├── SEO Analyzer
├── Export System
└── Dashboard UI
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Open a GitHub issue
- Check the documentation
- Contact support

---

**Built with ❤️ for content creators and marketers**