import sys
def generate_resp(ips):
    pattern = '*3\r\n$3\r\nSET\r\n${0}\r\n{1}\r\n$1\r\n1\r\n'
    for ip in ips:
        sys.stdout.write(pattern.format(len(ip),ip))
data = ''
with open("ip.source", 'rt') as f:
    data = f.read()
ips = data.split('\n')

generate_resp(ips)