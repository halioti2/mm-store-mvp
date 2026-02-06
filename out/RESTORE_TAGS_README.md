# Restore Original Tag System - Instructions

This guide will restore your database to use the original 9-tag system from the database backup instead of the expanded 16-tag system.

## Overview

**Current State:** 16 tags (10 aisle, 4 dietary, 2 special)  
**Target State:** 9 tags (6 aisle, 2 dietary, 1 special)

### Original 9 Tags
1. **Aisle Tags (6):**
   - `fruit` - Fruits section
   - `vegetables` - Vegetables section
   - `meat-and-seafood` - Meat & Seafood section
   - `deli` - Deli counter items
   - `dairy-and-eggs` - Dairy & Eggs section
   - `pantry` - Pantry/dry goods (everything else)

2. **Dietary Tags (2):**
   - `vegetarian` - Suitable for vegetarians
   - `gluten-free` - Gluten-free products

3. **Special Tags (1):**
   - `organic` - Organic products

## Files Created

1. **`current-products-with-original-tags.md`** - Complete list of 122 products tagged with original system
2. **`06_restore_original_tags.sql`** - SQL script to clear and restore original tags
3. **`scripts/reassign-original-tags.js`** - Node.js script to reassign all product tags

## Step-by-Step Instructions

### Step 1: Review the Product List

Open `out/current-products-with-original-tags.md` to see how all 122 products will be tagged:

```bash
code out/current-products-with-original-tags.md
```

### Step 2: Run SQL Script in Supabase

1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/xxcxpwhjnlvkiirvfrnm/sql
2. Copy the contents of `out/06_restore_original_tags.sql`
3. Paste and run the script

This will:
- ✅ Delete all product-tag relationships
- ✅ Delete all current tags (16 tags)
- ✅ Insert original 9 tags from backup
- ✅ Reset the tag ID sequence

### Step 3: Reassign Product Tags

Run the Node.js script to reassign all products with their original tags:

```bash
source .env 2>/dev/null
export $(cut -d= -f1 .env 2>/dev/null | grep -v '^#')
node scripts/reassign-original-tags.js
```

**Expected Output:**
```
🏷️  Reassigning product tags with original 9-tag system...

📦 Processing: banana (ID: 1)
   ✅ Assigned tag: fruit
   ✅ Assigned tag: vegetarian
   ✅ Assigned tag: gluten-free

...

📊 REASSIGNMENT SUMMARY
==================================================
✅ Tags assigned: ~300+
⚠️  Products not found: 0
❌ Errors: 0
📦 Total products processed: 122
==================================================
```

### Step 4: Verify the Changes

Check your application to ensure:
- Category navigation works (fruit, vegetables, meat-and-seafood, deli, dairy-and-eggs, pantry)
- Dietary filters work (vegetarian, gluten-free)
- All 122 products are properly tagged
- Product search still functions correctly

### Step 5: Deploy to Netlify

Once verified locally, deploy to production:

```bash
git add -A
git commit -m "Restore original 9-tag system from database backup"
git push
netlify deploy --prod
```

## Tag Assignment Logic

The script uses the following logic:

### Fruits
- Tags: `fruit`, `vegetarian`, `gluten-free`
- Examples: banana, apple, orange, lemon, avocado

### Vegetables
- Tags: `vegetables`, `vegetarian`, `gluten-free`
- Examples: tomato, onion, carrot, lettuce, broccoli, garlic

### Dairy & Eggs
- Tags: `dairy-and-eggs`, `vegetarian`
- Examples: milk, egg, butter, cheese, yogurt

### Meat & Seafood
- Tags: `meat-and-seafood`, `gluten-free` (most items)
- Some items also tagged with `deli` (ham, turkey breast)
- Examples: chicken, beef, turkey, salmon, bacon

### Pantry (Everything Else)
- Tags: `pantry`, plus `vegetarian` and/or `gluten-free` where applicable
- Includes:
  - Grains & pasta (rice, pasta, flour)
  - Baking supplies (sugar, honey, syrup)
  - Oils & fats (olive oil, vegetable oil)
  - Canned goods (tomatoes, beans, broth)
  - Spices & seasonings (salt, pepper, herbs)
  - Condiments (ketchup, mustard, soy sauce)
  - Bread products (bread, bagels, tortillas)
  - Frozen foods (frozen vegetables, ice cream)
  - Snacks (crackers, chips, cereal)

## Troubleshooting

### Products Not Found
If any products are not found, they may need to be added manually:
```sql
INSERT INTO products (name, price) VALUES ('missing product', 1.99);
```

### Tags Not Found
If any tags are missing, re-run Step 2 to restore the original tags.

### Relationship Errors
If you see duplicate key errors during reassignment, this is normal - it means the relationship already exists.

## Rollback (if needed)

If you need to go back to the 16-tag system:

1. Re-run `scripts/add-tags.js` to restore 16 tags
2. Re-run `scripts/assign-product-tags.js` to reassign tags

## Benefits of Original System

- **Simpler navigation:** Only 6 aisle categories instead of 10
- **Consistent with original design:** Matches the database backup
- **Easier maintenance:** Fewer tag relationships to manage
- **Better UX:** Pantry as catch-all category for diverse items

## Next Steps

After restoring tags, you may want to:
1. Run `out/05_fix_meal_plan_recipes.sql` to enable meal planning
2. Test all features (cart, fridge, recipes, search)
3. Add organic products and tag them with `organic` special tag
