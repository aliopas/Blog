import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq, like, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import * as schema from "../lib/schema";
import { revalidateTag } from "next/cache";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper for delays
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper for retries
async function generateWithRetry(prompt: string, retries = 3): Promise<string> {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`   Attempt ${i + 1}/${retries}...`);
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            if (text) return text;
        } catch (error) {
            console.error(`   Error (Attempt ${i + 1}):`, error);
            if (i === retries - 1) throw error;
            await sleep(2000 * (i + 1)); // Exponential backoff
        }
    }
    throw new Error("Failed to generate content after retries");
}

// Helper to clean JSON output from AI
function cleanJson(text: string): string {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
        return text.substring(start, end + 1);
    }
    return text.trim();
}

async function run() {
    console.log("🚀 Starting AI Content Generation Pipeline...");

    // Dynamically import db to ensure dotenv is loaded first
    const { db } = await import("../lib/db");
    const { posts, qualityChecks, categories } = schema;

    try {
        // ---------------------------------------------------------
        // Step 1: Fetch Trends (IMPROVED)
        // ---------------------------------------------------------
        console.log("\n1️⃣  Fetching Top Trends...");
        const trendsPrompt = `
      Identify the top 5 emerging technological breakthroughs or specific controversial tech topics right now.
      Avoid generic topics like "AI is growing". Focus on:
      - Specific new tools, frameworks, or libraries
      - Recent security breaches or vulnerabilities
      - Hardware releases or chip innovations
      - Regulatory changes affecting tech
      For each, provide a 1-sentence summary.
    `;
        const trendsResponse = await generateWithRetry(trendsPrompt);
        console.log("   Trends found:\n", trendsResponse);

        // ---------------------------------------------------------
        // Step 2: Select & Analyze Topic
        // ---------------------------------------------------------
        console.log("\n2️⃣  Selecting Best Topic...");

        // Fetch categories from DB to guide the AI
        const dbCategories = await db.select().from(categories);
        const categoriesList = dbCategories.map(c => `${c.id}: ${c.name}`).join(", ");

        const selectionPrompt = `
      From these trends:
      ${trendsResponse}

      1. Select the SINGLE best topic for a technical blog post.
      2. Ensure it fits one of these categories: [${categoriesList}].
      3. Provide the output in strictly valid JSON format:
      {
        "topic": "Selected Topic Name",
        "categoryId": "ID of the matching category",
        "reason": "Why this is a good topic"
      }
    `;
        const selectionRaw = await generateWithRetry(selectionPrompt);
        const selectionData = JSON.parse(cleanJson(selectionRaw));
        console.log("   Selected:", selectionData);

        // ---------------------------------------------------------
        // Step 2.5: Deduplication Check
        // ---------------------------------------------------------
        console.log("\n🔍 Checking for duplicates...");
        const existingPost = await db.query.posts.findFirst({
            where: or(
                like(posts.title, `%${selectionData.topic}%`),
                like(posts.topic, `%${selectionData.topic}%`)
            ),
        });

        if (existingPost) {
            console.warn(`⚠️  Topic "${selectionData.topic}" already exists (Post ID: ${existingPost.id}). Aborting.`);
            return { success: false, reason: "Duplicate topic", topic: selectionData.topic };
        }
        console.log("   Topic is unique. Proceeding.");

        // ---------------------------------------------------------
        // Step 3: Generate Outline (IMPROVED)
        // ---------------------------------------------------------
        console.log("\n3️⃣  Generating Outline...");
        const outlinePrompt = `
      Create a detailed blog post outline for the topic: "${selectionData.topic}".
      Structure it with:
      - Introduction (Hook, Problem, Solution)
      - Key Concepts (3-4 main sections with technical depth)
      - Practical Examples/Code Implementation (with specific language/framework)
      - Pros & Cons (if applicable)
      - Future Implications or Industry Impact
      - Conclusion with actionable takeaways
      - FAQ Section (3-5 questions)
    `;
        const outline = await generateWithRetry(outlinePrompt);
        console.log("   Outline generated.");

        // ---------------------------------------------------------
        // Step 4: Generate Full Content (IMPROVED)
        // ---------------------------------------------------------
        console.log("\n4️⃣  Writing Content...");
        const contentPrompt = `
      Write a comprehensive, high-quality technical blog post based on this outline:
      ${outline}

      Topic: ${selectionData.topic}
      
      Guidelines:
      - Use **Markdown** formatting with proper headers (##, ###).
      - Tone: Professional, authoritative, yet accessible to intermediate developers.
      - **CRITICAL**: Start with a "Key Takeaways" section (3-5 bullet points).
      - **CRITICAL**: Include realistic CODE BLOCKS in appropriate languages (JavaScript, Python, etc.) for implementation examples.
      - Avoid fluff. Go deep into technical details and explain WHY, not just WHAT.
      - Use real-world scenarios and practical use cases.
      - Aim for 1200+ words.
      - NO placeholders or "[TODO]" - write complete, production-ready content.
    `;
        const content = await generateWithRetry(contentPrompt);
        console.log("   Content generated (Length: " + content.length + " chars).");

        // ---------------------------------------------------------
        // Step 5: SEO & Metadata
        // ---------------------------------------------------------
        console.log("\n5️⃣  Generating SEO Metadata...");
        const seoPrompt = `
      Based on the topic "${selectionData.topic}" and the content generated, provide SEO metadata in JSON format.
      RETURN JSON ONLY. NO CONVERSATIONAL TEXT.
      {
        "title": "Catchy, SEO-optimized Title (max 60 chars)",
        "excerpt": "Compelling summary (max 160 chars)",
        "keywords": ["tag1", "tag2", "tag3"],
        "imageHint": "Description for an AI image generator to create a cover image"
      }
    `;
        const seoRaw = await generateWithRetry(seoPrompt);
        const seoData = JSON.parse(cleanJson(seoRaw));
        console.log("   SEO Data:", seoData);

        // ---------------------------------------------------------
        // Step 6: Quality Check
        // ---------------------------------------------------------
        console.log("\n6️⃣  Performing Quality Check...");
        const qualityPrompt = `
      Evaluate the following blog post content:
      ${content.substring(0, 5000)}... (truncated for analysis)

      Provide a quality score (0-100) based on:
      - Clarity
      - Technical Accuracy
      - Engagement
      - Formatting

      Output JSON:
      {
        "score": 85,
        "isHighQuality": true,
        "suggestions": "List of improvements..."
      }
    `;
        const qualityRaw = await generateWithRetry(qualityPrompt);
        const qualityData = JSON.parse(cleanJson(qualityRaw));
        console.log("   Quality Score:", qualityData.score);

        // ---------------------------------------------------------
        // Step 7: Save to Database
        // ---------------------------------------------------------
        console.log("\n💾 Saving to Database...");

        const slug = `${seoData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${nanoid(5)}`;
        const readTime = Math.ceil(content.split(' ').length / 200);

        let catId = parseInt(selectionData.categoryId);
        if (isNaN(catId)) {
            console.warn("⚠️  Invalid Category ID returned by AI. Defaulting to 1.");
            catId = 1;
        }

        try {
            const [newPost] = await db.insert(posts).values({
                title: seoData.title,
                slug: slug,
                excerpt: seoData.excerpt,
                content: content,
                categoryId: catId,
                imageUrl: 'https://picsum.photos/seed/' + nanoid(5) + '/800/400',
                imageHint: seoData.imageHint,
                publishedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                readTime: readTime,
                isFeatured: false,
                status: 'draft', // Always save as draft
                topic: selectionData.topic,
            }).returning();

            await db.insert(qualityChecks).values({
                postId: newPost.id,
                readabilityScore: qualityData.score || 75,
                keywordDensityScore: 80,
                isHighQuality: qualityData.isHighQuality !== false,
                suggestions: qualityData.suggestions || 'No suggestions provided',
            });

            console.log(`✅ Success! Post saved with ID: ${newPost.id}`);
            console.log(`   View it at: /admin/dashboard/posts/${newPost.id}`);

            // Revalidate cache
            revalidateTag('posts');

            return { success: true, postId: newPost.id, title: newPost.title };
        } catch (dbError) {
            console.error("\n❌ Database Error:", dbError);
            throw dbError;
        }

    } catch (error) {
        console.error("\n❌ Pipeline Failed:", error);
        return { success: false, error: String(error) };
    }
}

// Export for API route usage
export { run as generateScheduledPost };

// Run directly when executed as script
if (require.main === module) {
    run();
}
