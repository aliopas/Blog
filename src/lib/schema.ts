import { pgTable, text, integer, boolean, timestamp, serial, varchar, jsonb, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Categories Table
export const categories = pgTable('blog_categories', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Posts Table
export const posts = pgTable('blog_posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    imageUrl: text('image_url'),
    imageHint: text('image_hint'),
    categoryId: integer('category_id').references(() => categories.id).notNull(),
    publishedAt: varchar('published_at', { length: 50 }).notNull(),
    readTime: integer('read_time').notNull().default(5),
    isFeatured: boolean('is_featured').notNull().default(false),
    topic: text('topic'),
    status: varchar('status', { length: 20 }).notNull().default('draft'), // 'draft' or 'published'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Quality Checks Table
export const qualityChecks = pgTable('blog_quality_checks', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    readabilityScore: integer('readability_score').notNull(),
    keywordDensityScore: integer('keyword_density_score').notNull(),
    isHighQuality: boolean('is_high_quality').notNull(),
    suggestions: text('suggestions'),
    checkedAt: timestamp('checked_at').defaultNow().notNull(),
});

// Visitors Table (for tracking)
export const visitors = pgTable('blog_visitors', {
    id: serial('id').primaryKey(),
    ipAddress: varchar('ip_address', { length: 45 }).notNull(), // IPv6 support
    country: varchar('country', { length: 100 }),
    city: varchar('city', { length: 100 }),
    latitude: real('latitude'),
    longitude: real('longitude'),
    userAgent: text('user_agent'),
    pageVisited: text('page_visited').notNull(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'set null' }),
    visitedAt: timestamp('visited_at').defaultNow().notNull(),
});

// Post Metrics Table (aggregated traffic data)
export const postMetrics = pgTable('blog_post_metrics', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull().unique(),
    totalViews: integer('total_views').notNull().default(0),
    uniqueVisitors: integer('unique_visitors').notNull().default(0),
    avgTimeOnPage: integer('avg_time_on_page').default(0), // in seconds
    lastViewedAt: timestamp('last_viewed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// API Keys Table (for rotation)
export const apiKeys = pgTable('blog_api_keys', {
    id: serial('id').primaryKey(),
    keyName: varchar('key_name', { length: 50 }).notNull().unique(), // e.g., 'GEMINI_API_KEY_1'
    keyValue: text('key_value').notNull(),
    usageCount: integer('usage_count').notNull().default(0),
    quotaExceeded: boolean('quota_exceeded').notNull().default(false),
    lastUsedAt: timestamp('last_used_at'),
    resetAt: timestamp('reset_at'), // Daily reset timestamp
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
    posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    category: one(categories, {
        fields: [posts.categoryId],
        references: [categories.id],
    }),
    qualityCheck: one(qualityChecks, {
        fields: [posts.id],
        references: [qualityChecks.postId],
    }),
    metrics: one(postMetrics, {
        fields: [posts.id],
        references: [postMetrics.postId],
    }),
    visitors: many(visitors),
}));

export const qualityChecksRelations = relations(qualityChecks, ({ one }) => ({
    post: one(posts, {
        fields: [qualityChecks.postId],
        references: [posts.id],
    }),
}));

export const visitorsRelations = relations(visitors, ({ one }) => ({
    post: one(posts, {
        fields: [visitors.postId],
        references: [posts.id],
    }),
}));

export const postMetricsRelations = relations(postMetrics, ({ one }) => ({
    post: one(posts, {
        fields: [postMetrics.postId],
        references: [posts.id],
    }),
}));
