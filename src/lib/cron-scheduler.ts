'use server';

/**
 * @fileOverview Cron Job Scheduler for Automated Content Generation
 * 
 * This module handles scheduling automated content generation to run 6 times daily.
 * Schedule: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 (every 4 hours)
 */

import { runAutomatedContentGeneration } from '../ai/flows/automated-content-generation';
import { resetAllApiKeys } from './api-key-manager';

// Store last run time in memory (in production, use database)
let lastRunTimes: { [key: string]: Date } = {};

/**
 * Check if it's time to run the cron job
 */
function shouldRunCron(jobName: string, intervalHours: number): boolean {
    const lastRun = lastRunTimes[jobName];

    if (!lastRun) {
        return true; // Never run before
    }

    const now = new Date();
    const hoursSinceLastRun = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60);

    return hoursSinceLastRun >= intervalHours;
}

/**
 * Update last run time
 */
function updateLastRun(jobName: string): void {
    lastRunTimes[jobName] = new Date();
}

/**
 * Content generation cron job (runs every 4 hours)
 */
export async function contentGenerationCron() {
    const jobName = 'content-generation';
    const intervalHours = 4;

    if (!shouldRunCron(jobName, intervalHours)) {
        const nextRun = new Date(lastRunTimes[jobName].getTime() + intervalHours * 60 * 60 * 1000);
        console.log(`⏭️ Skipping content generation. Next run at: ${nextRun.toISOString()}`);
        return {
            skipped: true,
            nextRun: nextRun.toISOString(),
        };
    }

    console.log('🚀 Running content generation cron job...');

    try {
        const result = await runAutomatedContentGeneration('AI and Technology');
        updateLastRun(jobName);

        return {
            ...result,
            timestamp: new Date().toISOString(),
        };
    } catch (error: any) {
        console.error('❌ Content generation cron failed:', error);
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * API key reset cron job (runs daily at midnight)
 */
export async function apiKeyResetCron() {
    const jobName = 'api-key-reset';
    const intervalHours = 24;

    if (!shouldRunCron(jobName, intervalHours)) {
        const nextRun = new Date(lastRunTimes[jobName].getTime() + intervalHours * 60 * 60 * 1000);
        console.log(`⏭️ Skipping API key reset. Next run at: ${nextRun.toISOString()}`);
        return {
            skipped: true,
            nextRun: nextRun.toISOString(),
        };
    }

    console.log('🔄 Running API key reset cron job...');

    try {
        await resetAllApiKeys();
        updateLastRun(jobName);

        return {
            success: true,
            message: 'API keys reset successfully',
            timestamp: new Date().toISOString(),
        };
    } catch (error: any) {
        console.error('❌ API key reset cron failed:', error);
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
        };
    }
}

/**
 * Master cron runner - call this from your cron endpoint
 */
export async function runAllCrons() {
    console.log('⏰ Running all scheduled cron jobs...');

    const results = {
        contentGeneration: await contentGenerationCron(),
        apiKeyReset: await apiKeyResetCron(),
    };

    console.log('✅ All cron jobs completed');
    return results;
}

/**
 * Get cron job status
 */
export async function getCronStatus() {
    const now = new Date();

    return {
        currentTime: now.toISOString(),
        jobs: {
            contentGeneration: {
                lastRun: lastRunTimes['content-generation']?.toISOString() || 'Never',
                intervalHours: 4,
                nextRun: lastRunTimes['content-generation']
                    ? new Date(lastRunTimes['content-generation'].getTime() + 4 * 60 * 60 * 1000).toISOString()
                    : 'Ready to run',
            },
            apiKeyReset: {
                lastRun: lastRunTimes['api-key-reset']?.toISOString() || 'Never',
                intervalHours: 24,
                nextRun: lastRunTimes['api-key-reset']
                    ? new Date(lastRunTimes['api-key-reset'].getTime() + 24 * 60 * 60 * 1000).toISOString()
                    : 'Ready to run',
            },
        },
    };
}
