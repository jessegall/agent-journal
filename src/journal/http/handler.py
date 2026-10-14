import json
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlsplit

from journal.http.identity import Identity
from journal.http.request import Request
from journal.http.response import Response
from journal.http.router import Router


class Handler(BaseHTTPRequestHandler):
    """Turns one HTTP exchange into a Request for the router and writes its Response back; nothing else lives here."""

    router: Router
    identity: Identity

    def do_GET(self) -> None:
        self._reply(self.router.dispatch(self._request()))

    def do_POST(self) -> None:
        self._reply(self.router.dispatch(self._request()))

    def log_message(self, format, *args) -> None:
        return None

    def _request(self) -> Request:
        url = urlsplit(self.path)
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b""
        headers = {name.lower(): value for name, value in self.headers.items()}
        return Request(self.command, url.path, {k: v[-1] for k, v in parse_qs(url.query).items()}, json.loads(raw) if raw else {}, {}, headers, self.identity.of(headers))

    def _reply(self, response: Response) -> None:
        body = response.encoded()
        self.send_response(response.status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
