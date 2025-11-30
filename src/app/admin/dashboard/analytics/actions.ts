/**
 * 🤖 AI USAGE: Traffic Analysis (DISABLED)
 * AI Flow: analyzeTrafficPatterns
 * Location: @/ai/flows/analyze-traffic-patterns
 */

'use server';
import { resetAllApiKeys, getAllApiKeysStatus } from '@/lib/api-key-manager';
// import { analyzeTrafficPatterns } from '@/ai/flows/analyze-traffic-patterns'; // 🤖 DISABLED

export async function generateTrafficAnalysis(): Promise<{
    summary: string;
    recommendations: string[];
    trendingTopics: string[];
}> {
    await resetAllApiKeys();
    try {
        console.log('🚀 Starting traffic analysis...');

        // 🤖 AI DISABLED - Uncomment to enable
        throw new Error('AI traffic analysis is currently disabled. Please enable it in the code.');

        // // Check if we have any available keys
        // const keysStatus = await getAllApiKeysStatus();
        // const availableKeys = keysStatus.filter(k => !k.quotaExceeded);

        // if (availableKeys.length === 0) {
        //     throw new Error('No API keys available. All quotas exceeded. Please reset or add new keys.');
        // }

        // console.log(`✅ ${availableKeys.length} API keys available`);

        // const result = await analyzeTrafficPatterns();
        // return result;
    } catch (error) {
        console.error('❌ Error generating traffic analysis:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to generate traffic analysis');
    }
}

// Helper action to check API keys status
export async function checkApiKeysStatus() {
    try {
        return await getAllApiKeysStatus();
    } catch (error) {
        console.error('Error checking API keys status:', error);
        return [];
    }
}