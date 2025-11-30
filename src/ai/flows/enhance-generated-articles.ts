'use server';

/**
 * @fileOverview A flow to enhance generated articles with quotes and key takeaways.
 *
 * - enhanceGeneratedArticle - A function that enhances the generated article.
 * - EnhanceGeneratedArticleInput - The input type for the enhanceGeneratedArticle function.
 * - EnhanceGeneratedArticleOutput - The return type for the enhanceGeneratedArticle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EnhanceGeneratedArticleInputSchema = z.object({
  articleContent: z.string().describe('The content of the article to enhance.'),
  articleCategory: z.string().describe('The category of the article.'),
});
export type EnhanceGeneratedArticleInput = z.infer<
  typeof EnhanceGeneratedArticleInputSchema
>;

const EnhanceGeneratedArticleOutputSchema = z.object({
  enhancedContent: z
    .string()
    .describe('The enhanced content of the article with added quotes and takeaways.'),
  suggestedQuotes: z.array(z.string()).describe('Suggested quotes to include in the article.'),
  suggestedTakeaways: z
    .array(z.string())
    .describe('Suggested key takeaways to highlight in the article.'),
});
export type EnhanceGeneratedArticleOutput = z.infer<
  typeof EnhanceGeneratedArticleOutputSchema
>;

export async function enhanceGeneratedArticle(
  input: EnhanceGeneratedArticleInput
): Promise<EnhanceGeneratedArticleOutput> {
  return enhanceGeneratedArticleFlow(input);
}

const enhanceGeneratedArticlePrompt = ai.definePrompt({
  name: 'enhanceGeneratedArticlePrompt',
  input: { schema: EnhanceGeneratedArticleInputSchema },
  output: { schema: EnhanceGeneratedArticleOutputSchema },
  prompt: `You are an AI assistant tasked with enhancing articles to be more engaging and informative.

  Based on the article content and category provided, suggest relevant quotes and key takeaways that can be added to improve the overall value of the content.

  Article Category: {{{articleCategory}}}
  Article Content: {{{articleContent}}}

  Output:
  - enhancedContent: The enhanced content of the article with added quotes and takeaways.
  - suggestedQuotes: Suggested quotes to include in the article.
  - suggestedTakeaways: Suggested key takeaways to highlight in the article.`,
});

const enhanceGeneratedArticleFlow = ai.defineFlow(
  {
    name: 'enhanceGeneratedArticleFlow',
    inputSchema: EnhanceGeneratedArticleInputSchema,
    outputSchema: EnhanceGeneratedArticleOutputSchema,
  },
  async (input: EnhanceGeneratedArticleInput) => {
    const { output } = await enhanceGeneratedArticlePrompt(input);
    return output!;
  }
);
