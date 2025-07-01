// api/analyze.js - Vercel Serverless Function
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { teamName, league, keywords, email } = req.body;
        
        if (!teamName || !keywords || !Array.isArray(keywords)) {
            return res.status(400).json({ 
                error: 'Missing required fields: teamName and keywords array' 
            });
        }

        console.log(`Starting analysis for: ${teamName} (${league})`);
        
        // Create simulated analyses (we'll use real API later)
        const analyses = [];
        
        for (let i = 0; i < Math.min(5, keywords.length); i++) {
            const keyword = keywords[i];
            const competitors = getSimulatedCompetitors(keyword);
            const teamRank = Math.random() > 0.6 ? -1 : Math.floor(Math.random() * 10) + 1;
            const opportunity = calculateOpportunityScore(keyword, teamRank, competitors);

            analyses.push({
                keyword: keyword,
                opportunity: opportunity,
                gapType: getGapType(keyword, competitors),
                teamRank: teamRank === -1 ? 'Not found' : `#${teamRank}`,
                competitors: competitors.slice(0, 3),
                contentSuggestion: getContentSuggestion(keyword),
                llmStrategy: getLLMStrategy(keyword),
                searchVolume: generateSimulatedSearchVolume(keyword),
                isRealData: false,
                cost: 0
            });
        }
        
        // Sort by opportunity score
        analyses.sort((a, b) => b.opportunity - a.opportunity);
        
        console.log(`Analysis complete for ${teamName}`);
        
        res.json({
            success: true,
            teamName: teamName,
            league: league,
            totalKeywords: keywords.length,
            analyses: analyses,
            summary: {
                highOpportunity: analyses.filter(a => a.opportunity >= 7).length,
                totalSearchVolume: analyses.reduce((sum, a) => sum + a.searchVolume, 0),
                realDataCount: analyses.filter(a => a.isRealData).length
            }
        });
        
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ 
            error: 'Analysis failed', 
            message: error.message 
        });
    }
}

// Helper functions
function calculateOpportunityScore(keyword, teamRank, competitors) {
    let score = 5;
    if (keyword.includes('first time') || keyword.includes('what to expect')) score += 3;
    if (keyword.includes('parking')) score += 2;
    if (keyword.includes('tickets') || keyword.includes('cheap')) score += 2;
    if (keyword.includes('seating')) score += 1;
    if (teamRank === -1) score += 3;
    else if (teamRank > 10) score += 2;
    else if (teamRank > 5) score += 1;
    else if (teamRank <= 3) score -= 1;
    const hasTicketResellers = competitors.some(comp => 
        ['ticketmaster.com', 'stubhub.com', 'seatgeek.com'].includes(comp)
    );
    if (hasTicketResellers) score += 1;
    return Math.min(Math.max(score, 3), 10);
}

function getGapType(keyword, competitors) {
    if (keyword.includes('first time') || keyword.includes('what to expect')) {
        return 'First-Timer Experience Gap';
    }
    if (keyword.includes('parking')) {
        return 'Arena Information Gap';
    }
    if (competitors.some(comp => ['ticketmaster.com', 'stubhub.com', 'seatgeek.com'].includes(comp))) {
        return 'Ticket Reseller Dominance';
    }
    if (keyword.includes('seating') || keyword.includes('arena')) {
        return 'Venue Experience Gap';
    }
    return 'General Content Gap';
}

function getContentSuggestion(keyword) {
    if (keyword.includes('first time') || keyword.includes('what to expect')) {
        return {
            title: 'Complete First-Timer\'s Hockey Guide',
            format: 'FAQ-style guide with arena tips and terminology',
            cta: 'Buy Official Tickets'
        };
    }
    if (keyword.includes('parking')) {
        return {
            title: 'Ultimate Arena Parking Guide',
            format: 'Interactive map with pricing and walking times',
            cta: 'Reserve Parking & Tickets'
        };
    }
    if (keyword.includes('seating')) {
        return {
            title: 'Interactive Arena Seating Guide',
            format: 'Visual seating chart with ice view photos',
            cta: 'Find Your Perfect Seats'
        };
    }
    return {
        title: 'Comprehensive Fan Guide',
        format: 'Detailed FAQ with local tips',
        cta: 'Get Tickets'
    };
}

function getLLMStrategy(keyword) {
    if (keyword.includes('first time') || keyword.includes('what to expect')) {
        return 'Create conversational Q&A content optimized for voice search and AI assistants';
    }
    if (keyword.includes('parking') || keyword.includes('seating')) {
        return 'Use structured data and local context for location-based AI search';
    }
    return 'Optimize with natural language and hockey-specific terminology for AI search';
}

function generateSimulatedSearchVolume(keyword) {
    if (keyword.includes('tickets') || keyword.includes('cheap')) {
        return Math.floor(Math.random() * 800) + 200;
    }
    if (keyword.includes('first time') || keyword.includes('what to expect')) {
        return Math.floor(Math.random() * 400) + 150;
    }
    if (keyword.includes('parking')) {
        return Math.floor(Math.random() * 300) + 100;
    }
    return Math.floor(Math.random() * 200) + 50;
}

function getSimulatedCompetitors(keyword) {
    if (keyword.includes('tickets')) {
        return ['stubhub.com', 'ticketmaster.com', 'seatgeek.com'];
    }
    if (keyword.includes('parking')) {
        return ['spothero.com', 'parkwhiz.com', 'yelp.com'];
    }
    if (keyword.includes('first time')) {
        return ['reddit.com', 'tripadvisor.com', 'hockeyforum.com'];
    }
    return ['reddit.com', 'yelp.com', 'hockeydb.com'];
}