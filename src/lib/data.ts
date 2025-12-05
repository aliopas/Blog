'use server';

import { unstable_cache } from 'next/cache';

import { db } from './db';
import { categories, posts, qualityChecks, postMetrics } from './schema';
import { eq, desc, and } from 'drizzle-orm';
import type { Post, Category, ArticleQualityCheck, PostWithQualityCheck } from './types';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import { revalidateTag } from 'next/cache';

// Cached function to get all categories
const getAllCategoriesCached = unstable_cache(
  async () => {
    const result = await db.select().from(categories);
    return result.map(cat => ({
      id: cat.id.toString(),
      name: cat.name,
      slug: cat.slug,
    }));
  },
  ['all-categories'],
  { tags: ['categories'] }
);

// Cached function to get all posts with categories
const getAllPostsCached = unstable_cache(
  async () => {
    const result = await db.select().from(posts).orderBy(desc(posts.createdAt));
    const allCategories = await getAllCategoriesCached();

    return result.map((post) => {
      const category = allCategories.find(c => c.id === post.categoryId.toString());
      return {
        ...post,
        id: post.id.toString(),
        categoryId: post.categoryId.toString(),
        isFeatured: post.isFeatured,
        status: post.status as 'draft' | 'published',
        category: category || { id: '1', name: 'AI News', slug: 'ai-news' },
      };
    });
  },
  ['all-posts'],
  { tags: ['posts', 'categories'] }
);

// Get all posts or filter by status
export async function getPosts(status?: 'draft' | 'published'): Promise<Post[]> {
  const allPosts = await getAllPostsCached();

  if (status) {
    return allPosts.filter(p => p.status === status);
  }

  return allPosts;
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const decodedSlug = decodeURIComponent(slug);
  const result = await db.select().from(posts).where(eq(posts.slug, decodedSlug)).limit(1);

  if (!result[0]) return null;

  const post = result[0];
  const category = await db.select().from(categories).where(eq(categories.id, post.categoryId)).limit(1);

  return {
    ...post,
    id: post.id.toString(),
    categoryId: post.categoryId.toString(),
    isFeatured: post.isFeatured,
    status: post.status as 'draft' | 'published',
    category: category[0] ? {
      id: category[0].id.toString(),
      name: category[0].name,
      slug: category[0].slug,
    } : { id: '1', name: 'AI News', slug: 'ai-news' },
  };
}

// Get post by ID with quality check
export async function getPostById(id: string): Promise<PostWithQualityCheck | null> {
  const postId = parseInt(id);
  const result = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

  if (!result[0]) return null;

  const post = result[0];
  const category = await db.select().from(categories).where(eq(categories.id, post.categoryId)).limit(1);
  const qualityCheck = await db.select().from(qualityChecks).where(eq(qualityChecks.postId, postId)).limit(1);

  return {
    ...post,
    id: post.id.toString(),
    categoryId: post.categoryId.toString(),
    isFeatured: post.isFeatured,
    status: post.status as 'draft' | 'published',
    category: category[0] ? {
      id: category[0].id.toString(),
      name: category[0].name,
      slug: category[0].slug,
    } : { id: '1', name: 'AI News', slug: 'ai-news' },
    qualityCheck: qualityCheck[0] ? {
      id: qualityCheck[0].id.toString(),
      postId: qualityCheck[0].postId.toString(),
      readabilityScore: qualityCheck[0].readabilityScore,
      keywordDensityScore: qualityCheck[0].keywordDensityScore,
      isHighQuality: qualityCheck[0].isHighQuality,
      suggestions: qualityCheck[0].suggestions,
      checkedAt: qualityCheck[0].checkedAt.toISOString(),
    } : null,
  };
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  return getAllCategoriesCached();
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const allCategories = await getAllCategoriesCached();
  return allCategories.find(c => c.slug === slug) || null;
}

// Get category by name
export async function getCategoryByName(name: string): Promise<Category | null> {
  const allCategories = await getAllCategoriesCached();
  return allCategories.find(c => c.name === name) || null;
}

// Get posts by category ID
export async function getPostsByCategoryId(categoryId: string, status?: 'draft' | 'published'): Promise<Post[]> {
  const allPosts = await getAllPostsCached();
  let filtered = allPosts.filter(p => p.categoryId === categoryId);

  if (status) {
    filtered = filtered.filter(p => p.status === status);
  }

  return filtered;
}

// Add new post
export async function addPost(postData: any, qualityData: any, categoryName: string): Promise<string> {
  const category = await getCategoryByName(categoryName);
  if (!category) {
    throw new Error(`Category ${categoryName} not found`);
  }

  const slug = `${postData.title.replace(/\s+/g, '-').slice(0, 50)}-${nanoid(5)}`;
  const readTime = Math.ceil((postData.content?.split(' ').length || 0) / 200);

  const [newPost] = await db.insert(posts).values({
    title: postData.title,
    slug,
    excerpt: postData.content?.substring(0, 150) || '',
    content: postData.content,
    categoryId: parseInt(category.id),
    imageUrl: postData.imageUrl || 'https://picsum.photos/seed/1/600/400',
    imageHint: postData.imageHint || 'abstract',
    publishedAt: format(new Date(), 'MMMM d, yyyy'),
    readTime,
    isFeatured: false,
    status: postData.status || 'draft',
    topic: postData.topic,
  }).returning();

  // Add quality check
  await db.insert(qualityChecks).values({
    postId: newPost.id,
    readabilityScore: qualityData.readabilityScore,
    keywordDensityScore: qualityData.keywordDensityScore,
    isHighQuality: qualityData.isHighQuality,
    suggestions: qualityData.suggestions,
  });

  revalidateTag('posts');
  return newPost.id.toString();
}

// Update post
export async function updatePost(id: string, data: Partial<Omit<Post, 'id'>>) {
  const postId = parseInt(id);
  if (isNaN(postId)) {
    throw new Error('Invalid post ID');
  }

  const dataToUpdate: { [key: string]: any } = { ...data, updatedAt: new Date() };

  // Ensure categoryId is a number if it exists
  if (data.categoryId && typeof data.categoryId === 'string') {
    dataToUpdate.categoryId = parseInt(data.categoryId, 10);
  }

  await db.update(posts)
    .set(dataToUpdate)
    .where(eq(posts.id, postId));

  revalidateTag('posts');
}

// Delete post
export async function deletePost(id: string): Promise<void> {
  const postId = parseInt(id);
  // It's good practice to wrap dependent deletions in a transaction
  await db.transaction(async (tx) => {
    await tx.delete(qualityChecks).where(eq(qualityChecks.postId, postId));
    await tx.delete(posts).where(eq(posts.id, postId));
  });
  revalidateTag('posts');
}
