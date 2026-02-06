// Script to add generic ingredient names from a recipe
// This normalizes ingredients like "1 lb extra-lean ground turkey" to just "ground turkey"

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generic ingredient mappings based on the recipe
const ingredients = [
  { name: 'pancake mix', price: 7.99, tags: ['pantry', 'breakfast'] },
  { name: 'sugar-free syrup', price: 5.99, tags: ['pantry', 'breakfast'] },
  { name: 'ground turkey', price: 6.99, tags: ['meat-and-seafood', 'protein'] },
  { name: 'kosher salt', price: 3.49, tags: ['pantry', 'spices'] },
  { name: 'black pepper', price: 4.99, tags: ['pantry', 'spices'] },
  { name: 'white pepper', price: 5.49, tags: ['pantry', 'spices'] },
  { name: 'garlic powder', price: 3.99, tags: ['pantry', 'spices'] },
  { name: 'onion powder', price: 3.99, tags: ['pantry', 'spices'] },
  { name: 'italian seasoning', price: 4.49, tags: ['pantry', 'spices'] },
  { name: 'cayenne pepper', price: 4.99, tags: ['pantry', 'spices'] },
  { name: 'smoked paprika', price: 5.49, tags: ['pantry', 'spices'] },
  { name: 'gochujang', price: 6.99, tags: ['pantry', 'international'] },
  { name: 'egg white', price: 4.99, tags: ['dairy-and-eggs', 'protein'] },
  { name: 'american cheese', price: 4.49, tags: ['dairy-and-eggs', 'cheese'] }
];

async function addIngredients() {
  console.log('🥘 Adding generic ingredients to products table...\n');

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
