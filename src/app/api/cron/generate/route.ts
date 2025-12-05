import { generateScheduledPost } from '@/ai/page';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
    try {
        console.log("🔄 Cron job triggered: Generating scheduled post...");

        const result = await generateScheduledPost();

        if (result && result.success) {
            return NextResponse.json({
                success: true,
                message: `Post created successfully: ${result.title}`,
                postId: result.postId
            });
        } else {
            return NextResponse.json({
                success: false,
                message: result?.reason || result?.error || 'Unknown error'
            }, { status: 400 });
        }
    } catch (error) {
        console.error("❌ Cron job failed:", error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
