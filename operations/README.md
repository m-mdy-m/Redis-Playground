**`INCR` key**

* **Function:** Increments the numeric value stored at the specified key by 1.
* **Arguments:**
    * `key`: The key of the value to increment (string).
* **Returns:**
    * The new value of the key after the increment (integer). If the key does not exist or contains a value of the wrong type (e.g., a string that cannot be parsed as a number), an error is returned.
* **Example:**
    ```bash
    SET counter 0
    INCR counter        ; Increments the value of "counter" to 1
    GET counter        ; Returns 1 (the new value)
    ```
* **Important Notes:**
    * `INCR` is atomic, meaning the entire operation (reading the current value, incrementing it, and writing the new value) happens as a single unit. This ensures data consistency even in high-concurrency scenarios.
    * `INCR` only works with numeric values. If the key exists but holds a non-numeric value (e.g., a string), an error will occur.
    * For incrementing by a value other than 1, use the `INCRBY` command (explained later).

* **Additional Considerations:**
    * **Key Creation:** If the key doesn't exist before using `INCR`, it will be automatically created with an initial value of 0 before being incremented.
    * **Overflow:** Since `INCR` operates on 64-bit signed integers, there's a maximum value it can reach. If the incremented value overflows this limit, an error will occur.
---
**`INCRBY` key increment**

* **Function:** Increments the numeric value stored at the specified key by a given amount.
* **Arguments:**
    * `key`: The key of the value to increment (string).
    * `increment`: The amount by which to increment the value (integer).
* **Returns:**
    * The new value of the key after the increment (integer). If the key does not exist or contains a value of the wrong type (e.g., a string that cannot be parsed as a number), an error is returned.
* **Example:**
    ```bash
    SET counter 10
    INCRBY counter 5        ; Increments the value of "counter" by 5 (becomes 15)
    GET counter        ; Returns 15 (the new value)
    ```
* **Important Notes:**
    * `INCRBY` offers more flexibility than `INCR` by allowing you to specify the increment amount.
    * It maintains the atomicity property, guaranteeing a consistent operation even in high-concurrency scenarios.
    * Similar to `INCR`, `INCRBY` only works with numeric values. Using it on non-numeric keys will result in an error.
* **Additional Considerations:**
    * **Key Creation:** If the key doesn't exist before using `INCRBY`, it will be created automatically with an initial value of 0 before being incremented by the specified amount.
    * **Overflow and Underflow:** As `INCRBY` deals with 64-bit signed integers, there are maximum and minimum limits. Overflow occurs if the incremented value surpasses the maximum limit, while underflow happens if the decremented value falls below the minimum limit. Both scenarios lead to errors.
---
**`INCRBYFLOAT` key increment**

* **Function:** Increments the floating-point number value stored at the specified key by a given amount.
* **Arguments:**
    * `key`: The key of the value to increment (string).
    * `increment`: The amount (floating-point number) by which to increment the value.
* **Returns:**
    * The new value of the key after the increment (floating-point number). If the key does not exist or contains a value of the wrong type (e.g., a string that cannot be parsed as a floating-point number), an error is returned.
* **Example:**
    ```bash
    SET balance 10.50
    INCRBYFLOAT balance 2.75        ; Increments the value of "balance" by 2.75 (becomes 13.25)
    GET balance        ; Returns 13.25 (the new value)
    ```

**Important Notes:**

* `INCRBYFLOAT` is specifically designed for working with floating-point numbers, allowing you to perform precise increments on values with decimals.
* It maintains the atomicity property, guaranteeing a consistent operation even in high-concurrency environments.
* Unlike `INCRBY`, `INCRBYFLOAT` can handle both positive and negative increments for the specified amount.

**Additional Considerations:**

* **Key Creation:** If the key doesn't exist before using `INCRBYFLOAT`, it will be created automatically with an initial value of 0.0 before being incremented by the specified amount.
* **Overflow and Underflow:** Since `INCRBYFLOAT` deals with floating-point numbers, there are practical limits to how large or small the value can become. Extreme increments might lead to unexpected behavior due to precision limitations.
---
**`DECR` key**

* **Function:** Decrements the numeric value stored at the specified key by 1.
* **Arguments:**
    * `key`: The key of the value to decrement (string).
* **Returns:**
    * The new value of the key after the decrement (integer). If the key does not exist or contains a value of the wrong type (e.g., a string that cannot be parsed as a number), an error is returned.
* **Example:**
    ```bash
    SET counter 5
    DECR counter        ; Decrements the value of "counter" to 4
    GET counter        ; Returns 4 (the new value)
    ```
* **Important Notes:**
    * Like `INCR`, `DECR` is atomic, ensuring data consistency in high-traffic environments.
    * It only operates on numeric values. Attempting to decrement a non-numeric key will result in an error.
    * To decrement by a value other than 1, use the `DECRBY` command (explained later).

* **Additional Considerations:**

    * **Key Creation:** If the key doesn't exist before using `DECR`, it will be automatically created with an initial value of 0. This value will then be decremented by 1, resulting in a final value of -1.
    * **Underflow:** Since `DECR` works with 64-bit signed integers, there's a minimum value it can reach. Decrementing a value below this limit will lead to an underflow error.
---
**`DECRBY` key decrement**

* **Function:** Decrements the numeric value stored at the specified key by a given amount.
* **Arguments:**
    * `key`: The key of the value to decrement (string).
    * `decrement`: The amount by which to decrement the value (integer).
* **Returns:**
    * The new value of the key after the decrement (integer). If the key does not exist or contains a value of the wrong type (e.g., a string that cannot be parsed as a number), an error is returned.
* **Example:**
    ```bash
    SET counter 20
    DECRBY counter 7        ; Decrements the value of "counter" by 7 (becomes 13)
    GET counter        ; Returns 13 (the new value)
    ```
* **Important Notes:**
    * `DECRBY` provides fine-grained control by allowing you to specify the decrement amount.
    * It adheres to the atomicity principle, ensuring data consistency even under high traffic.
    * Just like `DECR`, `DECRBY` only operates on numeric values. Attempting to decrement a non-numeric key will result in an error.
* **Additional Considerations:**
    * **Key Creation:** If the key doesn't exist before using `DECRBY`, it will be created automatically with an initial value of 0. This value will then be decremented by the specified amount.
    * **Underflow:** Remember that `DECRBY` works with 64-bit signed integers. There's a minimum value it can reach. Decrementing below this limit will lead to an underflow error.
---
**`DECRBYFLOAT` key decrement**

* **Function:** Decrements the floating-point number value stored at the specified key by a given amount.
* **Arguments:**
    * `key`: The key of the value to decrement (string).
    * `decrement`: The amount (floating-point number) by which to decrement the value.
* **Returns:**
    * The new value of the key after the decrement (floating-point number). If the key does not exist or contains a value of the wrong type (e.g., a string that cannot be parsed as a floating-point number), an error is returned.
* **Example:**
    ```bash
    SET price 5.99
    DECRBYFLOAT price 1.25        ; Decrements the value of "price" by 1.25 (becomes 4.74)
    GET price        ; Returns 4.74 (the new value)
    ```

**Important Notes:**

* `DECRBYFLOAT` is the counterpart to `INCRBYFLOAT`, enabling you to precisely decrement floating-point number values.
* It adheres to the atomicity principle, ensuring data consistency even under high traffic.
* Similar to `INCRBYFLOAT`, `DECRBYFLOAT` can handle both positive and negative decrements for the specified amount (a positive value in this case would act as an increment).


**Additional Considerations:**

* **Key Creation:** If the key doesn't exist before using `DECRBYFLOAT`, it will be automatically created with an initial value of 0.0 before being decremented by the specified amount.
* **Underflow:** Remember that `DECRBYFLOAT` works with floating-point numbers. There's a minimum value it can reach. Decrementing below this limit might lead to unexpected behavior due to precision limitations.

**Key Difference from `DECRBY`:**

While `DECRBY` specifically works with integer values, `DECRBYFLOAT` caters to floating-point numbers, offering more granular control for scenarios requiring precise decimal adjustments.