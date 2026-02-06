# 🚀 QUICK START - Restore Original Tags

## What You're Doing
Restoring the original 9-tag system from your database backup (replacing the current 16-tag system).

## Three Simple Steps

### 1️⃣ Run SQL Script (1 minute)

Open Supabase SQL Editor:
👉 https://supabase.com/dashboard/project/xxcxpwhjnlvkiirvfrnm/sql

Copy and paste the entire contents of:
📄 `out/06_restore_original_tags.sql`

Click **RUN** ▶️

Expected: ✅ Success message, clears old tags, adds 9 original tags

---

### 2️⃣ Run Node.js Script (1 minute)

In your terminal:

```bash
source .env 2>/dev/null && export $(cut -d= -f1 .env 2>/dev/null | grep -v '^#') && node scripts/reassign-original-tags.js
```

Expected: ✅ See ~300+ tags being assigned to 122 products

---

### 3️⃣ Test & Deploy (2 minutes)

```bash
# Test locally
npm run dev
# Visit http://localhost:5175 and check categories

# Deploy to production
git add -A
git commit -m "Restore original 9-tag system"
git push
netlify deploy --prod
```

---

## ✅ That's It!

You now have:
- ✅ 9 tags (instead of 16)
- ✅ 122 products properly tagged
- ✅ 6 clear category pages
- ✅ 2 dietary filters
- ✅ Simpler, cleaner system

## 📚 More Info

- **Full Instructions:** `out/RESTORE_TAGS_README.md`
- **Complete Guide:** `out/TAG_RESTORATION_SUMMARY.md`
- **Product List:** `out/current-products-with-original-tags.md`

## ❓ Problems?

Check the detailed troubleshooting in `RESTORE_TAGS_README.md`

---

**Total Time:** ~4 minutes  
**Difficulty:** Easy (copy, paste, run)  
**Risk:** None (products not deleted, can rollback)
