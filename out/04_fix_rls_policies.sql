-- Fix RLS Policies - Drop and Recreate with correct settings
-- This matches the original database dump exactly

-- ============================================
-- DROP EXISTING POLICIES (if they exist)
-- ============================================

DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can manage their own cart items" ON public.cart_items;

DROP POLICY IF EXISTS "Users can view their own fridge items" ON public.fridge_items;
DROP POLICY IF EXISTS "Users can insert their own fridge items" ON public.fridge_items;
DROP POLICY IF EXISTS "Users can update their own fridge items" ON public.fridge_items;
DROP POLICY IF EXISTS "Users can delete their own fridge items" ON public.fridge_items;
DROP POLICY IF EXISTS "Users can manage their own fridge items" ON public.fridge_items;

DROP POLICY IF EXISTS "Users can manage their own meal plan recipes" ON public.meal_plan_recipes;

-- ============================================
-- CREATE CORRECT POLICIES (matching original dump)
-- ============================================

-- Cart items: Single policy for all operations
CREATE POLICY "Users can manage their own cart items" 
  ON public.cart_items 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Fridge items: Single policy for all operations
CREATE POLICY "Users can manage their own fridge items" 
  ON public.fridge_items 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Meal plan recipes: Single policy for all operations
CREATE POLICY "Users can manage their own meal plan recipes" 
  ON public.meal_plan_recipes 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- COMPLETE! 
-- ============================================
-- This fixes the RLS policies to match the original database
-- Now cart add, fridge add, and meal planning should work
