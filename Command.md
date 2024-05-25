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
**`GET` key**

* **Function:** Retrieves the value associated with a specific key.
* **Argument:**
    * `key`: The key whose value you want to retrieve (string).
* **Example:** `GET name` would return "Alice" if the previous `SET` command was executed.

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
