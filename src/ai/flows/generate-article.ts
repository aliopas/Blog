'use server';
/**
 * @fileOverview This file defines the flow for generating a full article from a topic and outline.
 * It has been refactored to use a direct API call instead of the full Genkit flow.
 */

import { callGeminiAPI, parseJson } from '@/ai/genkit'; 
import { z } from 'zod'; // Using Zod for schema validation

// 1. Input Schema
const GenerateArticleInputSchema = z.object({
  topic: z.string().describe('The main topic of the article.'),
  outline: z.string().describe('The structured outline to base the article on.'),
});
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

// 2. Output Schema
const GenerateArticleOutputSchema = z.object({
  title: z.string().describe('A compelling, SEO-friendly title for the article.'),
  content: z.string().describe('The full article content, formatted in clean HTML.'),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

/**
 * Generates a full article based on a topic and a detailed outline.
 * This function now constructs a prompt, calls the Gemini API directly, and parses the JSON response.
 */
export async function generateArticle(
  input: GenerateArticleInput
): Promise<GenerateArticleOutput> {

  // Validate input
  const { topic, outline } = GenerateArticleInputSchema.parse(input);

  const prompt = `
    You are an expert tech journalist and content writer. Your task is to write a high-quality, engaging, and SEO-optimized article.

    Topic: "${topic}"

    Follow this outline strictly:
    ---
    ${outline}
    ---

    Requirements:
    1.  Create a compelling, SEO-friendly title.
    2.  The article must be comprehensive, well-researched, and at least 1500 words long.
    3.  Use clean, semantic HTML for formatting (e.g., <h2>, <h3>, <p>, <ul>, <li>, <strong>, <code>, <pre>). Do NOT use <h1>, <html>, <head>, or <body> tags.
    4.  Maintain a professional yet engaging tone.
    5.  The entire response must be a single JSON object with two keys: "title" and "content".

    Example JSON Output:
    { 
      "title": "Unlocking the Power of Next.js 15", 
      "content": "<h2>Introduction</h2><p>Next.js 15 is here...</p>..."
    }
  `;

  try {
    console.log(`✍️ Generating article for topic: "${topic}"`);
    const responseText = await callGeminiAPI(prompt);
    const structuredResponse = await parseJson<GenerateArticleOutput>(responseText); // Added await

    // Validate the output to ensure it conforms to the schema
    const validatedOutput = GenerateArticleOutputSchema.parse(structuredResponse);
    
    console.log(`✅ Article "${validatedOutput.title}" generated successfully.`);
    return validatedOutput;

  } catch (error) {
    console.error('❌ Error in generateArticle:', error);
    // Return a fallback article in case of an error
    return {
      title: `Fallback: ${topic}`,
      content: `<p>Error generating article. Please try again.</p><p>Outline used:</p><pre>${outline}</pre>`,
    };
  }
}
