/**
 * Script to insert API keys into the database
 * Run with: node scripts/run-insert-keys.js
 */

import 'dotenv/config';
import postgres from 'postgres';

// Read database config from environment variables
const connectionString = process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}${process.env.DB_SSL === 'true' ? '?sslmode=require' : ''}`;

// Create postgres client
const sql = postgres(connectionString, {
    ssl: process.env.DB_SSL === 'true' ? 'require' : false,
});

async function insertApiKeys() {
    try {
        console.log('🔑 Inserting API keys into database from environment variables...');

        if (!process.env.GOOGLE_GENAI_API_KEY || !process.env.GEMINI_API_KEY_2) {
            console.error('❌ Error: GOOGLE_GENAI_API_KEY and GEMINI_API_KEY_2 environment variables must be set.');
            process.exit(1);
        }

        // Insert API keys
        const result = await sql`
            INSERT INTO blog_api_keys (key_name, key_value, usage_count, quota_exceeded, created_at)
            VALUES 
                ('GEMINI_API_KEY_1', ${process.env.GOOGLE_GENAI_API_KEY}, 0, false, NOW()),
                ('GEMINI_API_KEY_2', ${process.env.GEMINI_API_KEY_2}, 0, false, NOW())
            ON CONFLICT (key_name) 
            DO UPDATE SET 
                key_value = EXCLUDED.key_value,
                quota_exceeded = false,
                usage_count = 0
            RETURNING key_name;
        `;

        console.log('✅ API keys inserted successfully!');
        console.log(`📊 Inserted/Updated ${result.length} keys:`);
        result.forEach(row => console.log(`   - ${row.key_name}`));

        // Verify insertion
        console.log('\n🔍 Verifying keys in database...');
        const keys = await sql`
            SELECT 
                key_name,
                usage_count,
                quota_exceeded,
                last_used_at,
                created_at
            FROM blog_api_keys
            ORDER BY created_at DESC;
        `;

        console.log('\n📋 Current API Keys:');
        console.table(keys.map(k => ({
            'Key Name': k.key_name,
            'Usage Count': k.usage_count,
            'Quota Exceeded': k.quota_exceeded ? '🔴 Yes' : '🟢 No',
            'Last Used': k.last_used_at ? new Date(k.last_used_at).toLocaleString() : 'Never',
            'Created': new Date(k.created_at).toLocaleString(),
        })));

        console.log('\n✅ All done! You can now use the automated content generation system.');
        console.log('🚀 Try it at: http://localhost:3000/admin/dashboard/automation\n');

    } catch (error) {
        console.error('❌ Error inserting API keys:', error);
        throw error;
    } finally {
        await sql.end();
    }
}

// Run the script
insertApiKeys().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
