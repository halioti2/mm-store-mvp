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

// Mapping of product name patterns to aisle tags
const productToAisleMapping = {
  'produce': [
    'banana', 'apple', 'orange', 'tomato', 'potato', 'onion', 'carrot', 'lettuce', 
    'cucumber', 'bell pepper', 'broccoli', 'cauliflower', 'spinach', 'celery', 
    'garlic', 'ginger', 'mushroom', 'avocado', 'lemon', 'lime'
  ],
  'dairy-and-eggs': [
    'milk', 'egg', 'butter', 'cheese', 'cheddar cheese', 'mozzarella cheese', 
    'yogurt', 'sour cream', 'cream cheese', 'heavy cream'
  ],
  'meat-and-seafood': [
    'chicken breast', 'ground beef', 'bacon', 'sausage', 'pork chop', 
    'salmon', 'shrimp', 'tuna', 'turkey breast', 'ham'
  ],
  'pantry': [
    'rice', 'pasta', 'flour', 'sugar', 'brown sugar', 'salt', 'black pepper',
    'olive oil', 'vegetable oil', 'canola oil'
  ],
  'canned-goods': [
    'canned tomato', 'tomato sauce', 'tomato paste', 'chicken broth', 'beef broth',
    'vegetable broth', 'black bean', 'kidney bean', 'chickpea', 'corn'
  ],
  'bakery': [
    'bread', 'whole wheat bread', 'bagel', 'tortilla', 'pita bread', 'english muffin'
  ],
  'condiments-and-sauces': [
    'ketchup', 'mustard', 'mayonnaise', 'soy sauce', 'hot sauce', 'bbq sauce',
    'salsa', 'ranch dressing', 'italian dressing', 'oregano', 'basil', 'thyme',
    'rosemary', 'cumin', 'paprika', 'chili powder', 'cinnamon', 'parsley', 'cilantro'
  ],
  'frozen-foods': [
    'frozen peas', 'frozen corn', 'frozen broccoli', 'frozen mixed vegetables',
    'ice cream', 'frozen pizza'
  ],
  'snacks': [
    'peanut butter', 'jam', 'honey', 'maple syrup', 'crackers', 'chips', 
    'cereal', 'oatmeal'
  ]
};

async function assignProductTags() {
  console.log("🔗 Starting to assign tags to products...\n");

  // First, fetch all tags
  const { data: tags, error: tagsError } = await supabase
    .from('tags')
    .select('id, name, slug, type');

  if (tagsError) {
    console.error("❌ Error fetching tags:", tagsError.message);
    return;
  }

  console.log(`📋 Found ${tags.length} tags in database\n`);

  // Create a lookup map for quick access
  const tagsBySlug = {};
  tags.forEach(tag => {
    tagsBySlug[tag.slug] = tag;
  });

  // Fetch all products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name');

  if (productsError) {
    console.error("❌ Error fetching products:", productsError.message);
    return;
  }

  console.log(`🛒 Found ${products.length} products to tag\n`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const product of products) {
    try {
      const productNameLower = product.name.toLowerCase();
      let assignedTag = null;

      // Find matching aisle for this product
      for (const [aisleSlug, productNames] of Object.entries(productToAisleMapping)) {
        if (productNames.includes(productNameLower)) {
          assignedTag = tagsBySlug[aisleSlug];
          break;
        }
      }

      if (!assignedTag) {
        console.log(`⏭️  Skipped: "${product.name}" (no matching category)`);
        skippedCount++;
        continue;
      }

      // Check if relationship already exists
      const { data: existing, error: checkError } = await supabase
        .from('product_tags')
        .select('product_id, tag_id')
        .eq('product_id', product.id)
        .eq('tag_id', assignedTag.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error(`❌ Error checking "${product.name}":`, checkError.message);
        errorCount++;
        continue;
      }

      if (existing) {
        console.log(`⏭️  Skipped: "${product.name}" already tagged as "${assignedTag.name}"`);
        skippedCount++;
        continue;
      }

      // Insert the product-tag relationship
      const { error: insertError } = await supabase
        .from('product_tags')
        .insert([
          {
            product_id: product.id,
            tag_id: assignedTag.id
          }
        ]);

      if (insertError) {
        console.error(`❌ Failed to tag "${product.name}":`, insertError.message);
        errorCount++;
      } else {
        console.log(`✅ Tagged: "${product.name}" → ${assignedTag.name}`);
        successCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));

    } catch (err) {
      console.error(`❌ Error processing "${product.name}":`, err.message);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`📊 Summary:`);
  console.log(`   ✅ Successfully tagged: ${successCount} products`);
  console.log(`   ⏭️  Skipped: ${skippedCount} products`);
  console.log(`   ❌ Failed: ${errorCount} products`);
  console.log(`   📦 Total processed: ${products.length} products`);
  console.log("=".repeat(60));
  console.log("\n🎉 Product tagging complete!");
  console.log("💡 Your products are now organized by aisle categories!");
}

assignProductTags();
