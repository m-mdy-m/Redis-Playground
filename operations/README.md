## Database Designs

Redis, an in-memory data store, excels at handling frequently accessed data structures with high performance. Here's how to effectively translate relational database (RDBMS) tables into Redis data structures, along with essential considerations and a real-world example.

**Key Takeaways:**

- **Leverage Key-Value Pairs:** Embrace the fundamental concept of Redis: key-value pairs. Each record (previously a row) becomes a hash stored under a unique key crafted for efficient retrieval.
- **Hash Maps for Complex Data:** Redis's hash data structure (hashes) is ideal for storing complex records like database rows. Each field name in the row becomes a hash field within the key, with its corresponding value stored efficiently.
- **Unique Keys for Multi-Key Primaries:** When dealing with tables that have composite primary keys (multiple columns), craft unique keys that incorporate all primary key values. This ensures efficient retrieval of individual records.
- **Concatenate Key Fields with Separator:** Use a common separator (like ":") to concatenate the primary key values within the Redis key. This improves readability and aids in key construction.
- **Wildcards for Range Queries:** Utilize wildcards (like "*") within the key pattern for fetching a range of records based on specific criteria. This enables efficient retrieval of multiple keys matching a search pattern.

**Example: Transforming an Order Details Table**

Consider the following RDBMS table for order details with a composite primary key comprising `order_id` and `product_id`:

```sql
CREATE TABLE public.order_details (
  order_id smallint NOT NULL,
  product_id smallint NOT NULL,
  unit_price real NOT NULL,
  quantity smallint NOT NULL,
  discount real NOT NULL,
  CONSTRAINT pk_order_details PRIMARY KEY (order_id, product_id)
);
```

**Redis Data Structure Representation:**

In Redis, each order detail record becomes a hash with a key formed by concatenating all primary key values separated by a colon:

```bash
order:product:1024:11  (assuming order_id is 1024 and product_id is 11)
  unit_price: 14.00
  quantity: 14
  discount: 0.00
```

**Explanation:**

- The key `order:product:1024:11` is constructed by combining the prefix "order:product" with the primary key values separated by colons.
- The `HMSET` command creates a hash named `order:product:1024:11` with various fields (unit_price, quantity, discount) and their respective values for that specific order detail record.

**Redis Querying:**

- **Retrieving a Single Record:** Directly construct the key using the order ID and product ID and employ the `HGETALL` command to retrieve the entire record as a hash.
- **Accessing Specific Fields:** Use `HGET` (e.g., `HGET order:product:1024:11 unit_price`) to fetch individual fields within the hash.
- **Ranging by Key Patterns:** For retrieving order details within a specific order ID range, use wildcards: `HGETALL order:product:1024:*` (assuming all order details for order ID 1024 start with "order:product:1024:"). Redis will return all matching hashes.

**Real-World Example: E-commerce Product Catalog**

Imagine an e-commerce product catalog. Instead of storing every product in a single RDBMS table row, consider:

- Key: `product:<product_id>` (unique identifier for each product)
- Hash Fields:
    - `name` (product name)
    - `description` (product description)
    - `price` (unit price of the product)
    - `category` (product category)
    - `stock` (available quantity)

This approach allows for efficient retrieval of individual product details, including filtering by category or stock availability through wildcard searches on the key prefix.

**Additional Considerations:**

- **Database Persistence:** While Redis shines in in-memory performance, evaluate persistence options (RDB, AOF) for data durability if required.
- **Data Size:** Optimize key and value sizes considering Redis's memory-centric nature to maximize performance.
- **Denormalization:** Strategically denormalize data for faster retrieval by having the same data in multiple structures, but ensure data consistency across these structures to avoid inconsistencies.
- **Secondary Indexes:** For complex queries involving multiple fields, consider using additional data structures (like sorted sets) as secondary indexes to facilitate efficient retrieval.