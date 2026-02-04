# Deployment Guide for GitGrub.ai

This guide will help you deploy GitGrub.ai to Vercel.

## Quick Start

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Set up PostgreSQL Database**
   - Recommended: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Alternative: [Supabase](https://supabase.com) (free tier)
   - Alternative: [Neon](https://neon.tech) (free tier)

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

4. **Configure Environment Variables**
   In Vercel Dashboard → Settings → Environment Variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   ```

5. **Run Database Migrations**
   ```bash
   # Get production env vars
   vercel env pull .env.local
   
   # Run migrations
   npx prisma migrate deploy
   ```

6. **Deploy!**
   - Vercel will automatically deploy on every push
   - Or trigger a manual deployment from the dashboard

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Your app's public URL | `https://gitgrub.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Generate with `openssl rand -base64 32` |

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Database Setup Options

### Option 1: Vercel Postgres (Easiest)

1. In Vercel Dashboard, go to Storage
2. Click "Create Database" → "Postgres"
3. Copy the `POSTGRES_URL` connection string
4. Use it as `DATABASE_URL` in environment variables

### Option 2: Supabase (Free Tier)

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use "Connection pooling" for serverless)
5. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true`

### Option 3: Neon (Free Tier)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Use it as `DATABASE_URL`

## Database Migrations

### First Time Setup

```bash
# Pull environment variables
vercel env pull .env.local

# Create initial migration
npx prisma migrate dev --name init

# Deploy migration to production
npx prisma migrate deploy
```

### Future Updates

When you update the schema:

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Deploy to production
npx prisma migrate deploy
```

## Build Configuration

The project is configured with:
- `postinstall` script: Automatically runs `prisma generate` after npm install
- `build` script: Runs `prisma generate && next build`
- `vercel.json`: Vercel-specific configuration

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables set correctly
- [ ] Test user registration
- [ ] Test recipe creation
- [ ] Test recipe forking
- [ ] Test search functionality
- [ ] Verify authentication works
- [ ] Check Vercel logs for errors

## Troubleshooting

### Build Fails with Prisma Errors

**Problem**: `@prisma/client` not found or schema errors

**Solution**: 
- Ensure `postinstall` script is in package.json (it is)
- Check that `DATABASE_URL` is accessible
- Verify Prisma schema is valid: `npx prisma validate`

### Database Connection Errors

**Problem**: Cannot connect to database

**Solution**:
- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- For Supabase/Neon, ensure connection pooling is enabled
- Check database is not paused (some free tiers pause after inactivity)

### Authentication Not Working

**Problem**: Login/register fails

**Solution**:
- Verify `NEXTAUTH_URL` matches your actual domain
- Check `NEXTAUTH_SECRET` is set and not empty
- Ensure cookies are working (check browser console)

### Search Not Working

**Problem**: Case-insensitive search fails

**Solution**:
- PostgreSQL supports `mode: 'insensitive'` (already configured)
- If using SQLite locally, it won't work - use PostgreSQL

## Monitoring

- **Vercel Logs**: Check function logs in Vercel dashboard
- **Database**: Monitor connection pool usage
- **Performance**: Use Vercel Analytics (if enabled)

## Scaling Considerations

- **Database**: Upgrade PostgreSQL plan as needed
- **CDN**: Vercel automatically handles static assets
- **Edge Functions**: API routes run on Vercel Edge Network
- **Caching**: Consider adding Redis for session storage at scale

## Support

For issues:
1. Check Vercel deployment logs
2. Check database connection
3. Verify all environment variables
4. Review Prisma migration status
