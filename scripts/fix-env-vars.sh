#!/bin/bash

# Script to add environment variable fallbacks to all Netlify Functions
# Replace VITE_SUPABASE_URL with (VITE_SUPABASE_URL || SUPABASE_URL)

echo "Fixing environment variables in Netlify Functions..."

# Find all .js files in netlify/functions
for file in netlify/functions/*.js; do
  echo "Processing $file..."
  
  # Use sed to replace environment variable references
  # macOS sed requires backup extension, use '' for no backup
  sed -i '' 's/process\.env\.VITE_SUPABASE_URL/process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL/g' "$file"
  sed -i '' 's/process\.env\.VITE_SUPABASE_ANON_KEY/process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY/g' "$file"
done

echo "✅ Done! All functions updated with fallback environment variables."
