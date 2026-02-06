// Script to add items to fridge using service role (bypassing auth)

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

  // Get the first user from auth.users
  const { data: users, error: userError } = await supabase
    .from('auth.users')
    .select('id, email')
    .limit(1);

  if (userError) {
    // Try querying using the SQL query instead
    const { data: userData, error: sqlError } = await supabase
      .rpc('get_first_user');
    
    if (sqlError) {
      console.log('⚠️  No users found. Please provide a user ID or create an account first.');
      console.log('You can still add items by manually specifying a user_id in the script.\n');
      
      // For now, let\'s just create a test user ID
      console.log('Using a placeholder UUID for demonstration...\n');
    }
  }

  // Let's just get any existing user from fridge_items or cart_items
  const { data: existingFridgeItems } = await supabase
    .from('fridge_items')
    .select('user_id')
    .limit(1)
    .single();

  let userId = existingFridgeItems?.user_id;

  if (!userId) {
    console.log('⚠️  No existing user found. Creating items without user context.');
    console.log('Please log in to the app and then items will be associated with your account.\n');
    return;
  }

  console.log(`👤 Using User ID: ${userId}\n`);

  let addedCount = 0;
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

      // Check if item already exists in fridge
      const { data: existing } = await supabase
        .from('fridge_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .single();

      if (existing) {
        // Update quantity
        const { error: updateError } = await supabase
          .from('fridge_items')
          .update({ quantity: item.quantity })
          .eq('user_id', userId)
          .eq('product_id', product.id);

        if (updateError) {
          console.error(`❌ Error updating "${product.name}":`, updateError.message);
          errorCount++;
        } else {
          console.log(`🔄 Updated: ${product.name} (qty: ${item.quantity})`);
          addedCount++;
        }
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('fridge_items')
          .insert({
            user_id: userId,
            product_id: product.id,
            quantity: item.quantity
          });

        if (insertError) {
          console.error(`❌ Error adding "${product.name}":`, insertError.message);
          errorCount++;
        } else {
          console.log(`✅ Added: ${product.name} (qty: ${item.quantity})`);
          addedCount++;
        }
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
