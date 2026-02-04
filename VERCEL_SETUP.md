# Quick Vercel Setup Checklist

## Before Deployment

1. ✅ Code is pushed to GitHub/GitLab/Bitbucket
2. ✅ PostgreSQL database is set up
3. ✅ Environment variables are ready

## Vercel Deployment Steps

### 1. Import Project
- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- Click "Add New Project"
- Import your repository
- Vercel auto-detects Next.js ✅

### 2. Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<generate-secret>
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Deploy

- Click "Deploy"
- Wait for build to complete
- Note: First build may take longer (Prisma generation)

### 4. Run Database Migrations

After first deployment:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

Or use your database provider's SQL editor to run migrations manually.

### 5. Verify Deployment

- ✅ Visit your app URL
- ✅ Test registration
- ✅ Test login
- ✅ Create a recipe
- ✅ Check Vercel logs for errors

## Common Issues

**Build fails?**
- Check `DATABASE_URL` is set
- Verify Prisma schema is valid

**Database connection error?**
- Verify `DATABASE_URL` format
- Check database allows external connections
- For Supabase/Neon: Use connection pooling URL

**Auth not working?**
- Check `NEXTAUTH_URL` matches your domain
- Verify `NEXTAUTH_SECRET` is set

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
