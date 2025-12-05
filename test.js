import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Categories variable
const categories = `
Your categories:
1) AI & Machine Learning
2) Cybersecurity
3) Web Development
4) Mobile Development
5) Cloud Computing
6) DevOps & Automation
`;

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // -----------------------------
    // Request 1: Get Top 5 Trending Topics
    // -----------------------------
    const prompt1 = `
Research the latest trending topics in the field of Technology (Tech).

1) Identify the top 5 currently trending topics in technology.
2) List them without analysis.
`;

    const result1 = await model.generateContent(prompt1);
    const top5Topics = result1.response.text();
    console.log("Top 5 Trending Topics:\n", top5Topics);

    // -----------------------------
    // Request 2: Analyze, Select, Classify
    // -----------------------------
    const prompt2 = `
From the following top 5 trending topics:

${top5Topics}

1) Select the best 2 or 3 topics based on popularity, reach, and impact.
2) Analyze them briefly.
3) Choose one topic as the "most trending" right now.
4) Classify it into one of the categories below:

${categories}

5) Explain why you chose this topic and why it is the most trending now.

Output format:

- Best 2 or 3 selected topics:
  1) ...
  2) ...
  3) (if any)

- Most trending topic:
  ...

- Appropriate category:
  ...

- Reason for selection:
  ...
`;

    const result2 = await model.generateContent(prompt2);
    console.log("\nFinal Topic Analysis:\n", result2.response.text());
}

run();
