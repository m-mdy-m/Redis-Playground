## Redis Commands Summary
### **official Redis documentation** >> [https://redis.io/docs/latest/commands/](https://redis.io/docs/latest/commands/)
## Server Management:
**Starting the Server:**
```bash
redis-server
```
- This command launches the Redis server process.

**Shutting Down the Server:**

```bash
127.0.0.1:6379> shutdown [SAVE|NOSAVE]
```

- This command gracefully shuts down the server.
  - `SAVE`: Saves the data to disk before shutting down (recommended).
  - `NOSAVE`: **Does not** save the data, which is faster but leads to data loss if not persisted elsewhere.

**Restarting the Server (Linux with systemd):**

```bash
systemctl restart redis
```

- This command restarts the Redis service using systemd, the service manager on most Linux distributions.
## Connection Management:
**Connecting to the Server:**

```bash
redis-cli
```
- This command opens the Redis command-line interface (CLI) where you can interact with the server.


**Exiting the Redis CLI:**

```bash
127.0.0.1:6379> exit
```
- This command exits the `redis-cli` and closes your connection to the server.
## Server Information:
**PING Command**

```bash
127.0.0.1:6379> PING [Message]
```
* Checks if the Redis server is alive and responsive.
* Optionally, sends a custom message along with the ping and returns the same message back.

**INFO Command**

```bash
127.0.0.1:6379> info [section]
```
* Returns information and statistics about the Redis server.
* Provides insights into server performance, configuration, and resource usage.
## Help:
**Getting Help:**

```bash
redis-cli HELP <command_name>
```

- This command provides detailed information about a specific Redis command.


## Key-Value Operations:

### Setting and Getting Values:
**`SET` key value**

* **Function:** Creates a new key-value pair in the Redis database.
* **Arguments:**
    * `key`: A unique identifier for your data (string).
    * `value`: The data you want to store (can be a string, list, hash, set, or other supported data type).
* **Example:** `SET name "Alice"` stores the string "Alice" under the key "name".
---
**`MSET` key1 value1 [key2 value2 ...]**

* **Function:** Sets multiple key-value pairs in a single atomic operation.
* **Arguments:**
  * `key1`, `value1`, `key2`, `value2`, ...: A series of key-value pairs (strings) to be set. The number of arguments must be even, with each key followed by its corresponding value.
* **Returns:**
  * Simple string reply stating "OK" if all the key-value pairs were successfully set.
  * Error message if there's a problem (e.g., invalid arguments, wrong number of arguments).
* **Example:**
  ```bash
  MSET name "Alice" age 30 city "New York"
  ```

  This command sets the following key-value pairs:

    - `name`: "Alice"
    - `age`: "30"
    - `city`: "New York"
* **Important Notes:**
  * `MSET` is atomic, meaning all key-value pairs are set together as a single unit. This ensures data consistency, even in high-concurrency scenarios.
  * It's efficient for setting multiple key-value pairs simultaneously, especially when the keys and values are already prepared.
  * Existing keys will be overwritten with the new values provided in the `MSET` command.


**Additional Considerations:**

* **Number of Arguments:** Remember that `MSET` requires an even number of arguments, with each key followed by its corresponding value. An odd number of arguments will result in an error.
* **Data Types:** While `MSET` primarily works with strings, Redis allows setting different data types for each key-value pair as long as they are supported by Redis (strings, lists, sets, etc.). However, ensure your application logic handles the data types appropriately when retrieving the values later.
* **Alternative:** For setting a single key-value pair, use the `SET` command. `MSET` is more efficient when dealing with multiple key-value pairs at once. 
---
**`MSETNX` key1 value1 [key2 value2 ...]**

* **Function:** Sets multiple key-value pairs in a single atomic operation, but only if none of the specified keys already exist.
* **Arguments:**
  * `key1`, `value1`, `key2`, `value2`, ...: A series of key-value pairs (strings) to be set conditionally. The number of arguments must be even, with each key followed by its corresponding value.
* **Returns:**
  * Integer reply with the value 1 if all the key-value pairs were successfully set (because none of the keys existed before).
  * Integer reply with the value 0 if at least one of the keys already existed, and no setting operation was performed (atomicity ensures all or none are set).
  * Error message if there's a problem with the arguments (e.g., invalid arguments, wrong number of arguments).
* **Example:**
  ```bash
  MSETNX name "Alice" age 30  ; Keys might not exist yet
  MSETNX name "Bob" age 25  ; This will likely fail (assuming "name" was set previously)
  ```

  * The first `MSETNX` might set `name` to "Alice" and `age` to 30 if these keys didn't exist before.
  * The second `MSETNX` is unlikely to succeed because `name` probably already has a value set from the first command.

**Important Notes:**

* `MSETNX` offers conditional setting, ensuring that none of the key-value pairs overwrite existing data.
* It's atomic, meaning all key-value pairs are either set together or not set at all, maintaining data consistency.
* This command is useful for scenarios where you want to create multiple key-value pairs only if they don't exist yet, preventing accidental overwrites.

**Additional Considerations:**

* **Number of Arguments:** Remember that `MSETNX` requires an even number of arguments, with each key followed by its corresponding value. An odd number of arguments will result in an error.
* **Data Types:** Similar to `MSET`, `MSETNX` can work with different data types for each key-value pair as long as they are supported by Redis. However, ensure your application handles the data types appropriately when retrieving the values later.
* **Alternative:** Use `MSET` if you want to unconditionally set multiple key-value pairs, even if some keys already exist (existing keys will be overwritten). `MSETNX` provides a safer option for conditional setting.
---
**`SETNX` key value**

* **Function:** Sets the specified key to the given value only if the key does not already exist.
* **Arguments:**
    * `key`: The key of the value to be set (string).
    * `value`: The value to be associated with the key (string or any data type supported by Redis).
* **Returns:**
    * Integer reply with the value 1 if the key was successfully set because it didn't exist before.
    * Integer reply with the value 0 if the key already existed, and no setting operation was performed.
    * Error message if there are any issues with the arguments or the key itself (e.g., invalid arguments).
* **Example:**
  ```bash
  SETNX key1 "value1"        ; Sets key1 if it doesn't exist (returns 1)
  SETNX key1 "value2"        ; Tries to set key1 again (returns 0, key already exists)
  ```

**Important Notes:**

* `SETNX` provides a conditional setting mechanism. It ensures that the key-value pair is only set if the key doesn't exist beforehand.
* This is useful for scenarios where you want to:
    * Create a new key with a specific value only if it doesn't exist yet.
    * Prevent accidental overwrites of existing data.
* `SETNX` is atomic, meaning the entire operation of checking for existence and setting the value (if allowed) happens as a single unit.

**Additional Considerations:**

* **Data Types:** While the example shows strings, `SETNX` can work with any data type supported by Redis. The data type of the `value` will determine how it's stored and interpreted.
* **Alternatives:**
    * Use `SET` for unconditional setting of a key-value pair, even if the key already exists (existing keys will be overwritten).
    * Use `MSETNX` for setting multiple key-value pairs conditionally (all or none are set based on existence).
---
**`SETRANGE` key index value**

* **Function:** Replaces a portion of the existing string value stored at the specified key with a given value.
* **Arguments:**
    * `key`: The key of the string value to modify (string).
    * `index`: The zero-based index at which to start replacing the characters within the string (integer).
    * `value`: The string value to use for replacing the portion of the existing string (string).
* **Returns:**
    * The length of the updated string after the replacement operation (integer). If the key does not exist, a new key is created with the provided `value`.
    * An error message if there are any issues with the arguments or the key itself (e.g., invalid index, index out of bounds).
* **Example:**
  ```bash
  SET message "Hello, World!"
  SETRANGE message 7 "Beautiful"   ; Replaces "World" with "Beautiful" (starting at index 7)
  GET message                     ; Returns "Hello, Beautiful!"
  ```

**Important Notes:**

* `SETRANGE` is designed for in-place modification of string values. It allows you to replace a specific part of the string with a new value.
* The operation is atomic, ensuring the entire replacement happens as a single unit.
* This command is useful for updating specific sections of a string without modifying the entire content.

**Additional Considerations:**

* **Index and Length:** The `index` specifies the starting point for the replacement. The length of the provided `value` determines how many characters are replaced. If the `value` is shorter than the existing content at the specified index, the remaining characters are left unchanged. Conversely, if the `value` is longer, it will overwrite subsequent characters in the original string.
* **New Keys:** If the key doesn't exist before using `SETRANGE`, a new key is created with the provided `value`. The return value will be the string length of this newly created string (which is the length of the provided `value`).
* **Out-of-Bounds Indices:** If the `index` is negative or greater than the length of the string, the behavior depends on the Redis version. In some cases, an error might be thrown, while in others, no replacement might occur. It's advisable to consult the Redis documentation for your specific version regarding edge cases.
---
**`SETEX` key seconds value**

* **Function:** Sets the specified key to the given value and sets a timeout in seconds after which the key will be automatically deleted.
* **Arguments:**
    * `key`: The key of the value to be set (string).
    * `seconds`: The duration in seconds for which the key will exist (positive integer).
    * `value`: The value to be associated with the key (string or any data type supported by Redis).
* **Returns:**
    * Simple string reply stating "OK" if the key was successfully set with the timeout.
    * Error message if there are any issues with the arguments or the key itself (e.g., invalid arguments, negative timeout value).
* **Example:**
  ```bash
  SETEX temporary_data 60 "This is temporary data"
  ```

  This command sets the key "temporary_data" with the value "This is temporary data" and sets a timeout of 60 seconds. After 60 seconds, the key will be automatically removed from the Redis database.

**Important Notes:**

* `SETEX` combines setting a key-value pair with automatic expiration. It's a convenient way to store data that only needs to persist for a limited time.
* The timeout is set in seconds. If you need expiration in milliseconds, use the `PSETEX` command (covered elsewhere).
* `SETEX` is atomic, ensuring the key setting and expiration timer creation happen as a single unit.

**Additional Considerations:**

* **Key Overwrites:** If a key with the same name already exists, `SETEX` will overwrite the existing key's value and expiration time with the new values provided.
* **Data Types:** While the example shows strings, `SETEX` can work with any data type supported by Redis. The data type of the `value` will determine how it's stored and interpreted.
* **Alternatives:**
    * Use `SET` for setting a key-value pair without expiration.
    * Use `EXPIRE` to set an expiration time for an existing key.
---
**`PSETEX` key milliseconds value**

* **Function:** Sets the specified key to the given value and sets a timeout in milliseconds after which the key will be automatically deleted.
* **Arguments:**
    * `key`: The key of the value to be set (string).
    * `milliseconds`: The duration in milliseconds for which the key will exist (positive integer).
    * `value`: The value to be associated with the key (string or any data type supported by Redis).
* **Returns:**
    * Simple string reply stating "OK" if the key was successfully set with the timeout.
    * Error message if there are any issues with the arguments or the key itself (e.g., invalid arguments, negative timeout value).
* **Example:**
  ```bash
  PSETEX temporary_data 10000 "This is temporary data"  ; Timeout of 10 seconds (10000 milliseconds)
  ```

**Important Notes:**

* `PSETEX` is specifically designed for setting key-value pairs with expiration times in milliseconds. It offers finer control over expiration compared to `SETEX` which uses seconds.
* It combines setting a key-value pair with automatic expiration. This is useful for storing data that only needs to persist for a brief period.
* Similar to `SETEX`, `PSETEX` is atomic, ensuring the key setting and expiration timer creation happen as a single unit.

**Additional Considerations:**

* **Key Overwrites:** If a key with the same name already exists, `PSETEX` will overwrite the existing key's value and expiration time with the new values provided.
* **Data Types:** While the example shows strings, `PSETEX` can work with any data type supported by Redis. The data type of the `value` will determine how it's stored and interpreted.
* **Alternatives:**
    * Use `SET` for setting a key-value pair without expiration.
    * Use `EXPIRE` to set an expiration time for an existing key.
    * Consider `SETEX` if millisecond precision isn't crucial and second-level granularity is sufficient.

**Choosing Between `SETEX` and `PSETEX`:**

The choice between `SETEX` and `PSETEX` depends on the level of precision required for your expiration timeouts. If you need control down to the millisecond, `PSETEX` is the way to go. However, if seconds are sufficient for your use case, `SETEX` offers a simpler syntax.

---
**`GET` key**

* **Function:** Retrieves the value associated with a specific key.
* **Argument:**
    * `key`: The key whose value you want to retrieve (string).
* **Example:** `GET name` would return "Alice" if the previous `SET` command was executed.
---
**`MGET` key1 [key2 key3 ...]**

* **Function:** Retrieves the values of all the specified keys in a single atomic operation.
* **Arguments:**
  * `key1`, `key2`, `key3`, ...: A sequence of keys (strings) for which you want to retrieve the values.
* **Returns:**
  * An array reply, where each element in the array corresponds to the value retrieved for the respective key in the request order.
  * If a key does not exist, the special value `nil` is returned in its place within the array.
  * Error message if there are any issues with the arguments or the keys themselves.
* **Example:**
  ```bash
  SET name "Alice"
  SET age 30
  SET city "New York"

  MGET name age city non-existent-key  ; Requesting values for multiple keys
  ```

  This command might return an array reply like:

  ```
  1) "Alice"
  2) "30"
  3) "New York"
  4) nil  ; Key "non-existent-key" doesn't exist, so nil is returned
  ```

**Important Notes:**

* `MGET` is atomic, ensuring that all key retrievals happen as a single unit. This guarantees data consistency, even in high-traffic environments.
* It's efficient for fetching multiple values simultaneously, especially when you need the values for these specific keys together.
* `MGET` returns the values in the same order as the requested keys.


**Additional Considerations:**

* **Non-existent Keys:** As demonstrated in the example, `MGET` gracefully handles non-existent keys by returning `nil` in their place within the response array. This allows your application logic to deal with missing data appropriately.
* **Data Types:** While primarily used with strings, `MGET` can retrieve values of any data type supported by Redis (lists, sets, etc.). However, your code should be prepared to handle the specific data type returned for each key.
* **Alternative:** For retrieving a single key's value, use the `GET` command. `MGET` shines when you need to fetch values for multiple keys in one go.
---
**`GETSET` key value**

* **Function:** Sets the specified key to the given value and atomically returns the old value stored at the key.
* **Arguments:**
    * `key`: The key of the value to be set (string).
    * `value`: The new value to be set for the key (string or any data type supported by Redis).
* **Returns:**
    * The old value stored at the key before the `GETSET` operation (string or the data type of the previous value). If the key doesn't exist, the special value `nil` is returned.
    * Error message if there are any issues with the arguments or the key itself.
* **Example:**
  ```bash
  SET name "Alice"

  GETSET name "Bob"  ; Sets name to "Bob" and returns "Alice" (the old value)
  ```

**Important Notes:**

* `GETSET` performs two operations in a single atomic action:
    1. It retrieves the current value associated with the key.
    2. It sets the key to the provided new value.
* This atomicity ensures data consistency, even in high-concurrency scenarios. 
* `GETSET` is useful in situations where you need to:
    * Retrieve the existing value of a key.
    * Conditionally update the key's value only if it hasn't been modified since you retrieved it (using the returned value).

**Additional Considerations:**

* **Understanding `nil`:** If the key doesn't exist before using `GETSET`, the command will set the key to the provided value and return `nil` as the old value.
* **Data Types:** While the example shows strings, `GETSET` can work with any data type supported by Redis. The returned old value will match the data type previously stored at the key.
* **Alternative Uses:** While `GETSET` is often used for conditional updates, it can also be a simpler way to retrieve a value and set a new value in one go compared to separate `GET` and `SET` commands.
---
**`GETRANGE` or `SUBSTR` key start end**

* **Function:** Returns a substring of the string value stored at the specified key.
* **Arguments:**
    * `key`: The key of the string from which you want to extract a substring (string).
    * `start`: The zero-based index of the starting byte within the string (integer).
    * `end`: The zero-based index of the ending byte within the string (integer). Both `start` and `end` are inclusive. 
* **Returns:**
* A string reply containing the extracted substring.
* If the key does not exist, the special value `nil` is returned.
* An error message if there are any issues with the arguments or the key itself (e.g., invalid offsets, offsets exceeding string length).
* **Example:**
  ```bash
  SET message "Hello, World!"
  GETRANGE message 7 12        ; Extracts the substring "World" (starts at index 7, ends at 12)
  ```

**Important Notes:**

* `GETRANGE` is specifically designed for extracting substrings from string values. Attempting to use it with other data types will result in an error.
* It provides a way to retrieve a specific portion of a string without fetching the entire value.
* Both `start` and `end` indices are inclusive, meaning the extracted substring includes the characters at the specified start and end positions.

**Additional Considerations:**

* **Negative Offsets:** You can use negative offsets to specify positions relative to the end of the string. For example, `-1` refers to the last character, `-2` to the second-last character, and so on.
* **Out-of-Bounds Offsets:** If `start` is greater than `end`, an empty string is returned. If either `start` or `end` is out of the string's valid byte range (less than zero or greater than the string length minus one), the behavior depends on the Redis version. In some cases, an error might be thrown, while in others, a truncated substring might be returned. It's best to consult the Redis documentation for your specific version regarding edge cases.
* **Alternative:** If you need to manipulate the entire string or don't know the string length beforehand, consider using other string manipulation techniques offered by Redis (e.g., using Lua scripting).

### Key Management:
**`DEL` key**

* **Function:** Deletes one or more keys from the Redis database.
* **Argument:**
    * `key`: The key(s) to delete (can be a single key or multiple keys specified as arguments).
* **Example:** `DEL name` would remove the key "name" and its associated value.
* **Example-1** `DEL key1 key2 key3` 
---

**`EXISTS` key**

* **Function:** Checks if a specific key exists in the Redis database.
* **Argument:**
    * `key`: The key whose existence you want to verify (string).
* **Returns:**
    * 1 if the key exists.
    * 0 if the key does not exist.
* **Example**
  ```bash
  EXISTS name
  ```
---
**`RENAME` key newkey**

* **Function:** Renames a key to a new name.
* **Arguments:**
    * `key`: The existing key name that you want to rename (string).
    * `newkey`: The new name to assign to the key (string).
* **Returns:**
    * Simple string reply stating "OK" if the key was successfully renamed.
    * Error if `key` does not exist or `key` is equal to `newkey`.
* **Example:**
  ```bash
  SET oldkey "value"
  RENAME oldkey newkey  ; Renames "oldkey" to "newkey"
  GET newkey  ; Retrieves the value stored under the new key name
  ```

**Important Notes:**
* The `RENAME` command changes the name of `key` to `newkey`.
* If `newkey` already exists, it will be overwritten by `key`.
* Atomic operation: Renaming a key with `RENAME` is atomic, meaning it either completes successfully or does not change the database state at all.

---
**`RENAMENX` key newkey**

* **Function:** Renames a key to a new name, but only if the new key name does not already exist.
* **Arguments:**
    * `key`: The existing key name that you want to rename (string).
    * `newkey`: The new name to assign to the key (string).
* **Returns:**
    * 1 if the key was successfully renamed.
    * 0 if the new key name already exists and the rename did not occur.
    * Error if `key` does not exist or `key` is equal to `newkey`.
* **Example:**
  ```bash
  SET oldkey "value"
  SET anotherkey "othervalue"
  
  RENAMENX oldkey newkey  ; Renames "oldkey" to "newkey" since "newkey" does not exist
  RENAMENX anotherkey newkey  ; Fails because "newkey" already exists
  ```

**Important Notes:**
* The `RENAMENX` command only renames the key if `newkey` does not already exist.
* This command ensures that existing keys are not accidentally overwritten.
* Use `RENAMENX` to safely rename keys when there is a risk of key name conflicts.
---
**`UNLINK` key [key ...]**

* **Function:** Asynchronously deletes one or more keys from the Redis database. Unlike `DEL`, which blocks the server while performing the deletion, `UNLINK` allows Redis to continue processing other commands.
* **Arguments:**
    * `key`: The key(s) to delete. Multiple keys can be specified.
* **Returns:**
    * The number of keys that were successfully removed.
* **Example:**
  ```bash
  SET key1 "value1"
  SET key2 "value2"
  UNLINK key1 key2  ; Asynchronously removes "key1" and "key2"
  ```

**Important Notes:**
* The `UNLINK` command is useful for deleting large keys or a large number of keys without blocking the Redis server.
* While `DEL` performs the deletion immediately and blocks until the operation is complete, `UNLINK` delegates the deletion to a background thread, allowing Redis to continue handling other operations.
* Use `UNLINK` to improve the responsiveness of your Redis server, especially when dealing with keys that hold large data structures or when performing batch deletions.
* The command is part of Redis' effort to provide non-blocking alternatives to time-consuming operations, enhancing overall performance and scalability.

---
**`TYPE` key**

* **Function:** Returns the data type of the value stored at the specified key.
* **Arguments:**
    * `key`: The key for which you want to check the data type (string).
* **Returns:**
    * A string indicating the type of the value stored at the key. Possible return values include:
        * `string` for string values.
        * `list` for list values.
        * `set` for set values.
        * `zset` for sorted set values.
        * `hash` for hash values.
        * `stream` for stream values.
        * `none` if the key does not exist.
* **Example:**
  ```bash
  SET name "Alice"
  TYPE name  ; Returns "string"
  
  LPUSH mylist "item"
  TYPE mylist  ; Returns "list"
  
  TYPE nonexistingkey  ; Returns "none"
  ```

**Important Notes:**
* The `TYPE` command helps you understand the kind of data structure associated with a given key.
* This is useful for debugging and when interacting with Redis keys in a dynamic application environment where the type of data stored under certain keys may vary.
* Knowing the data type is crucial when performing operations that are specific to certain types, such as list operations on a key that stores a list or set operations on a key that stores a set.
---
**`STRLEN` key**

* **Function:** Returns the length of the string value stored at the specified key.
* **Arguments:**
  * `key`: The key of the string for which you want to get the length (string).
* **Returns:**
  * The length of the string stored at the key (integer). If the key does not exist, it returns 0.
* **Example:**
  ```bash
  SET name "Alice"
  STRLEN name        ; Returns 5 (length of the string "Alice")

  SET empty_string ""
  STRLEN empty_string  ; Returns 0 (length of the empty string)

  NONEXISTING_KEY    ; This key doesn't exist
  STRLEN NONEXISTING_KEY  ; Returns 0 (length of the non-existent key)
  ```
* **Important Notes:**

    * `STRLEN` only works with string values. Using it with other data types will result in an error.
    * It's a very lightweight and efficient operation, making it suitable for retrieving string lengths quickly.
* **Additional Considerations:**
    * **Understanding Length:** The returned length represents the number of bytes used to store the string value in Redis. This might differ from the perceived length if the string contains multi-byte characters depending on the character encoding used by Redis.
* **Use Cases:** Knowing the string length is beneficial for various scenarios:
    * Checking if a string is empty before performing operations on it.
    * Implementing string manipulation functions that require knowledge of the string's size.
    * Optimizing memory usage when dealing with large strings.
---
**`SCAN cursor [MATCH pattern] [COUNT count]`**

* **Function:** Iterates over a collection of elements in the Redis database using a cursor-based approach. 
* **Arguments:**
    * `cursor`: This is a unique identifier returned by a previous `SCAN` call. It allows you to resume scanning from where you left off (discussed later). For the first scan, use `0` as the cursor.
    * `MATCH pattern` (Optional): Filters the scan results to include only keys matching a specific pattern using the wildcard characters `*` (matches any sequence of characters) and `?` (matches a single character).
    * `COUNT count` (Optional): Specifies the maximum number of key-value pairs to be returned in the current scan iteration. This helps control the amount of data retrieved in each call.
* **Returns:**
    * A list containing two elements:
        * The new cursor value (string) to be used in the next `SCAN` call to continue iterating. When no more elements are available, the cursor will be `0`.
        * An array of key-value pairs (where each element is itself an array with the key and its corresponding value).
    * Error message if there are any issues with the arguments.
* **Example:**
  ```bash
  # Scan all keys (no pattern or count specified)
  SCAN 0  ; Returns cursor and an array of key-value pairs

  # Scan keys matching the pattern "user*" and retrieve at most 2 entries
  SCAN 0 MATCH "user*" COUNT 2  ; Returns cursor and an array with max 2 key-value pairs matching the pattern
  ```

**Important Notes:**

* `SCAN` is a cursor-based iterator, meaning it retrieves results in chunks and provides a cursor to continue from the last retrieved element in subsequent calls. 
* This approach is efficient for handling large datasets, as it avoids transferring the entire dataset at once.
* `SCAN` works with different data types stored in Redis (keys for sets, lists, hashes, etc.). The returned value will be the data type of the key itself.

**Additional Considerations:**

* **Cursor Handling:** It's crucial to keep track of the cursor and use it in subsequent `SCAN` calls to continue iterating. When the cursor becomes `0`, there are no more elements to scan.
* **Pattern Matching:** The optional `MATCH` argument allows you to filter the scan results based on a specific pattern. This can be helpful for retrieving keys within a specific namespace or category.
* **Count Limit:** The optional `COUNT` argument helps control the number of key-value pairs returned in each scan iteration. This is beneficial for throttling data retrieval or breaking down large scans into smaller chunks.

---
### Expiration Control:

**`EXPIRE` key `seconds`**

* **Function:** Sets a TTL (Time To Live) value on a key, specifying when it should automatically expire and be removed from the database.
* **Arguments:**
    * `key`: The key for which you want to set an expiration (string).
    * `seconds`: The duration in seconds before the key expires (integer).
* **Example:** `EXPIRE name 300` would set the key "name" to expire after 300 seconds (5 minutes).

**`TTL` key**

* **Function:** Checks the remaining time to live (TTL) for a key that has an expiration set.
* **Argument:**
    * `key`: The key for which you want to retrieve the remaining TTL (string).
* **Returns:**
    * An integer representing the remaining time in seconds before the key expires:
        * Positive value: Indicates the number of seconds remaining.
        * -2: The key does not exist.
        * -1: The key exists but does not have an expiration set.
*  **Example:**
  ```bash
  SET name "Alice"
  EXPIRE name 300 
  TTL name
  ```
---

**`PTTL` key**

* **Function:** Checks the remaining time to live (TTL) for a key that has an expiration set, in milliseconds.
* **Argument:**
    * `key`: The key for which you want to retrieve the remaining TTL (string).
* **Returns:**
    * An integer representing the remaining time in milliseconds before the key expires:
        * Positive value: Indicates the number of milliseconds remaining.
        * -2: The key does not exist.
        * -1: The key exists but does not have an expiration set.

**Example:**

```
SET name "Alice"
EXPIRE name 300  ; Set expiration for "name" to 300 seconds

; Check remaining TTL in milliseconds after some time
PTTL name
```
**Key Difference between `TTL` and `PTTL`:**

The primary difference lies in the unit of the returned value. `TTL` provides the remaining time in seconds, while `PTTL` offers the information in milliseconds.
* **Important Notes:**
  * `PTTL` works similarly to `TTL`, but the return value is in milliseconds instead of seconds.
  * It applies to keys with an existing expiration. It will return -1 for keys without an expiration.
---

**`PX` key milliseconds**

* **Function:** Sets a time-to-live (TTL) for a key in milliseconds, similar to `EXPIRE` but with a finer-grained control over the expiration time.
* **Arguments:**
    * `key`: The key for which you want to set an expiration (string).
    * `milliseconds`: The duration in milliseconds before the key expires (positive integer).
* **Returns:**
    * Simple string reply stating "OK" if the command executed successfully.

**Example:**

```bash
SET name "Alice"
PX name 1800000  ; Set expiration for "name" to 1800000 milliseconds (30 minutes)
```

**Key Differences between `PX` and `EXPIRE`:**

* **Time Unit:** `PX` uses milliseconds for expiration, while `EXPIRE` uses seconds.
* **Resolution:** `PX` offers more precise control over expiration times in smaller increments (milliseconds).
* **Important Notes:**
  * Just like `EXPIRE`, `PX` only affects keys with an existing expiration. It won't change the behavior of keys without a TTL set.
---

**`PEXPIRE` key milliseconds**

* **Function:** Sets a time-to-live (TTL) for a key in milliseconds, similar to `PX` but acts like an atomic (indivisible) operation.
* **Arguments:**
    * `key`: The key for which you want to set an expiration (string).
    * `milliseconds`: The duration in milliseconds before the key expires (positive integer).
* **Returns:**
    * Simple string reply stating "1" if the key was created or the expiration was updated successfully.
    * Simple string reply stating "0" if the key already exists and its TTL was not updated due to the new value being greater than the existing expiration (similar to the behavior of the SETNX command for setting values conditionally).

**Example:**

```bash
SET name "Alice"  ; Assuming the key "name" does not exist yet
PEXPIRE name 1800000  ; Set expiration for "name" to 1800000 milliseconds (30 minutes)

; Try setting a shorter expiration if the key already exists
PEXPIRE name 900000  ; Might return "0" if "name" already has a longer TTL
```

**Key Differences between `PEXPIRE` and `PX`:**

* **Atomicity:** `PEXPIRE` guarantees an atomic operation, meaning the key creation and expiration setting happen as a single, indivisible step. This can be useful in scenarios where you want to ensure the key doesn't exist before setting the expiration.
* **Conditional Update:** `PEXPIRE` won't update the expiration if the key already exists and the provided value is greater than the current TTL. 
* **Return Value:** `PEXPIRE` provides a success indicator ("1") or an indication that the update wasn't applied ("0"), while `PX` simply returns "OK" on success.

---
**`PERSIST` key**

* **Function:** Removes any existing expiration timeout from a key, turning it into a persistent key.
* **Argument:**
    * `key`: The key for which you want to remove the expiration (string).
* **Returns:**
    * Simple string reply stating "1" if the expiration was successfully removed.
    * Simple string reply stating "0" if the key does not exist.

**Example:**

```bash
SET name "Alice"
EXPIRE name 300  ; Set expiration for "name" to 300 seconds

; Later...
PERSIST name

TTL name  ; Should now return -1 (key exists but has no expiration)
```

**Important Notes:**

* `PERSIST` only affects keys that currently have an expiration set. It has no effect on keys that are already persistent (no TTL).

---
### Database Management

**`SELECT` index**

* **Function:** Switches the connection to a different Redis database.
* **Argument:**
    * `index`: The zero-based index of the database to select (integer).
* **Returns:**
    * Simple string reply stating "OK" if the command executed successfully.
* **Example:**
  ```bash
  SELECT 1  ; Switch to the second database (index 1)
  ```

**Important Notes:**
* Redis supports multiple databases, which are identified by index numbers starting from 0.
* The `SELECT` command changes the current database for the connection. Subsequent commands will operate on the selected database until another `SELECT` command is issued.
* By default, Redis uses database 0 if no `SELECT` command is issued.

**`KEYS` pattern**

* **Function:** Finds all keys matching a given pattern in the Redis database.
* **Argument:**
    * `pattern`: The pattern to match keys against (string). Wildcards supported:
        * `*`: Matches zero or more characters.
        * `?`: Matches exactly one character.
        * `[abc]`: Matches any one of the characters in the brackets.
* **Returns:**
    * An array of keys that match the given pattern.
* **Example:**
  ```bash
  SET name "Alice"
  SET age "30"
  SET address "123 Main St"
  
  KEYS *  ; Returns all keys: ["name", "age", "address"]
  KEYS a*  ; Returns keys starting with 'a': ["age", "address"]
  KEYS ?ame  ; Returns keys with one character followed by "ame": ["name"]
  ```

**Important Notes:**
* The `KEYS` command can be slow if the database contains a large number of keys, as it scans the entire keyspace.
* It is generally recommended to use `SCAN` for pattern matching in production environments to avoid performance issues.
* `KEYS` is useful for debugging and development, but should be used with caution in production due to its potential impact on performance.

**`FLUSHDB`**

* **Function:** Deletes all keys from the currently selected Redis database.
* **Returns:**
    * Simple string reply stating "

OK" if the command executed successfully.
* **Example:**
  ```bash
  FLUSHDB  ; This command will remove all keys from the current database
  ```

**Important Notes:**
* `FLUSHDB` only affects the current database, not all databases in Redis.
* Use with caution, as this command will permanently remove all data in the selected database.
* Useful in scenarios where you need to clear all data quickly, such as resetting the database state during development or testing.

---

**`FLUSHALL`**

* **Function:** Deletes all keys from all databases in the Redis instance.
* **Returns:**
    * Simple string reply stating "OK" if the command executed successfully.
* **Example:**
  ```bash
  FLUSHALL  ; This command will remove all keys from all databases in the Redis instance
  ```

**Important Notes:**
* `FLUSHALL` affects every database in the Redis instance, not just the currently selected one.
* Use with extreme caution, as this command will permanently remove all data across all databases.
* Typically used in scenarios where a complete reset of the Redis instance is required.

---
