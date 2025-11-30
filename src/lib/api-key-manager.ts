'use server';

import { db } from './db';
import { apiKeys } from './schema';
import { eq, and } from 'drizzle-orm';

/**
 * Get an API key based on purpose (content generation or analytics)
 * - content: Uses GOOGLE_GENAI_API_KEY (for articles, quality checks, etc.)
 * - analytics: Uses GEMINI_API_KEY_2 (for traffic analysis)
 */
export async function getApiKeyByPurpose(purpose: 'content' | 'analytics'): Promise<string | null> {
    try {
        // Direct assignment from environment variables
        if (purpose === 'content') {
            const key = process.env.GOOGLE_GENAI_API_KEY;
            if (key) {
                console.log(`🔑 Using API Key 1 for content generation`);
                return key;
            }
        } else if (purpose === 'analytics') {
            const key = process.env.GEMINI_API_KEY_2;
            if (key) {
                console.log(`📊 Using API Key 2 for analytics`);
                return key;
            }
        }

        // Fallback to database if env vars not available
        console.warn('⚠️ Environment API key not found, falling back to database...');
        return getActiveApiKey();
    } catch (error) {
        console.error('❌ Error getting API key by purpose:', error);
        return getActiveApiKey();
    }
}

/**
 * Get an active API key that hasn't exceeded its quota
 */
export async function getActiveApiKey(): Promise<string | null> {
    try {
        // Get all keys that haven't exceeded quota
        const availableKeys = await db
            .select()
            .from(apiKeys)
            .where(eq(apiKeys.quotaExceeded, false))
            .orderBy(apiKeys.usageCount); // Get the least used key

        if (availableKeys.length === 0) {
            console.warn('⚠️ No available API keys found in database');

            // Fallback to environment variable
            const envKey = process.env.GOOGLE_GENAI_API_KEY;
            if (envKey) {
                console.log('✅ Using fallback API key from environment');
                return envKey;
            }

            return null;
        }

        const selectedKey = availableKeys[0];
        console.log(`✅ Selected API key: ${selectedKey.keyName} (usage: ${selectedKey.usageCount})`);

        return selectedKey.keyValue;
    } catch (error) {
        console.error('❌ Error getting active API key:', error);

        // Fallback to environment variable
        const envKey = process.env.GOOGLE_GENAI_API_KEY;
        if (envKey) {
            console.log('✅ Using fallback API key from environment (error recovery)');
            return envKey;
        }

        return null;
    }
}

/**
 * Mark an API key as exceeded quota
 */
export async function markKeyAsExceeded(keyValue: string): Promise<void> {
    try {
        await db
            .update(apiKeys)
            .set({
                quotaExceeded: true,
                lastUsedAt: new Date()
            })
            .where(eq(apiKeys.keyValue, keyValue));

        console.log(`🚫 Marked key as exceeded: ...${keyValue.slice(-4)}`);
    } catch (error) {
        console.error('❌ Error marking key as exceeded:', error);
    }
}

/**
 * Increment usage count for an API key
 */
export async function incrementKeyUsage(keyValue: string): Promise<void> {
    try {
        const [key] = await db
            .select()
            .from(apiKeys)
            .where(eq(apiKeys.keyValue, keyValue))
            .limit(1);

        if (key) {
            await db
                .update(apiKeys)
                .set({
                    usageCount: key.usageCount + 1,
                    lastUsedAt: new Date()
                })
                .where(eq(apiKeys.keyValue, keyValue));
        }
    } catch (error) {
        console.error('❌ Error incrementing key usage:', error);
    }
}

/**
 * Reset all API keys quota (should run daily)
 */
export async function resetAllApiKeys(): Promise<void> {
    try {
        await db
            .update(apiKeys)
            .set({
                quotaExceeded: false,
                usageCount: 0,
                resetAt: new Date()
            });

        console.log('✅ All API keys reset successfully');
    } catch (error) {
        console.error('❌ Error resetting API keys:', error);
    }
}

/**
 * Add a new API key to the database
 */
export async function addApiKey(keyName: string, keyValue: string): Promise<void> {
    try {
        await db.insert(apiKeys).values({
            keyName,
            keyValue,
            usageCount: 0,
            quotaExceeded: false,
        });

        console.log(`✅ Added new API key: ${keyName}`);
    } catch (error) {
        console.error('❌ Error adding API key:', error);
        throw error;
    }
}

/**
 * Get all API keys status
 */
export async function getAllApiKeysStatus() {
    try {
        const keys = await db.select().from(apiKeys);

        return keys.map(key => ({
            keyName: key.keyName,
            usageCount: key.usageCount,
            quotaExceeded: key.quotaExceeded,
            lastUsedAt: key.lastUsedAt,
            resetAt: key.resetAt,
        }));
    } catch (error) {
        console.error('❌ Error getting API keys status:', error);
        return [];
    }
}