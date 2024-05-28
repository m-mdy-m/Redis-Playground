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
import {writeFileSync,readFileSync} from 'fs'
import { join} from 'path'
const sourcePath = join(__dirname,'ip.source.txt')
const file = join(__dirname,'ips.txt')
function generateResp(ips:string[]) {
    for (let i = 0; i < ips.length; i++) {
        const ip:string = ips[i];
        writeFileSync(file,`*3\r\n$3\r\nSET\r\n${ip.length}\r\n${ip}\r\n$1\r\n`,'utf-8')
    }
}
const ips = readFileSync(sourcePath, "utf-8").split('\r\n')
generateResp(ips);
