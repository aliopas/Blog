-- ============================================
-- API Keys Setup Script
-- ============================================
-- This script helps you insert your Google Gemini API keys
-- into the database for the automated content generation system.
--
-- INSTRUCTIONS:
-- 1. This script is for reference. The keys are inserted via the
--    `scripts/run-insert-keys.js` script which reads them
--    from environment variables.
-- 2. Make sure to set the environment variables before running the script.
-- ============================================

-- Insert API Keys
-- Your actual API keys are now inserted via the run-insert-keys.js script
INSERT INTO blog_api_keys (key_name, key_value, usage_count, quota_exceeded, created_at)
VALUES 
  -- Key 1
  ('GEMINI_API_KEY_1', 'YOUR_API_KEY_HERE_AS_ENV_VAR', 0, false, NOW()),
  
  -- Key 2
  ('GEMINI_API_KEY_2', 'YOUR_API_KEY_HERE_AS_ENV_VAR', 0, false, NOW())
  
ON CONFLICT (key_name) DO NOTHING;

-- Verify insertion
SELECT 
  key_name,
  usage_count,
  quota_exceeded,
  last_used_at,
  created_at
FROM blog_api_keys
ORDER BY created_at DESC;

-- ============================================
-- How to get Google Gemini API Keys:
-- ============================================
-- 1. Go to: https://aistudio.google.com/app/apikey
-- 2. Click "Create API Key"
-- 3. Select your Google Cloud project (or create new one)
-- 4. Copy the generated API key
-- 5. Set it as an environment variable in your deployment environment.
-- ============================================
