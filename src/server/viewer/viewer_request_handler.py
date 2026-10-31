from collections.abc import Mapping
from types import MappingProxyType
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
from server.viewer.pair_request import PairRequest
from server.viewer.session_type import SessionType
from server.viewer.share_sessions import ShareSessions
from server.viewer.shared_row import SharedRow
from server.viewer.share_refusal import ShareRefusal
from server.viewer.share_route import OPEN
from server.viewer.phone_module_error import PhoneModuleError
from server.viewer.unknown_environment_error import UnknownEnvironmentError
from server.viewer.unknown_login_key_error import UnknownLoginKeyError
from server.viewer.viewer_request_error import ViewerRequestError
from server.viewer.viewer_server import ViewerServer

COOKIE_NAME = "journal_viewer"
SHARE_COOKIE_NAME = "journal_share"
SHARE_ROUTE = "/viewer/share/"
VIEWER_ROOT = "/viewer/"
VIEWER_MODULE = "journal.core.viewer"
KIT_ROUTE = "/viewer/kit/"
SHELL_ASSETS_ROUTE = "/viewer/assets/"
VENDOR_ROUTE = "/viewer/vendor/"
SHELL_PAGE = "index.html"
LINE_ROUTE = "/api/line"
EVENTS_ROUTE = "/api/events"
WINDOWS_ROUTE = "/api/windows"
MARKS_ROUTE = "/api/marks"
DOCKS_ROUTE = "/api/docks"
SESSION_ROUTE = "/api/session"
NOTICES_ROUTE = "/api/push"
WAITING_ROUTE = "/api/waiting"
PAIRING_PAGE = "/pair"
PAIRING_ROUTE = "/viewer/pair"
PHONE_WORKER = "phone-sw.js"
PHONE_FILES = (PHONE_WORKER, "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png")
WORKER_HEADERS = {"Service-Worker-Allowed": "/", "Cache-Control": "no-cache"}
SKILLS_ROUTE = "/api/skills"
MODULES_ROUTE = "/modules/"
FRAME_POLICY = ("sandbox allow-scripts; default-src 'none'; script-src {listener}; style-src {listener} 'unsafe-inline'; img-src {listener} data:;"
                " connect-src 'none'; form-action 'none'")


class ViewerRequestHandler(BaseHTTPRequestHandler):
    """Answers the viewer's requests: refuses one whose Host is not the listener's own address, turns a
    login key into a session cookie once, serves module, window kit and shell asset files, which hold code
    and no data, to any origin, and the phone's pairing page and its POST to anyone, so a frame with no
    origin loads its own, and answers the viewer's pages and data only with that cookie."""

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
        if route.path.startswith((KIT_ROUTE, SHELL_ASSETS_ROUTE, VENDOR_ROUTE)):
            self.answer_module_file(viewer, VIEWER_MODULE, route.path.removeprefix(VIEWER_ROOT))
            return
        if route.path.startswith(SHARE_ROUTE):
            self.answer_share(viewer, route.path.removeprefix(SHARE_ROUTE))
            return
        if route.path == PAIRING_PAGE:
            self.answer_module_file(viewer, VIEWER_MODULE, SHELL_PAGE)
            return
        if route.path.removeprefix(VIEWER_ROOT) in PHONE_FILES:
            name = route.path.removeprefix(VIEWER_ROOT)
            self.answer_module_file(viewer, VIEWER_MODULE, name, WORKER_HEADERS if name == PHONE_WORKER else {})
            return
        token = self.cookie_token()
        if not viewer.login.has_session(token):
            self.answer(401, {"error": "open the address journal viewer prints to log in"})
            return
        session = viewer.login.session(token)
        if session.type is SessionType.SHARE and route.path.startswith("/api/") and route.path not in (SESSION_ROUTE, EVENTS_ROUTE):
            self.answer(403, {"error": "a share link opens only the row it shares"})
            return
        if route.path == WINDOWS_ROUTE:
            try:
                windows = viewer.routes.windows_route.windows(parse_qs(route.query).get("environment", [""])[0])
            except UnknownEnvironmentError as error:
                self.answer(404, {"error": str(error)})
                return
            self.answer(200, {"windows": [asdict(window) for window in windows], "person_id": viewer.login.person_id(token)})
            return
        if route.path == WAITING_ROUTE:
            self.answer(200, {"waiting": [asdict(waiting_item) for waiting_item in viewer.routes.waiting_route.waiting()]})
            return
        if route.path == NOTICES_ROUTE:
            self.answer_notices(viewer, token, None)
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
        if route.path == SKILLS_ROUTE:
            self.answer(200, {"skills": viewer.routes.skills_route.skills()})
            return
        if route.path == EVENTS_ROUTE:
            self.answer_events(viewer.routes.event_stream, parse_qs(route.query), session.shared, viewer.login.shares)
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
        if urlsplit(self.path).path == PAIRING_ROUTE:
            self.answer_pairing(viewer, body)
            return
        token = self.cookie_token()
        if not viewer.login.has_session(token):
            self.answer(401, {"error": "open the address journal viewer prints to log in"})
            return
        if urlsplit(self.path).path == NOTICES_ROUTE:
            self.answer_notices(viewer, token, body)
            return
        if urlsplit(self.path).path != LINE_ROUTE:
            self.answer(404, {"error": f"no route {self.path}"})
            return
        try:
            request = ViewerLineRequest.parsed(json.loads(body or b"{}"))
        except ViewerRequestError as error:
            self.answer(400, {"error": str(error)})
            return
        session = viewer.login.session(token)
        try:
            answered = viewer.routes.line_route.answer(request.window, request.line, viewer.login.person_id(token), request.environment, session.shared)
        except ShareRefusal as refusal:
            self.answer(403, {"error": refusal.reason})
            return
        self.answer(200, asdict(answered))

    def answer_notices(self, viewer: ViewerServer, token: str, body: bytes | None) -> None:
        notices = viewer.routes.notices_route
        if notices.is_share(token):
            self.answer(403, {"error": "a share link has no phone to send notices to"})
            return
        try:
            if body is None:
                self.answer(200, {"public_key": notices.public_key()})
                return
            notices.subscribe(token, body)
        except (PhoneModuleError, ViewerRequestError) as error:
            self.answer(404 if isinstance(error, PhoneModuleError) else 400, {"error": str(error)})
            return
        self.answer(200, {"subscribed": True})

    def answer_events(self, event_stream: EventStream, query: dict[str, list[str]], shared: SharedRow | None, shares: ShareSessions) -> None:
        request = EventsRequest.parsed(query, self.headers.get("Last-Event-ID"))
        environment = request.environment if shared is None else shares.environment_name(shared.environment_id)
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        event_stream.follow(environment, request.cursor_id, self.stream_message, shared)

    def answer_share(self, viewer: ViewerServer, token: str) -> None:
        status = viewer.routes.share_route.status(token)
        cookie = {"Set-Cookie": f"{SHARE_COOKIE_NAME}={token}; HttpOnly; SameSite=Strict; Path=/"} if status == OPEN else {}
        self.answer_module_file(viewer, VIEWER_MODULE, SHELL_PAGE, cookie, status)

    def answer_module_file(self, viewer: ViewerServer, module_name: str, path: str, headers: Mapping[str, str] = MappingProxyType({}), status: int = 200) -> None:
        try:
            module_file = viewer.routes.module_files.file(module_name, path)
        except MissingModuleFileError as error:
            self.answer(404, {"error": str(error)})
            return
        self.send_response(status)
        self.send_header("Content-Type", module_file.content_type)
        self.send_header("Content-Length", str(len(module_file.content)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Access-Control-Allow-Origin", "*")
        if module_file.frame:
            self.send_header("Content-Security-Policy", FRAME_POLICY.format(listener=f"http://{viewer.host}"))
        for name, value in headers.items():
            self.send_header(name, value)
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

    def answer_pairing(self, viewer: ViewerServer, body: bytes) -> None:
        limit = viewer.login.phones.wrong_codes
        if not limit.admits():
            self.answer(429, {"error": "too many codes this minute: wait a minute and try again"})
            return
        try:
            token = viewer.login.phones.paired_token(PairRequest.parsed(body).code)
        except PhoneModuleError as error:
            self.answer(400, {"error": str(error)})
            return
        except ViewerRequestError as error:
            self.answer(400, {"error": str(error)})
            return
        payload = json.dumps({"paired": True}).encode()
        self.send_response(200)
        self.send_header("Set-Cookie", f"{COOKIE_NAME}={token}; HttpOnly; SameSite=Strict; Path=/")
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def cookie_token(self) -> str:
        cookie = SimpleCookie(self.headers.get("Cookie", ""))
        names = [name for name in (COOKIE_NAME, SHARE_COOKIE_NAME) if name in cookie]
        return cookie[names[0]].value if names else ""

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
