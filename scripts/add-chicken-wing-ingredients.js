// Script to add chicken wing recipe ingredients with original tags

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// New ingredients from chicken wings recipe with original tag system
const ingredients = [
  // Meat
  { name: 'chicken wings', price: 9.99, tags: ['meat-and-seafood', 'gluten-free'] },
  
  // Oils
  { name: 'peanut oil', price: 12.99, tags: ['pantry', 'vegetarian', 'gluten-free'] },
  
  // Sauces (hot sauce already exists)
  { name: 'buffalo sauce', price: 4.99, tags: ['pantry'] },
  { name: 'worcestershire sauce', price: 4.49, tags: ['pantry'] },
  
  // Dairy (butter, sour cream, mayonnaise already exist)
  { name: 'unsalted butter', price: 4.99, tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'buttermilk', price: 3.99, tags: ['dairy-and-eggs', 'vegetarian'] },
  
  // Fresh Herbs (parsley, garlic already exist)
  { name: 'fresh dill', price: 2.99, tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'fresh chives', price: 2.49, tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  
  // Spices/Seasonings (white vinegar, cayenne, salt, onion powder, dried parsley already exist or covered)
  { name: 'white vinegar', price: 2.99, tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'dried parsley', price: 3.49, tags: ['pantry', 'vegetarian', 'gluten-free'] }
];

async function addIngredients() {
  console.log('🍗 Adding chicken wing recipe ingredients to products table...\n');

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
    } catch (err) {
      console.error(`❌ Error processing "${ingredient.name}":`, err.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Products added: ${addedCount}`);
  console.log(`⏭️  Products already existed: ${skippedCount}`);
  console.log(`🏷️  Tags assigned: ${taggedCount}`);
  console.log(`📦 Total products processed: ${ingredients.length}`);
  console.log('='.repeat(50) + '\n');
}

addIngredients().catch(console.error);
