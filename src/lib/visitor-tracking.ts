'use server';

import { db } from './db';
import { visitors, postMetrics } from './schema';
import { eq, sql } from 'drizzle-orm';

export async function trackVisitor(data: {
    ipAddress: string;
    country: string | null;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    userAgent: string | null;
    pageVisited: string;
    postId: number | null;
}) {
    try {
        await db.insert(visitors).values(data);
    } catch (error) {
        console.error('Failed to track visitor:', error);
    }
}

export async function updatePostMetrics(postId: number, ipAddress: string) {
    try {
        // Check if metrics exist for this post
        const existing = await db.select().from(postMetrics).where(eq(postMetrics.postId, postId)).limit(1);

        if (existing[0]) {
            // Update existing metrics
            await db.update(postMetrics)
                .set({
                    totalViews: sql`${postMetrics.totalViews} + 1`,
                    lastViewedAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(postMetrics.postId, postId));
        } else {
            // Create new metrics
            await db.insert(postMetrics).values({
                postId,
                totalViews: 1,
                uniqueVisitors: 1,
                lastViewedAt: new Date(),
            });
        }
    } catch (error) {
        console.error('Failed to update post metrics:', error);
    }
}

export async function getUniqueVisitorsForPost(postId: number): Promise<number> {
    try {
        const result = await db
            .select({ count: sql<number>`COUNT(DISTINCT ${visitors.ipAddress})` })
            .from(visitors)
            .where(eq(visitors.postId, postId));

        return result[0]?.count || 0;
    } catch (error) {
        console.error('Failed to get unique visitors:', error);
        return 0;
    }
}
