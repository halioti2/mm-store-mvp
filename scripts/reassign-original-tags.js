// Script to reassign all products with original 9 tags
// Based on current-products-with-original-tags.md

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Original tag slugs (9 tags total)
// Aisle: fruit, vegetables, meat-and-seafood, deli, dairy-and-eggs, pantry
// Dietary: vegetarian, gluten-free
// Special: organic

const productTagMappings = [
  // FRUITS - fruit, vegetarian, gluten-free
  { name: 'banana', tags: ['fruit', 'vegetarian', 'gluten-free'] },
  { name: 'apple', tags: ['fruit', 'vegetarian', 'gluten-free'] },
  { name: 'orange', tags: ['fruit', 'vegetarian', 'gluten-free'] },
  { name: 'lemon', tags: ['fruit', 'vegetarian', 'gluten-free'] },
  { name: 'lime', tags: ['fruit', 'vegetarian', 'gluten-free'] },
  { name: 'avocado', tags: ['fruit', 'vegetarian', 'gluten-free'] },
  
  // VEGETABLES - vegetables, vegetarian, gluten-free
  { name: 'tomato', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'potato', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'onion', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'red onion', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'carrot', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'lettuce', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'cucumber', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'bell pepper', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'red chilli', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'broccoli', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'cauliflower', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'spinach', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'baby spinach', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'celery', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'garlic', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'ginger', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  { name: 'mushroom', tags: ['vegetables', 'vegetarian', 'gluten-free'] },
  
  // DAIRY & EGGS - dairy-and-eggs, vegetarian
  { name: 'milk', tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'egg', tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'egg white', tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'butter', tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'cheese', tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'cheddar cheese', tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'mozzarella cheese', tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'american cheese', tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'yogurt', tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'sour cream', tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'cream cheese', tags: ['dairy-and-eggs', 'vegetarian'] },
  { name: 'heavy cream', tags: ['dairy-and-eggs', 'vegetarian'] },
  
  // MEAT & SEAFOOD - meat-and-seafood (no vegetarian/gluten-free)
  { name: 'chicken breast', tags: ['meat-and-seafood', 'gluten-free'] },
  { name: 'ground beef', tags: ['meat-and-seafood', 'gluten-free'] },
  { name: 'ground turkey', tags: ['meat-and-seafood', 'gluten-free'] },
  { name: 'bacon', tags: ['meat-and-seafood', 'gluten-free'] },
  { name: 'sausage', tags: ['meat-and-seafood'] },
  { name: 'pork sausage', tags: ['meat-and-seafood'] },
  { name: 'pork chop', tags: ['meat-and-seafood', 'gluten-free'] },
  { name: 'salmon', tags: ['meat-and-seafood', 'gluten-free'] },
  { name: 'shrimp', tags: ['meat-and-seafood', 'gluten-free'] },
  { name: 'tuna', tags: ['meat-and-seafood', 'gluten-free'] },
  { name: 'turkey breast', tags: ['meat-and-seafood', 'deli', 'gluten-free'] },
  { name: 'ham', tags: ['meat-and-seafood', 'deli', 'gluten-free'] },
  
  // PANTRY - Grains & Pasta
  { name: 'rice', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'pasta', tags: ['pantry', 'vegetarian'] },
  { name: 'flour', tags: ['pantry', 'vegetarian'] },
  { name: 'oatmeal', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  
  // PANTRY - Baking & Sugar
  { name: 'sugar', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'brown sugar', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'honey', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'maple syrup', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'pancake mix', tags: ['pantry', 'vegetarian'] },
  
  // PANTRY - Oils & Fats
  { name: 'olive oil', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'vegetable oil', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'canola oil', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  
  // PANTRY - Canned Goods
  { name: 'canned tomato', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'whole tomatoes', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'tomato sauce', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'tomato paste', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'chicken broth', tags: ['pantry', 'gluten-free'] },
  { name: 'beef broth', tags: ['pantry', 'gluten-free'] },
  { name: 'vegetable broth', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'black bean', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'kidney bean', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'chickpea', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'chickpeas', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'corn', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  
  // PANTRY - Spices & Seasonings
  { name: 'salt', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'kosher salt', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'sea salt', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'black pepper', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'white pepper', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'oregano', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'basil', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'thyme', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'rosemary', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'cumin', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'ground cumin', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'paprika', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'smoked paprika', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'chili powder', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'cinnamon', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'parsley', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'cilantro', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'garlic powder', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'onion powder', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'italian seasoning', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'cayenne pepper', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  
  // PANTRY - International/Specialty
  { name: 'gochujang', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  
  // PANTRY - Condiments
  { name: 'ketchup', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'mustard', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'mayonnaise', tags: ['pantry', 'vegetarian'] },
  { name: 'soy sauce', tags: ['pantry', 'vegetarian'] },
  { name: 'hot sauce', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'bbq sauce', tags: ['pantry'] },
  { name: 'salsa', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'ranch dressing', tags: ['pantry', 'vegetarian'] },
  { name: 'italian dressing', tags: ['pantry', 'vegetarian'] },
  { name: 'sugar-free syrup', tags: ['pantry', 'vegetarian'] },
  
  // PANTRY - Spreads
  { name: 'peanut butter', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'jam', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  
  // PANTRY - Bakery (bread products)
  { name: 'bread', tags: ['pantry', 'vegetarian'] },
  { name: 'whole wheat bread', tags: ['pantry', 'vegetarian'] },
  { name: 'bagel', tags: ['pantry', 'vegetarian'] },
  { name: 'tortilla', tags: ['pantry', 'vegetarian'] },
  { name: 'pita bread', tags: ['pantry', 'vegetarian'] },
  { name: 'english muffin', tags: ['pantry', 'vegetarian'] },
  
  // PANTRY - Frozen Foods
  { name: 'frozen peas', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'frozen corn', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'frozen broccoli', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'frozen mixed vegetables', tags: ['pantry', 'vegetarian', 'gluten-free'] },
  { name: 'ice cream', tags: ['pantry', 'vegetarian'] },
  { name: 'frozen pizza', tags: ['pantry'] },
  
  // PANTRY - Snacks
  { name: 'crackers', tags: ['pantry', 'vegetarian'] },
  { name: 'chips', tags: ['pantry', 'vegetarian'] },
  { name: 'cereal', tags: ['pantry', 'vegetarian'] }
];

async function reassignProductTags() {
  console.log('🏷️  Reassigning product tags with original 9-tag system...\n');

  let successCount = 0;
  let errorCount = 0;
  let notFoundCount = 0;

  for (const mapping of productTagMappings) {
    try {
      // Find the product by name (case-insensitive)
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', mapping.name)
        .single();

      if (productError || !product) {
        console.log(`⚠️  Product "${mapping.name}" not found`);
        notFoundCount++;
        continue;
      }

      console.log(`\n📦 Processing: ${product.name} (ID: ${product.id})`);

      // Assign each tag
      for (const tagSlug of mapping.tags) {
        // Get the tag ID
        const { data: tag, error: tagError } = await supabase
          .from('tags')
          .select('id, name')
          .eq('slug', tagSlug)
          .single();

        if (tagError || !tag) {
          console.log(`   ❌ Tag "${tagSlug}" not found in database`);
          continue;
        }

        // Insert the product_tag relationship
        const { error: insertError } = await supabase
          .from('product_tags')
          .insert({
            product_id: product.id,
            tag_id: tag.id
          });

        if (insertError) {
          // Ignore duplicate key errors (already exists)
          if (insertError.code === '23505') {
            console.log(`   ⏭️  Tag "${tag.name}" already assigned`);
          } else {
            console.log(`   ❌ Error assigning tag "${tag.name}":`, insertError.message);
            errorCount++;
          }
        } else {
          console.log(`   ✅ Assigned tag: ${tag.name}`);
          successCount++;
        }
      }
    } catch (err) {
      console.error(`❌ Error processing "${mapping.name}":`, err.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 REASSIGNMENT SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Tags assigned: ${successCount}`);
  console.log(`⚠️  Products not found: ${notFoundCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📦 Total products processed: ${productTagMappings.length}`);
  console.log('='.repeat(50) + '\n');
}

reassignProductTags().catch(console.error);
