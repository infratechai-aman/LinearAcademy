import urllib.request
import urllib.error
import json

endpoints = [
    '/api/health',
    '/api/students',
    '/api/courses'
]

for ep in endpoints:
    url = f'http://127.0.0.1:8002{ep}'
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = response.read().decode()
            print(f'SUCCESS {ep}: {data[:150]}...')
    except urllib.error.HTTPError as e:
        print(f'HTTP ERROR {ep}: {e.code} {e.reason}')
        print(e.read().decode())
    except Exception as e:
        print(f'ERROR {ep}: {e}')
