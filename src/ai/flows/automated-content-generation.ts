'use server';
/**
 * @fileOverview Automated Content Generation System (Refactored)
 * This system uses direct API calls to discover topics, find sources, and generate articles.
 */

import { z } from 'zod';
import { callGeminiAPI, parseJson } from '../genkit'; 
import { addPost } from '@/lib/data';
import { checkArticleQuality } from './check-article-quality';

// --- Zod Schemas for Data Structures ---
const TrendingTopicSchema = z.object({
    topic: z.string().describe('The trending topic'),
    category: z.string().describe('The category this topic belongs to'),
    searchVolume: z.number().optional().describe('Estimated search volume'),
});
const TrendingTopicsResponseSchema = z.object({ topics: z.array(TrendingTopicSchema) });

const SourceContentSchema = z.object({
    originalTitle: z.string().describe('Title of the source article/post'),
    sourceUrl: z.string().optional().describe('URL of the source if available'),
    keyPoints: z.array(z.string()).describe('Key points extracted from the source'),
    summary: z.string().describe('Detailed summary of the content'),
    tone: z.string().describe('The tone of the original content'),
});

const GeneratedArticleSchema = z.object({
    title: z.string().describe('Article title'),
    content: z.string().describe('Full HTML content'),
    excerpt: z.string().describe('Brief excerpt/summary'),
    imageHint: z.string().describe('Hint for image generation'),
    keywords: z.string().describe('Target keywords for SEO'),
});

export type TrendingTopic = z.infer<typeof TrendingTopicSchema>;
export type SourceContent = z.infer<typeof SourceContentSchema>;
export type GeneratedArticle = z.infer<typeof GeneratedArticleSchema>;


/**
 * Step 1: Fetch trending topics using a direct AI call.
 */
export async function fetchTrendingTopics(niche: string = 'AI and Technology'): Promise<TrendingTopic[]> {
    console.log(`🔍 Step 1: Discovering trending topics in tech community...`);
    const categories = ["AI News", "Machine Learning", "Web Development", "Programming", "Tech Reviews", "Tutorials", "DevOps"];
    
    const prompt = `
      You are a tech trend analyst. Current date: ${new Date().toDateString()}.
      Find 3 trending topics in the '${niche}' niche that match these categories: ${categories.join(', ')}.
      Requirements:
      - Topics must be current and highly relevant RIGHT NOW.
      - Be specific, not generic (e.g., 'New React 19 features' instead of 'JavaScript').
      - Estimate a search volume score from 1-100.
      Respond with a single JSON object with a key "topics" which is an array of topic objects.
      Example: { "topics": [{ "topic": "Example Topic", "category": "AI News", "searchVolume": 88 }] }
    `;

    try {
        const responseText = await callGeminiAPI(prompt);
        const parsed = await parseJson<{ topics: TrendingTopic[] }>(responseText); // Added await
        const validated = TrendingTopicsResponseSchema.parse(parsed); // Validate the structure
        
        console.log(`✅ Found ${validated.topics.length} trending topics`);
        validated.topics.forEach((t, i) => console.log(`   ${i + 1}. [${t.category}] ${t.topic}`));
        return validated.topics;

    } catch (error) {
        console.error('❌ Error fetching trending topics:', error);
        return [
            { topic: 'Fallback: Latest developments in Large Language Models', category: 'AI News' },
            { topic: 'Fallback: Next.js 15 Features and Updates', category: 'Web Development' },
        ];
    }
}

/**
 * Step 2: Find a post/source for the topic using a direct AI call.
 */
export async function findSourceForTopic(topic: TrendingTopic): Promise<SourceContent> {
    console.log(`🔎 Step 2: Finding source material for: ${topic.topic}`);
    const prompt = `
      You are an expert researcher. For the topic "${topic.topic}" in the category "${topic.category}", your task is:
      1. Simulate finding a high-quality, recent article on the web.
      2. Based on your internal knowledge, reconstruct what a leading tech blog would say about this topic today.
      3. Extract the key information and present it as a JSON object.
      Respond with a single JSON object with keys: "originalTitle", "keyPoints" (an array of strings), "summary", and "tone".
    `;

    try {
        const responseText = await callGeminiAPI(prompt);
        const parsed = await parseJson<SourceContent>(responseText); // Added await
        const validated = SourceContentSchema.parse(parsed);
        console.log(`✅ Source found: ${validated.originalTitle}`);
        return validated;
    } catch (error) {
        console.error('❌ Error finding source:', error);
        throw error;
    }
}

/**
 * Step 3: Recreate/Rewrite the article based on the source using a direct AI call.
 */
export async function rewriteArticle(source: SourceContent, topic: TrendingTopic): Promise<GeneratedArticle> {
    console.log(`✍️ Step 3: Recreating/Rewriting article based on source...`);
    const prompt = `
      You are an expert tech content writer. Rewrite and improve the following source content into a unique, high-quality article.
      Original Topic: "${topic.topic}"
      Source Summary: ${source.summary}
      Key Points: ${source.keyPoints.join(', ')}

      Requirements:
      1. Create a NEW, COMPELLING Title.
      2. Write a comprehensive article (1500+ words) using clean HTML (<h2>, <p>, <ul>, <li>, <code> etc.).
      3. Make it better than the source: add insights, examples, or better structure.
      4. Provide a brief excerpt, an image hint for DALL-E, and SEO keywords.
      Respond with a single JSON object with keys: "title", "content", "excerpt", "imageHint", "keywords".
    `;

    try {
        const responseText = await callGeminiAPI(prompt);
        const parsed = await parseJson<GeneratedArticle>(responseText); // Added await
        const validated = GeneratedArticleSchema.parse(parsed);
        console.log(`✅ Article rewritten: ${validated.title}`);
        return validated;
    } catch (error) {
        console.error('❌ Error rewriting article:', error);
        throw error;
    }
}

/**
 * Main automated content generation function (Refactored).
 */
export async function runAutomatedContentGeneration(niche: string = 'AI and Technology'): Promise<{ success: boolean; articlesGenerated: number; errors: string[]; }> {
    console.log('🤖 Starting automated content generation...');
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    const errors: string[] = [];
    let articlesGenerated = 0;

    try {
        console.log('\n--- STEP 1: FETCHING TRENDING TOPICS ---');
        const topics = await fetchTrendingTopics(niche);
        if (topics.length === 0) throw new Error('No trending topics found');
        
        const selectedTopic = topics[0];
        console.log(`👉 Selected Topic: ${selectedTopic.topic}`);

        console.log('\n--- STEP 2: FINDING SOURCE MATERIAL ---');
        const sourceContent = await findSourceForTopic(selectedTopic);

        console.log('\n--- STEP 3: REWRITING ARTICLE ---');
        const article = await rewriteArticle(sourceContent, selectedTopic);

        console.log('\n--- STEP 4: QUALITY CHECK ---');
        const qualityCheck = await checkArticleQuality({ content: article.content, keywords: article.keywords });
        console.log(`📊 Quality Score: ${qualityCheck.readabilityScore}/100`);

        console.log('\n--- STEP 5: SAVING TO DATABASE ---');
        const postId = await addPost(
            { title: article.title, content: article.content, excerpt: article.excerpt, imageHint: article.imageHint, topic: selectedTopic.topic, status: 'draft' },
            qualityCheck,
            selectedTopic.category
        );
        console.log(`✅ Article saved successfully with ID: ${postId}`);
        articlesGenerated = 1;

    } catch (error: any) {
        console.error('❌ Error in automated content generation:', error);
        errors.push(error.message || 'Unknown error');
    }

    const success = articlesGenerated > 0;
    console.log('\n🏁 Automated content generation completed');
    console.log(`✅ Articles generated: ${articlesGenerated}`);
    console.log(`❌ Errors: ${errors.length}`);
    return { success, articlesGenerated, errors };
}

/**
 * Manual trigger for testing.
 */
export async function triggerContentGeneration(niche?: string) {
    return runAutomatedContentGeneration(niche);
}
