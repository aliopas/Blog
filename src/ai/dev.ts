import { config } from 'dotenv';
config();

import '@/ai/flows/check-article-quality.ts';
import '@/ai/flows/categorize-trending-topics.ts';
import '@/ai/flows/enhance-generated-articles.ts';
import '@/ai/flows/generate-article-outlines.ts';
import '@/ai/flows/generate-article.ts';
import '@/ai/flows/generate-and-process-article.ts';
