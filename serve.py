import json
import os
import re
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qsl, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))
import features  # noqa: E402
import migrations  # noqa: E402
from commands.http import dispatch  # noqa: E402
from engine.stop import asked  # noqa: E402
from engine.viewer import heartbeat, remember  # noqa: E402

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
        body = {"_raw": raw, "_type": kind} if kind.startswith("multipart/") or kind.startswith("text/plain") else json.loads(raw or b"{}")
        reply = dispatch(method, url.path, self.root, dict(parse_qsl(url.query)), body)
        self.send_response(reply.code)
        self.sibling()
        self.send_header("Content-Type", reply.kind)
        if reply.chunks is None:
            data = reply.bytes()
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            self.wfile.flush()
            if reply.after:
                reply.after()
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
    features.FEATURES["updates"].announce(root)
    features.FEATURES["plugins"].host(root)
    features.FEATURES["services"].watch(root)
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    remember(root, server.server_address[1])
    heartbeat(root, server.server_address[1])
    return server


WATCH_SECONDS = 1.0
SETTLE_SECONDS = 1.5
IGNORED_CODE_FOLDERS = {"__pycache__", "environments", "runtime", "tests"}


def code_snapshot(package: Path) -> tuple[tuple[str, int], ...]:
    files = []
    for path in package.rglob("*.py"):
        relative = path.relative_to(package)
        if any(part.startswith(".") or part in IGNORED_CODE_FOLDERS for part in relative.parts[:-1]):
            continue
        try:
            files.append((str(path), path.stat().st_mtime_ns))
        except OSError:
            continue
    return tuple(sorted(files))


def watch_code(package: Path, server: ThreadingHTTPServer, changed: threading.Event) -> None:
    before = code_snapshot(package)
    last_change = 0.0
    while not changed.is_set():
        time.sleep(WATCH_SECONDS)
        now = code_snapshot(package)
        if now != before:
            before = now
            last_change = time.monotonic()
        elif last_change and time.monotonic() - last_change >= SETTLE_SECONDS:
            changed.set()
            server.shutdown()


def watch_stop(root: Path, server: ThreadingHTTPServer, halting: threading.Event, began: float = 0.0) -> None:
    while not halting.is_set():
        time.sleep(WATCH_SECONDS)
        if asked(root, began):
            halting.set()
            server.shutdown()


def run(root: Path, port: int = 8430) -> None:
    server = serve(root, port)
    print(f"http://127.0.0.1:{server.server_address[1]}/", flush=True)
    changed = threading.Event()
    halting = threading.Event()
    threading.Thread(target=watch_code, args=(Path(__file__).resolve().parent, server, changed), daemon=True).start()
    threading.Thread(target=watch_stop, args=(root, server, halting, time.time()), daemon=True).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    if halting.is_set():
        print("journal: stopped", flush=True)
        return
    if changed.is_set():
        print("journal: Python code changed; restarting on the same port", flush=True)
        command = [sys.executable, str(Path(__file__).resolve().with_name("journal.py")), "--root", str(root), "serve", "--port", str(server.server_port)]
        os.execv(sys.executable, command)


if __name__ == "__main__":
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".journal").resolve()
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8430
    run(root, port)
