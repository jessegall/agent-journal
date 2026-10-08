from http.client import HTTPConnection, HTTPException
from urllib.parse import parse_qsl, quote, unquote, urlencode, urlsplit

from engine.viewer import lately_running
from features.routing import JSON, PHONE_ENVIRONMENT, PHONE_UNLOCKED
from features.sharing.page import disposition
from features.sharing.server import APP_HEADERS

CARRIED = ("Content-Type", "Accept", "Last-Event-ID")
KEPT = ("Content-Type", "Cache-Control")
STREAMED = "text/event-stream"
WAIT_SECONDS = 600
CHUNK = 65536
API = "/api/"


def encoded(asked) -> str:
    """The asked path and query, decoded and encoded again, so no raw character reaches the request line."""
    path = "/".join(quote(unquote(part), safe="") for part in asked.path.split("/"))
    return f"{path}?{urlencode(parse_qsl(asked.query, keep_blank_values=True))}" if asked.query else path


def phone_marks(environment: str, unlocked: bool) -> dict:
    return {PHONE_ENVIRONMENT: environment, PHONE_UNLOCKED: "1" if unlocked else "0"}


class Desktop:
    """The journal's own server on this machine, reached from outside through the share server with its loopback Host and no Origin."""

    def __init__(self, handler, path: str, marks: dict, page_headers: dict = APP_HEADERS) -> None:
        self.handler = handler
        self.asked = urlsplit(path)
        self.marks = marks
        self.page_headers = page_headers

    def forward(self, body: bytes) -> None:
        reached = urlsplit(lately_running(self.handler.shares.record.root))
        if not reached.port:
            return self.handler.answer(503, "the journal is not running")
        connection = HTTPConnection(reached.hostname, reached.port, timeout=WAIT_SECONDS)
        try:
            connection.request(self.handler.command, encoded(self.asked), body or None, self.carried())
            reply = connection.getresponse()
            headers = {name: reply.getheader(name) for name in KEPT if reply.getheader(name)}
            kind = reply.getheader("Content-Type", "")
            if kind.startswith(STREAMED):
                return self.stream(reply, headers)
            if not kind.startswith(JSON) and self.asked.path.startswith(API):
                headers["Content-Disposition"] = disposition(unquote(self.asked.path.rsplit("/", 1)[-1]))
            return self.handler.packed(reply.status, reply.read(), {**headers, **self.page_headers, "X-Content-Type-Options": "nosniff"})
        except (OSError, HTTPException):
            return self.handler.answer(502, "the journal did not answer")
        finally:
            connection.close()

    def carried(self) -> dict:
        given = {name: self.handler.headers[name] for name in CARRIED if name in self.handler.headers}
        return {**given, **self.marks}

    def stream(self, reply, headers: dict) -> None:
        self.handler.send_response(reply.status)
        for name, value in {**headers, **self.page_headers, "Cache-Control": "no-cache", "X-Accel-Buffering": "no"}.items():
            self.handler.send_header(name, value)
        self.handler.end_headers()
        while chunk := reply.read1(CHUNK):
            self.handler.wfile.write(chunk)
            self.handler.wfile.flush()
