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
**`SET` key value**

* **Function:** Creates a new key-value pair in the Redis database.
* **Arguments:**
    * `key`: A unique identifier for your data (string).
    * `value`: The data you want to store (can be a string, list, hash, set, or other supported data type).
* **Example:** `SET name "Alice"` stores the string "Alice" under the key "name".

**`GET` key**

* **Function:** Retrieves the value associated with a specific key.
* **Argument:**
    * `key`: The key whose value you want to retrieve (string).
* **Example:** `GET name` would return "Alice" if the previous `SET` command was executed.

**`DEL` key**

* **Function:** Deletes one or more keys from the Redis database.
* **Argument:**
    * `key`: The key(s) to delete (can be a single key or multiple keys specified as arguments).
* **Example:** `DEL name` would remove the key "name" and its associated value.
* **Example-1** `DEL key1 key2 key3` 

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