import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Tracking is disabled - just return success
        console.log('⚠️ Visitor tracking is currently disabled.');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Tracking API error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
