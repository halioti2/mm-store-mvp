-- Script to add cucumber salad ingredients
-- Run this in Supabase SQL Editor

-- Insert new products (using conditional insert to skip if they already exist)
INSERT INTO products (name, price, image_url)
SELECT 'mini cucumbers', 3.99, NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'mini cucumbers');

INSERT INTO products (name, price, image_url)
SELECT 'seasoned rice vinegar', 3.49, NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'seasoned rice vinegar');

INSERT INTO products (name, price, image_url)
SELECT 'hot honey', 8.99, NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'hot honey');

INSERT INTO products (name, price, image_url)
SELECT 'sesame oil', 5.99, NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'sesame oil');

INSERT INTO products (name, price, image_url)
SELECT 'fish sauce', 4.49, NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'fish sauce');

INSERT INTO products (name, price, image_url)
SELECT 'red pepper flakes', 2.99, NULL
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'red pepper flakes');

-- Get product IDs for tag assignment
-- (We'll use these to create the product_tags relationships)

-- First, let's see which products we need to tag
DO $$
DECLARE
  v_mini_cucumbers_id INTEGER;
  v_salt_id INTEGER;
  v_red_onion_id INTEGER;
  v_seasoned_rice_vinegar_id INTEGER;
  v_hot_honey_id INTEGER;
  v_soy_sauce_id INTEGER;
  v_sesame_oil_id INTEGER;
  v_fish_sauce_id INTEGER;
  v_garlic_id INTEGER;
  v_red_pepper_flakes_id INTEGER;
  
  v_vegetables_tag INTEGER;
  v_vegetarian_tag INTEGER;
  v_gluten_free_tag INTEGER;
  v_pantry_tag INTEGER;
BEGIN
  -- Get product IDs
  SELECT id INTO v_mini_cucumbers_id FROM products WHERE name = 'mini cucumbers';
  SELECT id INTO v_salt_id FROM products WHERE name = 'salt';
  SELECT id INTO v_red_onion_id FROM products WHERE name = 'red onion';
  SELECT id INTO v_seasoned_rice_vinegar_id FROM products WHERE name = 'seasoned rice vinegar';
  SELECT id INTO v_hot_honey_id FROM products WHERE name = 'hot honey';
  SELECT id INTO v_soy_sauce_id FROM products WHERE name = 'soy sauce';
  SELECT id INTO v_sesame_oil_id FROM products WHERE name = 'sesame oil';
  SELECT id INTO v_fish_sauce_id FROM products WHERE name = 'fish sauce';
  SELECT id INTO v_garlic_id FROM products WHERE name = 'garlic';
  SELECT id INTO v_red_pepper_flakes_id FROM products WHERE name = 'red pepper flakes';
  
  -- Get tag IDs
  SELECT id INTO v_vegetables_tag FROM tags WHERE slug = 'vegetables';
  SELECT id INTO v_vegetarian_tag FROM tags WHERE slug = 'vegetarian';
  SELECT id INTO v_gluten_free_tag FROM tags WHERE slug = 'gluten-free';
  SELECT id INTO v_pantry_tag FROM tags WHERE slug = 'pantry';
  
  -- Assign tags to mini cucumbers (vegetables, vegetarian, gluten-free)
  IF v_mini_cucumbers_id IS NOT NULL THEN
    INSERT INTO product_tags (product_id, tag_id) VALUES
      (v_mini_cucumbers_id, v_vegetables_tag),
      (v_mini_cucumbers_id, v_vegetarian_tag),
      (v_mini_cucumbers_id, v_gluten_free_tag)
    ON CONFLICT (product_id, tag_id) DO NOTHING;
  END IF;
  
  -- Assign tags to salt (pantry, vegetarian, gluten-free)
  IF v_salt_id IS NOT NULL THEN
    INSERT INTO product_tags (product_id, tag_id) VALUES
      (v_salt_id, v_pantry_tag),
      (v_salt_id, v_vegetarian_tag),
      (v_salt_id, v_gluten_free_tag)
    ON CONFLICT (product_id, tag_id) DO NOTHING;
  END IF;
  
  -- Assign tags to red onion (vegetables, vegetarian, gluten-free)
  IF v_red_onion_id IS NOT NULL THEN
    INSERT INTO product_tags (product_id, tag_id) VALUES
      (v_red_onion_id, v_vegetables_tag),
      (v_red_onion_id, v_vegetarian_tag),
      (v_red_onion_id, v_gluten_free_tag)
    ON CONFLICT (product_id, tag_id) DO NOTHING;
  END IF;
  
  -- Assign tags to seasoned rice vinegar (pantry, vegetarian, gluten-free)
  IF v_seasoned_rice_vinegar_id IS NOT NULL THEN
    INSERT INTO product_tags (product_id, tag_id) VALUES
      (v_seasoned_rice_vinegar_id, v_pantry_tag),
      (v_seasoned_rice_vinegar_id, v_vegetarian_tag),
      (v_seasoned_rice_vinegar_id, v_gluten_free_tag)
    ON CONFLICT (product_id, tag_id) DO NOTHING;
  END IF;
  
  -- Assign tags to hot honey (pantry, vegetarian, gluten-free)
  IF v_hot_honey_id IS NOT NULL THEN
    INSERT INTO product_tags (product_id, tag_id) VALUES
      (v_hot_honey_id, v_pantry_tag),
      (v_hot_honey_id, v_vegetarian_tag),
      (v_hot_honey_id, v_gluten_free_tag)
    ON CONFLICT (product_id, tag_id) DO NOTHING;
  END IF;
  
  -- Assign tags to soy sauce (pantry, vegetarian)
  -- Note: Traditional soy sauce contains gluten from wheat
  IF v_soy_sauce_id IS NOT NULL THEN
    INSERT INTO product_tags (product_id, tag_id) VALUES
      (v_soy_sauce_id, v_pantry_tag),
      (v_soy_sauce_id, v_vegetarian_tag)
    ON CONFLICT (product_id, tag_id) DO NOTHING;
  END IF;
  
  -- Assign tags to sesame oil (pantry, vegetarian, gluten-free)
  IF v_sesame_oil_id IS NOT NULL THEN
    INSERT INTO product_tags (product_id, tag_id) VALUES
      (v_sesame_oil_id, v_pantry_tag),
      (v_sesame_oil_id, v_vegetarian_tag),
      (v_sesame_oil_id, v_gluten_free_tag)
    ON CONFLICT (product_id, tag_id) DO NOTHING;
  END IF;
  
  -- Assign tags to fish sauce (pantry, gluten-free)
  -- Note: Fish sauce is not vegetarian
  IF v_fish_sauce_id IS NOT NULL THEN
    INSERT INTO product_tags (product_id, tag_id) VALUES
      (v_fish_sauce_id, v_pantry_tag),
      (v_fish_sauce_id, v_gluten_free_tag)
    ON CONFLICT (product_id, tag_id) DO NOTHING;
  END IF;
  
  -- Assign tags to garlic (vegetables, vegetarian, gluten-free)
  IF v_garlic_id IS NOT NULL THEN
    INSERT INTO product_tags (product_id, tag_id) VALUES
      (v_garlic_id, v_vegetables_tag),
      (v_garlic_id, v_vegetarian_tag),
      (v_garlic_id, v_gluten_free_tag)
    ON CONFLICT (product_id, tag_id) DO NOTHING;
  END IF;
  
  -- Assign tags to red pepper flakes (pantry, vegetarian, gluten-free)
  IF v_red_pepper_flakes_id IS NOT NULL THEN
    INSERT INTO product_tags (product_id, tag_id) VALUES
      (v_red_pepper_flakes_id, v_pantry_tag),
      (v_red_pepper_flakes_id, v_vegetarian_tag),
      (v_red_pepper_flakes_id, v_gluten_free_tag)
    ON CONFLICT (product_id, tag_id) DO NOTHING;
  END IF;
  
  RAISE NOTICE 'Cucumber salad ingredients added successfully!';
END $$;

-- Verify the additions
SELECT 
  p.id,
  p.name,
  p.price,
  STRING_AGG(t.name, ', ' ORDER BY t.name) as tags
FROM products p
LEFT JOIN product_tags pt ON p.id = pt.product_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.name IN (
  'mini cucumbers',
  'salt',
  'red onion',
  'seasoned rice vinegar',
  'hot honey',
  'soy sauce',
  'sesame oil',
  'fish sauce',
  'garlic',
  'red pepper flakes'
)
GROUP BY p.id, p.name, p.price
ORDER BY p.name;
