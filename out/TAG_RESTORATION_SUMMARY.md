# Tag System Restoration - Complete Package

## 📋 Summary

This package restores your database to use the **original 9-tag system** from your PostgreSQL backup instead of the expanded 16-tag system that was created.

### What's Included

1. **Product Inventory** - `current-products-with-original-tags.md`
   - Complete list of all 122 products in your database
   - Each product tagged according to original 9-tag system
   - Organized by category for easy reference

2. **SQL Migration** - `06_restore_original_tags.sql`
   - Clears all existing product-tag relationships
   - Removes current 16 tags
   - Restores original 9 tags from backup (IDs 1-8, 25)

3. **Tag Reassignment Script** - `scripts/reassign-original-tags.js`
   - Automatically assigns tags to all 122 products
   - Uses original tag system logic
   - Handles duplicates gracefully

4. **Complete Instructions** - `RESTORE_TAGS_README.md`
   - Step-by-step guide
   - Troubleshooting tips
   - Rollback instructions

## 🏷️ Original Tag System

### Aisle Tags (6)
- `fruit` - Fruits (banana, apple, orange, etc.)
- `vegetables` - Vegetables (tomato, onion, carrot, etc.)
- `meat-and-seafood` - Meats & Seafood (chicken, beef, salmon, etc.)
- `deli` - Deli items (ham, turkey breast)
- `dairy-and-eggs` - Dairy products (milk, cheese, eggs, etc.)
- `pantry` - Everything else (grains, spices, canned goods, frozen, snacks, bakery, etc.)

### Dietary Tags (2)
- `vegetarian` - Suitable for vegetarians
- `gluten-free` - Gluten-free products

### Special Tags (1)
- `organic` - Organic products (currently none tagged)

## 📦 Product Breakdown

- **Fruits:** 6 items (all tagged: fruit, vegetarian, gluten-free)
- **Vegetables:** 17 items (all tagged: vegetables, vegetarian, gluten-free)
- **Dairy & Eggs:** 12 items (all tagged: dairy-and-eggs, vegetarian)
- **Meat & Seafood:** 12 items (tagged: meat-and-seafood, most also gluten-free)
- **Pantry:** 70+ items (various combinations of pantry, vegetarian, gluten-free)

**Total:** 122 products with ~300+ tag assignments

## ⚡ Quick Start

### Run All Steps:

```bash
# Step 1: Review the product list
code out/current-products-with-original-tags.md

# Step 2: Open Supabase SQL Editor and run:
# Copy contents of out/06_restore_original_tags.sql
# Paste into: https://supabase.com/dashboard/project/xxcxpwhjnlvkiirvfrnm/sql

# Step 3: Reassign tags
source .env 2>/dev/null
export $(cut -d= -f1 .env 2>/dev/null | grep -v '^#')
node scripts/reassign-original-tags.js

# Step 4: Test locally
npm run dev

# Step 5: Deploy
git add -A
git commit -m "Restore original 9-tag system"
git push
netlify deploy --prod
```

## 🔍 Why Restore Original Tags?

### Problems with Current 16-Tag System
- ❌ Tags created didn't match original database
- ❌ Secondary tags (vegetables, protein, spices, oils) never existed
- ❌ More complex navigation (10 aisles vs 6)
- ❌ Inconsistent with backup data
- ❌ Scripts looking for non-existent tags failing

### Benefits of Original 9-Tag System
- ✅ Matches original database design
- ✅ Simpler navigation (6 clear aisle categories)
- ✅ Pantry as sensible catch-all for diverse items
- ✅ Proven tag structure from working system
- ✅ Easier to maintain and understand
- ✅ All products properly categorized

## 📊 Comparison

| Aspect | Current (16 Tags) | Original (9 Tags) |
|--------|-------------------|-------------------|
| Aisle Tags | 10 | 6 |
| Dietary Tags | 4 | 2 |
| Special Tags | 2 | 1 |
| Complexity | High | Low |
| Matches Backup | ❌ No | ✅ Yes |
| Navigation | Fragmented | Clear |
| Pantry Category | Narrow | Comprehensive |

## 🎯 Expected Results

After running the restoration:

### Database State
- ✅ 9 tags in `tags` table
- ✅ 122 products in `products` table
- ✅ ~300+ relationships in `product_tags` table
- ✅ All foreign keys and constraints intact

### Frontend Functionality
- ✅ Category pages work: `/category/fruit`, `/category/vegetables`, `/category/meat-and-seafood`, etc.
- ✅ Dietary filters work: vegetarian, gluten-free
- ✅ Product search functions correctly
- ✅ All 122 products browseable and searchable
- ✅ Cart and fridge operations work (with login)

### Category Navigation
The app will show 6 main categories:
1. **Fruit** - Fresh fruits
2. **Vegetables** - Fresh vegetables
3. **Meat & Seafood** - Fresh proteins
4. **Deli** - Deli counter items
5. **Dairy & Eggs** - Dairy products and eggs
6. **Pantry** - Everything else (grains, spices, canned, frozen, bakery, snacks, condiments)

## 🛠️ Technical Details

### SQL Script (`06_restore_original_tags.sql`)
```sql
-- Clears product_tags relationships
DELETE FROM public.product_tags;

-- Removes current tags
DELETE FROM public.tags;

-- Restores original 9 tags with correct IDs
INSERT INTO public.tags (id, name, type, slug) VALUES
(1, 'fruit', 'aisle', 'fruit'),
(2, 'vegetables', 'aisle', 'vegetables'),
(3, 'meat & seafood', 'aisle', 'meat-and-seafood'),
(4, 'deli', 'aisle', 'deli'),
(5, 'dairy & eggs', 'aisle', 'dairy-and-eggs'),
(25, 'pantry', 'aisle', 'pantry'),
(6, 'vegetarian', 'dietary', 'vegetarian'),
(7, 'gluten-free', 'dietary', 'gluten-free'),
(8, 'organic', 'special', 'organic');

-- Reset sequence
SELECT setval('public.tags_id_seq', 25, true);
```

### Node.js Script (`reassign-original-tags.js`)
- Processes all 122 products
- Looks up each product by name (case-insensitive)
- Assigns multiple tags per product based on mappings
- Handles duplicates gracefully
- Provides detailed progress output
- Summary statistics at end

## 📝 Notes

1. **Pantry is the Catch-All:** In the original system, `pantry` includes:
   - Grains & pasta
   - Baking supplies
   - Oils & fats
   - Canned goods
   - Spices & seasonings
   - Condiments
   - Bread products
   - Frozen foods
   - Snacks

2. **Multiple Tags:** Products can have multiple tags:
   - Rice: `pantry`, `vegetarian`, `gluten-free`
   - Turkey Breast: `meat-and-seafood`, `deli`, `gluten-free`
   - Vegetables: `vegetables`, `vegetarian`, `gluten-free`

3. **IDs Matter:** The script preserves original tag IDs (1-8, 25) to maintain consistency with backup.

4. **No Data Loss:** Products are NOT deleted, only tag relationships are reset.

## 🔄 Rollback Instructions

If you need to revert to the 16-tag system:

```bash
# Re-create 16 tags
node scripts/add-tags.js

# Re-assign tags (but old script won't work with original tags)
# You'd need to create a new tagging script or manually tag
```

## ✅ Validation Checklist

After restoration, verify:

- [ ] SQL script ran without errors
- [ ] Reassignment script completed successfully
- [ ] 9 tags exist in Supabase `tags` table
- [ ] ~300+ relationships in `product_tags` table
- [ ] Category pages load: fruit, vegetables, meat-and-seafood, deli, dairy-and-eggs, pantry
- [ ] Products display correctly in each category
- [ ] Dietary filters work (vegetarian, gluten-free)
- [ ] Product search returns results
- [ ] Cart add-to-cart works (with login)
- [ ] No console errors in browser
- [ ] Netlify deployment successful

## 🚀 Next Steps After Restoration

1. **Fix Meal Planning** - Run `05_fix_meal_plan_recipes.sql` to add user_id column
2. **Test All Features** - Cart, fridge, recipes, meal planning
3. **Add Organic Products** - Tag premium products with `organic` special tag
4. **Recipe Parsing** - Test recipe parser with Gemini API
5. **Production Deploy** - Push to Netlify production

## 📞 Support

If you encounter issues:
1. Check `RESTORE_TAGS_README.md` for troubleshooting
2. Verify all environment variables are set
3. Check Supabase SQL Editor for errors
4. Review console output from reassignment script

---

**Created:** February 6, 2026  
**Purpose:** Restore original 9-tag system from database backup  
**Status:** Ready to execute
