import redis

file = 'allkeys.txt'
url = 'redis://localhost:6379'
query = '*'
print('Read Keys...', end='')
client = redis.from_url(url=url,decode_responses=True)
keys = client.keys(query)
print(f'{len(keys)} keys found')

def chunks(lst,n):
    for i in range(0,len(lst),n):
        yield lst[i:i + n]

partitions = list(chunks(keys,10000))

with open(file,'w',newline='\n',encoding='utf-8') as f:
    for i in range(0,len(partitions)):
        progress = ((i+1)/len(partitions)) * 100

        print(f"\rProcessing values ... {progress}%",end='')

        keys = partitions[i]
        values = client.mget(keys)
        for i in zip(keys,values):
            f.write(f'KEY :{i[0]}')
            f.write('\n')
            f.write(f'VALUE :{i[1]}')
            f.write('\n')

print('\nProcessing Done...')