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
const process = require("process");
const sourcePath = path.join(__dirname, "ip.source.txt");
function generateResp(ips) {
  for (let i = 0; i < ips.length; i++) {
    const ip = ips[i].trim()
    try {
      const command = `*3\r\n$3\r\nSET\r\n$${ip.length}\r\n${ip}\r\n$1\r\n1\r\n`;
      process.stdout.write(`${command}`);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }
}

fs.readFile(sourcePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const ips = data.split("\n");
  generateResp(ips);
});