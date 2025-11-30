'use server';

import { z } from 'zod';
import { runFlowWithRotation, getDefaultAi } from '../genkit';
import {
    getTopPosts,
    getVisitorsByCountry,
    getTrafficTrend
} from '@/app/admin/dashboard/analytics/queries';

// Define schemas
const AnalyzeTrafficOutputSchema = z.object({
    summary: z.string().describe('Overall performance summary'),
    recommendations: z.array(z.string()).describe('Content strategy recommendations'),
    trendingTopics: z.array(z.string()).describe('Trending topics from top posts'),
});

export type AnalyzeTrafficOutput = z.infer<typeof AnalyzeTrafficOutputSchema>;

// Main analysis function
export async function analyzeTrafficPatterns(): Promise<AnalyzeTrafficOutput> {
    try {
        console.log('📊 Starting traffic analysis...');

        // 1. Fetch real analytics data
        const [topPosts, topCountries, trafficTrend] = await Promise.all([
            getTopPosts(),
            getVisitorsByCountry(),
            getTrafficTrend(7),
        ]);

        console.log(`✅ Data fetched: ${topPosts.length} posts, ${topCountries.length} countries`);

        // 2. Prepare context
        const context = `
Traffic Analytics Summary:

TOP PERFORMING POSTS (by views):
${topPosts.length > 0
                ? topPosts.map((p, i) => `${i + 1}. "${p.title}" - ${p.views} views, ${p.uniqueVisitors} unique visitors`).join('\n')
                : 'No posts data available yet'}

VISITOR DEMOGRAPHICS (Top Countries):
${topCountries.length > 0
                ? topCountries.map((c, i) => `${i + 1}. ${c.country}: ${c.count} visitors`).join('\n')
                : 'No country data available yet'}

TRAFFIC TREND (Last 7 Days):
${trafficTrend.length > 0
                ? trafficTrend.map(t => `${t.date}: ${t.visitors} visitors`).join('\n')
                : 'No traffic trend data available yet'}

Total Posts Analyzed: ${topPosts.length}
Total Countries: ${topCountries.length}
    `.trim();

        console.log('🤖 Calling AI for analysis...');

        // 3. Run analysis with key rotation - Use API Key 2 for analytics
        const result = await runFlowWithRotation<
            { context: string },
            AnalyzeTrafficOutput
        >(
            (aiInstance: any) => {
                // ✅ Define prompt inside the flow with the AI instance
                const analyzeTrafficPrompt = aiInstance.definePrompt({
                    name: 'analyzeTrafficPrompt',
                    input: {
                        schema: z.object({
                            context: z.string().describe('Analytics context to analyze'),
                        })
                    },
                    output: { schema: AnalyzeTrafficOutputSchema },
                    prompt: `You are an AI analytics expert specializing in blog content strategy.

            Analyze the following blog traffic data and provide actionable insights:

            {{{context}}}

            Based on this data, provide:
            1. A brief summary (2-3 sentences) of current performance trends
            2. 3-5 specific, actionable content recommendations (what topics/formats should we focus on?)
            3. 3 trending topics derived from the top performing posts

            Be specific and data-driven in your recommendations.`,
                });

                return aiInstance.defineFlow(
                    {
                        name: 'analyzeTrafficFlow',
                        inputSchema: z.object({ context: z.string() }),
                        outputSchema: AnalyzeTrafficOutputSchema,
                    },
                    async (input: { context: string }) => {
                        const { output } = await analyzeTrafficPrompt(input);
                        return output!;
                    }
                );
            },
            { context },
            'analytics' // Use API Key 2 for analytics
        );

        console.log('✅ Analysis complete!');
        return result;

    } catch (error) {
        console.error('❌ Error in analyzeTrafficPatterns:', error);

        // Fallback response if AI fails
        return {
            summary: 'Unable to generate AI analysis at this time. Please try again later or check your API keys.',
            recommendations: [
                'Continue creating quality content',
                'Monitor traffic patterns regularly',
                'Engage with your audience',
                'Check API key quotas'
            ],
            trendingTopics: ['General Tech', 'Web Development', 'AI']
        };
    }
}