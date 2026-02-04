#!/bin/bash

# Database setup script for GitGrub.ai
# This script helps set up the database for both local and production environments

echo "🍝 GitGrub.ai Database Setup"
echo "============================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo ""
    echo "Please set DATABASE_URL in your .env file:"
    echo "  For PostgreSQL: DATABASE_URL=\"postgresql://user:password@host:5432/database?schema=public\""
    echo "  For SQLite: DATABASE_URL=\"file:./dev.db\""
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated"
echo ""

# Check if we should run migrations or push
if [ "$1" == "migrate" ]; then
    echo "🔄 Running database migrations..."
    npx prisma migrate deploy
    
    if [ $? -ne 0 ]; then
        echo "❌ Migration failed"
        exit 1
    fi
    
    echo "✅ Migrations completed"
elif [ "$1" == "dev" ]; then
    echo "🔄 Creating development migration..."
    npx prisma migrate dev --name init
    
    if [ $? -ne 0 ]; then
        echo "❌ Migration failed"
        exit 1
    fi
    
    echo "✅ Development migration created"
else
    echo "🔄 Pushing schema to database..."
    npx prisma db push
    
    if [ $? -ne 0 ]; then
        echo "❌ Database push failed"
        exit 1
    fi
    
    echo "✅ Schema pushed to database"
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "  - Start the dev server: npm run dev"
echo "  - Open Prisma Studio: npm run db:studio"
