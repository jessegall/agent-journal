import json
import re
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qsl, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))
import features  # noqa: E402
import migrations  # noqa: E402
from commands.http import dispatch  # noqa: E402
from engine.viewer import remember  # noqa: E402

LOOPBACK = re.compile(r"^http://(127\.0\.0\.1|localhost)(:\d+)?$")


class Handler(BaseHTTPRequestHandler):
    root: Path = Path(".journal")

    def log_message(self, *_):
        pass

    def sibling(self) -> None:
        origin = self.headers.get("Origin") or ""
        if not LOOPBACK.match(origin):
            return
        self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Vary", "Origin")

    def handle_one(self, method: str) -> None:
        url = urlparse(self.path)
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b""
        kind = self.headers.get("Content-Type") or ""
        body = {"_raw": raw, "_type": kind} if kind.startswith("multipart/") else json.loads(raw or b"{}")
        reply = dispatch(method, url.path, self.root, dict(parse_qsl(url.query)), body)
        self.send_response(reply.code)
        self.sibling()
        self.send_header("Content-Type", reply.kind)
        if reply.chunks is None:
            data = reply.bytes()
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        try:
            for chunk in reply.chunks:
                self.wfile.write(chunk)
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError, OSError):
            reply.chunks.close()

    def do_GET(self):
        self.handle_one("GET")

    def do_POST(self):
        self.handle_one("POST")

    def do_OPTIONS(self):
        self.send_response(204)
        self.sibling()
        self.end_headers()


def serve(root: Path, port: int = 8430) -> ThreadingHTTPServer:
    Handler.root = root
    migrations.run(root)
    features.load()
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    remember(root, server.server_address[1])
    return server


if __name__ == "__main__":
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".journal").resolve()
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8430
    print(f"http://127.0.0.1:{port}/")
    serve(root, port).serve_forever()
