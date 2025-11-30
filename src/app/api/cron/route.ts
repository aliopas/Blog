import { NextRequest, NextResponse } from 'next/server';
import { runAllCrons } from '@/lib/cron-scheduler';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds execution

const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-token-here';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== CRON_SECRET) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const results = await runAllCrons();
        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            results,
        });
    } catch (error: any) {
        console.error('❌ Cron endpoint error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
