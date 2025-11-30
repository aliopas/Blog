'use server';

/**
 * @fileOverview Command to check the quality of an article.
 * This is a standalone command that can be called from API routes or server actions.
 */

import { checkArticleQuality, type CheckArticleQualityInput } from '../flows/check-article-quality';

export interface CheckQualityCommandInput {
    content: string;
    keywords: string;
}

export interface CheckQualityCommandOutput {
    readabilityScore: number;
    keywordDensity: number;
    suggestions: string[];
}

/**
 * Check the quality of an article
 * @param input - Object containing the article content and target keywords
 * @returns Object with quality metrics and suggestions
 */
export async function checkQualityCommand(
    input: CheckQualityCommandInput
): Promise<CheckQualityCommandOutput> {
    console.log('🔍 Starting article quality check...');
    console.log(`📄 Content length: ${input.content.length} characters`);
    console.log(`🔑 Keywords: ${input.keywords}`);

    const qualityInput: CheckArticleQualityInput = {
        content: input.content,
        keywords: input.keywords,
    };

    const result = await checkArticleQuality(qualityInput);

    console.log('✅ Quality check complete!');
    console.log(`📊 Readability Score: ${result.readabilityScore}/100`);
    console.log(`📈 Keyword Density: ${result.keywordDensity}%`);
    console.log(`💡 Suggestions: ${result.suggestions.length} items`);

    return {
        readabilityScore: result.readabilityScore,
        keywordDensity: result.keywordDensity,
        suggestions: result.suggestions,
    };
}
