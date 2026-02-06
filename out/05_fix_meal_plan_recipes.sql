-- Add missing user_id column to meal_plan_recipes table
-- This column is required for RLS policies to work

ALTER TABLE public.meal_plan_recipes 
  ADD COLUMN user_id uuid DEFAULT auth.uid() NOT NULL;

-- Now we can create the proper RLS policy
DROP POLICY IF EXISTS "Users can manage their own meal plan recipes" ON public.meal_plan_recipes;
DROP POLICY IF EXISTS "Allow public read access to meal_plan_recipes" ON public.meal_plan_recipes;

CREATE POLICY "Users can manage their own meal plan recipes" 
  ON public.meal_plan_recipes 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- COMPLETE! 
-- ============================================
-- This adds the missing user_id column and creates the proper RLS policy
