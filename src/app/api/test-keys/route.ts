/**
 * 🤖 AI USAGE: Test API Keys (DISABLED)
 * - Direct Google Generative AI (test all API keys)
 * See: AI_FLOWS_TRACKING.md
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiKeys } from '@/lib/schema';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // 🤖 DISABLED

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
    try {
        // 🤖 AI DISABLED - Uncomment to enable
        return NextResponse.json({
            message: 'AI key testing is currently disabled',
            total: 0,
            results: []
        }, { status: 503 });

        // // 1. Get all keys from DB
        // const keys = await db.select().from(apiKeys);
        // const results = [];

        // console.log(`🔍 Testing ${keys.length} API keys...`);

        // // 2. Test each key individually
        // for (const key of keys) {
        //     console.log(`🔑 Testing key: ${key.keyName} (...${key.keyValue.slice(-4)})`);

        //     try {
        //         const genAI = new GoogleGenerativeAI(key.keyValue);
        //         const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        //         const start = Date.now();
        //         const result = await model.generateContent('Say "OK"');
        //         const response = result.response.text();
        //         const duration = Date.now() - start;

        //         console.log(`   ✅ Success (${duration}ms): ${response}`);

        //         results.push({
        //             name: key.keyName,
        //             key: `...${key.keyValue.slice(-4)}`,
        //             status: '✅ Valid',
        //             latency: `${duration}ms`,
        //             response: response
        //         });

        //     } catch (error: any) {
        //         console.error(`   ❌ Failed: ${error.message}`);

        //         let status = '❌ Error';
        //         if (error.message.includes('429')) status = '⏳ Rate Limited';
        //         if (error.message.includes('Quota')) status = '🚫 Quota Exceeded';

        //         results.push({
        //             name: key.keyName,
        //             key: `...${key.keyValue.slice(-4)}`,
        //             status: status,
        //             error: error.message.split(' ')[0] + '...' // Short error
        //         });
        //     }
        // }

        // return NextResponse.json({
        //     total: keys.length,
        //     results
        // });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
