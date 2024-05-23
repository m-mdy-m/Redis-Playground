## Redis Commands Summary
### **official Redis documentation** >> [https://redis.io/docs/latest/commands/](https://redis.io/docs/latest/commands/)

**Starting the Server:**

```bash
redis-server
```

- This command launches the Redis server process.

**Connecting to the Server:**

```bash
redis-cli
```

- This command opens the Redis command-line interface (CLI) where you can interact with the server.

**Shutting Down the Server:**

```bash
127.0.0.1:6379> shutdown [SAVE|NOSAVE]
```

- This command gracefully shuts down the server.
  - `SAVE`: Saves the data to disk before shutting down (recommended).
  - `NOSAVE`: **Does not** save the data, which is faster but leads to data loss if not persisted elsewhere.

**Exiting the Redis CLI:**

```bash
127.0.0.1:6379> exit
```

**PING Command**

```bash
127.0.0.1:6379> PING [Message]
```
* Checks if the Redis server is alive and responsive.
* Optionally, sends a custom message along with the ping and returns the same message back.

- This command exits the `redis-cli` and closes your connection to the server.

**Restarting the Server (Linux with systemd):**

```bash
systemctl restart redis
```

- This command restarts the Redis service using systemd, the service manager on most Linux distributions.

**Getting Help:**

```bash
redis-cli HELP <command_name>
```

- This command provides detailed information about a specific Redis command.
