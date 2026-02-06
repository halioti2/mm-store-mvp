// Script to add recipe ingredients with appropriate tags

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Normalized ingredient names with prices and tags
const ingredients = [
  { name: 'red onion', price: 1.99, tags: ['produce', 'vegetables'] },
  { name: 'garlic', price: 2.99, tags: ['produce', 'vegetables'] },
  { name: 'red chilli', price: 2.49, tags: ['produce', 'vegetables'] },
  { name: 'pork sausage', price: 5.99, tags: ['meat-and-seafood', 'protein'] },
  { name: 'olive oil', price: 8.99, tags: ['pantry', 'oils'] },
  { name: 'sea salt', price: 3.49, tags: ['pantry', 'spices'] },
  { name: 'ground cumin', price: 4.49, tags: ['pantry', 'spices'] },
  { name: 'whole tomatoes', price: 2.49, tags: ['pantry', 'canned-goods'] },
  { name: 'chickpeas', price: 1.99, tags: ['pantry', 'canned-goods'] },
  { name: 'baby spinach', price: 3.99, tags: ['produce', 'vegetables'] }
];

async function addIngredients() {
  console.log('🥘 Adding recipe ingredients to products table...\n');

  let addedCount = 0;
  let skippedCount = 0;
  let taggedCount = 0;

  for (const ingredient of ingredients) {
    try {
      // Check if product already exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .ilike('name', ingredient.name)
        .single();

      let productId;

      if (existing) {
        console.log(`⏭️  "${ingredient.name}" already exists (ID: ${existing.id})`);
        productId = existing.id;
        skippedCount++;
      } else {
        // Insert the product
        const { data: newProduct, error: insertError } = await supabase
          .from('products')
          .insert({ name: ingredient.name, price: ingredient.price })
          .select('id')
          .single();

        if (insertError) {
          console.error(`❌ Error inserting "${ingredient.name}":`, insertError.message);
          continue;
        }

        productId = newProduct.id;
        console.log(`✅ Added "${ingredient.name}" (ID: ${productId})`);
        addedCount++;
      }

      // Now assign tags to this product
      for (const tagSlug of ingredient.tags) {
        // Get the tag ID
        const { data: tag } = await supabase
          .from('tags')
          .select('id')
          .eq('slug', tagSlug)
          .single();

        if (!tag) {
          console.log(`   ⚠️  Tag "${tagSlug}" not found, skipping`);
          continue;
        }

        // Check if product_tag relationship already exists
        const { data: existingRelation } = await supabase
          .from('product_tags')
          .select('*')
          .eq('product_id', productId)
          .eq('tag_id', tag.id)
          .single();

        if (existingRelation) {
          console.log(`   ⏭️  Tag "${tagSlug}" already assigned`);
          continue;
        }

        // Create the product_tag relationship
        const { error: tagError } = await supabase
          .from('product_tags')
          .insert({ product_id: productId, tag_id: tag.id });

        if (tagError) {
          console.error(`   ❌ Error assigning tag "${tagSlug}":`, tagError.message);
        } else {
          console.log(`   🏷️  Assigned tag "${tagSlug}"`);
          taggedCount++;
        }
      }

      console.log(''); // Empty line for readability
    } catch (error) {
      console.error(`❌ Unexpected error for "${ingredient.name}":`, error.message);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Products added: ${addedCount}`);
  console.log(`   ⏭️  Products skipped (already exist): ${skippedCount}`);
  console.log(`   🏷️  Tags assigned: ${taggedCount}`);
  console.log('\n✨ Done!');
}

addIngredients();
