from collections.abc import Mapping
from contextlib import nullcontext
from types import MappingProxyType
import json
from time import perf_counter
from dataclasses import asdict, replace
from datetime import datetime, timezone
from uuid import uuid4
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qsl, parse_qs, urlencode, urlsplit

from server.server_instance import server_instance
from server.hook.queue_request import QueueRequest
from server.viewer.read_attribution import ReadAttribution
from server.viewer.viewer_request_record import ViewerHttpRequest, ViewerRequestRecord
from server.viewer.event_stream import EventStream
from server.viewer.file_route import LIMIT_BYTES
from server.viewer.events_request import EventsRequest
from core.base.database.repeated_lines import RepeatedLines
from core.base.change.event_pattern_error import EventPatternError
from server.viewer.missing_module_file_error import MissingModuleFileError
from server.viewer.line_answer import LineAnswer
from server.viewer.line_route import REFUSED_CODE
from server.viewer.viewer_line_request import ViewerLineRequest
from server.viewer.window_data_request import KEYS_HEADER, WINDOW_HEADER, WindowDataRequest
from server.viewer.viewer_lines_request import ViewerLinesRequest
from server.viewer.pair_request import PairRequest
from server.viewer.session_type import SessionType
from server.viewer.module_file_caching import ModuleFileCaching
from server.viewer.share_sessions import ShareSessions
from server.viewer.viewer_session import ViewerSession
from server.viewer.shared_row import SharedRow
from server.viewer.share_refusal import ShareRefusal
from server.viewer.share_route import OPEN, PASSWORD_NEEDED, PASSWORD_TRY_LIMIT_STATUS
from server.viewer.phone_module_error import PhoneModuleError
from server.viewer.unknown_environment_error import UnknownEnvironmentError
from server.viewer.unknown_login_key_error import UnknownLoginKeyError
from server.viewer.viewer_request_error import ViewerRequestError
from server.viewer.viewer_server import ViewerServer

COOKIE_NAME = "journal_viewer"
SHARE_COOKIE_NAME = "journal_share"
SHARE_ROUTE = "/viewer/share/"
ENDED_LINK_MARK = b'<meta name="journal-share" content="gone">'
VIEWER_ROOT = "/viewer/"
VIEWER_MODULE = "journal.core.viewer"
KIT_ROUTE = "/viewer/kit/"
SHELL_ASSETS_ROUTE = "/viewer/assets/"
VENDOR_ROUTE = "/viewer/vendor/"
SHELL_PAGE = "index.html"
LINE_ROUTE = "/api/line"
LINES_ROUTE = "/api/lines"
WINDOW_ROUTE = "/api/window"
READ_LINES_ROUTE = "/api/read-lines"
REPEATED_LINES_ROUTE = "/api/repeated-lines"
READ_RECEIPTS_ROUTE = "/api/read-receipts"
REQUEST_LOG_STATUS_ROUTE = "/api/request-log-status"
EVENTS_ROUTE = "/api/events"
SHARE_COMMENTS_ROUTE = "/api/share/comments"
WINDOWS_ROUTE = "/api/windows"
BUTTONS_ROUTE = "/api/buttons"
MARKS_ROUTE = "/api/marks"
DOCKS_ROUTE = "/api/docks"
STATES_ROUTE = "/api/states"
SESSION_ROUTE = "/api/session"
SERVER_STATE_ROUTE = "/api/server-state"
NOTICES_ROUTE = "/api/push"
FILES_ROUTE = "/api/files"
MESSAGE_FILES = "/api/files/message/"
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
        route = urlsplit(self.path).path
        if route == EVENTS_ROUTE:
            self.answer_get()
            return
        routes = self.viewer().routes
        queue = routes.queue
        if route == WINDOW_ROUTE:
            window = self.headers.get(WINDOW_HEADER, "")
            with queue.viewer_turn(f"GET {self.path}", window, routes.priorities.priority(window)):
                self.answer_get()
            return
        turn = queue.viewer_turn(f"GET {self.path}") if route.startswith("/api/") else queue.observing(QueueRequest.started("Viewer", f"GET {self.path}"))
        with turn:
            self.answer_get()

    def answer_get(self) -> None:
        viewer = self.viewer()
        if self.headers.get("Host") != viewer.host:
            self.answer(403, {"error": "this listener answers only its own address"})
            return
        route = urlsplit(self.path)
        key = parse_qs(route.query).get("key", [""])[0]
        if route.path == "/" and key:
            kept_query = [pair for pair in parse_qsl(route.query) if pair[0] != "key"]
            try:
                token = viewer.login.session_token(key)
            except UnknownLoginKeyError as error:
                if not self.session_cookie(COOKIE_NAME):
                    self.answer(401, {"error": str(error)})
                    return
                self.answer_redirect(kept_query, {})
                return
            self.answer_redirect(kept_query, {"Set-Cookie": f"{COOKIE_NAME}={token}; HttpOnly; SameSite=Strict; Path=/"})
            return
        if route.path == SERVER_STATE_ROUTE:
            self.answer(200, asdict(viewer.routes.server_state_route.state()))
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
        if session.type is SessionType.SHARE and route.path.startswith("/api/") and route.path not in (SESSION_ROUTE, EVENTS_ROUTE, SHARE_COMMENTS_ROUTE):
            self.answer(403, {"error": "a share link opens only the row it shares"})
            return
        if route.path.startswith(MESSAGE_FILES):
            self.answer_message_file(viewer, route.path.removeprefix(MESSAGE_FILES))
            return
        if route.path == WINDOW_ROUTE:
            self.answer_window_data(viewer, viewer.login.person_id(token), route.query)
            return
        if route.path == WINDOWS_ROUTE:
            try:
                windows = viewer.routes.windows_route.windows(parse_qs(route.query).get("environment", [""])[0])
            except UnknownEnvironmentError as error:
                self.answer(404, {"error": str(error)})
                return
            self.answer(200, {"windows": [asdict(window) for window in windows], "person_id": viewer.login.person_id(token)})
            return
        if route.path == BUTTONS_ROUTE:
            try:
                buttons = viewer.routes.buttons_route.buttons(parse_qs(route.query).get("environment", [""])[0], viewer.login.person_id(token))
            except UnknownEnvironmentError as error:
                self.answer(404, {"error": str(error)})
                return
            self.answer(200, asdict(buttons))
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
        if route.path == READ_LINES_ROUTE:
            self.answer(200, {"reads": viewer.routes.line_route.read_lines(), "recording": viewer.routes.request_log.status()["enabled"]})
            return
        if route.path == REQUEST_LOG_STATUS_ROUTE:
            self.answer(200, viewer.routes.request_log.status())
            return
        if route.path == SHARE_COMMENTS_ROUTE:
            self.answer_share_comments(viewer, viewer.login.session(token), None)
            return
        if route.path == MARKS_ROUTE:
            self.answer(200, {"marks": viewer.routes.chat_declarations_route.marks()})
            return
        if route.path == DOCKS_ROUTE:
            self.answer(200, {"docks": viewer.routes.chat_declarations_route.docks()})
            return
        if route.path == STATES_ROUTE:
            self.answer(200, {"states": viewer.routes.chat_declarations_route.states()})
            return
        if route.path == SKILLS_ROUTE:
            self.answer(200, {"skills": viewer.routes.skills_route.skills()})
            return
        if route.path == EVENTS_ROUTE:
            self.answer_events(viewer.routes.event_stream, parse_qs(route.query, keep_blank_values=True), session.shared, viewer.login.shares)
            return
        if route.path == "/" or route.path.startswith(VIEWER_ROOT):
            self.answer_module_file(viewer, VIEWER_MODULE, route.path.removeprefix(VIEWER_ROOT).strip("/") or SHELL_PAGE)
            return
        self.answer(404, {"error": f"no route {route.path}"})

    def do_POST(self) -> None:
        route = urlsplit(self.path).path
        if route in (LINE_ROUTE, LINES_ROUTE):
            self.answer_post()
            return
        with self.viewer().routes.queue.viewer_turn(f"POST {self.path}"):
            self.answer_post()

    def answer_post(self) -> None:
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
        if urlsplit(self.path).path == FILES_ROUTE:
            self.answer_upload(viewer, token, body)
            return
        if urlsplit(self.path).path == SHARE_COMMENTS_ROUTE:
            self.answer_share_comments(viewer, viewer.login.session(token), body)
            return
        if urlsplit(self.path).path == LINES_ROUTE:
            self.answer_lines(viewer, token, body)
            return
        if urlsplit(self.path).path == REPEATED_LINES_ROUTE:
            report = json.loads(body or b"{}")
            viewer.routes.line_route.report_repeated_lines(RepeatedLines(str(report.get("window", "")), str(report.get("line", "")), int(report.get("count", 0))))
            self.answer(200, {})
            return
        if urlsplit(self.path).path == READ_RECEIPTS_ROUTE:
            try:
                entries = json.loads(body or b"{}")["receipts"]
                if not isinstance(entries, list):
                    raise ViewerRequestError("read receipts are a list")
                receipts = tuple(ReadAttribution.parsed(entry) for entry in entries)
            except (KeyError, TypeError, ValueError, ViewerRequestError) as error:
                self.answer(400, {"error": str(error)})
                return
            self.answer(200, {"received": len(receipts)})
            self.wfile.flush()
            viewer.routes.request_log.complete_reads(viewer.login.person_id(token), receipts)
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
        received_at, request_id = datetime.now(timezone.utc).isoformat(), str(uuid4())
        started_at = perf_counter()
        try:
            turn = nullcontext() if viewer.routes.priorities.is_unqueued(request.line) else viewer.routes.queue.viewer_turn(" ".join(request.line), request.window, viewer.routes.priorities.priority(request.window))
            with turn:
                queued_ms = (perf_counter() - started_at) * 1000
                timed = viewer.routes.line_route.timed_single_answer(request.window, request.line, viewer.login.person_id(token), request.environment, session.shared)
                answered = timed.answer
        except ShareRefusal as refusal:
            self.answer(403, {"error": refusal.reason})
            return
        duration_ms = (perf_counter() - started_at) * 1000
        http = ViewerHttpRequest(request_id, received_at, None, duration_ms, self.payload_bytes(body), viewer.login.person_id(token))
        self.answer(200, asdict(answered), {"X-Journal-Request-Id": request_id})
        self.wfile.flush()
        viewer.routes.request_log.record_viewer(ViewerRequestRecord(http, request, 0, timed.duration_ms, queued_ms, answered.code, timed.points))

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
        try:
            request = EventsRequest.parsed(query, self.headers.get("Last-Event-ID"))
        except EventPatternError as error:
            self.answer(400, {"error": str(error)})
            return
        if shared is not None:
            request = replace(request, environments=tuple([shares.environment_name(shared.environment_id)]))
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.viewer().untrack_request()
        event_stream.follow(request, self.stream_message, shared)

    def answer_window_data(self, viewer: ViewerServer, person_id: int, query: str) -> None:
        try:
            request = WindowDataRequest.parsed(self.headers.get(WINDOW_HEADER), self.headers.get(KEYS_HEADER), query)
            started_at, received_at, request_id = perf_counter(), datetime.now(timezone.utc).isoformat(), str(uuid4())
            answer = viewer.routes.window_data.answer(request, person_id)
        except ViewerRequestError as error:
            self.answer(400, {"error": str(error)})
            return
        self.answer(200, asdict(answer.body()), {"X-Journal-Request-Id": request_id})
        self.wfile.flush()
        http = ViewerHttpRequest(request_id, received_at, request_id, (perf_counter() - started_at) * 1000, 0, person_id)
        viewer.routes.request_log.record_viewers([ViewerRequestRecord(http, line, index, timed.duration_ms, 0.0, timed.answer.code, timed.points)
                                                  for index, (line, timed) in enumerate(zip(answer.lines, answer.answers, strict=True))])

    def answer_lines(self, viewer: ViewerServer, token: str, body: bytes | None) -> None:
        try:
            request = ViewerLinesRequest.parsed(json.loads(body or b"{}"))
        except ViewerRequestError as error:
            self.answer(400, {"error": str(error)})
            return
        session, person_id = viewer.login.session(token), viewer.login.person_id(token)
        received_at, request_id = datetime.now(timezone.utc).isoformat(), str(uuid4())
        started_at = perf_counter()
        inspections = [(index, line) for index, line in enumerate(request.lines) if viewer.routes.priorities.is_unqueued(line.line)]
        command_lines = [(index, line) for index, line in enumerate(request.lines) if not viewer.routes.priorities.is_unqueued(line.line)]
        answers: dict[int, LineAnswer] = {}
        records: list[ViewerRequestRecord] = []
        for index, line in inspections:
            answers[index] = viewer.routes.line_route.answers(ViewerLinesRequest([line]), person_id, session.shared)[0]
        if command_lines:
            first_window = min((line.window for _, line in command_lines), key=viewer.routes.priorities.priority)
            with viewer.routes.queue.viewer_turn("; ".join(" ".join(line.line) for _, line in command_lines), first_window, viewer.routes.priorities.priority(first_window)):
                queued_ms = (perf_counter() - started_at) * 1000
                command_answers = viewer.routes.line_route.timed_answers(ViewerLinesRequest([line for _, line in command_lines]), person_id, session.shared)
            duration_ms = (perf_counter() - started_at) * 1000
            http = ViewerHttpRequest(request_id, received_at, request_id, duration_ms, self.payload_bytes(body), person_id)
            for (index, line), timed in zip(command_lines, command_answers, strict=True):
                answers[index] = timed.answer
                records.append(ViewerRequestRecord(http, line, index, timed.duration_ms, queued_ms, timed.answer.code, timed.points))
        self.answer(200, {"answers": [asdict(answers[index]) for index in range(len(request.lines))]}, {"X-Journal-Request-Id": request_id})
        self.wfile.flush()
        viewer.routes.request_log.record_viewers(records)

    @staticmethod
    def payload_bytes(body: bytes | None) -> int:
        return 0 if body is None else len(body)

    def answer_share_comments(self, viewer: ViewerServer, session: ViewerSession, body: bytes | None) -> None:
        if session.share_id is None or not session.comments:
            self.answer(403, {"error": "only a link that takes comments has them"})
            return
        shares = viewer.login.shares
        try:
            if body is not None:
                comment = json.loads(body or b"{}")
                shares.comment(session.share_id, str(comment.get("name", "")), str(comment.get("text", "")))
            self.answer(200, {"rows": shares.comments(session.share_id)})
        except PhoneModuleError as error:
            self.answer(409, {"error": str(error)})

    def answer_share(self, viewer: ViewerServer, token: str) -> None:
        cookies = SimpleCookie(self.headers.get("Cookie", ""))
        presented = cookies[SHARE_COOKIE_NAME].value if SHARE_COOKIE_NAME in cookies else ""
        opening = viewer.routes.share_route.opening(token, self.headers.get("Authorization"), presented)
        status = opening.status
        if status == PASSWORD_NEEDED:
            self.send_response(status)
            self.send_header("WWW-Authenticate", 'Basic realm="Shared page", charset="UTF-8"')
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        if status == PASSWORD_TRY_LIMIT_STATUS:
            self.answer(status, {"error": "too many wrong passwords: try again later"})
            return
        kept = f"{SHARE_COOKIE_NAME}={opening.cookie}; HttpOnly; SameSite=Strict; Path=/"
        ended = f"{SHARE_COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0"
        cookie = {"Set-Cookie": kept if status == OPEN else ended}
        self.answer_module_file(viewer, VIEWER_MODULE, SHELL_PAGE, cookie, status, ENDED_LINK_MARK if status != OPEN else b"")

    def answer_module_file(self, viewer: ViewerServer, module_name: str, path: str, headers: Mapping[str, str] = MappingProxyType({}), status: int = 200, head_mark: bytes = b"") -> None:
        try:
            module_file = viewer.routes.module_files.file(module_name, path)
        except MissingModuleFileError as error:
            self.answer(404, {"error": str(error)})
            return
        content = module_file.content.replace(b"</head>", head_mark + b"</head>", 1) if head_mark else module_file.content
        caching = ModuleFileCaching.built(self.path, content)
        client_copy_current = status == 200 and not headers and caching.is_unchanged(self.headers.get("If-None-Match"))
        if client_copy_current:
            self.send_response(304)
            self.send_header("ETag", caching.etag)
            self.send_header("Cache-Control", caching.cache_control)
            self.end_headers()
            return
        self.send_response(status)
        self.send_header("Content-Type", module_file.content_type)
        self.send_header("Content-Length", str(len(content)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Cache-Control", caching.cache_control)
        self.send_header("ETag", caching.etag)
        self.send_header("Access-Control-Allow-Origin", "*")
        if module_file.frame:
            self.send_header("Content-Security-Policy", FRAME_POLICY.format(listener=f"http://{viewer.host}"))
        for name, value in headers.items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(content)

    def stream_message(self, message: str) -> bool:
        try:
            self.wfile.write(message.encode())
            self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            return False
        return True

    def answer_upload(self, viewer: ViewerServer, token: str, body: bytes) -> None:
        if viewer.login.session(token).type is SessionType.SHARE:
            self.answer(403, {"error": "a share link opens only the row it shares"})
            return
        if len(body) > LIMIT_BYTES:
            self.answer(413, {"error": f"a file is at most {LIMIT_BYTES // (1024 * 1024)} megabytes"})
            return
        name = parse_qs(urlsplit(self.path).query).get("name", [""])[0]
        self.answer(200, {"file": viewer.routes.file_route.upload(name, body)})

    def answer_message_file(self, viewer: ViewerServer, file_path: str) -> None:
        number, _, name = file_path.partition("/")
        download = viewer.routes.file_route.download(int(number), name) if number.isdigit() and name else None
        if download is None:
            self.answer(404, {"error": f"no file {file_path}"})
            return
        self.send_response(200)
        self.send_header("Content-Type", download.content_type)
        self.send_header("Content-Length", str(len(download.data)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(download.data)

    def answer_redirect(self, kept_query: list[tuple[str, str]], headers: dict[str, str]) -> None:
        self.send_response(303)
        for name, value in headers.items():
            self.send_header(name, value)
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
        return self.session_cookie(COOKIE_NAME, SHARE_COOKIE_NAME)

    def session_cookie(self, *names: str) -> str:
        cookie, login = SimpleCookie(self.headers.get("Cookie", "")), self.viewer().login
        tokens = [cookie[name].value for name in names if name in cookie]
        return next((token for token in tokens if login.has_session(token)), "")

    def viewer(self) -> ViewerServer:
        return server_instance(self.server, ViewerServer)

    def answer(self, status: int, value: dict[str, object], headers: Mapping[str, str] = MappingProxyType({})) -> None:
        body = json.dumps(value).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        for name, value in headers.items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        return
