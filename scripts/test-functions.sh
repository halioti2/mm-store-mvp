#!/bin/bash

# Test Netlify Functions
# Make sure netlify dev is running first!

BASE_URL="http://localhost:8888/.netlify/functions"

echo "🧪 Testing Netlify Functions..."
echo ""

# Test 1: Hello World
echo "1️⃣ Testing test-hello..."
curl -s "$BASE_URL/test-hello" | jq '.'
echo ""

# Test 2: Connectivity Test
echo "2️⃣ Testing connectivityTest..."
curl -s "$BASE_URL/connectivityTest" | jq '.'
echo ""

# Test 3: Product Search (needs a query)
echo "3️⃣ Testing product-search (searching for 'chicken')..."
curl -s "$BASE_URL/product-search?query=chicken" | jq '.'
echo ""

echo "✅ Basic tests complete!"
echo ""
echo "📝 Available functions:"
echo "  - cart-add-item (POST)"
echo "  - cart-remove-item (POST)"
echo "  - cart-update-quantity (POST)"
echo "  - cart-reset (POST)"
echo "  - cart-add-multiple-items (POST)"
echo "  - fridge-add-item (POST)"
echo "  - fridge-remove-item (POST)"
echo "  - fridge-update-quantity (POST)"
echo "  - product-search (GET)"
echo "  - suggest-recipes (POST)"
echo "  - parse-recipe (POST)"
echo "  - save-recipe (POST)"
echo "  - enrich (POST)"
echo "  - sync (POST)"
echo "  - plan-clear (POST)"
