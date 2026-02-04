#!/usr/bin/env node

// Script to generate Prisma Client with fallback DATABASE_URL
// This ensures prisma generate works even if DATABASE_URL is not set

const { execSync } = require('child_process');

// Set a dummy DATABASE_URL if not provided
// Prisma generate doesn't actually connect, but validates the format
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/dummy?schema=public';
  console.log('⚠️  DATABASE_URL not set, using dummy value for generation');
}

try {
  console.log('🔧 Generating Prisma Client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: process.env
  });
  console.log('✅ Prisma Client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client');
  process.exit(1);
}
