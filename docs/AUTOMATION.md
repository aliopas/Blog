# 🤖 Automated Content Generation System

## Overview
This system automatically generates high-quality blog articles 6 times daily using AI, based on trending topics in your niche.

## Features
- ✅ Automated content generation (6 times daily)
- ✅ AI-powered trending topic discovery
- ✅ Quality checking before saving
- ✅ Saves articles as drafts for admin review
- ✅ API key rotation system
- ✅ Manual trigger from admin dashboard

## Schedule
Content is generated automatically at:
- **00:00 UTC** (2:00 AM Egypt)
- **04:00 UTC** (6:00 AM Egypt)
- **08:00 UTC** (10:00 AM Egypt)
- **12:00 UTC** (2:00 PM Egypt)
- **16:00 UTC** (6:00 PM Egypt)
- **20:00 UTC** (10:00 PM Egypt)

## Database Tables Used

### 1. `blog_posts`
Stores generated articles with status='draft' for admin review.

### 2. `blog_quality_checks`
Stores quality metrics for each generated article.

### 3. `blog_api_keys`
Manages multiple API keys with automatic rotation when quota is exceeded.

### 4. `blog_categories`
Links articles to appropriate categories.

## Setup Instructions

### 1. Add API Keys to Database

You need to insert your Google Gemini API keys into the database:

```sql
-- Insert your API keys
INSERT INTO blog_api_keys (key_name, key_value, usage_count, quota_exceeded)
VALUES 
  ('GEMINI_API_KEY_1', 'your-first-api-key-here', 0, false),
  ('GEMINI_API_KEY_2', 'your-second-api-key-here', 0, false),
  ('GEMINI_API_KEY_3', 'your-third-api-key-here', 0, false);
```

### 2. Add Environment Variables

Add to your `.env` file:

```env
# Cron Secret (for securing the cron endpoint)
CRON_SECRET=your-super-secret-token-here

# Fallback API Key (optional, used if database is unavailable)
GOOGLE_GENAI_API_KEY=your-fallback-api-key
```

### 3. Set Up Cron Service

You have several options:

#### Option A: Vercel Cron (Recommended for Vercel deployments)

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

#### Option B: External Cron Service (cron-job.org, EasyCron, etc.)

Set up a cron job to call:
```
GET https://your-domain.com/api/cron
Headers:
  Authorization: Bearer your-super-secret-token-here
```

Schedule: `0 */4 * * *` (every 4 hours)

#### Option C: GitHub Actions

Create `.github/workflows/cron.yml`:
```yaml
name: Automated Content Generation

on:
  schedule:
    - cron: '0 */4 * * *'  # Every 4 hours
  workflow_dispatch:  # Allow manual trigger

jobs:
  generate-content:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Content Generation
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.com/api/cron
```

## Admin Dashboard

Access the automation dashboard at:
```
/admin/dashboard/automation
```

Features:
- ✅ Manual content generation trigger
- ✅ View cron job status
- ✅ See last run times and next scheduled runs
- ✅ Monitor generation results

## How It Works

1. **Trending Topic Discovery**
   - AI analyzes current trends in your niche
   - Selects the most relevant and timely topics

2. **Article Generation**
   - Creates comprehensive, SEO-optimized content
   - Includes proper HTML formatting
   - Generates title, excerpt, and keywords

3. **Quality Check**
   - Analyzes readability score
   - Checks keyword density
   - Provides improvement suggestions

4. **Save as Draft**
   - Article is saved with status='draft'
   - Admin reviews and approves before publishing
   - Can edit or enhance before going live

## API Endpoints

### `/api/cron` (GET)
Triggers all scheduled cron jobs (content generation + API key reset)
- **Auth**: Bearer token required
- **Returns**: Job execution results

### `/api/automation/generate` (POST)
Manually trigger content generation
- **Auth**: None (admin only via dashboard)
- **Returns**: Generation result

### `/api/automation/status` (GET)
Get current automation status
- **Auth**: None (admin only via dashboard)
- **Returns**: Cron job status and schedules

## Monitoring

Check logs for:
- ✅ Content generation success/failure
- ✅ API key rotation events
- ✅ Quality check scores
- ✅ Database save confirmations

Example log output:
```
🤖 Starting automated content generation...
🔍 Fetching trending topics for: AI and Technology
✅ Found 3 trending topics
📝 Selected topic: Latest developments in Large Language Models
✍️ Generating article for: Latest developments in Large Language Models
✅ Article generated: Understanding GPT-4 and Beyond
🔍 Checking article quality...
📊 Quality Score - Readability: 85, Keywords: 78
💾 Saving article to database...
✅ Article saved with ID: 123
```

## Troubleshooting

### No articles being generated
1. Check if API keys are in database
2. Verify CRON_SECRET is set correctly
3. Check cron service is running
4. Review logs for errors

### API quota exceeded
- System automatically rotates to next available key
- Keys reset daily at midnight
- Add more keys to database if needed

### Low quality articles
- Adjust prompts in `automated-content-generation.ts`
- Modify quality thresholds
- Enhance topic selection criteria

## File Structure

```
src/
├── ai/
│   ├── flows/
│   │   ├── automated-content-generation.ts  # Main automation logic
│   │   ├── check-article-quality.ts         # Quality checker
│   │   └── ...
│   └── genkit.ts                            # AI instance manager
├── lib/
│   ├── api-key-manager.ts                   # API key rotation
│   ├── cron-scheduler.ts                    # Cron job scheduler
│   └── data.ts                              # Database operations
└── app/
    ├── api/
    │   ├── cron/route.ts                    # Cron endpoint
    │   └── automation/
    │       ├── generate/route.ts            # Manual trigger
    │       └── status/route.ts              # Status endpoint
    └── admin/
        └── dashboard/
            └── automation/page.tsx          # Admin UI
```

## Next Steps

1. ✅ Insert API keys into database
2. ✅ Set CRON_SECRET in environment
3. ✅ Set up cron service
4. ✅ Test manual generation
5. ✅ Monitor first automated run
6. ✅ Review and publish generated articles

## Support

For issues or questions, check:
- Application logs
- Database connection
- API key quotas
- Cron service status
