import { db } from '@/lib/db';
import { posts, categories, qualityChecks } from '@/lib/schema';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import { type InferInsertModel } from 'drizzle-orm';

type NewPost = InferInsertModel<typeof posts>;
type NewCategory = InferInsertModel<typeof categories>;

console.log('Seeding database...');

async function seed() {
  try {
    // Clear existing data
    // Note: Drizzle with D1 doesn't support batch, so we run them sequentially.
    await db.delete(qualityChecks);
    await db.delete(posts);
    await db.delete(categories);
    console.log('Cleared existing data.');

    const placeholderMap = new Map(PlaceHolderImages.map(p => [p.imageHint.split(' ')[0], p]));

    const seedCategories: NewCategory[] = [
      { name: 'AI News', slug: 'ai-news' },
      { name: 'Open Source', slug: 'open-source' },
      { name: 'Web Dev', slug: 'web-dev' },
      { name: 'DevOps', slug: 'devops' },
      { name: 'Cybersecurity', slug: 'cybersecurity' },
    ];

    await db.insert(categories).values(seedCategories);
    console.log(`Seeded ${seedCategories.length} categories.`);

    const seededCategories = await db.select().from(categories);
    const categoryMap = new Map(seededCategories.map(c => [c.slug, c]));

    const seedPosts: Omit<NewPost, 'id'>[] = [
      {
        title: 'The Future of Generative AI: What to Expect in 2024',
        slug: 'future-of-generative-ai-2024',
        excerpt: 'A deep dive into the upcoming trends and advancements in the world of generative artificial intelligence, from new model architectures to their real-world applications.',
        content: '<p>The field of generative AI is evolving at an unprecedented pace. This article explores the key trends that will shape 2024, including multimodal models, personalized AI assistants, and the ethical considerations that come with them. We\'ll examine how these technologies will impact industries from software development to creative arts.</p><h2>Multimodal Models on the Rise</h2><p>One of the most significant shifts is the move towards models that understand and generate content across different modalities like text, images, and audio. This opens up new possibilities for more intuitive and powerful AI applications.</p>',
        imageUrl: placeholderMap.get('abstract')?.imageUrl || null,
        imageHint: placeholderMap.get('abstract')?.imageHint || null,
        categoryId: categoryMap.get('ai-news')!.id,
        publishedAt: format(new Date('2024-07-20'), 'MMMM d, yyyy'),
        readTime: 7,
        isFeatured: true,
        status: 'published',
        topic: 'Generative AI in 2024',
      },
      {
        title: 'Top 5 Open Source Projects to Watch This Year',
        slug: 'top-5-open-source-projects-2024',
        excerpt: 'Discover the most promising and impactful open-source projects that are shaping the future of software development and technology.',
        content: '<h3>Introduction</h3><p>Open source continues to be the backbone of modern technology. In this post, we highlight five projects that are making significant waves in the community, from new database technologies to innovative development tools.</p>',
        imageUrl: placeholderMap.get('open')?.imageUrl || null,
        imageHint: placeholderMap.get('open')?.imageHint || null,
        categoryId: categoryMap.get('open-source')!.id,
        publishedAt: format(new Date('2024-07-19'), 'MMMM d, yyyy'),
        readTime: 5,
        isFeatured: false,
        status: 'published',
        topic: 'Open Source Projects 2024',
      },
      {
        title: 'A Guide to Modern Web Development with Next.js 15',
        slug: 'guide-modern-web-dev-nextjs-15',
        excerpt: 'Next.js 15 introduces powerful new features for building performant and scalable web applications. This guide walks you through the essentials.',
        content: '<p>With the release of Next.js 15, developers have access to a new level of performance and developer experience. This guide covers server components, server actions, and how to structure your next project for success.</p>',
        imageUrl: placeholderMap.get('web')?.imageUrl || null,
        imageHint: placeholderMap.get('web')?.imageHint || null,
        categoryId: categoryMap.get('web-dev')!.id,
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
        content: '<h2>The Core of DevOps</h2><p>CI/CD is more than just automation; it\'s a cultural shift. This article breaks down the components of a modern pipeline, from code commit to production deployment, and explains the benefits of adopting this practice.</p>',
        imageUrl: placeholderMap.get('devops')?.imageUrl || null,
        imageHint: placeholderMap.get('devops')?.imageHint || null,
        categoryId: categoryMap.get('devops')!.id,
        publishedAt: format(new Date('2024-07-17'), 'MMMM d, yyyy'),
        readTime: 6,
        isFeatured: false,
        status: 'published',
        topic: 'CI/CD Pipelines',
      },
      {
        title: 'The Rise of Zero-Trust Architecture in Cybersecurity',
        slug: 'rise-of-zero-trust-cybersecurity',
        excerpt: 'In an era of sophisticated threats, the "trust but verify" model is no longer enough. Enter Zero-Trust, a new paradigm for securing modern enterprises.',
        content: '<p>This article explores the principles of Zero-Trust architecture, why it\'s becoming the industry standard, and how organizations can begin to implement it to protect their critical assets.</p>',
        imageUrl: placeholderMap.get('cybersecurity')?.imageUrl || null,
        imageHint: placeholderMap.get('cybersecurity')?.imageHint || null,
        categoryId: categoryMap.get('cybersecurity')!.id,
        publishedAt: format(new Date('2024-07-16'), 'MMMM d, yyyy'),
        readTime: 7,
        isFeatured: false,
        status: 'published',
        topic: 'Zero-Trust Architecture',
      },
    ];

    await db.insert(posts).values(seedPosts);
    console.log(`Seeded ${seedPosts.length} posts.`);

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
