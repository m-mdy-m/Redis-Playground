## Redis Data Storage

Unlike traditional relational databases, it doesn't rely on complex schemas or tables. Instead, it focuses on storing data using **unique keys** that map to specific **values**. This key-based approach offers:

- **Speed:** Since data resides primarily in RAM, Redis boasts incredibly fast read and write operations.
- **Simplicity:** The key-value structure makes data access and manipulation straightforward.

**Choosing the Right Value Type**

Redis provides various data structures to store your values, allowing you to optimize for different use cases:

- **Strings:** The most basic type, ideal for storing simple text or binary data.
- **Lists:** Ordered collections of strings. You can add/remove elements from the beginning or end (push/pop) or access elements by index.
- **Hashes:** Like dictionaries, Hashes store key-value pairs within a single key. This is useful for storing complex objects with multiple attributes.
- **Sets:** Unordered collections of unique strings. Sets are efficient for checking membership, performing set operations (union, intersection, difference), and getting random elements.
- **Sorted Sets:** Similar to Sets, but elements have an associated score, allowing for ordered retrieval.
- **Bitmaps:** Space-efficient for representing bit fields, useful for tasks like tracking user logins or flags.

**Remember the Key!**
Since keys need to be unique, choosing clear and descriptive names is essential for efficient data management.

**Additional Considerations**

- **Persistence:** While data resides primarily in RAM, Redis offers persistence options like RDB snapshots and AOF (Append-only File) to survive server restarts.
- **Expiration:** You can set expiration times on keys for automatic data removal after a specific period.

## Key And Value

In Redis, everything revolves around keys and values

**Keys: The Unique Identifiers**

* **Function:** Keys act as unique labels or identifiers for your data. They're similar to names you assign to files or folders on your computer. 
* **Uniqueness:** Each key within a single Redis database must be distinct. You cannot have two keys with the same name.
* **Naming Conventions:** While there are no strict rules, it's highly recommended to choose descriptive and meaningful key names. This makes it easier to understand what data a particular key holds, especially when managing large datasets. 
    * **Examples:** `user:123` (identifies a user record), `product_data:shoes` (stores product details for shoes).
* **Length:** Key lengths can vary, but it's generally recommended to keep them concise for performance reasons. Aim for keys that are easy to remember and manage.

**Values: The Heart of Your Data**

* **Data Container:** Values are the actual data you want to store in Redis. They can be of various types, depending on your needs.
* **Supported Data Types:** Redis offers a rich set of data structures for values, allowing you to store different types of data efficiently:
    * **Strings:** Basic building block, perfect for storing text or binary data.
    * **Lists:** Ordered collections of strings, ideal for sequences or shopping carts.
    * **Hashes:** Key-value pairs within a single key, useful for representing objects with multiple attributes (e.g., user profiles).
    * **Sets:** Unordered collections of unique strings, good for checking membership or performing set operations.
    * **Sorted Sets:** Ordered sets with associated scores for each element, enabling prioritized retrieval.
    * **Bitmaps:** Space-efficient for representing bit fields, useful for tracking flags or user logins.
* **Size Considerations:** While there's no hard limit on value size, extremely large values might impact performance. Consider alternative storage solutions for massive data sets.

**Putting Keys and Values Together: The SET and GET Commands**

The `SET` and `GET` commands are the fundamental building blocks for interacting with keys and values in Redis. Here's how they work:

* **SET:** This command stores a key-value pair in the database. It takes two arguments: the key name and the value you want to associate with it.
    * **Example:** `SET name "Alice"` stores the string "Alice" under the key "name".
* **GET:** This command retrieves the value associated with a specific key. It takes the key name as an argument.
    * **Example:** `GET name` would return "Alice" if the previous `SET` command was executed.

**Remember:**

* To retrieve data, you must use the exact key you used to store it. Since keys are unique identifiers, even slight variations in the key name will result in a "nil" response (meaning no data found).
* Keys themselves are not stored as separate entities. They exist only in relation to their associated values.

**Beyond the Basics**

* **Expiration:** You can set expiration times on keys using commands like `EXPIRE`. This allows for automatic data removal after a specified period, helping to manage data freshness and prevent clutter.
* **Data Types and Performance:** Choosing the right data type for your values significantly impacts performance. Lists are efficient for adding/removing elements at the beginning or end, while Hashes excel at retrieving specific fields within a complex object.

## How Redis Handle Key Expirations

### Normal Keys
- **Without Expirations**: When you create a key in Redis without an expiration time, it will persist indefinitely until explicitly deleted. For instance, if you run:
  ```sh
  SET course "redis"
  ```
  The key `course` will exist in Redis forever unless you delete it manually.

### Keys with Expirations
- **Expiration Storage**: Redis stores expiration times as UNIX timestamps in milliseconds. This means it records the exact moment when the key should expire.

- **Expiration Process**: Keys with expiration times are handled through two main mechanisms: passive and active expiration.

### Passive Expiration
- **Mechanism**: Passive expiration happens when a client attempts to access a key. If the key has expired, Redis will recognize this and delete the key, returning a "key not found" response to the client.
- **Example**:
  ```sh
  SET course "redis" EX 10
  ```
  If you try to access the key `course` after 10 seconds, Redis will passively delete it and return nil.

### Active Expiration
- **Mechanism**: To ensure that expired keys are removed in a timely manner even if they are not accessed, Redis employs an active expiration mechanism that runs periodically.

- **Process**:
  1. **Frequency**: Redis performs active expiration checks 10 times per second.
  2. **Sampling**: During each check, Redis randomly selects 20 keys with expiration times.
  3. **Deletion**: It deletes all keys found to be expired.
  4. **Threshold Check**: If more than 25% of the sampled keys are expired, Redis repeats the process to ensure more expired keys are cleared out.

- **Optimization**: This mechanism helps in preventing a sudden burst of deletions that could impact performance by spreading the load evenly over time.

### Summary of Key Expiration Handling
- **Normal Keys**: Persist indefinitely unless manually deleted.
- **Expired Keys**:
  - Stored with expiration times as UNIX timestamps in milliseconds.
  - **Passive Expiration**: Key is deleted upon access if it has expired.
  - **Active Expiration**: Redis periodically checks and deletes expired keys in batches, ensuring system efficiency.


## Key Space in Redis

In Redis, the concept of key space is akin to database namespaces or schemas found in other database systems. It allows for organizational separation within a Redis instance, enabling better management and isolation of data. Here’s a detailed explanation:

### Key Space Overview

- **Isolation**: Each key space in Redis functions as an isolated database, allowing you to use the same key names in different key spaces without conflicts.
- **Indexing**: Key spaces are indexed starting from 0. By default, a Redis instance starts with 16 key spaces (databases), but this number can be configured.

### Managing Keys Across Key Spaces

**Example Scenario:**
1. **Set a Key in Key Space 0**:
   ```bash
   SELECT 0         # Switch to key space 0
   SET key1 value1  # Set key1 with value1
   GET key1         # Returns value1
   ```

2. **Set a Key with the Same Name in Key Space 1**:
   ```bash
   SELECT 1         # Switch to key space 1
   SET key1 value2  # Set key1 with value2
   GET key1         # Returns value2
   ```

3. **Switch Back to Key Space 0**:
   ```bash
   SELECT 0         # Switch back to key space 0
   GET key1         # Returns value1
   ```

### Key Space Commands

#### `SELECT index`

- **Function**: Switches the connection to a different key space (database).
- **Arguments**:
  - `index`: The zero-based index of the key space to select (integer).
- **Returns**: Simple string reply "OK" if the command is executed successfully.
- **Example**:
  ```bash
  SELECT 1  # Switch to key space 1
  ```

#### `KEYS pattern`

- **Function**: Finds all keys matching a given pattern in the currently selected key space.
- **Arguments**:
  - `pattern`: The pattern to match keys against (string). Wildcards supported:
    - `*`: Matches zero or more characters.
    - `?`: Matches exactly one character.
    - `[abc]`: Matches any one of the characters in the brackets.
- **Returns**: An array of keys that match the given pattern.
- **Example**:
  ```bash
  KEYS *  # Returns all keys in the current key space
  ```

#### `FLUSHDB`

- **Function**: Deletes all keys from the currently selected key space.
- **Returns**: Simple string reply "OK" if the command executed successfully.
- **Example**:
  ```bash
  FLUSHDB  # This command will remove all keys from the current key space
  ```

### Important Considerations

1. **Isolation**: Keys in one key space are entirely separate from keys in another. You cannot directly link or join keys across different key spaces.
2. **Use Cases**:
   - **Testing Environments**: Different key spaces can be used for development, testing, and production within the same Redis instance.
   - **Multi-Tenant Applications**: Separate key spaces for different tenants to ensure data isolation.
3. **Limitations**: Unlike SQL databases, where you can join tables across schemas, Redis key spaces do not support linking keys across different key spaces.

### Advantages of Key Spaces

- **Data Management**: Allows for better organization and management of data by segregating different datasets into separate key spaces.
- **Operational Efficiency**: Facilitates operations like clearing a specific key space (`FLUSHDB`) without affecting others.
- **Security and Isolation**: Enhances data security and isolation, which is crucial for multi-tenant systems.

### Summary

Redis key spaces provide a powerful way to manage and isolate data within a single Redis instance. By understanding and leveraging key space commands such as `SELECT`, `KEYS`, and `FLUSHDB`, you can effectively manage and organize your Redis databases, ensuring that your data is well-structured and efficiently accessed.