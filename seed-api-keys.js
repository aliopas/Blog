import 'dotenv/config';
import { addApiKey, getAllApiKeysStatus } from "./src/lib/api-key-manager.ts";

async function seedApiKeys() {
    try {
        console.log('🌱 Seeding API Keys to Database...\n');

        // Get current status
        console.log('📊 Current API Keys in Database:');
        const currentKeys = await getAllApiKeysStatus();
        console.table(currentKeys);
        console.log('');

        // Add API keys from .env
        const keysToAdd = [
            {
                name: 'GOOGLE_GENAI_API_KEY',
                value: process.env.GOOGLE_GENAI_API_KEY
            },
            {
                name: 'GEMINI_API_KEY_2',
                value: process.env.GEMINI_API_KEY_2
            }
        ];

        for (const key of keysToAdd) {
            if (key.value && key.value.trim() !== '') {
                console.log(`➕ Adding ${key.name}...`);
                try {
                    await addApiKey(key.name, key.value);
                    console.log(`✅ Added ${key.name} successfully\n`);
                } catch (error) {
                    console.log(`⚠️ ${key.name} might already exist or error occurred: ${error.message}\n`);
                }
            } else {
                console.log(`⏭️ Skipping ${key.name} (empty value)\n`);
            }
        }

        // Show final status
        console.log('📊 Final API Keys Status:');
        const finalKeys = await getAllApiKeysStatus();
        console.table(finalKeys);

        console.log('\n✅ Seeding completed!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

seedApiKeys();
