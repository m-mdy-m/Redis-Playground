const { createClient } = require("redis");
const client = createClient();
(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis server!");
  } catch (error) {
    console.error("Redis connection error:", error);
  } finally {
    // Always disconnect from Redis when your application exits
    await client.quit();
  }
})();