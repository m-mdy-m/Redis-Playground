import { createClient } from 'redis'

const clint = createClient()
clint.on('error',err=>{
    console.log('Redis Clint Error',err)
})

(async()=>{
    await clint.connect()
    await clint.set('key', 'value')
    const value = await clint.get('key')
})()