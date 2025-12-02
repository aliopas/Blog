'use server';

// Analytics actions - All AI features disabled, returning mock data only

export async function generateTrafficAnalysis(): Promise<{
    summary: string;
    recommendations: string[];
    trendingTopics: string[];
}> {
    // Return mock data - AI features are disabled
    console.log('⚠️ AI traffic analysis is disabled. Returning placeholder data.');

    return {
        summary: 'AI traffic analysis is currently disabled. Enable AI features to get real insights.',
        recommendations: [
            'Focus on writing high-quality content',
            'Share your posts on social media',
            'Engage with your audience'
        ],
        trendingTopics: ['Technology', 'Development', 'AI']
    };
}

// No API key management needed - AI features are disabled
export async function checkApiKeysStatus() {
    return [];
}