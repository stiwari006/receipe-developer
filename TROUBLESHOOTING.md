# Troubleshooting Deployment Issues

## Build Fails at `prisma generate`

### Symptoms
- Build hangs or fails during `prisma generate`
- Logs show `> prisma generate` but nothing after

### Solutions

#### Solution 1: Ensure Prisma is in dependencies (not just devDependencies)

Check your `package.json` - `prisma` should be in `dependencies`, not `devDependencies`:

```json
{
  "dependencies": {
    "prisma": "^5.7.1",
    "@prisma/client": "^5.7.1"
  }
}
```

#### Solution 2: Add DATABASE_URL for build (even if dummy)

Vercel might need DATABASE_URL set during build. Add a dummy one in Vercel environment variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/dummy?schema=public
```

This won't be used during `prisma generate`, but some Prisma versions validate the format.

#### Solution 3: Update Prisma version

Try updating to the latest Prisma version:

```bash
npm install prisma@latest @prisma/client@latest
```

#### Solution 4: Remove postinstall script temporarily

If `postinstall` is causing issues, you can remove it and rely only on the build script:

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

Remove `"postinstall": "prisma generate"` temporarily.

#### Solution 5: Use Prisma's binary targets

Add binary targets to your `schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}
```

#### Solution 6: Check Vercel build logs

Look for specific error messages in Vercel build logs. Common issues:
- Network timeout
- Missing dependencies
- Permission issues

## Build Succeeds but App Crashes

### Database Connection Errors

**Error**: `Can't reach database server`

**Solution**:
1. Verify `DATABASE_URL` is set in Vercel environment variables
2. Check database allows connections from Vercel IPs
3. For Supabase/Neon: Use connection pooling URL
4. Ensure database is not paused (free tiers may pause)

### Prisma Client Not Found

**Error**: `@prisma/client did not initialize yet`

**Solution**:
1. Ensure `prisma generate` runs during build
2. Check that `@prisma/client` is in `dependencies`
3. Verify build logs show Prisma generation succeeded

## Authentication Issues

### NextAuth Errors

**Error**: `NEXTAUTH_SECRET is missing`

**Solution**:
1. Set `NEXTAUTH_SECRET` in Vercel environment variables
2. Generate secret: `openssl rand -base64 32`
3. Ensure `NEXTAUTH_URL` matches your Vercel domain

## Quick Fixes

### Reset Build Cache

In Vercel Dashboard:
1. Go to your project
2. Settings → General
3. Clear build cache
4. Redeploy

### Force Rebuild

```bash
vercel --force
```

### Check Prisma Locally

Before deploying, test locally:

```bash
npx prisma validate
npx prisma generate
npm run build
```

If these work locally but fail on Vercel, it's likely an environment issue.

## Still Having Issues?

1. Check Vercel build logs for specific error messages
2. Verify all environment variables are set
3. Ensure database is accessible
4. Try deploying with a minimal setup first
5. Check Prisma and Next.js versions are compatible
