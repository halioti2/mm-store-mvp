# Tag Restoration Files - Index

## 🎯 Start Here

If you just want to get started quickly: **[QUICKSTART.md](./QUICKSTART.md)**

## 📚 Documentation Files

### 1. QUICKSTART.md ⚡
**For:** Users who want the fastest path  
**Contains:** 3-step quick start guide  
**Time:** 4 minutes

### 2. RESTORE_TAGS_README.md 📖
**For:** Users who want detailed instructions  
**Contains:** 
- Step-by-step guide with explanations
- Troubleshooting section
- Rollback instructions
- Validation checklist

### 3. TAG_RESTORATION_SUMMARY.md 📊
**For:** Users who want complete technical overview  
**Contains:**
- Full comparison of old vs new systems
- Technical implementation details
- Benefits and rationale
- Complete reference guide

### 4. current-products-with-original-tags.md 📄
**For:** Reference - see all products and their tags  
**Contains:**
- All 122 products organized by category
- Tag assignments for each product
- Price information
- Categorization logic

## 🛠️ Implementation Files

### 5. 06_restore_original_tags.sql 🗄️
**Type:** SQL Script  
**Run in:** Supabase SQL Editor  
**Purpose:** Clear current tags and restore original 9 tags  
**Execution:** Copy/paste and run

### 6. scripts/reassign-original-tags.js ⚙️
**Type:** Node.js Script  
**Run via:** Terminal command  
**Purpose:** Reassign all 122 products with original tags  
**Execution:** `node scripts/reassign-original-tags.js`

## 📋 File Structure

```
out/
├── QUICKSTART.md                          ← START HERE
├── RESTORE_TAGS_README.md                 ← Detailed instructions
├── TAG_RESTORATION_SUMMARY.md             ← Technical overview
├── current-products-with-original-tags.md ← Product inventory
├── 06_restore_original_tags.sql           ← SQL to run in Supabase
└── INDEX.md                               ← This file

scripts/
└── reassign-original-tags.js              ← Node.js tagging script
```

## 🔄 Recommended Reading Order

1. **First time?** Start with `QUICKSTART.md`
2. **Want details?** Read `RESTORE_TAGS_README.md`
3. **Need full context?** Check `TAG_RESTORATION_SUMMARY.md`
4. **Curious about products?** Browse `current-products-with-original-tags.md`

## 🚀 Execution Order

```bash
# Step 1: Run SQL in Supabase
# File: 06_restore_original_tags.sql
# Location: https://supabase.com/dashboard/project/xxcxpwhjnlvkiirvfrnm/sql

# Step 2: Run Node.js script
source .env 2>/dev/null && \
export $(cut -d= -f1 .env 2>/dev/null | grep -v '^#') && \
node scripts/reassign-original-tags.js

# Step 3: Test and deploy
npm run dev
git add -A && git commit -m "Restore original 9-tag system" && git push
netlify deploy --prod
```

## ❓ Quick Reference

**Original Tags (9):**
- Aisle: `fruit`, `vegetables`, `meat-and-seafood`, `deli`, `dairy-and-eggs`, `pantry`
- Dietary: `vegetarian`, `gluten-free`
- Special: `organic`

**Products:** 122 total  
**Tag Assignments:** ~300+  
**Time to Complete:** ~4 minutes  
**Risk Level:** Low (no products deleted, can rollback)

## 🆘 Need Help?

1. Check troubleshooting in `RESTORE_TAGS_README.md`
2. Verify environment variables are set
3. Check Supabase SQL Editor for error messages
4. Review console output from Node.js script

## ✅ Success Criteria

After running both scripts, you should have:
- ✅ 9 tags in Supabase `tags` table
- ✅ 122 products in `products` table (unchanged)
- ✅ ~300+ relationships in `product_tags` table
- ✅ Category pages work: fruit, vegetables, meat-and-seafood, deli, dairy-and-eggs, pantry
- ✅ Filters work: vegetarian, gluten-free
- ✅ No console errors

---

**Created:** February 6, 2026  
**Package Version:** 1.0  
**Status:** Ready to use
