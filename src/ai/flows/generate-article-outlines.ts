'use server';
/**
 * @fileOverview This file defines the flow for generating an article outline from a topic.
 * It has been refactored to use a direct API call instead of the full Genkit flow.
 */

import { callGeminiAPI, parseJson } from '@/ai/genkit'; 
import { z } from 'zod'; // Using Zod for schema validation

// 1. Input Schema
const GenerateArticleOutlinesInputSchema = z.object({
  topic: z.string().describe('The topic to generate an article outline for.'),
});
export type GenerateArticleOutlinesInput = z.infer<typeof GenerateArticleOutlinesInputSchema>;

// 2. Output Schema
const GenerateArticleOutlinesOutputSchema = z.object({
  outline: z.string().describe('A detailed, structured outline for the article.'),
});
export type GenerateArticleOutlinesOutput = z.infer<typeof GenerateArticleOutlinesOutputSchema>;

/**
 * Generates a detailed article outline based on a given topic.
 * This function now constructs a prompt, calls the Gemini API directly, and parses the JSON response.
 */
export async function generateArticleOutlines(
  input: GenerateArticleOutlinesInput
): Promise<GenerateArticleOutlinesOutput> {

  // Validate input
  const { topic } = GenerateArticleOutlinesInputSchema.parse(input);

  const prompt = `
    You are an expert content creator, skilled at creating compelling article outlines.
    Based on the topic provided, generate a detailed article outline. The outline should be structured and comprehensive, covering all the key aspects of the topic.
    
    Topic: "${topic}"

    Respond with a JSON object containing the outline in a single, formatted string.
    Example: { "outline": "1. Introduction\n  - Hook\n  - Thesis\n2. Main Point 1\n  - Detail A\n  - Detail B" }
  `;

  try {
    console.log(`📝 Generating outline for topic: "${topic}"`);
    const responseText = await callGeminiAPI(prompt);
    const structuredResponse = await parseJson<GenerateArticleOutlinesOutput>(responseText); // Added await

    // Validate the output to ensure it conforms to the schema
    const validatedOutput = GenerateArticleOutlinesOutputSchema.parse(structuredResponse);
    
    console.log('✅ Outline generated successfully.');
    return validatedOutput;

  } catch (error) {
    console.error('❌ Error in generateArticleOutlines:', error);
    // In case of an error, return a fallback outline to avoid crashing the entire process
    return {
      outline: `// Fallback Outline due to error //\n- Introduction: Introduce ${topic}\n- Key Aspect 1\n- Key Aspect 2\n- Conclusion`,
    };
  }
}
