# **App Name**: Tech Insights Daily

## Core Features:

- Automated Content Curation: Uses Gemini API to search for trending topics across AI, Open Source, Web Dev, DevOps, and Cybersecurity. LLM acts as a tool to discover and categorize relevant content based on defined search prompts.
- AI-Powered Content Generation: Leverages Gemini API to generate article outlines and drafts based on trending topics. Applies a multi-key rotation system for API key management.
- Quality Scoring and Enhancement: AI performs a quality check (readability, keyword density) and suggests enhancements such as quotes and takeaways. Uses a quality score to decide to auto-publish or require manual review.
- Admin Dashboard: Provides a protected admin dashboard at `/admin` for managing posts, reviewing AI jobs, monitoring API usage, and toggling auto-publish settings. Features session-based authentication using Email/Password with httpOnly cookies.
- Automated Publishing Pipeline: Automates the process of publishing articles with quality scores above a threshold. Allows for manual review and approval before publishing.
- Content Analytics: Tracks key metrics like page views, traffic sources, and device breakdown to provide insights into content performance.
- Multi-Language Support (Future): Implements a multi-language structure with separate tables for English and Arabic content. Will auto-detect user IP to serve content in the appropriate language. This is designed as a feature and doesn't need to be functional for the MVP.

## Style Guidelines:

- Background color: Near-black (#0A0A0A) to create a dark, immersive experience reminiscent of Vercel's design.
- Primary color: A modern purple (#7C3AED) to convey tech and innovation.
- Accent color: A vibrant blue (#0070F3), analogous to the primary color, used for interactive elements and highlights to draw user attention.
- Body and headline font: 'Inter' sans-serif font for a modern, neutral, and readable text experience. (Note: currently only Google Fonts are supported.)
- Code font: 'Source Code Pro' monospace font for displaying code snippets. 
- Minimal Hero Section: Clean and straightforward with a bold headline, subheadline, and a clear CTA.
- Latest Posts Grid: 2-3 column responsive grid with card design including cover image, category badge, title, excerpt, read time, and date.