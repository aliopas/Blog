'use server';

/**
 * @fileOverview Command to categorize a single topic or multiple topics.
 * This is a standalone command that can be called from API routes or server actions.
 */

import { categorizeTrendingTopics } from '../flows/categorize-trending-topics';

export interface CategorizeTopicInput {
    topics: string[];
}

export interface CategorizeTopicOutput {
    categoryMap: Record<string, string>;
}

/**
 * Categorize one or more topics into predefined categories
 * @param input - Object containing an array of topics to categorize
 * @returns Object with a map of topics to their categories
 */
export async function categorizeTopic(
    input: CategorizeTopicInput
): Promise<CategorizeTopicOutput> {
    console.log('🏷️ Starting topic categorization...');
    console.log(`📝 Topics to categorize: ${input.topics.join(', ')}`);

    const categoryMap = await categorizeTrendingTopics(input.topics);

    console.log('✅ Categorization complete!');
    console.log('📊 Results:', categoryMap);

    return { categoryMap };
}
