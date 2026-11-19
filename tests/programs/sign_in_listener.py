"""Stands in for an agent program's own sign-in to an MCP server: it prints the page to sign in on, waits on this machine for the browser to come back, answers it as the real programs do before they trade the code, and ends signed in only for the code `good`, echoing any other code in its error as a real program might."""

import http.server
import sys

WAITING_SECONDS = 20


class BrowserReturn(http.server.BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        self.server.returned = self.path
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Authentication successful")

    def log_message(self, format, *args) -> None:
        pass


server = http.server.HTTPServer(("127.0.0.1", 0), BrowserReturn)
server.returned, server.timeout = "", WAITING_SECONDS
print(f"Visit this URL to authorize:\n  https://sign-in.test/authorize?state=s1&redirect_uri=http%3A%2F%2Flocalhost%3A{server.server_address[1]}%2Fcallback", flush=True)
server.handle_request()
if "code=good" in server.returned:
    print(f'Authentication successful for "{sys.argv[1]}"', flush=True)
    sys.exit(0)
print(f'Couldn\'t complete authentication for "{sys.argv[1]}": the server refused http://localhost{server.returned}', flush=True)
sys.exit(1)
