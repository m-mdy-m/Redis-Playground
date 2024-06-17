const http = require("http");
const fs = require("fs");
const redis = require("redis");
const client = redis.createClient();

client.connect();
client.on("ready", () => console.log("Redis is ready"));
client.on("error", (err) => console.log("Error " + err));

const PORT = process.env.PORT || 3000;
const lua = {
  script: fs.readFileSync("./example_redis_script.lua", "utf8"),
};
const server = http.createServer(async (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  if (req.url === "/add") {
    try {
      const reply = await client.eval(lua.script, {
        keys: ["key1"],
        args: ["value2"],
      });
      console.log("Reply:", reply);
      res.write(` key : ${reply[0]} value: ${reply[1]}`);
      res.end();
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "text/plain" }); 
      res.write("An error occurred while processing your request.");
      res.end();
    }
  } else {
    res.write("<h1>Hello World</h1>");
    res.end();
  }
});

server.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
});
