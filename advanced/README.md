# Redis Reapplication
**Redis Replication: High Availability and Scalability**

Redis replication enables you to create exact copies of a master Redis server (primary) onto one or more replica servers (secondaries). This approach offers several benefits:

* **High Availability:** If the master fails, a replica can be promoted to take its place, minimizing downtime and ensuring data remains accessible.
* **Scalability:** You can distribute read traffic across multiple replicas, improving performance for read-heavy workloads.

**How Redis Replication Works**

1. **Master-Replica Model:** Redis replication follows a simple leader-follower model. The master server holds the primary data store and processes all write requests. Replicas passively receive updates from the master and maintain synchronized copies of the dataset.

2. **Asynchronous Replication:** By default, Redis uses asynchronous replication. This means the master acknowledges writes and continues processing new requests without waiting for confirmation from replicas. This approach improves performance but introduces a potential window for data loss if the master fails before replicating writes.

3. **Data Synchronization:** The master keeps replicas updated by sending them a continuous stream of commands reflecting changes to the dataset (e.g., SET, DEL, EXPIRE). Replicas execute these commands to maintain consistency with the master.

4. **Partial vs. Full Resynchronization:**
   - **Partial Resync:** When a replica reconnects after a brief disconnection, it attempts a partial resynchronization. This involves catching up on any missed commands from the master's backlog.
   - **Full Resync:** If the replica is significantly out of sync or the master's backlog is exhausted, a full resynchronization occurs. Here, the master creates a snapshot (RDB file) of its entire dataset and transmits it to the replica, followed by the backlog of commands.

5. **Replication ID and Offset:**
   - **Replication ID:** Each master has a unique replication ID that represents a specific point in time for its dataset.
   - **Replication Offset:** This value tracks the position within the master's command stream that a replica has processed. Together, the replication ID and offset uniquely identify a replica's state relative to the master.

**Key Points to Remember:**

* Replicas are typically read-only by default to avoid inconsistencies with the master. However, Redis versions before 7.0 allowed writable replicas, which are strongly discouraged due to potential data integrity issues.
* Replication provides eventual consistency, meaning replicas will eventually catch up to the master's state, but there might be a slight delay.
* Redis Sentinel and Redis Cluster are higher-level solutions built on top of replication to automate failover and manage replica instances.

**Additional Considerations:**

* **Diskless Replication:** Starting with Redis version 2.8.18, diskless replication is available. This method improves performance during full resynchronization by transferring the RDB file directly over the network without writing it to disk first.
* **Replica Configuration:** To configure a replica, you simply specify the master's IP address and port in the replica's configuration file.

## Command :

- **`SLAVEOF <host> <port>`** (or `replicaof <host> <port>`):
    - Establishes a connection between a replica server and the master server.
    - This command initiates the initial synchronization process, where the replica retrieves a snapshot (RDB) of the master's dataset and then applies any subsequent changes received as a stream of commands.
    - Replace `<host>` with the master's IP address or hostname, and `<port>` with the master's port number (usually 6379).
- **`INFO replication`** (or `INFO REPLICATION`):
    - Provides detailed information about the current replication state of a Redis instance (master or replica).
    - This includes data like the master's hostname/port (for replicas), replication backlog size, connected replicas (for masters), and the last time there was successful communication with the master (for replicas).
    - This is a valuable diagnostic tool to verify the health and synchronization status of replicas.
- **`ROLE`**:
    - Returns the current role of the Redis instance (master, replica, or none).
    - This is a quick way to confirm whether an instance is functioning as a master or a replica.

**Important Notes:**

- The `SLAVEOF` command can be used on a running Redis server, dynamically changing its role to a replica.
- Once a replica is connected to a master, it will automatically attempt to re-establish the connection if it loses communication (within a configurable timeout period).
- While Redis historically supported writing to replicas, this is strongly discouraged due to potential consistency issues and is disabled by default. Modern Redis setups typically use read-only replicas for read scalability.

**Additional Considerations for Redis Replication Management:**

- Redis Sentinel: Consider using Redis Sentinel, a tool that automates master failover by monitoring master and replica health and promoting a suitable replica if the master fails.
- `replica-read-only`: To explicitly configure a replica as read-only, use the `replica-read-only yes` option in your Redis configuration file. This prevents accidental writes to replicas.
- `min-replicas-to-write` and `min-replicas-max-lag`: If maintaining strong data consistency is crucial, you can configure the master to require a minimum number of connected replicas with an acceptable lag before accepting write requests (offering a trade-off between performance and data safety).

## Example :
**Scenario 1: Basic Master-Slave Setup for High Availability**

In this scenario, you have a single master Redis server (port 6379) and two replica servers (ports 6380 and 6381). This offers basic high availability if the master fails.

**Master Configuration (db1.rdb):**

```
redis-server --port 6379 --filename db1.rdb
```

**Replica 1 Configuration (db2.rdb):**

```
redis-server --port 6380 --filename db2.rdb
slaveof localhost 6379
```

**Replica 2 Configuration (db3.rdb):**

```
redis-server --port 6381 --filename db3.rdb
slaveof localhost 6379
```

**Explanation:**

* The `redis-server` commands start Redis instances on ports 6379, 6380, and 6381, with persistence enabled using the specified RDB filenames.
* The master (port 6379) doesn't require any specific configuration for replication.
* Both replicas (ports 6380 and 6381) use the `slaveof` command to establish connections to the master at `localhost` (local machine) on port 6379. This initiates the initial synchronization process.
* Once synchronized, the replicas will continuously receive updates from the master, maintaining consistency.

**Scenario 2: Scalability with Read-Only Replicas**

Here, you have a master (port 6379) and multiple read-only replicas (ports 6380, 6381, and 6382) to handle read-heavy workloads, improving performance and scalability.

**Master Configuration (db1.rdb):**

```
redis-server --port 6379 --filename db1.rdb
```

**Replica 1 Configuration (db2.rdb):**

```
redis-server --port 6380 --filename db2.rdb
slaveof localhost 6379
replica-read-only yes  # Enable read-only mode
```

**Replica 2 Configuration (db3.rdb):**

```
redis-server --port 6381 --filename db3.rdb
slaveof localhost 6379
replica-read-only yes  # Enable read-only mode
```

**Replica 3 Configuration (db4.rdb):**

```
redis-server --port 6382 --filename db4.rdb
slaveof localhost 6379
replica-read-only yes  # Enable read-only mode
```

**Explanation:**

* This setup is similar to the previous example, but all replicas are explicitly configured as read-only using the `replica-read-only yes` option. This prevents accidental writes to replicas.
* Clients can connect to any of the replica ports (6380, 6381, or 6382) to perform read operations, offloading the read load from the master.

**Scenario 3: Disaster Recovery with Geographically Dispersed Replicas**

In this scenario, you have a master (port 6379) in one location and a replica (port 6380) in a geographically dispersed location. This provides redundancy in case of a region-wide outage.

**Master Configuration (db1.rdb):**

```
redis-server --port 6379 --filename db1.rdb
```

**Replica Configuration (db2.rdb):**

```
redis-server --port 6380 --filename db2.rdb
slaveof <master_ip> 6379  # Replace with master's IP address
```

**Explanation:**

* The replica connects to the master's IP address instead of `localhost`, enabling it to reside in a different location.
* This setup offers disaster recovery because if the master's region experiences an outage, the replica can potentially be used to restore data or continue operations.

**Important Considerations:**

* **Asynchronous Replication:** Remember that Redis replication is asynchronous. Writes acknowledged by the master might not yet be replicated to all replicas before a failover. This introduces a potential window for data loss.
* **Data Persistence:** Both master and replicas should be configured with persistence (RDB or AOF) to ensure data is not lost on restarts.
* **Replica Monitoring:** Monitor replica health and connectivity to ensure they're synchronized with the master

**Method 1: Using the `SLAVEOF NO ONE` Command**

1. Connect to the slave server using the `redis-cli` tool. You'll need to specify the slave's port number if it's different from the default (6379).

   ```bash
   redis-cli -p <slave_port>
   ```

2.  Execute the following command:

   ```
   SLAVEOF NO ONE
   ```

This command instructs the slave to stop replicating from any master. It will still be running as a Redis server, but it won't receive updates from the master anymore. The existing data on the slave will remain intact.

**Method 2: Stopping the Slave Server**

Simply stopping the slave server process will effectively disconnect it from the master. However, this is a less controlled approach compared to `SLAVEOF NO ONE`.

1. Use the appropriate command for your operating system to stop the slave server process. The exact command will depend on how you started your Redis instance (e.g., using a service manager like systemd or manually running the `redis-server` command).

   - For systemd-based systems:

     ```bash
     sudo systemctl stop redis@<slave_port>.service
     ```

   - For manually started processes:

     ```bash
     ps aux | grep redis-server | grep <slave_port>  # Find the process ID
     kill <process_id>
     ```

**Important Considerations:**

- Once disconnected, the slave won't receive updates from the master. It will maintain the data it had at the time of disconnection.
- If you intend to reconnect the slave to the same master later, you'll need to use the `SLAVEOF` command again to re-establish the replication connection and initiate a new synchronization process.
- Stopping the slave process might not be the cleanest approach as it can leave the slave in an inconsistent state if it was actively replicating at the time.

**Additional Notes:**

- If you're using Redis Sentinel for automated failover, the sentinel will eventually mark the disconnected slave as "disconnected" and won't try to promote it during a master failure.
- You can use the `INFO replication` command to verify the slave's current replication status after disconnection.
## Master-Slave Replication in Redis

### Overview

Redis supports master-slave replication to enhance availability and scalability. In this setup, a single master node handles all write operations, while multiple slave nodes replicate data from the master and handle read operations. This ensures data redundancy and load distribution.

### How It Works

#### Connection and Identification

1. **Initial Setup**:
   - A Redis instance is designated as the master. Other Redis instances are configured as slaves.
   - Slaves are configured to replicate data from the master using the `slaveof` command or through configuration settings in `redis.conf`.

2. **Connecting to the Master**:
   - Upon startup, a slave connects to the master using the IP address and port specified in its configuration.
   - The slave sends a `PING` command to the master. If the master responds with `PONG`, the connection is considered successful.

3. **Full Synchronization**:
   - During the initial connection, the slave requests a synchronization with the master.
   - The master creates a snapshot of the data (RDB file) and sends it to the slave. This is called the "full sync."
   - The slave saves this snapshot to disk, loads it into memory, and starts processing updates from the master.

4. **Replication IDs**:
   - **`master_replid`**: This is a unique identifier for the replication stream from the master. It remains the same across all slaves replicating from the same master.
   - **`master_repl_offset`**: This is the replication offset, indicating the position up to which the slave has processed the replication stream. Each slave has a different offset value as they may lag behind the master to varying degrees.

#### Data Replication and Stability

1. **Continuous Replication**:
   - After the full sync, the master sends any new write commands to all connected slaves.
   - Slaves process these commands in the order they are received, ensuring they have an identical dataset as the master.

2. **Write Operations**:
   - All write operations (e.g., setting a key-value pair) are performed on the master.
   - These operations are then propagated to the slaves. Slaves cannot perform write operations directly, ensuring data consistency.

3. **Handling Disconnects**:
   - If a slave loses connection to the master, it will attempt to reconnect.
   - Upon reconnection, the slave requests a partial resynchronization using its last known offset.
   - If the master can fulfill this request, it sends only the missing data (partial sync). If not, a full sync is performed again.

### Slave Promotion to Master

1. **Promotion Process**:
   - When the master fails, one of the slaves can be promoted to master to ensure continued availability.
   - This can be done manually using the `SLAVEOF NO ONE` command on the chosen slave or automatically through a failover mechanism provided by Redis Sentinel.

2. **Replication ID Change**:
   - The new master generates a new `master_replid`. Slaves that were connected to the old master need to be reconfigured to replicate from the new master.

3. **Synchronization**:
   - Upon promotion, the new master will handle all write operations, and the remaining slaves will start replicating from this new master.
   - The new master ensures that it has the most up-to-date data before accepting writes to maintain data consistency.

### Stability and Consistency

1. **Heartbeat Mechanism**:
   - Slaves send periodic `PING` commands to the master to check connectivity.
   - The master responds with `PONG`, ensuring the connection remains alive.

2. **Acknowledgements**:
   - Slaves acknowledge the receipt of replication data by sending their replication offset to the master.
   - The master uses this information to track the replication status of each slave.

3. **Consistency Guarantees**:
   - Redis ensures that data written to the master is propagated to slaves in a consistent and orderly manner.
   - Slaves are always behind the master by a small margin, depending on network latency and load.

### Summary

Redis master-slave replication ensures high availability and scalability by distributing read operations across multiple slaves while centralizing write operations on a single master. Slaves connect to the master, perform initial synchronization, and then continuously replicate changes. In case of master failure, a slave can be promoted to master, ensuring minimal downtime. This setup is designed to maintain data consistency and stability through various mechanisms, including heartbeats and replication offsets.