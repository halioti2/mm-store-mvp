-- Add items to fridge for user: ethan.davey@pursuit.org
-- User ID: 1ba01d05-1365-4cc0-88c7-43dca702c14a

-- First, let's clear any existing fridge items for this user (optional)
-- DELETE FROM public.fridge_items WHERE user_id = '1ba01d05-1365-4cc0-88c7-43dca702c14a';

-- Add chicken wing recipe ingredients
INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 2 FROM public.products WHERE name ILIKE 'chicken wings'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 1 FROM public.products WHERE name ILIKE 'butter'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 3 FROM public.products WHERE name ILIKE 'garlic'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 1 FROM public.products WHERE name ILIKE 'hot sauce'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 1 FROM public.products WHERE name ILIKE 'buttermilk'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 1 FROM public.products WHERE name ILIKE 'fresh dill'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 1 FROM public.products WHERE name ILIKE 'fresh chives'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

-- Add random other items
INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 2 FROM public.products WHERE name ILIKE 'milk'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 12 FROM public.products WHERE name ILIKE 'egg'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 1 FROM public.products WHERE name ILIKE 'cheese'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 2 FROM public.products WHERE name ILIKE 'chicken breast'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 1 FROM public.products WHERE name ILIKE 'broccoli'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 5 FROM public.products WHERE name ILIKE 'carrot'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 3 FROM public.products WHERE name ILIKE 'onion'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 4 FROM public.products WHERE name ILIKE 'tomato'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 1 FROM public.products WHERE name ILIKE 'lettuce'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 1 FROM public.products WHERE name ILIKE 'bacon'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 4 FROM public.products WHERE name ILIKE 'yogurt'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 2 FROM public.products WHERE name ILIKE 'bell pepper'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO public.fridge_items (user_id, product_id, quantity)
SELECT '1ba01d05-1365-4cc0-88c7-43dca702c14a', id, 3 FROM public.products WHERE name ILIKE 'avocado'
ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;

-- Verification query - run this to see all fridge items
-- SELECT 
--   fi.quantity,
--   p.name,
--   p.price,
--   (fi.quantity * p.price) as subtotal
-- FROM public.fridge_items fi
-- JOIN public.products p ON fi.product_id = p.id
-- WHERE fi.user_id = '1ba01d05-1365-4cc0-88c7-43dca702c14a'
-- ORDER BY p.name;
