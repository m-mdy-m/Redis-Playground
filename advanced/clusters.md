## Redis Clusters

*Redis Cluster: Scalable and Available Data Storage**

Redis Cluster is a feature that transforms Redis from a single server data store into a horizontally scalable and highly available distributed system. It achieves this by:

* **Sharding Data Across Multiple Nodes:** Data is automatically partitioned and distributed across multiple Redis nodes in the cluster. Each node is responsible for a subset of the data based on a hashing mechanism, ensuring even distribution.
* **Master-Slave with Automatic Failover:** Each shard consists of one primary node (master) and zero or more replica nodes (slaves). The master handles read and write requests, while slaves replicate the master's data for redundancy. If a master fails, a slave is automatically promoted to become the new master, minimizing downtime.
* **High Availability During Partitions:** Even when a network partition occurs, separating some nodes from others, Redis Cluster can continue operations with available nodes. However, access to data on unavailable nodes will be limited until the partition heals.

**Key Features and Considerations:**

* **Multi-Master is Not Supported:** Redis Cluster currently operates with a single master per shard for data consistency.
* **Data Bucketing:** Data is not explicitly grouped into 16KB buckers. Instead, the hashing function distributes key-value pairs across nodes.
* **Scalability Up to 1000 Nodes:** Redis Cluster can theoretically scale to a large number of nodes (up to 1000), enabling massive datasets to be efficiently managed.

**Limitations:**

* **Majority Master Failure:** If a majority of masters in a shard group fail, the cluster becomes unavailable for writes in that shard. However, reads may still be possible from available slaves.

**Additional Points:**

* **Hash Tags:** Redis Cluster allows forcing specific keys to reside on the same node using hash tags. This is useful for multi-key operations that require all involved keys to be on the same shard.
* **Manual Resharding:** While Redis Cluster automates most sharding operations, manual resharding may be necessary when the data distribution becomes unbalanced. However, resharding can temporarily impact multi-key operations.
