/**
 * AI USAGE: Automated Content Generation
 * - triggerContentGeneration (automated content generation)
 * See: AI_FLOWS_TRACKING.md
 */

/**
 * Manual content generation trigger endpoint
 */

import { NextResponse } from 'next/server';
// import { triggerContentGeneration } from '@/ai/flows/automated-content-generation'; // 🤖 AI DISABLED

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Increased to 5 minutes to allow for the new slower, sequential AI flow

export async function POST() {
    // 🤖 AI DISABLED
    return NextResponse.json(
        {
            success: false,
            error: "AI processing is disabled on this server.",
            timestamp: new Date().toISOString(),
        },
        { status: 503 } // Service Unavailable
    );

    /*
    try {
        console.log('📝 Manual content generation triggered');

        const result = await triggerContentGeneration('AI and Technology');

        return NextResponse.json({
            ...result,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('❌ Manual generation error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
    */
}
