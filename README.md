# GitGrub.ai 🍝

A collaborative, version-controlled platform for recipes, like GitHub, but for your favorite meals.

## Features

- 📝 **Standardized Recipe Format** - Clean, structured recipes without endless backstories
- 🍝 **Fork & Remix** - Fork any recipe and create your own version with substitutions, dietary tweaks, or regional spins
- 👯 **Social Features** - Follow chefs, like recipes, and comment on cooking tips
- 🔍 **Search & Discover** - Searchable, filterable library of community-tested recipes
- 📊 **Version Control** - Full commit history for every recipe, track changes over time
- 🔄 **Pull Requests** - Submit recipe improvements and collaborate with the community

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma) - production ready
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with shadcn/ui components
- **ORM**: Prisma
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd "Food receipe"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
```
# For local development, you can use a local PostgreSQL or SQLite
# PostgreSQL (recommended for production):
DATABASE_URL="postgresql://user:password@localhost:5432/gitgrub?schema=public"

# Or SQLite for quick local testing:
# DATABASE_URL="file:./dev.db"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
# Or for production: npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Quick Deploy to Vercel

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for a quick checklist, or [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**TL;DR:**
1. Push code to GitHub
2. Set up PostgreSQL database (Vercel Postgres, Supabase, or Neon)
3. Import to Vercel
4. Add environment variables
5. Run `npx prisma migrate deploy`
6. Done! 🎉

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── recipes/      # Recipe CRUD operations
│   │   └── users/        # User operations
│   ├── recipes/          # Recipe pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── profile/          # User profiles
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── ...              # Custom components
├── lib/                 # Utility functions
│   ├── prisma.ts       # Prisma client
│   └── utils.ts        # Helper functions
└── prisma/             # Database schema
    └── schema.prisma  # Prisma schema
```

## Deployment to Vercel

### Prerequisites
- A Vercel account
- A PostgreSQL database (Vercel Postgres, Supabase, Neon, or any PostgreSQL provider)

### Steps

1. **Push your code to GitHub** (or GitLab/Bitbucket)

2. **Set up a PostgreSQL database**:
   - Option A: Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (recommended)
   - Option B: Use [Supabase](https://supabase.com) (free tier available)
   - Option C: Use [Neon](https://neon.tech) (free tier available)
   - Option D: Any other PostgreSQL provider

3. **Import your project to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js settings

4. **Configure Environment Variables** in Vercel:
   - Go to your project settings → Environment Variables
   - Add the following:
     ```
     DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
     NEXTAUTH_URL=https://your-domain.vercel.app
     NEXTAUTH_SECRET=your-random-secret-here
     ```
   - Generate `NEXTAUTH_SECRET` using: `openssl rand -base64 32`

5. **Run database migrations**:
   ```bash
   # Option 1: Using Prisma Migrate (recommended)
   npx prisma migrate deploy
   
   # Option 2: Using Prisma Push (for quick setup)
   npx prisma db push
   ```
   
   You can run this locally with your production DATABASE_URL, or use Vercel's CLI:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

6. **Deploy**:
   - Vercel will automatically build and deploy on every push to your main branch
   - The build process includes `prisma generate` automatically

### Post-Deployment

1. **Verify your database connection** - Check Vercel logs for any Prisma errors
2. **Test authentication** - Make sure login/register works
3. **Create your first recipe** - Verify the app is fully functional

### Troubleshooting

- **Build fails**: Check that `DATABASE_URL` is set correctly
- **Prisma errors**: Ensure `prisma generate` runs during build (it's in package.json)
- **Database connection**: Verify your PostgreSQL database allows connections from Vercel's IPs
- **Environment variables**: Make sure all env vars are set in Vercel dashboard

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts with authentication
- **Recipe**: Recipes with standardized format
- **Commit**: Version history for recipes
- **PullRequest**: Recipe improvement suggestions
- **Comment**: Comments on recipes
- **Like**: Recipe likes
- **Follow**: User follow relationships

## Features in Detail

### Recipe Management
- Create recipes with standardized format (ingredients, steps, tags, notes)
- Edit and update recipes with commit history
- Fork recipes to create variations
- Public/private recipe visibility

### Social Features
- Follow other chefs
- Like recipes
- Comment on recipes
- View recipe statistics (forks, likes, comments)

### Version Control
- Full commit history for each recipe
- Track changes over time
- See who made what changes

## Future Enhancements

- Pull request system for recipe improvements
- Recipe collections and meal planning
- Advanced search with filters (cuisine, dietary restrictions, difficulty)
- Recipe analytics for Pro users
- Recipe monetization tools
- Branded collaborations

## Business Model

Freemium model:
- **Free**: Basic recipe creation and sharing
- **Pro**: Analytics, monetization tools, branded collaborations

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
