export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  imageHint: string | null;
  categoryId: string;
  publishedAt: string;
  readTime: number;
  isFeatured: boolean;
  topic: string | null;
  status: 'draft' | 'published';
  category: Category; // Joined data
}

export interface ArticleQualityCheck {
    id: string;
    postId: string;
    readabilityScore: number;
    keywordDensityScore: number;
    isHighQuality: boolean;
    suggestions: string | null;
    checkedAt: string;
}

export type PostWithQualityCheck = Post & {
    qualityCheck: ArticleQualityCheck | null;
};

// This mirrors the Drizzle schema for raw queries
export type RawPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  imageHint: string | null;
  categoryId: string;
  publishedAt: string;
  readTime: number;
  isFeatured: number; // SQLite stores boolean as 0 or 1
  topic: string | null;
  status: 'draft' | 'published';
  categoryName: string;
  categorySlug: string;
};
