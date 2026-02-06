-- Complete Database Setup for Supabase
-- This includes tables, constraints, foreign keys, and RLS policies

-- ============================================
-- CONSTRAINTS AND PRIMARY KEYS
-- ============================================

-- Products table constraints
ALTER TABLE public.products ADD CONSTRAINT products_pkey PRIMARY KEY (id);

-- Tags table constraints  
ALTER TABLE public.tags ADD CONSTRAINT tags_pkey PRIMARY KEY (id);

-- Product_tags table constraints
ALTER TABLE public.product_tags 
  ADD CONSTRAINT product_tags_pkey PRIMARY KEY (product_id, tag_id);

-- Cart items constraints
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);
ALTER TABLE public.cart_items 
  ADD CONSTRAINT cart_items_user_id_product_id_key UNIQUE (user_id, product_id);

-- Fridge items constraints
ALTER TABLE public.fridge_items ADD CONSTRAINT fridge_items_pkey PRIMARY KEY (id);
ALTER TABLE public.fridge_items 
  ADD CONSTRAINT fridge_items_user_id_product_id_key UNIQUE (user_id, product_id);

-- Recipes constraints
ALTER TABLE public.recipes ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);

-- Recipe ingredients constraints
ALTER TABLE public.recipe_ingredients ADD CONSTRAINT recipe_ingredients_pkey PRIMARY KEY (id);

-- Meal plan recipes constraints
ALTER TABLE public.meal_plan_recipes ADD CONSTRAINT meal_plan_recipes_pkey PRIMARY KEY (id);

-- User favorite recipes constraints
ALTER TABLE public.user_favorite_recipes 
  ADD CONSTRAINT user_favorite_recipes_pkey PRIMARY KEY (user_id, recipe_id);

-- Unmatched ingredients constraints
ALTER TABLE public.unmatched_ingredients ADD CONSTRAINT unmatched_ingredients_pkey PRIMARY KEY (id);

-- ============================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================

-- Product_tags foreign keys
ALTER TABLE public.product_tags 
  ADD CONSTRAINT product_tags_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.product_tags 
  ADD CONSTRAINT product_tags_tag_id_fkey 
  FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

-- Cart items foreign keys
ALTER TABLE public.cart_items 
  ADD CONSTRAINT cart_items_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.cart_items 
  ADD CONSTRAINT cart_items_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fridge items foreign keys
ALTER TABLE public.fridge_items 
  ADD CONSTRAINT fridge_items_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.fridge_items 
  ADD CONSTRAINT fridge_items_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Recipe ingredients foreign keys
ALTER TABLE public.recipe_ingredients 
  ADD CONSTRAINT recipe_ingredients_recipe_id_fkey 
  FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;

ALTER TABLE public.recipe_ingredients 
  ADD CONSTRAINT recipe_ingredients_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- Meal plan recipes foreign keys
ALTER TABLE public.meal_plan_recipes 
  ADD CONSTRAINT meal_plan_recipes_recipe_id_fkey 
  FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;

-- User favorite recipes foreign keys
ALTER TABLE public.user_favorite_recipes 
  ADD CONSTRAINT user_favorite_recipes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_favorite_recipes 
  ADD CONSTRAINT user_favorite_recipes_recipe_id_fkey 
  FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;

-- Unmatched ingredients foreign keys
ALTER TABLE public.unmatched_ingredients 
  ADD CONSTRAINT unmatched_ingredients_source_recipe_id_fkey 
  FOREIGN KEY (source_recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fridge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plan_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unmatched_ingredients ENABLE ROW LEVEL SECURITY;

-- Products: Public read access
CREATE POLICY "Allow public read access to products" 
  ON public.products FOR SELECT USING (true);

-- Tags: Public read access
CREATE POLICY "Allow public read access to tags" 
  ON public.tags FOR SELECT USING (true);

-- Product_tags: Public read access
CREATE POLICY "Allow public read access to product_tags" 
  ON public.product_tags FOR SELECT USING (true);

-- Cart items: Users can manage their own cart
CREATE POLICY "Users can view their own cart items" 
  ON public.cart_items FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" 
  ON public.cart_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
  ON public.cart_items FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
  ON public.cart_items FOR DELETE 
  USING (auth.uid() = user_id);

-- Fridge items: Users can manage their own fridge
CREATE POLICY "Users can view their own fridge items" 
  ON public.fridge_items FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fridge items" 
  ON public.fridge_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fridge items" 
  ON public.fridge_items FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fridge items" 
  ON public.fridge_items FOR DELETE 
  USING (auth.uid() = user_id);

-- Recipes: Public read access
CREATE POLICY "Allow public read access to recipes" 
  ON public.recipes FOR SELECT USING (true);

-- Recipe ingredients: Public read access
CREATE POLICY "Allow public read access to recipe_ingredients" 
  ON public.recipe_ingredients FOR SELECT USING (true);

-- Meal plan recipes: Public read for now (can restrict later)
CREATE POLICY "Allow public read access to meal_plan_recipes" 
  ON public.meal_plan_recipes FOR SELECT USING (true);

-- User favorite recipes: Users manage their own favorites
CREATE POLICY "Users can view their own favorite recipes" 
  ON public.user_favorite_recipes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorite recipes" 
  ON public.user_favorite_recipes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorite recipes" 
  ON public.user_favorite_recipes FOR DELETE 
  USING (auth.uid() = user_id);

-- Unmatched ingredients: Public read access
CREATE POLICY "Allow public read access to unmatched_ingredients" 
  ON public.unmatched_ingredients FOR SELECT USING (true);

-- ============================================
-- COMPLETE! 
-- ============================================
-- Run this SQL in your Supabase SQL Editor AFTER creating tables
-- This adds all the missing constraints, foreign keys, and RLS policies
