#!/usr/bin/env node

// Script to validate Prisma setup before build
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Prisma setup...');

// Check if schema exists
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Prisma schema not found at:', schemaPath);
  process.exit(1);
}

console.log('✅ Prisma schema found');

// Validate schema
try {
  console.log('📋 Validating Prisma schema...');
  execSync('npx prisma validate', { stdio: 'inherit' });
  console.log('✅ Prisma schema is valid');
} catch (error) {
  console.error('❌ Prisma schema validation failed');
  process.exit(1);
}

// Try to generate (this doesn't need DATABASE_URL)
try {
  console.log('🔧 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client');
  console.error('This might be due to:');
  console.error('1. Missing dependencies');
  console.error('2. Invalid schema');
  console.error('3. Network issues (if using Prisma Data Proxy)');
  process.exit(1);
}

console.log('✅ All Prisma checks passed!');
