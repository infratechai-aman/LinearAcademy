from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"message": "Raw Python Handler is ALIVE", "path": self.path}
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        response = {"message": "POST successful via Raw Handler"}
        self.wfile.write(json.dumps(response).encode('utf-8'))

