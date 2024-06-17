**New Features**

* **Role-based LDAP integration:** This feature allows you to integrate Redis with an LDAP server to control access to Redis commands and instances. This is useful for organizations that need to manage access to Redis based on user roles and groups.

**Example:**

```
redis-server --requirepass "$(ldapsearch -x -H "ldap://ldap.example.com" -b "dc=example,dc=com" -W "(cn=%u)" dn uid | cut -d, -f 1 | sed 's/dn=//')"
```

This command will start a Redis server that requires users to authenticate with an LDAP server before they can execute any commands. The `requirepass` option sets the password to the user's LDAP DN.

* **Enhanced client mutual authentication:** This feature allows you to require clients to authenticate with Redis using mutual TLS certificates. This is useful for organizations that need to ensure that only authorized clients can connect to Redis.

**Example:**

```
redis-server --tls-require-client-cert --tls-ca /path/to/ca.crt
```

This command will start a Redis server that requires clients to present a TLS certificate to connect. The `tls-ca` option specifies the path to the CA certificate that Redis will use to validate client certificates.

* **Active-Active improvements:** Redis 6.2 includes several improvements for Active-Active deployments, including:

    * **Support for eviction policies:** Redis 6.2 now supports eviction policies in Active-Active deployments. This allows you to control how Redis evicts data from memory when it is running low on space.
    * **Support for migration:** Redis 6.2 now supports migration of data between Active-Active nodes. This allows you to move data from one node to another without downtime.
    * **Improved BITFIELD support:** Redis 6.2 includes several improvements to BITFIELD support in Active-Active deployments. This makes it easier to use BITFIELD commands in Active-Active deployments.

**Example:**

```
redis-failover --active-active
```

This command will start Redis in Active-Active mode. The `--active-active` option tells Redis to use the Active-Active configuration file.

**Other Changes**

* **Full TLS 1.3 support:** Redis 6.2 now supports TLS 1.3, the latest version of the TLS protocol. This is a major security improvement that will help to protect Redis deployments from eavesdropping and man-in-the-middle attacks.

* **Automatic recovery configuration:** Redis 6.2 now includes an automatic recovery configuration feature. This feature can automatically restart Redis nodes that have failed.

* **Full IPv6 support:** Redis 6.2 now supports IPv6, the latest version of the IP protocol. This means that Redis can be deployed on IPv6 networks.

**Overall, Redis 6.2 is a major release that includes a number of new features and improvements. These changes make Redis more secure, scalable, and easier to use.**

## Major changes in Redis version 7.0

Redis 7.0 brings a significant leap forward with a focus on functionality, security, and developer experience. Here's a breakdown of the key changes:

**1. Redis Functions:**

* This is a major addition, replacing the need for EVAL scripts. Functions are first-class citizens in Redis, loaded at startup and callable by various applications. They offer several advantages:
    * **Improved Security:** Functions reside within the Redis server, reducing the attack surface compared to Lua scripts.
    * **Durability:** Functions can be persisted for later use, unlike temporary Lua scripts.
    * **Scalability:** Functions can be called from multiple clients and applications, promoting better resource utilization.

**2. ACLv2 (Access Control Lists version 2):**

* This enhanced access control system offers more granular control over user permissions. It introduces selectors, allowing you to define access rules based on specific key patterns or data types. This enables a more secure and flexible approach to managing user access.

**3. Command Introspection:**

* This new feature provides valuable insights into available Redis commands. You can use the `COMMAND` command with various subcommands to:
    * List all available commands.
    * Get details about a specific command, including its arguments, return types, and complexity.
    * Discover deprecated commands and their recommended replacements.

**4. Sharded Pub/Sub:**

* This improvement enhances the Publish/Subscribe functionality for distributed deployments. It allows messages to be published to specific Redis shards, ensuring efficient delivery to interested subscribers across a sharded cluster. This is particularly beneficial for large-scale applications with high message volumes.

**5. Other Breaking Changes:**

* **Lua Script Changes:** The `print` function is removed from Lua scripting due to potential security risks. Developers should use `redis.log` for logging purposes.
* **External Key Access Restriction:** External key access patterns now require explicit ACL permissions for the `SORT` command with full access to all keys. This strengthens security by preventing unauthorized access to potentially sensitive data.

**6. Additional Improvements:**

* **Improved bitmap, list, set, sorted set, and stream data types:** These core data structures receive additional functionalities to support a wider range of use cases.
* **Enhanced cache semantics:** Cache semantics are extended to support existential and comparative modifiers, offering more control over data caching behavior.


**In summary, Redis 7.0 delivers a significant upgrade with a focus on security, scalability, developer experience, and improved core functionalities. The introduction of Redis Functions, enhanced ACL, and Sharded Pub/Sub mark key advancements for managing data and access control in modern applications.**
