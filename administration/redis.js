const redis = require("redis");
let file = 'keys.txt'
let url = "localhost:6379";
let query = "*";
console.log("Read keys...");

const clint = redis.createClient({
  url: url,
});
const keys = clint.keys
console.log(`${keys.length} found`);