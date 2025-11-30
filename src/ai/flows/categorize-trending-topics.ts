'use server';
/**
 * @fileOverview This file defines a function for categorizing trending topics using a direct AI call.
 */

import { callGeminiAPI, parseJson } from '../genkit'; 
import { z } from 'zod';

const CategorySchema = z.object({
  name: z.string(),
  search_prompt: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

const CategorizeTrendingTopicsInputSchema = z.array(z.string()).describe('An array of trending topics to categorize.');
export type CategorizeTrendingTopicsInput = z.infer<typeof CategorizeTrendingTopicsInputSchema>;

const CategorizeTrendingTopicsOutputSchema = z.record(z.string(), z.string()).describe('A record mapping trending topics to their categories.');
export type CategorizeTrendingTopicsOutput = z.infer<typeof CategorizeTrendingTopicsOutputSchema>;

const AIResponseSchema = z.object({ category: z.string() });

export async function categorizeTrendingTopics(
  input: CategorizeTrendingTopicsInput
): Promise<CategorizeTrendingTopicsOutput> {
  const categories: Category[] = [
    { name: 'AI News', search_prompt: 'Latest AI models, releases, breakthroughs, company announcements (OpenAI, Google), and research papers.' },
    { name: 'Open Source', search_prompt: 'New open-source projects, tools, major releases, and security news.' },
    { name: 'Web Dev', search_prompt: 'News, tutorials, and releases for web frameworks, tools, and security.' },
    { name: 'DevOps', search_prompt: 'Latest in DevOps tools, project announcements, and security vulnerabilities.' },
    { name: 'Cybersecurity', search_prompt: 'News on cybersecurity tools, major project announcements, and vulnerabilities.' },
  ];

  const results: CategorizeTrendingTopicsOutput = {};

  for (const topic of input) {
    const categoryDescriptions = categories.map(c => ` - ${c.name}: ${c.search_prompt}`).join('\n');

    const prompt = `
      Given the trending topic: "${topic}", determine which of the following categories it best fits into.

      Categories and their descriptions:
      ${categoryDescriptions}

      Respond with a single JSON object containing the category name.
      Example: { "category": "AI News" }
      If none of the categories fit, return { "category": "Other" }.
    `;

    try {
      const responseText = await callGeminiAPI(prompt);
      const parsed = await parseJson<{ category: string }>(responseText); // Added await
      const validated = AIResponseSchema.parse(parsed); // Ensure the AI response is valid
      results[topic] = validated.category;
    } catch (error) {
      console.error(`❌ Error categorizing topic "${topic}":`, error);
      results[topic] = 'Other'; // Assign a fallback category on error
    }
  }

  return results;
}
