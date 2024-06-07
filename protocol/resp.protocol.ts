/**
 * @generator_protocol
 * @example
 * SET <ip> 1
 * SET 10.0.0.134 1
 * RESP -> *3\r\n$3\r\nSET\r\n$10\r\n10.0.0.134$1\r\n1\r\n
 * @first_step
 * Read File
 * @Two_step
 * Data and convert into `RESP` style Conventions
 */
import {readFile} from 'fs'
import { join} from 'path'
const sourcePath = join(__dirname,'ip.source.txt')

function generateResp(ips: string[]): void {
    for (const ip of ips) {
      const command = `*3\r\n$3\r\nSET\r\n$${ip.length}\r\n${ip}\r\n$1\r\n1\r\n`;
      process.stdout.write(command);
    }
  }
readFile(sourcePath, 'utf-8', (err: Error | null, data: string) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
  
    const ips = data.split('\n');
    generateResp(ips);
  });