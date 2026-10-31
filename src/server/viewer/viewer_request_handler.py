import json
from dataclasses import asdict
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlsplit

from server.viewer.event_stream import EventStream
from server.viewer.viewer_line_request import ViewerLineRequest
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_request_error import ViewerRequestError
from server.viewer.viewer_server import ViewerServer

COOKIE_NAME = "journal_viewer"
VIEWER_ROOT = "/viewer/"
LINE_ROUTE = "/api/line"
EVENTS_ROUTE = "/api/events"


class ViewerRequestHandler(BaseHTTPRequestHandler):
    """Answers the viewer's requests: refuses one whose Host is not the listener's own address, turns a login key
    into a session cookie once, and answers the viewer's pages only with that cookie."""

    def do_GET(self) -> None:
        viewer = self.viewer()
        if self.headers.get("Host") != viewer.host:
            self.answer(403, {"error": "this listener answers only its own address"})
            return
        route = urlsplit(self.path)
        key = parse_qs(route.query).get("key", [""])[0]
        if route.path == "/" and key:
            self.answer_login(viewer.login, key)
            return
        token = self.cookie_token()
        if not viewer.login.has_session(token):
            self.answer(401, {"error": "open the address journal viewer prints to log in"})
            return
        if route.path == EVENTS_ROUTE:
            self.answer_events(viewer.event_stream, parse_qs(route.query))
            return
        if route.path in ("/", VIEWER_ROOT) or route.path.startswith(VIEWER_ROOT):
            self.answer(200, {"person_id": viewer.login.person_id(token)})
            return
        self.answer(404, {"error": f"no route {route.path}"})

    def do_POST(self) -> None:
        viewer = self.viewer()
        body = self.rfile.read(int(self.headers.get("Content-Length", "0") or "0"))
        if self.headers.get("Host") != viewer.host:
            self.answer(403, {"error": "this listener answers only its own address"})
            return
        token = self.cookie_token()
        if not viewer.login.has_session(token):
            self.answer(401, {"error": "open the address journal viewer prints to log in"})
            return
        if urlsplit(self.path).path != LINE_ROUTE:
            self.answer(404, {"error": f"no route {self.path}"})
            return
        try:
            request = ViewerLineRequest.parsed(json.loads(body or b"{}"))
        except ViewerRequestError as error:
            self.answer(400, {"error": str(error)})
            return
        self.answer(200, asdict(viewer.line_route.answer(request.window, request.line, viewer.login.person_id(token), request.environment)))

    def answer_events(self, event_stream: EventStream, query: dict[str, list[str]]) -> None:
        cursor_text = self.headers.get("Last-Event-ID") or query.get("cursor", ["0"])[0]
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        event_stream.follow(query.get("environment", [""])[0], int(cursor_text) if cursor_text.isdigit() else 0, self.stream_message)

    def stream_message(self, message: str) -> bool:
        try:
            self.wfile.write(message.encode())
            self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            return False
        return True

    def answer_login(self, login: ViewerLogin, key: str) -> None:
        if not login.has_key(key):
            self.answer(401, {"error": "this login key is spent or unknown: ask journal viewer for a new one"})
            return
        self.send_response(303)
        self.send_header("Set-Cookie", f"{COOKIE_NAME}={login.session_token(key)}; HttpOnly; SameSite=Strict; Path=/")
        self.send_header("Location", VIEWER_ROOT)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def cookie_token(self) -> str:
        cookie = SimpleCookie(self.headers.get("Cookie", ""))
        return cookie[COOKIE_NAME].value if COOKIE_NAME in cookie else ""

    def viewer(self) -> ViewerServer:
        if not isinstance(self.server, ViewerServer):
            raise TypeError(f"a viewer request handler serves a ViewerListener, not {type(self.server).__name__}")
        return self.server

    def answer(self, status: int, value: dict[str, object]) -> None:
        body = json.dumps(value).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        return
