'use server';
/**
 * @fileOverview This file defines a master flow that orchestrates the entire article generation process.
 * It chains several flows to go from a topic to a quality-checked article saved in the database as a draft.
 */

// CORRECTED: Import 'callGeminiAPI' instead of the non-existent 'ai' object.
import { callGeminiAPI } from '@/ai/genkit';
import { z } from 'zod';
import {
  generateArticleOutlines,
} from './generate-article-outlines';
import { generateArticle } from './generate-article';
import {
  checkArticleQuality,
  type CheckArticleQualityInput,
} from './check-article-quality';
import { categorizeTrendingTopics } from './categorize-trending-topics';
import { addPost } from '@/lib/data';

const GenerateAndProcessArticleInputSchema = z.object({
  topic: z.string().describe('The topic to generate an article for.'),
});
export type GenerateAndProcessArticleInput = z.infer<
  typeof GenerateAndProcessArticleInputSchema
>;

const GenerateAndProcessArticleOutputSchema = z.object({
  postId: z.string().describe('The ID of the newly created post draft.'),
});
export type GenerateAndProcessArticleOutput = z.infer<
  typeof GenerateAndProcessArticleOutputSchema
>;

/**
 * دالة رئيسية لتوليد ومعالجة المقال
 */
export async function generateAndProcessArticle(
  input: GenerateAndProcessArticleInput
): Promise<GenerateAndProcessArticleOutput> {
  try {
    console.log(`🚀 Starting article generation for topic: "${input.topic}"`);

    // Step 1: Categorize the topic
    console.log('📂 Step 1: Categorizing topic...');
    const categoryMap = await categorizeTrendingTopics([input.topic]);
    const categoryName = categoryMap[input.topic] || 'AI News';
    console.log(`✅ Category: ${categoryName}`);

    // Step 2: Generate the outline
    console.log('📝 Step 2: Generating article outline...');
    const outlineOutput = await generateArticleOutlines({ topic: input.topic });
    console.log('✅ Outline generated');

    // Step 3: Generate the article content from the outline
    console.log('✍️ Step 3: Generating article content...');
    const articleOutput = await generateArticle({
      topic: input.topic,
      outline: outlineOutput.outline,
    });
    console.log('✅ Article content generated');

    // Step 4: Check the quality of the generated article
    console.log('🔍 Step 4: Checking article quality...');
    const qualityCheckInput: CheckArticleQualityInput = {
      content: articleOutput.content,
      keywords: input.topic,
    };
    const qualityCheckOutput = await checkArticleQuality(qualityCheckInput);
    console.log('✅ Quality check complete');

    // Step 5: Save everything to the database as a draft
    console.log('💾 Step 5: Saving article to database...');
    const newPostData = {
      title: articleOutput.title,
      content: articleOutput.content,
      status: 'draft',
      topic: input.topic,
    };

    const postId = await addPost(newPostData, qualityCheckOutput, categoryName);
    console.log(`✅ Article saved with ID: ${postId}`);

    return { postId };

  } catch (error: any) {
    console.error('❌ Error in generateAndProcessArticle:', error.message);
    throw error;
  }
}

/**
 * A helper function to call the AI directly.
 * CORRECTED: This now uses the 'callGeminiAPI' function which returns the text directly.
 */
export async function callAI(prompt: string): Promise<string> {
  try {
    const text = await callGeminiAPI(prompt);
    return text;
  } catch (error: any) {
    console.error('❌ AI call failed:', error.message);
    throw error;
  }
}
