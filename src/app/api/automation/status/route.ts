/**
 * Automation status endpoint
 */

import { NextResponse } from 'next/server';
import { getCronStatus } from '@/lib/cron-scheduler';

export async function GET() {
    try {
        const status = await getCronStatus();

        return NextResponse.json({
            success: true,
            ...status,
        });
    } catch (error: any) {
        console.error('❌ Status error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}
