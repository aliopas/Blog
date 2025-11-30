
'use server';

import { getPosts, getPostById, getCategories, getCategoryByName } from '@/lib/data';
// Correctly import all types from the single source of truth
import type { Post, Category, PostWithQualityCheck } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// The problematic re-export has been removed. 
// Components should import types directly from @/lib/types.

import { db } from '@/lib/db';
import { posts, categories, qualityChecks } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * Fetches all posts with a 'draft' status, along with their associated category
 * and quality check information.
 * @returns {Promise<PostWithQualityCheck[]>} A promise that resolves to an array of pending posts.
 */
export async function getPendingPosts(): Promise<PostWithQualityCheck[]> {
    const result = await db.select({
        post: posts,
        category: categories,
        qualityCheck: qualityChecks,
    })
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .leftJoin(qualityChecks, eq(posts.id, qualityChecks.postId))
        .where(eq(posts.status, 'draft'))
        .orderBy(desc(posts.createdAt));

    return result.map(({ post, category, qualityCheck }) => ({
        ...post,
        // Ensure IDs are converted to strings if they are numbers
        id: post.id.toString(),
        categoryId: post.categoryId.toString(),
        // No change needed for boolean
        isFeatured: post.isFeatured,
        // Cast status to the correct literal type
        status: post.status as 'draft' | 'published',
        // Provide a fallback for category if it's null
        category: category ? {
            id: category.id.toString(),
            name: category.name,
            slug: category.slug,
        } : { id: '0', name: 'Uncategorized', slug: 'uncategorized' }, // Fallback
        // Map qualityCheck data if it exists
        qualityCheck: qualityCheck ? {
            id: qualityCheck.id.toString(),
            postId: qualityCheck.postId.toString(),
            readabilityScore: qualityCheck.readabilityScore,
            keywordDensityScore: qualityCheck.keywordDensityScore,
            isHighQuality: qualityCheck.isHighQuality,
            suggestions: qualityCheck.suggestions,
            // Ensure date is in ISO string format
            checkedAt: qualityCheck.checkedAt.toISOString(),
        } : null,
    }));
}

/**
 * Fetches a single post by its ID for review.
 * This function now correctly returns the PostWithQualityCheck type.
 * @param {string} postId - The ID of the post to fetch.
 * @returns {Promise<PostWithQualityCheck | null>} A promise that resolves to the post or null if not found.
 */
export async function getPostForReview(postId: string): Promise<PostWithQualityCheck | null> {
    // getPostById is assumed to return a fully detailed post.
    // We cast it to the more specific type if we are confident in the data structure.
    const post = await getPostById(postId);
    return post as PostWithQualityCheck | null;
}

// Re-export getCategoryByName from lib/data for consistent API
export { getCategoryByName };

/**
 * Finds a placeholder image URL based on a string hint.
 * @param {string} hint - A keyword to find a relevant placeholder image.
 * @returns {Promise<{imageUrl: string} | undefined>} A promise that resolves to an object with the image URL or undefined.
 */
export async function getPlaceholderImageByHint(hint: string) {
    const image = PlaceHolderImages.find(p => p.imageHint.includes(hint));
    return image;
}

/**
 * Fetches all categories.
 * @returns {Promise<Category[]>} A promise that resolves to an array of all categories.
 */
export async function getAllCategories(): Promise<Category[]> {
    return getCategories();
}
