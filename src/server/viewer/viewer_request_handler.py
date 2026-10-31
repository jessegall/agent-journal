import json
from dataclasses import asdict
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qsl, parse_qs, urlencode, urlsplit

from server.server_instance import server_instance
from server.viewer.event_stream import EventStream
from server.viewer.events_request import EventsRequest
from server.viewer.missing_module_file_error import MissingModuleFileError
from server.viewer.viewer_line_request import ViewerLineRequest
from server.viewer.unknown_login_key_error import UnknownLoginKeyError
from server.viewer.viewer_request_error import ViewerRequestError
from server.viewer.viewer_server import ViewerServer

COOKIE_NAME = "journal_viewer"
VIEWER_ROOT = "/viewer/"
VIEWER_MODULE = "journal.core.viewer"
KIT_ROUTE = "/viewer/kit/"
SHELL_PAGE = "index.html"
LINE_ROUTE = "/api/line"
EVENTS_ROUTE = "/api/events"
WINDOWS_ROUTE = "/api/windows"
MARKS_ROUTE = "/api/marks"
DOCKS_ROUTE = "/api/docks"
SESSION_ROUTE = "/api/session"
MODULES_ROUTE = "/modules/"
FRAME_POLICY = ("sandbox allow-scripts; default-src 'none'; script-src {listener}; style-src {listener} 'unsafe-inline'; img-src {listener} data:;"
                " connect-src 'none'; form-action 'none'")


class ViewerRequestHandler(BaseHTTPRequestHandler):
    """Answers the viewer's requests: refuses one whose Host is not the listener's own address, turns a login key
    into a session cookie once, serves module and window kit files, which hold code and no data, to any origin
    so a frame with no origin loads its own, and answers the viewer's pages and data only with that cookie."""

    def do_GET(self) -> None:
        viewer = self.viewer()
        if self.headers.get("Host") != viewer.host:
            self.answer(403, {"error": "this listener answers only its own address"})
            return
        route = urlsplit(self.path)
        key = parse_qs(route.query).get("key", [""])[0]
        if route.path == "/" and key:
            try:
                token = viewer.login.session_token(key)
            except UnknownLoginKeyError as error:
                self.answer(401, {"error": str(error)})
                return
            self.answer_session(token, [pair for pair in parse_qsl(route.query) if pair[0] != "key"])
            return
        if route.path.startswith(MODULES_ROUTE):
            module_name, _, path = route.path.removeprefix(MODULES_ROUTE).partition("/")
            self.answer_module_file(viewer, module_name, path)
            return
        if route.path.startswith(KIT_ROUTE):
            self.answer_module_file(viewer, VIEWER_MODULE, route.path.removeprefix(VIEWER_ROOT))
            return
        token = self.cookie_token()
        if not viewer.login.has_session(token):
            self.answer(401, {"error": "open the address journal viewer prints to log in"})
            return
        if route.path == WINDOWS_ROUTE:
            windows = viewer.routes.windows_route.windows(parse_qs(route.query).get("environment", [""])[0])
            self.answer(200, {"windows": [asdict(window) for window in windows], "person_id": viewer.login.person_id(token)})
            return
        if route.path == SESSION_ROUTE:
            self.answer(200, asdict(viewer.routes.session_route.answer(token)))
            return
        if route.path == MARKS_ROUTE:
            self.answer(200, {"marks": viewer.routes.chat_declarations_route.marks()})
            return
        if route.path == DOCKS_ROUTE:
            self.answer(200, {"docks": viewer.routes.chat_declarations_route.docks()})
            return
        if route.path == EVENTS_ROUTE:
            self.answer_events(viewer.routes.event_stream, parse_qs(route.query))
            return
        if route.path == "/" or route.path.startswith(VIEWER_ROOT):
            self.answer_module_file(viewer, VIEWER_MODULE, route.path.removeprefix(VIEWER_ROOT).strip("/") or SHELL_PAGE)
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
        self.answer(200, asdict(viewer.routes.line_route.answer(request.window, request.line, viewer.login.person_id(token), request.environment)))

    def answer_events(self, event_stream: EventStream, query: dict[str, list[str]]) -> None:
        request = EventsRequest.parsed(query, self.headers.get("Last-Event-ID"))
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        event_stream.follow(request.environment, request.cursor_id, self.stream_message)

    def answer_module_file(self, viewer: ViewerServer, module_name: str, path: str) -> None:
        try:
            module_file = viewer.routes.module_files.file(module_name, path)
        except MissingModuleFileError as error:
            self.answer(404, {"error": str(error)})
            return
        self.send_response(200)
        self.send_header("Content-Type", module_file.content_type)
        self.send_header("Content-Length", str(len(module_file.content)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Access-Control-Allow-Origin", "*")
        if module_file.frame:
            self.send_header("Content-Security-Policy", FRAME_POLICY.format(listener=f"http://{viewer.host}"))
        self.end_headers()
        self.wfile.write(module_file.content)

    def stream_message(self, message: str) -> bool:
        try:
            self.wfile.write(message.encode())
            self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            return False
        return True

    def answer_session(self, token: str, kept_query: list[tuple[str, str]]) -> None:
        self.send_response(303)
        self.send_header("Set-Cookie", f"{COOKIE_NAME}={token}; HttpOnly; SameSite=Strict; Path=/")
        self.send_header("Location", f"{VIEWER_ROOT}?{urlencode(kept_query)}" if kept_query else VIEWER_ROOT)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def cookie_token(self) -> str:
        cookie = SimpleCookie(self.headers.get("Cookie", ""))
        return cookie[COOKIE_NAME].value if COOKIE_NAME in cookie else ""

    def viewer(self) -> ViewerServer:
        return server_instance(self.server, ViewerServer)

    def answer(self, status: int, value: dict[str, object]) -> None:
        body = json.dumps(value).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        return
