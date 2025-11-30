import 'dotenv/config';
import { db } from './db';
import { categories, posts, qualityChecks, apiKeys } from './schema';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        // 1. Seed Categories
        console.log('📁 Adding categories...');
        const categoriesData = [
            { name: 'AI News', slug: 'ai-news' },
            { name: 'Open Source', slug: 'open-source' },
            { name: 'Web Dev', slug: 'web-dev' },
            { name: 'DevOps', slug: 'devops' },
            { name: 'Cybersecurity', slug: 'cybersecurity' },
        ];

        const insertedCategories = await db.insert(categories).values(categoriesData).returning();
        console.log(`✅ Added ${insertedCategories.length} categories`);

        // 2. Seed Posts
        console.log('📝 Adding sample posts...');
        const postsData = [
            {
                title: 'The Future of Generative AI: What to Expect in 2024',
                slug: 'future-of-generative-ai-2024',
                excerpt: 'A deep dive into the upcoming trends and advancements in the world of generative artificial intelligence.',
                content: '<p>The field of generative AI is evolving at an unprecedented pace. This article explores the key trends that will shape 2024, including multimodal models, personalized AI assistants, and the ethical considerations that come with them.</p><h2>Multimodal Models on the Rise</h2><p>One of the most significant shifts is the move towards models that understand and generate content across different modalities like text, images, and audio.</p>',
                imageUrl: "https://images.unsplash.com/photo-1727434032792-c7ef921ae086?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMEFJfGVufDB8fHx8MTc2MzkxMzEzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
                imageHint: 'abstract AI',
                categoryId: insertedCategories[0].id,
                publishedAt: format(new Date('2024-07-20'), 'MMMM d, yyyy'),
                readTime: 7,
                isFeatured: true,
                status: 'published',
                topic: 'Generative AI in 2024',
            },
            {
                title: 'Top 5 Open Source Projects to Watch This Year',
                slug: 'top-5-open-source-projects-2024',
                excerpt: 'Discover the most promising and impactful open-source projects that are shaping the future of software development.',
                content: '<h3>Introduction</h3><p>Open source continues to be the backbone of modern technology. In this post, we highlight five projects that are making significant waves in the community.</p>',
                imageUrl: "https://images.unsplash.com/photo-1614112671716-d584b4ce4f49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxvcGVuJTIwc291cmNlfGVufDB8fHx8MTc2NDAwNzIwMHww&ixlib=rb-4.1.0&q=80&w=1080",
                imageHint: 'open source',
                categoryId: insertedCategories[1].id,
                publishedAt: format(new Date('2024-07-19'), 'MMMM d, yyyy'),
                readTime: 5,
                isFeatured: false,
                status: 'published',
                topic: 'Open Source Projects 2024',
            },
            {
                title: 'A Guide to Modern Web Development with Next.js 15',
                slug: 'guide-modern-web-dev-nextjs-15',
                excerpt: 'Next.js 15 introduces powerful new features for building performant and scalable web applications.',
                content: '<p>With the release of Next.js 15, developers have access to a new level of performance and developer experience. This guide covers server components, server actions, and how to structure your next project for success.</p>',
                imageUrl: "https://images.unsplash.com/photo-1624996752380-8ec242e0f85d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHx3ZWIlMjBkZXZlbG9wbWVudHxlbnwwfHx8fDE3NjM5OTkzMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
                imageHint: 'web development',
                categoryId: insertedCategories[2].id,
                publishedAt: format(new Date('2024-07-18'), 'MMMM d, yyyy'),
                readTime: 8,
                isFeatured: false,
                status: 'published',
                topic: 'Next.js 15 Guide',
            },
            {
                title: 'Understanding CI/CD Pipelines in a DevOps Culture',
                slug: 'understanding-cicd-pipelines-devops',
                excerpt: 'Learn how Continuous Integration and Continuous Deployment (CI/CD) pipelines are fundamental to a successful DevOps strategy.',
                content: '<h2>The Core of DevOps</h2><p>CI/CD is more than just automation; it\'s a cultural shift. This article breaks down the components of a modern pipeline.</p>',
                imageUrl: "https://picsum.photos/seed/4/600/400",
                imageHint: 'devops diagram',
                categoryId: insertedCategories[3].id,
                publishedAt: format(new Date('2024-07-17'), 'MMMM d, yyyy'),
                readTime: 6,
                isFeatured: false,
                status: 'published',
                topic: 'CI/CD Pipelines',
            },
            {
                title: 'The Rise of Zero-Trust Architecture in Cybersecurity',
                slug: 'rise-of-zero-trust-cybersecurity',
                excerpt: 'In an era of sophisticated threats, the "trust but verify" model is no longer enough.',
                content: '<p>This article explores the principles of Zero-Trust architecture, why it\'s becoming the industry standard, and how organizations can begin to implement it.</p>',
                imageUrl: "https://images.unsplash.com/photo-1753122435360-644ac2f9c68a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjeWJlcnNlY3VyaXR5JTIwbG9ja3xlbnwwfHx8fDE3NjM5NjQ1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
                imageHint: 'cybersecurity lock',
                categoryId: insertedCategories[4].id,
                publishedAt: format(new Date('2024-07-16'), 'MMMM d, yyyy'),
                readTime: 7,
                isFeatured: false,
                status: 'published',
                topic: 'Zero-Trust Architecture',
            },
        ];

        const insertedPosts = await db.insert(posts).values(postsData).returning();
        console.log(`✅ Added ${insertedPosts.length} posts`);

        // 3. Seed Quality Checks
        console.log('🔍 Adding quality checks...');
        const qualityChecksData = insertedPosts.slice(0, 2).map((post, index) => ({
            postId: post.id,
            readabilityScore: index === 0 ? 85 : 80,
            keywordDensityScore: index === 0 ? 78 : 82,
            isHighQuality: true,
            suggestions: index === 0
                ? 'The article is well-written and covers the topic comprehensively.'
                : 'Good keyword usage and clear language.',
        }));

        await db.insert(qualityChecks).values(qualityChecksData);
        console.log(`✅ Added ${qualityChecksData.length} quality checks`);

        // 4. Seed API Keys (if provided in env)
        console.log('🔑 Adding API keys...');
        const apiKeysData = [];
        for (let i = 1; i <= 4; i++) {
            const keyValue = process.env[`GEMINI_API_KEY_${i}`];
            if (keyValue) {
                apiKeysData.push({
                    keyName: `GEMINI_API_KEY_${i}`,
                    keyValue,
                    usageCount: 0,
                    quotaExceeded: false,
                });
            }
        }

        if (apiKeysData.length > 0) {
            await db.insert(apiKeys).values(apiKeysData);
            console.log(`✅ Added ${apiKeysData.length} API keys`);
        } else {
            console.log('⚠️  No API keys found in environment variables');
        }

        console.log('✅ Database seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

seed()
    .then(() => {
        console.log('🎉 Seeding completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    });
