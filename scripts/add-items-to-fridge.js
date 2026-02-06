// Script to add items to fridge for testing

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get the authenticated user
async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    console.error('❌ Not authenticated. Please log in first.');
    process.exit(1);
  }
  return user;
}

// Items to add to fridge (with product names and quantities)
const fridgeItems = [
  // Chicken wing ingredients
  { name: 'chicken wings', quantity: 2 },
  { name: 'butter', quantity: 1 },
  { name: 'garlic', quantity: 3 },
  { name: 'hot sauce', quantity: 1 },
  { name: 'buttermilk', quantity: 1 },
  { name: 'fresh dill', quantity: 1 },
  { name: 'fresh chives', quantity: 1 },
  
  // Random other items
  { name: 'milk', quantity: 2 },
  { name: 'egg', quantity: 12 },
  { name: 'cheese', quantity: 1 },
  { name: 'chicken breast', quantity: 2 },
  { name: 'broccoli', quantity: 1 },
  { name: 'carrot', quantity: 5 },
  { name: 'onion', quantity: 3 },
  { name: 'tomato', quantity: 4 },
  { name: 'lettuce', quantity: 1 },
  { name: 'bacon', quantity: 1 },
  { name: 'yogurt', quantity: 4 },
  { name: 'bell pepper', quantity: 2 },
  { name: 'avocado', quantity: 3 }
];

async function addItemsToFridge() {
  console.log('🧊 Adding items to your fridge...\n');

  // Get current user
  const user = await getCurrentUser();
  console.log(`👤 User ID: ${user.id}\n`);

  let addedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const item of fridgeItems) {
    try {
      // Find the product
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', item.name)
        .single();

      if (productError || !product) {
        console.log(`⚠️  Product "${item.name}" not found in database`);
        errorCount++;
        continue;
      }

      // Use the upsert_fridge_item function
      const { data, error } = await supabase
        .rpc('upsert_fridge_item', {
          p_user_id: user.id,
          p_product_id: product.id,
          p_quantity: item.quantity
        });

      if (error) {
        console.error(`❌ Error adding "${product.name}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Added/Updated: ${product.name} (qty: ${item.quantity})`);
        addedCount++;
      }
    } catch (err) {
      console.error(`❌ Error processing "${item.name}":`, err.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Items added/updated: ${addedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📦 Total items processed: ${fridgeItems.length}`);
  console.log('='.repeat(50) + '\n');
  console.log('🧊 Your fridge is now stocked!');
}

addItemsToFridge().catch(console.error);
