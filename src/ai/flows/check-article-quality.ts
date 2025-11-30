'use server';

/**
 * @fileOverview This file defines a function for checking the quality of a generated article.
 * It has been refactored to use a direct API call.
 */

import { callGeminiAPI, parseJson } from '../genkit'; // CORRECTED: Use direct API call
import { z } from 'zod';

const CheckArticleQualityInputSchema = z.object({
    content: z.string().describe('The article content to check.'),
    keywords: z.string().describe('The target keywords for the article.'),
});
export type CheckArticleQualityInput = z.infer<typeof CheckArticleQualityInputSchema>;

// This is the schema for the data we expect from the AI.
const AIResponseSchema = z.object({
    readabilityScore: z.number().describe('A score from 0 to 100 on how readable the article is.'),
    seoScore: z.number().describe('A score from 0 to 100 on how well the article is optimized for SEO.'),
    isPlagiarized: z.boolean().describe('Whether the article is likely to be plagiarized.'),
});
export type CheckArticleQualityOutput = z.infer<typeof AIResponseSchema>;


/**
 * Checks the quality of a generated article using a direct API call.
 */
export async function checkArticleQuality(
  input: CheckArticleQualityInput
): Promise<CheckArticleQualityOutput> {
  // Validate input
  const { content, keywords } = CheckArticleQualityInputSchema.parse(input);

  const prompt = `
    You are an expert article quality checker. Analyze the following article based on the provided content and keywords.

    Article Content:
    ---
    ${content}
    ---

    Keywords: "${keywords}"

    Provide a quality score for readability and SEO, and check for plagiarism.
    Respond with a single JSON object with your analysis, containing these exact keys: "readabilityScore", "seoScore", "isPlagiarized".
    - readabilityScore: Score from 0-100.
    - seoScore: Score from 0-100, based on keyword density and placement.
    - isPlagiarized: A boolean indicating if the content seems copied.
    
    Example response: { "readabilityScore": 95, "seoScore": 88, "isPlagiarized": false }
  `;

  try {
    console.log(`🔎 Checking quality for article...`);
    const responseText = await callGeminiAPI(prompt);
    const parsed = await parseJson<CheckArticleQualityOutput>(responseText);
    const validated = AIResponseSchema.parse(parsed);
    console.log(`✅ Quality check complete.`);
    return validated;
  } catch (error) {
    console.error('❌ Error in checkArticleQuality:', error);
    // Provide a fallback response in case of an error
    return {
      readabilityScore: 50,
      seoScore: 50,
      isPlagiarized: false,
    };
  }
}
