**1. New Options for the `SET` Command:**

Redis 6.2 introduces three new options for the [`SET` command]([https://redis.io/commands/set](https://redis.io/commands/set)):

* **`GET`**: This option retrieves the previous value of a key while setting a new one.  For instance, you can use it to get the old favorite flavor before setting a new one:

```bash
SET favoriteflavor "Mint Choc Chip" GET
```

* **`EXAT`**: This option allows you to set an expiry timestamp for a key while setting its value.  Here, we set a coupon code to expire at a specific time:

```bash
SET couponcode halfoff EXAT 1640937600
```

* **`PXAT`**: This option works similarly to `EXAT` but uses milliseconds for the expiry timestamp.

**2. New Alternatives to the `GET` Command:**

Redis 6.2 introduces two new commands that offer alternatives to the basic `GET` command:

* **`GETEX`**: This command retrieves the value of a key and simultaneously sets an expiry time for it.  This is useful for scenarios where you want the data to be available only for a limited duration.

```bash
GETEX limitedtimecoupon EX 7200  # Get value and set expiry to 2 hours
```

* **`GETDEL`**: This command retrieves the value of a key and then deletes the key itself.  This is particularly useful for one-time use cases like coupon codes.

```bash
GETDEL onetimecoupon  # Get value and delete the coupon
```

**3. Streams: MINID Trimming Strategy**

Previously, Redis streams offered the `MAXLEN` option to trim streams based on the number of entries.  Redis 6.2 introduces a new trimming strategy called `MINID`.  This strategy allows you to trim a stream based on a minimum ID, effectively removing entries older than a specific point in time.  This aligns better with how consumers typically read streams.

The provided sample data includes a stream named `redemptions` for ice cream coupon redemptions.  You can use the `XTRIM` command with the `MINID` option to trim this stream.

**4. Hashes: HRANDFIELD Command**

The new [`HRANDFIELD` command]([https://redis.io/commands/hrandfield](https://redis.io/commands/hrandfield)) allows you to retrieve one or more random fields from a Redis Hash.  Optionally, you can also get the corresponding values.  This is helpful in scenarios where you want to pick random elements from a set of options, like choosing a random restaurant dish from a menu.

The provided sample data has a hash named `entrees` that stores various dishes.  You can use `HRANDFIELD` to get random entree names or both the name and the number associated with the dish.

**5. Sets: SMISMEMBER Command**

The new [`SMISMEMBER` command]([https://redis.io/commands/smismember](https://redis.io/commands/smismember)) is a more efficient way to check for membership of multiple elements in a set.  Previously, you would have had to use the `SISMEMBER` command for each element individually.  `SMISMEMBER` returns 1 for a matching element and 0 otherwise.

---

**1. New Options for the `SET` Command:**

* **Example: Combining `SET` with `GET`**

Imagine you have a user's shopping cart stored as a Redis Set. You might want to add a new item while also checking if a specific item is already present:

```bash
SET mycart "apples"  # Add "apples" to the cart
127.0.0.1:6379> SISMEMBER mycart "apples"  # Check if "apples" is now in the cart
(integer) 1

SET mycart "oranges" GET  # Add "oranges" and get the previous contents
"apples"
127.0.0.1:6379> SISMEMBER mycart "oranges"  # Now both "apples" and "oranges" are present
(integer) 1
```

* **Example: Automatic Key Expiration with `EXAT`**

Suppose you're storing temporary discount codes. You can set them to expire automatically at a specific date and time using `EXAT`:

```bash
SET discountcode "SUMMERFUN" EXAT 1645094400  # Code expires on 2024-02-15 00:00:00 UTC
```

* **Example: Millisecond Precision with `PXAT`**

If you need even finer control over expiry times, use `PXAT` to specify expiry in milliseconds. Here, a temporary session might expire after 15 minutes:

```bash
SET sessionid "abcd1234" PXAT 900000  # Session expires after 15 minutes (900000 milliseconds)
```

**2. New Alternatives to the `GET` Command:**

* **Example: Conditional Expiry with `GETEX`**

Let's say you're caching frequently accessed data but want to refresh it periodically. Use `GETEX` to retrieve the data and set a short expiry if it doesn't already exist:

```bash
GETEX product_data EX 300  # Get product data and set 5-minute expiry if not present

# Later...

GETEX product_data EX 300  # Retrieve potentially updated product data and refresh expiry
```

* **Example: One-Time Use with `GETDEL`**

Imagine you're generating unique download links. You can use `GETDEL` to provide the link and then immediately delete it to prevent reuse:

```bash
SET downloadlink "https://files.example.com/myfile.zip"
127.0.0.1:6379> GETDEL downloadlink
"https://files.example.com/myfile.zip"

# Trying to use the same link again will return nil
127.0.0.1:6379> GET downloadlink
(nil)
```

**3. Streams: `MINID` Trimming Strategy (Example Continued)**

Building on the `redemptions` stream example, let's say you only care about recent redemptions from the last day. Here's how to trim the stream using `XTRIM` with `MINID`:

```bash
# Discover the minimum ID of an entry from yesterday
127.0.0.1:6379> xrevrange redemptions + - count 1
1) 1) "1617314919000-0"  # Yesterday's redemption

# Trim the stream to keep only entries with IDs greater than or equal to yesterday's
127.0.0.1:6379> xtrim redemptions MINID 1617314919000
(integer) 16  # Number of entries removed

# Verify that older entries are gone
127.0.0.1:6379> xrange redemptions - + count 1
1) 1) "1617314919000-0"  # Yesterday's entry is the first remaining
```

---

## More on Redis 6.2 changes with Examples

Here are some more details on the changes introduced in Redis 6.2 with examples for the commands mentioned other than the SET command:

**1. GETEX Command**

* **Use Cases**

  The `GETEX` command is useful in scenarios where you want to retrieve a value from Redis while also setting an expiration time on that key. This can be helpful for caching data that is expected to be valid only for a limited duration.

  For instance, imagine you have a web application that displays frequently changing news headlines. You can store these headlines in Redis using `SET` along with an appropriate expiry using `GETEX`. This way, your application retrieves fresh headlines from the source periodically and updates the Redis cache. Clients can then efficiently read the headlines from the cache without needing to hit the external source every single time.

* **Example**

  ```bash
  SET news_headlines "Top 10 Stories Today"  # Store the news headlines
  GETEX news_headlines EX 3600  # Get headlines and set expiry to 1 hour
  ```

**2. HRANDFIELD Command**

* **Use Cases**

  The `HRANDFIELD` command comes in handy when you want to pick random elements from a collection of data stored in a Redis Hash. This can be used in various applications, such as:

    * Recommendation systems: You can use `HRANDFIELD` to recommend random products to users based on their purchase history or browsing behavior stored in Hashes.
    * Gamification: In games, you can leverage `HRANDFIELD` to pick random items or rewards for players.

* **Example**

  Let's say you have a Redis Hash named `movies` that stores information about different movies, including their titles and genres. You can use `HRANDFIELD` to suggest a random movie to a user:

  ```bash
  HSET movies "movie1" "action"
  HSET movies "movie2" "comedy"
  HSET movies "movie3" "thriller"
  HRANDFIELD movies 1  # Get a random movie title
  ```

**3. SMISMEMBER Command**

* **Use Cases**

  The `SMISMEMBER` command is particularly useful for checking membership of multiple elements in a set efficiently. This can be beneficial in scenarios where you need to verify if specific items exist within a set concurrently.

  For example, consider an e-commerce application where you have a set named `active_users` that stores IDs of users who are currently logged in. You can use `SMISMEMBER` to check if multiple user IDs correspond to active users.

* **Example**

  ```bash
  SADD active_users user1 user2 user3  # Add users to the active users set
  SMISMEMBER active_users user2 user4 user1  # Check membership for multiple users
  ```
