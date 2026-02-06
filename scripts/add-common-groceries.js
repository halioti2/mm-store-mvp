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

// 100 most common grocery items with realistic prices
const groceries = [
  // Produce
  { name: "banana", price: 0.59 },
  { name: "apple", price: 1.49 },
  { name: "orange", price: 1.29 },
  { name: "tomato", price: 1.99 },
  { name: "potato", price: 0.89 },
  { name: "onion", price: 1.29 },
  { name: "carrot", price: 1.49 },
  { name: "lettuce", price: 2.49 },
  { name: "cucumber", price: 1.29 },
  { name: "bell pepper", price: 2.29 },
  { name: "broccoli", price: 2.99 },
  { name: "cauliflower", price: 3.49 },
  { name: "spinach", price: 2.99 },
  { name: "celery", price: 2.49 },
  { name: "garlic", price: 0.99 },
  { name: "ginger", price: 3.99 },
  { name: "mushroom", price: 3.99 },
  { name: "avocado", price: 1.99 },
  { name: "lemon", price: 0.79 },
  { name: "lime", price: 0.69 },
  
  // Dairy & Eggs
  { name: "milk", price: 3.99 },
  { name: "egg", price: 4.99 },
  { name: "butter", price: 4.49 },
  { name: "cheese", price: 5.99 },
  { name: "cheddar cheese", price: 6.49 },
  { name: "mozzarella cheese", price: 5.99 },
  { name: "yogurt", price: 4.99 },
  { name: "sour cream", price: 3.49 },
  { name: "cream cheese", price: 3.99 },
  { name: "heavy cream", price: 4.99 },
  
  // Meat & Protein
  { name: "chicken breast", price: 8.99 },
  { name: "ground beef", price: 6.99 },
  { name: "bacon", price: 7.99 },
  { name: "sausage", price: 5.99 },
  { name: "pork chop", price: 9.99 },
  { name: "salmon", price: 14.99 },
  { name: "shrimp", price: 12.99 },
  { name: "tuna", price: 3.99 },
  { name: "turkey breast", price: 9.99 },
  { name: "ham", price: 8.99 },
  
  // Pantry Staples
  { name: "rice", price: 3.99 },
  { name: "pasta", price: 2.49 },
  { name: "flour", price: 3.49 },
  { name: "sugar", price: 2.99 },
  { name: "brown sugar", price: 3.49 },
  { name: "salt", price: 1.99 },
  { name: "black pepper", price: 4.99 },
  { name: "olive oil", price: 9.99 },
  { name: "vegetable oil", price: 6.99 },
  { name: "canola oil", price: 5.99 },
  
  // Canned & Jarred
  { name: "canned tomato", price: 1.99 },
  { name: "tomato sauce", price: 2.49 },
  { name: "tomato paste", price: 1.79 },
  { name: "chicken broth", price: 2.99 },
  { name: "beef broth", price: 3.49 },
  { name: "vegetable broth", price: 2.99 },
  { name: "black bean", price: 1.49 },
  { name: "kidney bean", price: 1.49 },
  { name: "chickpea", price: 1.99 },
  { name: "corn", price: 1.29 },
  
  // Bread & Bakery
  { name: "bread", price: 3.49 },
  { name: "whole wheat bread", price: 4.49 },
  { name: "bagel", price: 4.99 },
  { name: "tortilla", price: 3.99 },
  { name: "pita bread", price: 3.49 },
  { name: "english muffin", price: 3.99 },
  
  // Condiments & Sauces
  { name: "ketchup", price: 3.49 },
  { name: "mustard", price: 2.99 },
  { name: "mayonnaise", price: 4.99 },
  { name: "soy sauce", price: 3.99 },
  { name: "hot sauce", price: 3.49 },
  { name: "bbq sauce", price: 3.99 },
  { name: "salsa", price: 3.99 },
  { name: "ranch dressing", price: 4.49 },
  { name: "italian dressing", price: 3.99 },
  
  // Spices & Herbs
  { name: "oregano", price: 3.99 },
  { name: "basil", price: 3.49 },
  { name: "thyme", price: 3.99 },
  { name: "rosemary", price: 3.99 },
  { name: "cumin", price: 4.49 },
  { name: "paprika", price: 3.99 },
  { name: "chili powder", price: 4.49 },
  { name: "cinnamon", price: 4.99 },
  { name: "parsley", price: 2.99 },
  { name: "cilantro", price: 2.49 },
  
  // Frozen Foods
  { name: "frozen peas", price: 2.99 },
  { name: "frozen corn", price: 2.49 },
  { name: "frozen broccoli", price: 2.99 },
  { name: "frozen mixed vegetables", price: 3.49 },
  { name: "ice cream", price: 5.99 },
  { name: "frozen pizza", price: 6.99 },
  
  // Snacks & Misc
  { name: "peanut butter", price: 4.99 },
  { name: "jam", price: 3.99 },
  { name: "honey", price: 6.99 },
  { name: "maple syrup", price: 8.99 },
  { name: "crackers", price: 3.99 },
  { name: "chips", price: 3.99 },
  { name: "cereal", price: 4.99 },
  { name: "oatmeal", price: 4.49 }
];

async function addGroceries() {
  console.log("🛒 Starting to add 100 common grocery items...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const item of groceries) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: item.name,
            price: item.price,
            image_url: null // Empty so it can be enriched later
          }
        ])
        .select();

      if (error) {
        console.error(`❌ Failed to add "${item.name}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Added: ${item.name} ($${item.price})`);
        successCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (err) {
      console.error(`❌ Error adding "${item.name}":`, err.message);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`📊 Summary:`);
  console.log(`   ✅ Successfully added: ${successCount} products`);
  console.log(`   ❌ Failed: ${errorCount} products`);
  console.log(`   📦 Total: ${groceries.length} products`);
  console.log("=".repeat(50));
  console.log("\n💡 Next step: Run 'node scripts/enrich-images-spoonacular.js' to add images!");
}

addGroceries();
