# Sample AI Assistant Queries

Once your Shopify MCP servers are configured, you can ask your AI assistant these types of questions:

## 📦 Product Management

### List Products
```
"List my first 10 products"
"Show me all products with 'electric' in the title"
"Find products priced between $50 and $100"
```

### View Product Details
```
"Show me details for product ID 12345"
"What are the variants for product 'Blue T-Shirt'?"
"Display inventory levels for all products"
```

### Create Products
```
"Create a new product called 'Premium Headphones' priced at $199"
"Add a product with title 'Organic Coffee' and description 'Fair trade beans'"
```

### Update Products
```
"Update product #12345 description to include SEO keywords"
"Change the price of 'Blue T-Shirt' to $29.99"
"Add tags 'summer' and 'sale' to product #67890"
```

## 🛒 Order Management

### List Orders
```
"Show me orders from the last 7 days"
"List all unfulfilled orders"
"Find orders over $500"
```

### View Order Details
```
"Show me details for order #1001"
"What items are in order #1002?"
"Display shipping address for order #1003"
```

## 👥 Customer Management

### List Customers
```
"Show me my first 20 customers"
"Find customers who joined this month"
```

### Customer Details
```
"Show me customer details for email john@example.com"
"How many orders has customer #12345 placed?"
```

### Tag Customers
```
"Add tag 'VIP' to customer #12345"
"Tag all customers who spent over $1000 as 'premium'"
```

## 💰 Discounts & Promotions

### Create Discounts
```
"Create a 20% discount code 'SUMMER20' valid for 30 days"
"Make a $10 off coupon for first-time customers"
"Create a buy-one-get-one discount"
```

### View Discounts
```
"List all active discount codes"
"Show me discounts expiring this week"
```

## 📚 Documentation & Code Generation

### Search Documentation
```
"How do I create a product using GraphQL?"
"What fields are available on the Order object?"
"Show me webhook subscription examples"
```

### Generate Code
```
"Generate a GraphQL query to fetch product variants"
"Create a mutation to update product inventory"
"Write a query to get customer order history"
```

### Validate Code
```
"Validate this GraphQL query: { shop { name } }"
"Check if this mutation is correct: mutation { productUpdate(...) }"
```

## 🏪 Collections

### List Collections
```
"Show me all collections"
"Find collections with 'summer' in the name"
```

### Collection Products
```
"List products in the 'Featured' collection"
"How many products are in collection #123?"
```

## 📝 Draft Orders

### Create Draft Orders
```
"Create a draft order for customer john@example.com"
"Make a draft order with product #12345, quantity 2"
```

### Complete Draft Orders
```
"Complete draft order #456"
"Convert draft order to a real order"
```

## 🔍 Advanced Queries

### Complex Filters
```
"Find products tagged 'electronics' with inventory > 10"
"Show orders from Brazil placed in January 2026"
"List customers who haven't ordered in 90 days"
```

### Bulk Operations
```
"Update all products tagged 'clearance' to 50% off"
"Add 'new-arrival' tag to products created this week"
```

### Analytics
```
"What's my total revenue this month?"
"Which products have the most sales?"
"Show me my top 10 customers by order value"
```

## 💡 Tips for Better Results

1. **Be specific**: Include product IDs, dates, or exact criteria
2. **Use natural language**: The AI understands conversational queries
3. **Ask for validation**: Request GraphQL validation before executing
4. **Check documentation**: Ask about API capabilities first
5. **Test incrementally**: Start with simple queries, then get more complex

## 🚨 Important Notes

- Always validate generated code before using in production
- Be careful with bulk operations - test on a few items first
- Some operations require specific API scopes
- Rate limits apply - don't make too many requests at once

---

**Have a query pattern that works well? Share it in the discussions!**
