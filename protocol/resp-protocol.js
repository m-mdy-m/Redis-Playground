/**
 * @generator_protocol
 * @example
 * SET <ip> 1
 * SET 10.0.0.134 1
 * RESP -> *3\r\n$3\r\nSET\r\n$10\r\n10.0.0.134\r\n$1\r\n1\r\n
 * @first_step
 * Read File
 * @Two_step
 * Data and convert into `RESP` style Conventions
 */
const fs = require("fs");
const path = require("path");
const sourcePath = path.join(__dirname, "ip.source.txt");

function generateResp() {
  const data = fs.readFileSync(sourcePath, "utf-8");
  const ips = data.split("\n");
  for (const ip of ips) {
    process.stdout.write(
      `*3\r\n$3\r\nSET\r\n$${ip.length}\r\n${ip}\r\n$1\r\n1\r\n`
    );
  }
}
generateResp();