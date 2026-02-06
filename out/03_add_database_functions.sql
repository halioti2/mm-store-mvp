-- Database Functions for Cart and Fridge Operations
-- These functions handle upsert logic (insert or update if exists)

-- ============================================
-- CART UPSERT FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.upsert_cart_item(
  p_user_id uuid, 
  p_product_id bigint, 
  p_quantity_to_add integer
) 
RETURNS TABLE(id bigint, user_id uuid, product_id bigint, quantity integer)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.cart_items (user_id, product_id, quantity)
  VALUES (p_user_id, p_product_id, p_quantity_to_add)
  
  -- If a row with this user_id and product_id already exists...
  ON CONFLICT ON CONSTRAINT cart_items_user_id_product_id_key
  
  DO UPDATE
    -- ...then UPDATE the existing row by adding to the quantity
    SET quantity = cart_items.quantity + p_quantity_to_add
    WHERE cart_items.user_id = p_user_id AND cart_items.product_id = p_product_id
  
  -- Return the contents of the row that was just inserted or updated
  RETURNING cart_items.id, cart_items.user_id, cart_items.product_id, cart_items.quantity;
END;
$$;

-- Grant execute permissions to all roles
GRANT ALL ON FUNCTION public.upsert_cart_item(p_user_id uuid, p_product_id bigint, p_quantity_to_add integer) TO anon;
GRANT ALL ON FUNCTION public.upsert_cart_item(p_user_id uuid, p_product_id bigint, p_quantity_to_add integer) TO authenticated;
GRANT ALL ON FUNCTION public.upsert_cart_item(p_user_id uuid, p_product_id bigint, p_quantity_to_add integer) TO service_role;

-- ============================================
-- FRIDGE UPSERT FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.upsert_fridge_item(
  p_user_id uuid, 
  p_product_id bigint, 
  p_quantity_to_add real
) 
RETURNS TABLE(id bigint, user_id uuid, product_id bigint, quantity real)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.fridge_items (user_id, product_id, quantity)
  VALUES (p_user_id, p_product_id, p_quantity_to_add)
  
  -- If a row with this user_id and product_id already exists...
  ON CONFLICT ON CONSTRAINT fridge_items_user_id_product_id_key
  
  -- ...then UPDATE the existing row by adding to the quantity
  DO UPDATE
    SET quantity = fridge_items.quantity + p_quantity_to_add
  
  -- Return the contents of the row that was just inserted or updated
  RETURNING fridge_items.id, fridge_items.user_id, fridge_items.product_id, fridge_items.quantity;
END;
$$;

-- Grant execute permissions to all roles
GRANT ALL ON FUNCTION public.upsert_fridge_item(p_user_id uuid, p_product_id bigint, p_quantity_to_add real) TO anon;
GRANT ALL ON FUNCTION public.upsert_fridge_item(p_user_id uuid, p_product_id bigint, p_quantity_to_add real) TO authenticated;
GRANT ALL ON FUNCTION public.upsert_fridge_item(p_user_id uuid, p_product_id bigint, p_quantity_to_add real) TO service_role;

-- ============================================
-- COMPLETE! 
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- These functions allow cart and fridge add operations to work
