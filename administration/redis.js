const redis = require("redis");
const fs = require("fs").promises;
let file = "allkeys_node.txt";
let url = "redis://localhost:6379";
let query = "*";
console.log("Read keys...");

const client = redis.createClient(url);
(async () => {
  try {
    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();
    const keys = await client.KEYS(query);
    console.log(`${keys.length} keys found`);
    await writeKeys(keys);
  } catch (error) {
    console.error("Error:", error);
  }
})();
async function writeKeys(keys) {
  try {
    const chunkSize = 10000;
    const partitions = [];
    for (let i = 0; i < keys.length; i += chunkSize) {
      partitions.push(keys.slice(i, i + chunkSize));
    }

    await fs.writeFile(file, "", "utf-8");
    for (let i = 0; i < partitions.length; i++) {
      const keys = partitions[i];
      const values = await client.mGet(keys);
      for (let i = 0; i < keys.length; i++) {
        await fs.appendFile(file, `KEY:${keys[i]}\nVALUE:${values[i]}\n`);
      }
    }
  } catch (error) {
    console.error("Error in writeKeys:", error);
  } finally {
    await client.quit();
  }
}
