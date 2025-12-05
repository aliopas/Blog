
import dotenv from 'dotenv';
dotenv.config();

import { desc } from 'drizzle-orm';

async function verify() {
    console.log('🔍 Verifying Database Content...');

    // Dynamic imports to ensure dotenv loads first
    const { db } = await import('./src/lib/db');
    const { posts } = await import('./src/lib/schema');

    try {
        const allPosts = await db.select().from(posts).orderBy(desc(posts.id)).limit(5);
        console.log(`Found ${allPosts.length} posts.`);

        if (allPosts.length > 0) {
            console.log('Latest posts:');
            allPosts.forEach(p => {
                console.log(`- ID: ${p.id}, Title: ${p.title}, Status: ${p.status}`);
            });
        } else {
            console.log('No posts found.');
        }

        // Check specifically for ID 13 if it was reported as saved
        const post13 = allPosts.find(p => p.id === 13);
        if (post13) {
            console.log('✅ Post 13 exists!');
        } else {
            console.log('❌ Post 13 NOT found in the latest 5.');
        }

    } catch (error) {
        console.error('❌ Database Error:', error);
    }
    process.exit(0);
}

verify();
