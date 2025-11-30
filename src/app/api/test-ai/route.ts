/**
 * 🤖 AI USAGE: Test AI Connection (DISABLED)
 * - testApiConnection (test AI connection)
 * See: AI_FLOWS_TRACKING.md
 */

import { NextResponse } from 'next/server';
// import { testApiConnection } from '@/ai/test-api'; // 🤖 DISABLED

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('🧪 Triggering AI Test via API...');

        // 🤖 AI DISABLED - Uncomment to enable
        return NextResponse.json({
            success: false,
            message: 'AI Connection Test Disabled',
            error: 'AI features are currently disabled',
            timestamp: new Date().toISOString(),
        }, { status: 503 });

        // const result = await testApiConnection();

        // return NextResponse.json({
        //     success: result.success,
        //     message: result.success ? 'AI Connection Successful' : 'AI Connection Failed',
        //     response: result.response,
        //     error: result.error,
        //     timestamp: new Date().toISOString(),
        // });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
