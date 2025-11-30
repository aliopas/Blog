import { NextResponse } from 'next/server';
import { trackVisitor } from '@/lib/visitor-tracking';

export const runtime = 'nodejs'; // Force Node.js runtime for DB connection

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Run tracking (fire and forget)
        trackVisitor(data).catch(err =>
            console.error('Tracking error in API:', err)
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Tracking API error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
