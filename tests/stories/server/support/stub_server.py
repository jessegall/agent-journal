import threading
from collections.abc import Mapping
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = "127.0.0.1"
STOP_POLL_SECONDS = 0.01


@dataclass(frozen=True)
class StubAnswer:
    """What the stub server answers: a status code, its headers and its body, after a delay."""

    code: int
    body: bytes = b""
    headers: Mapping[str, str] | None = None
    wait_for_release: bool = False


@dataclass(frozen=True)
class StubRequest:
    """A request the stub server received: its method, path and headers."""

    method: str
    path: str
    headers: Mapping[str, str]


class StubServer:
    """A local HTTP server that gives every request one fixed answer and keeps the requests it received, for a story
    that needs an answer the real shared server never gives, such as a redirect or an HTML page."""

    def __init__(self, answer: StubAnswer) -> None:
        self.requests: list[StubRequest] = []
        self.release = threading.Event()
        received, fixed = self.requests, answer
        release = self.release

        class Handler(BaseHTTPRequestHandler):
            def respond(self) -> None:
                received.append(StubRequest(self.command, self.path, dict(self.headers.items())))
                if fixed.wait_for_release:
                    release.wait()
                self.send_response(fixed.code)
                for name, value in (fixed.headers or {}).items():
                    self.send_header(name, value)
                self.send_header("Content-Length", str(len(fixed.body)))
                self.end_headers()
                self.wfile.write(fixed.body)

            do_GET = do_PUT = do_POST = do_DELETE = respond

            def log_message(self, *details: object) -> None:
                return None

        self.server = ThreadingHTTPServer((HOST, 0), Handler)

    @property
    def address(self) -> str:
        return f"http://{HOST}:{self.server.server_address[1]}"

    def __enter__(self) -> "StubServer":
        threading.Thread(target=self.server.serve_forever, args=[STOP_POLL_SECONDS], daemon=True).start()
        return self

    def __exit__(self, *details: object) -> None:
        self.release.set()
        self.server.shutdown()
        self.server.server_close()
