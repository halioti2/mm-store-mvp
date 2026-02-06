import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Product and tag mappings for cucumber salad ingredients
const productTagMappings = [
  { 
    name: 'mini cucumbers', 
    price: 3.99, 
    tags: ['vegetables', 'vegetarian', 'gluten-free'] 
  },
  { 
    name: 'salt', 
    price: 2.49, 
    tags: ['pantry', 'vegetarian', 'gluten-free'] 
  },
  { 
    name: 'red onion', 
    price: 1.29, 
    tags: ['vegetables', 'vegetarian', 'gluten-free'] 
  },
  { 
    name: 'seasoned rice vinegar', 
    price: 3.49, 
    tags: ['pantry', 'vegetarian', 'gluten-free'] 
  },
  { 
    name: 'hot honey', 
    price: 8.99, 
    tags: ['pantry', 'vegetarian', 'gluten-free'] 
  },
  { 
    name: 'soy sauce', 
    price: 3.99, 
    tags: ['pantry', 'vegetarian'] 
  },
  { 
    name: 'sesame oil', 
    price: 5.99, 
    tags: ['pantry', 'vegetarian', 'gluten-free'] 
  },
  { 
    name: 'fish sauce', 
    price: 4.49, 
    tags: ['pantry', 'gluten-free'] 
  },
  { 
    name: 'garlic', 
    price: 0.79, 
    tags: ['vegetables', 'vegetarian', 'gluten-free'] 
  },
  { 
    name: 'red pepper flakes', 
    price: 2.99, 
    tags: ['pantry', 'vegetarian', 'gluten-free'] 
  }
];

async function addCucumberSaladIngredients() {
  console.log('🥒 Starting cucumber salad ingredients import...\n');
  
  // First, fetch all existing tags
  const { data: tagsData, error: tagsError } = await supabase
    .from('tags')
    .select('id, slug');
  
  if (tagsError) {
    console.error('❌ Error fetching tags:', tagsError);
    return;
  }
  
  // Create a map of tag slugs to IDs
  const tagMap = {};
  tagsData.forEach(tag => {
    tagMap[tag.slug] = tag.id;
  });
  
  console.log('📋 Found tags:', Object.keys(tagMap).join(', '));
  console.log('');
  
  let productsAdded = 0;
  let productsAlreadyExisted = 0;
  let tagsAssigned = 0;
  let errors = 0;
  
  for (const item of productTagMappings) {
    try {
      // Check if product already exists
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', item.name)
        .maybeSingle();
      
      if (checkError) {
        console.error(`❌ Error checking product "${item.name}":`, checkError.message);
        errors++;
        continue;
      }
      
      let productId;
      
      if (existingProduct) {
        console.log(`⏭️  Product "${item.name}" already exists (ID: ${existingProduct.id})`);
        productId = existingProduct.id;
        productsAlreadyExisted++;
      } else {
        // Insert the product
        const { data: newProduct, error: insertError } = await supabase
          .from('products')
          .insert({
            name: item.name,
            price: item.price,
            image_url: null // Will be enriched later with Spoonacular
          })
          .select()
          .single();
        
        if (insertError) {
          console.error(`❌ Error inserting product "${item.name}":`, insertError.message);
          errors++;
          continue;
        }
        
        productId = newProduct.id;
        console.log(`✅ Added product: "${item.name}" (ID: ${productId}, $${item.price})`);
        productsAdded++;
      }
      
      // Assign tags to the product
      for (const tagSlug of item.tags) {
        const tagId = tagMap[tagSlug];
        
        if (!tagId) {
          console.warn(`   ⚠️  Tag "${tagSlug}" not found in database`);
          continue;
        }
        
        // Check if the product-tag relationship already exists
        const { data: existingRelation } = await supabase
          .from('product_tags')
          .select('id')
          .eq('product_id', productId)
          .eq('tag_id', tagId)
          .maybeSingle();
        
        if (existingRelation) {
          console.log(`   ↪️  Tag "${tagSlug}" already assigned`);
          continue;
        }
        
        // Insert the product-tag relationship
        const { error: tagError } = await supabase
          .from('product_tags')
          .insert({
            product_id: productId,
            tag_id: tagId
          });
        
        if (tagError) {
          console.error(`   ❌ Error assigning tag "${tagSlug}":`, tagError.message);
          errors++;
        } else {
          console.log(`   🏷️  Assigned tag: "${tagSlug}"`);
          tagsAssigned++;
        }
      }
      
      console.log(''); // Empty line between products
    } catch (err) {
      console.error(`❌ Unexpected error processing "${item.name}":`, err.message);
      errors++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Products added: ${productsAdded}`);
  console.log(`⏭️  Products already existed: ${productsAlreadyExisted}`);
  console.log(`🏷️  Tags assigned: ${tagsAssigned}`);
  console.log(`❌ Errors: ${errors}`);
  console.log('='.repeat(50));
  console.log('\n💡 Next step: Run image enrichment script to add Spoonacular images:');
  console.log('   node scripts/enrich-images-spoonacular.js\n');
}

addCucumberSaladIngredients()
  .then(() => {
    console.log('✨ Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
