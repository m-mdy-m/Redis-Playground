##  Database Designs

Redis, an in-memory data store, excels at handling frequently accessed data structures with high performance. Here's how to effectively translate relational database (RDBMS) tables into Redis data structures, along with essential considerations and a real-world example.

**Key Takeaways:**

- **Embrace Key-Value Pairs:** Unlike RDBMS tables with rows and columns, Redis thrives on key-value pairs. Each record (previously a row) is stored as a hash under a unique key.
- **Hash Maps for Rich Data:** Redis's hash data type (hashes) is ideal for storing complex data structures like rows. Each field name in the row becomes a hash field within the key, with its corresponding value stored efficiently.
- **Primary Key as Key Name:** Leverage the primary key of the RDBMS table as the Redis key name. This facilitates direct retrieval of individual records. A common separator (like ":") is often used to differentiate keys from actual data.
- **Wildcards for Range Queries:** When searching for a range of records, use wildcards (like "*") within the key pattern. This enables efficient retrieval of multiple keys matching a specific criteria.

**Example: Transforming an Employee Table**

Consider the following RDBMS table for employees:

```sql
CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  age INT,
  hire_date DATE,
  salary DECIMAL(20,2)
);
```

**Redis Data Structure Representation:**

In Redis, each employee record becomes a hash with the `employee_id` as the key:

```bash
employee:1
  first_name: John
  last_name: Doe
  age: 30
  hire_date: 2020-01-01
  salary: 15000.00
```

**Explanation:**

- The key `employee:1` is formed by concatenating the prefix "employee:" with the primary key value `1`.
- The `HMSET` command creates a hash named `employee:1` with various fields (first_name, last_name, age, hire_date, salary) and their respective values for that employee record.

**Redis Querying:**

- **Retrieving a Single Record:** Directly use the employee ID to construct the key and retrieve the entire record using the `HGETALL` command.
- **Fetching Specific Fields:** You can retrieve individual fields using `HGET` (e.g., `HGET employee:1 first_name`).
- **Ranging by Key Patterns:** For retrieving employees within a specific age range, use wildcards in the key: `HGETALL employee:*` (assuming all employee IDs start with "employee:"). Redis will return all matching hashes.

**Real-World Example: E-commerce Shopping Cart**

Imagine an e-commerce shopping cart. Instead of storing every item in a single row of an RDBMS table, consider:

- Key: `cart:<user_id>` (unique identifier for each user's cart)
- Hash Fields:
    - `item_id:<product_id>` (unique identifier for each item in the cart)
    - `quantity` (number of units for that product)
    - `price` (unit price of the product)

This structure allows for efficient retrieval and manipulation of individual items in a user's cart.

**Additional Considerations:**

- **Database Persistence:** While Redis excels at in-memory performance, consider persistence options like RDB or AOF for data durability if required.
- **Data Size:** Optimize key and value sizes for Redis's memory-centric nature.
- **Denormalization:** For faster retrieval, denormalize data strategically to avoid multiple key lookups in some cases. However, maintain data consistency across structures.
