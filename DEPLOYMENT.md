# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Prepare all required values

## Step 1: Prepare Environment Variables

You'll need these values ready:

### Database (Aiven Postgres)
- `DB_HOST`: Your Postgres host
- `DB_PORT`: 28899
- `DB_NAME`: defaultdb
- `DB_USER`: Your database user
- `DB_PASSWORD`: Your database password
- `DB_SSL`: true

### Google Gemini API
- `GOOGLE_GENAI_API_KEY_1`: First API key
- `GOOGLE_GENAI_API_KEY_2`: Second API key

### Admin Credentials
- `ADMIN_EMAIL`: Admin email
- `ADMIN_PASSWORD`: Strong password

### Security
- `CRON_SECRET`: Random secret for cron endpoints

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Add Environment Variables:
   - Go to **Settings** → **Environment Variables**
   - Add all variables from `.env.example`
   - Set for: **Production**, **Preview**, and **Development**

5. Click **Deploy**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add DB_HOST
vercel env add DB_PORT
vercel env add DB_NAME
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_SSL
vercel env add GOOGLE_GENAI_API_KEY_1
vercel env add GOOGLE_GENAI_API_KEY_2
vercel env add CRON_SECRET

# Deploy to production
vercel --prod
```

## Step 3: Post-Deployment

### Verify Deployment
1. Visit your Vercel URL
2. Test the homepage
3. Login to `/admin` with your credentials
4. Test AI generation at `/admin/dashboard/generate`

### Set Up Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed

### Monitor Performance
1. Check **Analytics** tab in Vercel dashboard
2. Monitor **Logs** for any errors
3. Set up **Alerts** for critical issues

## Troubleshooting

### Build Fails
- Check **Build Logs** in Vercel dashboard
- Ensure all environment variables are set
- Verify TypeScript has no errors locally: `npm run typecheck`

### Database Connection Issues
- Verify database credentials
- Check if Aiven allows connections from Vercel IPs
- Test connection locally first

### AI Features Not Working
- Verify Google API keys are valid
- Check API key quotas
- Review function logs in Vercel

## Security Checklist

- ✅ All environment variables set in Vercel (not in code)
- ✅ `.env` file is in `.gitignore`
- ✅ Strong admin password
- ✅ CRON_SECRET is random and secure
- ✅ Database uses SSL
- ✅ API keys have appropriate quotas

## Performance Tips

1. **Enable Edge Functions** for faster response times
2. **Use Vercel Analytics** to monitor performance
3. **Set up Caching** for static assets
4. **Monitor Bundle Size** in build logs

## Useful Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Rollback to previous deployment
vercel rollback

# Remove deployment
vercel remove [deployment-url]
```

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Aiven Support: https://aiven.io/support

---

**Ready to deploy!** 🚀
