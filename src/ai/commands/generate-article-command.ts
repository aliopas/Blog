'use server';

/**
 * @fileOverview Command to generate a full article from an outline.
 * This is a standalone command that can be called from API routes or server actions.
 */

import { generateArticle, type GenerateArticleInput } from '../flows/generate-article';

export interface GenerateArticleCommandInput {
    topic: string;
    outline: string;
}

export interface GenerateArticleCommandOutput {
    title: string;
    content: string;
}

/**
 * Generate a full article from a topic and outline
 * @param input - Object containing the topic and outline
 * @returns Object with the generated article title and content
 */
export async function generateArticleCommand(
    input: GenerateArticleCommandInput
): Promise<GenerateArticleCommandOutput> {
    console.log('📝 Starting article generation...');
    console.log(`📌 Topic: ${input.topic}`);
    console.log(`📋 Outline length: ${input.outline.length} characters`);

    const articleInput: GenerateArticleInput = {
        topic: input.topic,
        outline: input.outline,
    };

    const result = await generateArticle(articleInput);

    console.log('✅ Article generation complete!');
    console.log(`📰 Title: ${result.title}`);
    console.log(`📄 Content length: ${result.content.length} characters`);

    return {
        title: result.title,
        content: result.content,
    };
}
