-- ============================================
-- Restore Original Tag System
-- ============================================
-- This script:
-- 1. Clears all product_tags relationships
-- 2. Deletes current tags
-- 3. Restores original 9 tags from backup
-- 4. Will be followed by a Node.js script to reassign product tags
-- ============================================

-- Step 1: Clear all product-tag relationships
DELETE FROM public.product_tags;

-- Step 2: Delete all current tags
DELETE FROM public.tags;

-- Step 3: Restore original 9 tags from database backup
-- Original tag data from schema/db_cluster-28-07-2025@02-32-30.backup lines 3828-3850

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

-- Reset the sequence for tags id to start after 25
SELECT setval('public.tags_id_seq', 25, true);

-- ============================================
-- COMPLETE!
-- ============================================
-- Next step: Run the Node.js script to reassign product tags
-- based on current-products-with-original-tags.md
