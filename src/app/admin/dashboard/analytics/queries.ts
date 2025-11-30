'use server';

import { db } from '@/lib/db';
import { visitors, postMetrics, posts } from '@/lib/schema';
import { sql, desc, eq } from 'drizzle-orm';

export async function getVisitorStats() {
    try {
        const [totalVisitors] = await db
            .select({ count: sql<number>`COUNT(*)` })
            .from(visitors);

        const [uniqueVisitors] = await db
            .select({ count: sql<number>`COUNT(DISTINCT ${visitors.ipAddress})` })
            .from(visitors);

        const [todayVisitors] = await db
            .select({ count: sql<number>`COUNT(*)` })
            .from(visitors)
            .where(sql`DATE(${visitors.visitedAt}) = CURRENT_DATE`);

        return {
            total: totalVisitors?.count || 0,
            unique: uniqueVisitors?.count || 0,
            today: todayVisitors?.count || 0,
        };
    } catch (error) {
        console.error('Failed to get visitor stats:', error);
        return { total: 0, unique: 0, today: 0 };
    }
}

export async function getVisitorsByCountry() {
    try {
        const result = await db
            .select({
                country: visitors.country,
                count: sql<number>`COUNT(*)`,
            })
            .from(visitors)
            .where(sql`${visitors.country} IS NOT NULL`)
            .groupBy(visitors.country)
            .orderBy(desc(sql`COUNT(*)`))
            .limit(10);

        return result.map(r => ({
            country: r.country || 'Unknown',
            count: r.count,
        }));
    } catch (error) {
        console.error('Failed to get visitors by country:', error);
        return [];
    }
}

export async function getVisitorLocations() {
    try {
        const result = await db
            .select({
                country: visitors.country,
                city: visitors.city,
                latitude: visitors.latitude,
                longitude: visitors.longitude,
                count: sql<number>`COUNT(*)`,
            })
            .from(visitors)
            .where(sql`${visitors.latitude} IS NOT NULL AND ${visitors.longitude} IS NOT NULL`)
            .groupBy(visitors.country, visitors.city, visitors.latitude, visitors.longitude)
            .limit(100);

        return result.map(r => ({
            country: r.country || 'Unknown',
            city: r.city || 'Unknown',
            latitude: r.latitude!,
            longitude: r.longitude!,
            count: r.count,
        }));
    } catch (error) {
        console.error('Failed to get visitor locations:', error);
        return [];
    }
}

export async function getTopPosts() {
    try {
        const result = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                views: postMetrics.totalViews,
                uniqueVisitors: postMetrics.uniqueVisitors,
            })
            .from(postMetrics)
            .innerJoin(posts, eq(postMetrics.postId, posts.id))
            .orderBy(desc(postMetrics.totalViews))
            .limit(10);

        return result.map(r => ({
            id: r.id.toString(),
            title: r.title,
            slug: r.slug,
            views: r.views || 0,
            uniqueVisitors: r.uniqueVisitors || 0,
        }));
    } catch (error) {
        console.error('Failed to get top posts:', error);
        return [];
    }
}

export async function getTrafficTrend(days: number = 7) {
    try {
        const result = await db
            .select({
                date: sql<string>`DATE(${visitors.visitedAt})`,
                count: sql<number>`COUNT(*)`,
            })
            .from(visitors)
            .where(sql`${visitors.visitedAt} >= CURRENT_DATE - INTERVAL '${sql.raw(days.toString())} days'`)
            .groupBy(sql`DATE(${visitors.visitedAt})`)
            .orderBy(sql`DATE(${visitors.visitedAt})`);

        return result.map(r => ({
            date: r.date,
            visitors: r.count,
        }));
    } catch (error) {
        console.error('Failed to get traffic trend:', error);
        return [];
    }
}
