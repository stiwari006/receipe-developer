# Build Fix for Vercel Deployment

## Issue
Build hangs or fails at `prisma generate` step.

## Root Cause
`prisma` was in `devDependencies` instead of `dependencies`. Vercel doesn't install devDependencies during production builds, so `prisma generate` fails.

## Fix Applied

1. ✅ Moved `prisma` from `devDependencies` to `dependencies`
2. ✅ Removed duplicate `prisma` entry
3. ✅ Simplified `vercel.json` to use npm scripts
4. ✅ Removed unnecessary `output: 'standalone'` from next.config.js

## What Changed

### package.json
- `prisma` is now in `dependencies` (required for Vercel builds)
- `@prisma/client` remains in `dependencies`
- Removed duplicate `prisma` from `devDependencies`

### vercel.json
- Simplified to use `npm run build` instead of inline command
- Removed unnecessary environment variables

### next.config.js
- Removed `output: 'standalone'` (Vercel handles this automatically)

## Next Steps

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Fix: Move prisma to dependencies for Vercel build"
   git push
   ```

2. **Redeploy on Vercel:**
   - The build should now succeed
   - `prisma generate` will run during `postinstall` and `build`

3. **If build still fails:**
   - Check Vercel build logs for specific errors
   - Ensure `DATABASE_URL` is set (even a dummy value works for generate)
   - See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more solutions

## Verification

After deployment, verify:
- ✅ Build completes successfully
- ✅ Prisma Client is generated
- ✅ App starts without errors
- ✅ Database connection works (after setting real DATABASE_URL)
