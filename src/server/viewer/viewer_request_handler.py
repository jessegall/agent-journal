from collections.abc import Callable, Mapping, Sequence
from contextlib import nullcontext
from types import MappingProxyType
import html
import json
from time import perf_counter
from dataclasses import asdict, replace
from uuid import uuid4
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qsl, parse_qs, urlencode, urlsplit

from server.request.server_instance import server_instance
from server.hook.queue_request import QueueRequest
from server.viewer.read_attribution import ReadAttribution
from server.viewer.viewer_request_record import ViewerHttpRequest, ViewerRequestRecord
from server.viewer.event_stream import EventStream
from server.viewer.file_route import LIMIT_BYTES
from server.viewer.events_request import EventsRequest
from engine.database.repeated_lines import RepeatedLines
from engine.event.errors.event_pattern_error import EventPatternError
from engine.types.type_guards import is_list
from server.errors.missing_module_file_error import MissingModuleFileError
from server.viewer.line_answer import LineAnswer
from server.viewer.viewer_line_request import ViewerLineRequest
from server.viewer.window_data_request import KEYS_HEADER, WINDOW_HEADER, WindowDataRequest
from server.viewer.viewer_lines_request import ViewerLinesRequest
from server.viewer.pair_request import PairRequest
from server.enums.session_type import SessionType
from server.viewer.module_file_caching import ModuleFileCaching
from server.viewer.share_sessions import ShareSessions
from server.viewer.viewer_session import ViewerSession
from server.viewer.shared_row import SharedRow
from server.errors.share_refusal import ShareRefusal
from server.viewer.share_route import OPEN, PASSWORD_NEEDED, PASSWORD_TRY_LIMIT_STATUS
from server.errors.phone_module_error import PhoneModuleError
from server.errors.unknown_environment_error import UnknownEnvironmentError
from server.errors.unknown_login_key_error import UnknownLoginKeyError
from server.errors.viewer_request_error import ViewerRequestError
from server.viewer.door_refusal import DoorRefusal
from server.viewer.door_request import DoorRequest
from server.viewer.viewer_server import ViewerServer

UNKNOWN_PEER_UID = -1
CLOSED_DOOR_REASON = "not available on a hosted journal yet"
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
LOGIN_LINK_ROUTE = "/api/login-link"
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
LOGIN_PAGE_REASON = "This browser is not logged in."
LOGIN_PAGE = """<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Not logged in</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: system-ui, sans-serif; max-width: 34rem; margin: 4rem auto; padding: 0 1rem; line-height: 1.5">
<h1>Not logged in</h1>
<p>{reason}</p>
<p>To log this browser in, open the journal viewer in a browser that is logged in and choose <strong>Log in another browser</strong> from its menu. Copy the link it shows into this browser. The link works once.</p>
</body>
</html>
"""
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
        if self.door_refuses(is_change=False):
            return
        route = urlsplit(self.path)
        key = parse_qs(route.query).get("key", [""])[0]
        if route.path == "/" and key:
            kept_query = [pair for pair in parse_qsl(route.query) if pair[0] != "key"]
            try:
                token = viewer.login.session_token(key)
            except UnknownLoginKeyError as error:
                if not self.session_cookie(self.cookie_name(COOKIE_NAME)):
                    self.answer_login_page(str(error))
                    return
                self.answer_redirect(kept_query, {})
                return
            self.answer_redirect(kept_query, {"Set-Cookie": viewer.answer_headers.cookie(self.cookie_name(COOKIE_NAME), token)})
            return
        if route.path == SERVER_STATE_ROUTE and not viewer.door.state_needs_login(self.door_request(is_change=False)):
            self.answer_server_state(viewer)
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
            if route.path.startswith("/api/"):
                self.answer(401, {"error": "this browser is not logged in"})
            else:
                self.answer_login_page(LOGIN_PAGE_REASON)
            return
        session = viewer.login.session(token)
        if session.type is SessionType.SHARE and route.path.startswith("/api/") and route.path not in (SESSION_ROUTE, EVENTS_ROUTE, SHARE_COMMENTS_ROUTE, WINDOW_ROUTE):
            self.answer(403, {"error": "a share link opens only the row it shares"})
            return
        if route.path.startswith(MESSAGE_FILES):
            self.answer_message_file(viewer, route.path.removeprefix(MESSAGE_FILES))
            return
        if route.path == SERVER_STATE_ROUTE:
            self.answer_server_state(viewer)
            return
        if route.path == WINDOW_ROUTE:
            self.answer_window_data(viewer, session, viewer.login.person_id(token), route.query)
            return
        if route.path == WINDOWS_ROUTE:
            try:
                environment = parse_qs(route.query).get("environment", [""])[0]
                windows = viewer.routes.windows_route.windows(environment)
                inspectors = viewer.routes.windows_route.inspectors(environment)
            except UnknownEnvironmentError as error:
                self.answer(404, {"error": str(error)})
                return
            self.answer(200, {"windows": [asdict(window) for window in windows], "inspectors": [asdict(inspector) for inspector in inspectors], "person_id": viewer.login.person_id(token)})
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

    def answer_server_state(self, viewer: ViewerServer) -> None:
        self.answer(200, asdict(viewer.routes.server_state_route.state()))

    def do_POST(self) -> None:
        route = urlsplit(self.path).path
        if route in (LINE_ROUTE, LINES_ROUTE):
            self.answer_post()
            return
        with self.viewer().routes.queue.viewer_turn(f"POST {self.path}"):
            self.answer_post()

    def answer_post(self) -> None:
        viewer = self.viewer()
        if self.door_refuses(is_change=True):
            return
        body = self.rfile.read(int(self.headers.get("Content-Length", "0") or "0"))
        if urlsplit(self.path).path == PAIRING_ROUTE:
            self.answer_pairing(viewer, body)
            return
        token = self.cookie_token()
        if not viewer.login.has_session(token):
            self.answer(401, {"error": "open the address journal viewer prints to log in"})
            return
        if urlsplit(self.path).path == LOGIN_LINK_ROUTE:
            self.answer_login_link(viewer, viewer.login.session(token))
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
                if not is_list(entries):
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
        received_at, request_id = self.stamped()
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

    def parsed_request[Parsed](self, parse: Callable[[], Parsed]) -> Parsed | None:
        try:
            return parse()
        except ViewerRequestError as error:
            self.answer(400, {"error": str(error)})
            return None

    def answer_window_data(self, viewer: ViewerServer, session: ViewerSession, person_id: int, query: str) -> None:
        started_at, received_at, request_id = perf_counter(), viewer.routes.clock.timestamp().text, str(uuid4())
        answer = self.parsed_request(lambda: viewer.routes.window_data.answer(WindowDataRequest.parsed(self.headers.get(WINDOW_HEADER), self.headers.get(KEYS_HEADER), query), person_id, session.shared))
        if answer is None:
            return
        http = self.http_request(request_id, received_at, (perf_counter() - started_at) * 1000, 0, person_id)
        self.finish_request(viewer, asdict(answer.body()), request_id, [ViewerRequestRecord(http, line, index, timed.duration_ms, 0.0, timed.answer.code, timed.points)
                                                                            for index, (line, timed) in enumerate(zip(answer.lines, answer.answers, strict=True))])

    def answer_lines(self, viewer: ViewerServer, token: str, body: bytes | None) -> None:
        request = self.parsed_request(lambda: ViewerLinesRequest.parsed(json.loads(body or b"{}")))
        if request is None:
            return
        session, person_id = viewer.login.session(token), viewer.login.person_id(token)
        received_at, request_id = self.stamped()
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
            http = self.http_request(request_id, received_at, duration_ms, self.payload_bytes(body), person_id)
            for (index, line), timed in zip(command_lines, command_answers, strict=True):
                answers[index] = timed.answer
                records.append(ViewerRequestRecord(http, line, index, timed.duration_ms, queued_ms, timed.answer.code, timed.points))
        self.finish_request(viewer, {"answers": [asdict(answers[index]) for index in range(len(request.lines))]}, request_id, records)

    def finish_request(self, viewer: ViewerServer, body: Mapping[str, object], request_id: str, records: Sequence[ViewerRequestRecord]) -> None:
        self.answer(200, body, {"X-Journal-Request-Id": request_id})
        self.wfile.flush()
        viewer.routes.request_log.record_viewers(records)

    def stamped(self) -> tuple[str, str]:
        return self.viewer().routes.clock.timestamp().text, str(uuid4())

    @staticmethod
    def http_request(request_id: str, received_at: str, duration_ms: float, body_bytes: int, person_id: int) -> ViewerHttpRequest:
        return ViewerHttpRequest(request_id, received_at, request_id, duration_ms, body_bytes, person_id)

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
        share_cookie = self.cookie_name(SHARE_COOKIE_NAME)
        presented = cookies[share_cookie].value if share_cookie in cookies else ""
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
        kept = viewer.answer_headers.cookie(share_cookie, opening.cookie)
        ended = f"{viewer.answer_headers.cookie(share_cookie, '')}; Max-Age=0"
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
            self.send_header("Content-Security-Policy", FRAME_POLICY.format(listener=viewer.answer_headers.listener_origin(viewer.host)))
        for name, value in {**(viewer.answer_headers.shell_page() if path == SHELL_PAGE else {}), **headers}.items():
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

    def answer_login_link(self, viewer: ViewerServer, session: ViewerSession) -> None:
        if session.type is not SessionType.PERSON or session.person_id is None:
            self.answer(403, {"error": "only a person's own viewer can log in another browser"})
            return
        self.answer(200, {"link": f"{viewer.answer_headers.listener_origin(viewer.host)}/?key={viewer.login.new_key(session.person_id)}"})

    def answer_login_page(self, reason: str) -> None:
        body = LOGIN_PAGE.format(reason=html.escape(reason)).encode()
        self.send_response(401)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def answer_redirect(self, kept_query: list[tuple[str, str]], headers: dict[str, str]) -> None:
        self.send_response(303)
        for name, text in headers.items():
            self.send_header(name, text)
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
        self.send_header("Set-Cookie", viewer.answer_headers.cookie(self.cookie_name(COOKIE_NAME), token))
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def cookie_token(self) -> str:
        return self.session_cookie(self.cookie_name(COOKIE_NAME), self.cookie_name(SHARE_COOKIE_NAME))

    def cookie_name(self, base: str) -> str:
        return self.viewer().answer_headers.cookie_prefix + self.viewer().login.cookie_name(base)

    def session_cookie(self, *names: str) -> str:
        cookie, login = SimpleCookie(self.headers.get("Cookie", "")), self.viewer().login
        tokens = [cookie[name].value for name in names if name in cookie]
        return next((token for token in tokens if login.has_session(token)), "")

    def viewer(self) -> ViewerServer:
        return server_instance(self.server, ViewerServer)

    def send_response(self, code: int, message: str | None = None) -> None:
        self.sent_header_names: set[str] = set()
        super().send_response(code, message)

    def send_header(self, keyword: str, value: str) -> None:
        super().send_header(keyword, value)
        self.sent_header_names.add(keyword.lower())

    def end_headers(self) -> None:
        for name, value in self.viewer().answer_headers.common_headers().items():
            if name.lower() not in self.sent_header_names:
                self.send_header(name, value)
        super().end_headers()

    @property
    def peer_uid(self) -> int:
        return UNKNOWN_PEER_UID

    def door_request(self, is_change: bool) -> DoorRequest:
        return DoorRequest(self.peer_uid, self.headers.get("Host", ""), self.headers.get("Origin", ""), self.headers.get("Sec-Fetch-Site", ""), is_change,
                           self.viewer().login.has_session(self.cookie_token()), int(self.headers.get("Content-Length", "0") or "0"))

    def door_refuses(self, is_change: bool) -> bool:
        viewer = self.viewer()
        refusal = viewer.door.refusal(self.door_request(is_change))
        route = urlsplit(self.path)
        if refusal is None and viewer.closed_doors.closes_route(route.path, parse_qs(route.query)):
            refusal = DoorRefusal(404, CLOSED_DOOR_REASON)
        if refusal is None:
            return False
        self.close_connection = True
        self.answer(refusal.status, {"error": refusal.reason}, {"Connection": "close"})
        return True

    def answer(self, status: int, value: Mapping[str, object], headers: Mapping[str, str] = MappingProxyType({})) -> None:
        body = json.dumps(value).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        for name, text in headers.items():
            self.send_header(name, text)
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        return
