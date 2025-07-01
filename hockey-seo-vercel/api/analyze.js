export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { teamName, league, keywords } = req.body;
    
    if (!teamName || !keywords) {
        return res.status(400).json({ error: 'Missing teamName or keywords' });
    }

    const analyses = keywords.slice(0, 5).map((keyword, i) => ({
        keyword,
        opportunity: Math.floor(Math.random() * 5) + 6,
        gapType: 'SEO Gap',
        teamRank: 'Not found',
        competitors: ['stubhub.com', 'ticketmaster.com'],
        contentSuggestion: { title: 'Create content', format: 'Blog post', cta: 'Get tickets' },
        llmStrategy: 'Optimize for search',
        searchVolume: Math.floor(Math.random() * 500) + 100,
        isRealData: false
    }));

    res.json({
        success: true,
        teamName,
        league,
        totalKeywords: keywords.length,
        analyses,
        summary: {
            highOpportunity: 3,
            totalSearchVolume: 1500,
            realDataCount: 0
        }
    });
}
