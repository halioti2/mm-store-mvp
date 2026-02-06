import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Standard aisle tags for grocery store organization
const aisleTags = [
  { name: 'Produce', type: 'aisle', slug: 'produce' },
  { name: 'Meat & Seafood', type: 'aisle', slug: 'meat-and-seafood' },
  { name: 'Dairy & Eggs', type: 'aisle', slug: 'dairy-and-eggs' },
  { name: 'Bakery', type: 'aisle', slug: 'bakery' },
  { name: 'Pantry', type: 'aisle', slug: 'pantry' },
  { name: 'Frozen Foods', type: 'aisle', slug: 'frozen-foods' },
  { name: 'Condiments & Sauces', type: 'aisle', slug: 'condiments-and-sauces' },
  { name: 'Snacks', type: 'aisle', slug: 'snacks' },
  { name: 'Beverages', type: 'aisle', slug: 'beverages' },
  { name: 'Canned Goods', type: 'aisle', slug: 'canned-goods' },
];

// Optional dietary and special tags
const dietaryTags = [
  { name: 'Vegetarian', type: 'dietary', slug: 'vegetarian' },
  { name: 'Vegan', type: 'dietary', slug: 'vegan' },
  { name: 'Gluten-Free', type: 'dietary', slug: 'gluten-free' },
  { name: 'Dairy-Free', type: 'dietary', slug: 'dairy-free' },
];

const specialTags = [
  { name: 'Organic', type: 'special', slug: 'organic' },
  { name: 'Featured', type: 'special', slug: 'featured' },
];

const allTags = [...aisleTags, ...dietaryTags, ...specialTags];

async function addTags() {
  console.log("🏷️  Starting to add tags...\n");

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const tag of allTags) {
    try {
      // Check if tag already exists
      const { data: existing, error: checkError } = await supabase
        .from('tags')
        .select('id, name')
        .eq('slug', tag.slug)
        .maybeSingle();

      if (checkError) {
        console.error(`❌ Error checking "${tag.name}":`, checkError.message);
        errorCount++;
        continue;
      }

      if (existing) {
        console.log(`⏭️  Skipped: "${tag.name}" (already exists)`);
        skippedCount++;
        continue;
      }

      // Insert new tag
      const { data, error } = await supabase
        .from('tags')
        .insert([tag])
        .select();

      if (error) {
        console.error(`❌ Failed to add "${tag.name}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Added: ${tag.name} (${tag.type}) - slug: ${tag.slug}`);
        successCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (err) {
      console.error(`❌ Error adding "${tag.name}":`, err.message);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`📊 Summary:`);
  console.log(`   ✅ Successfully added: ${successCount} tags`);
  console.log(`   ⏭️  Skipped (already exist): ${skippedCount} tags`);
  console.log(`   ❌ Failed: ${errorCount} tags`);
  console.log(`   📦 Total processed: ${allTags.length} tags`);
  console.log("=".repeat(50));
  console.log("\n💡 Next step: Run 'node scripts/assign-product-tags.js' to assign tags to products!");
}

addTags();
