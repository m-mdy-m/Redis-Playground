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

**`EXISTS` key**

* **Function:** Checks if a specific key exists in the Redis database.
* **Argument:**
    * `key`: The key whose existence you want to verify (string).
* **Returns:**
    * 1 if the key exists.
    * 0 if the key does not exist.

**`EXPIRE` key `seconds`**

* **Function:** Sets a TTL (Time To Live) value on a key, specifying when it should automatically expire and be removed from the database.
* **Arguments:**
    * `key`: The key for which you want to set an expiration (string).
    * `seconds`: The duration in seconds before the key expires (integer).
* **Example:** `EXPIRE name 300` would set the key "name" to expire after 300 seconds (5 minutes).

**`MGET` key1 key2 ... keyN**

* **Function:** Retrieves the values of multiple keys in a single command.
* **Arguments:**
    * `key1`, `key2`, ..., `keyN`: A list of keys whose values you want to retrieve (strings).
* **Returns:**
    * A list of values corresponding to the order of the provided keys.

**`SETNX` key value**

* **Function:** Sets the value of a key only if the key does not already exist in the database.
* **Arguments:**
    * `key`: The key to set (string).
    * `value`: The value to store (can be any supported data type).
* **Returns:**
    * 1 if the key was successfully set.
    * 0 if the key already existed.

**`INCR` key**

* **Function:** Increments the value of a key by 1 (assuming the key stores a numeric value).
* **Argument:**
    * `key`: The key whose value you want to increment (string).
* **Example:** Assuming the key "count" has the value 5, `INCR count` would increment it to 6.

**`DECR` key**

* **Function:** Decrements the value of a key by 1 (assuming the key stores a numeric value).
* **Argument:**
    * `key`: The key whose value you want to decrement (string).
