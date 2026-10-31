import json
from collections.abc import Callable
import traceback
from urllib.parse import parse_qs
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler

from core.base.caller.caller_request_error import CallerRequestError
from core.base.cli.console import ERROR_CODE
from core.base.timing import TIMING_HEADER, Timing
from core.base.timing_log import TimingLog
from core.base.caller.caller_request import CallerRequest
from core.base.refusal import Refusal
from core.base.type_guards import is_mapping
from server.viewer.viewer_key_route import ViewerKeyRoute
from server.endpoints.cli_endpoint import CliEndpoint
from server.endpoints.chunk_stream import ChunkStream
from server.endpoints.cli_request import CliRequest
from server.endpoints.cli_request_error import CliRequestError
from server.endpoints.health_endpoint import HealthEndpoint
from server.endpoints.hook_endpoint import HookEndpoint
from core.base.driver.hook_event_error import HookEventError
from core.base.provider.unknown_program_error import UnknownProgramError
from server.server_instance import server_instance
from server.journal_server import JournalServer
from server.listener_wake import ListenerWake
from server.peer_pid import peer_pid

EXIT_CODE_TRAILER = "Journal-Exit-Code"
CODE_VERSION_HEADER = "Journal-Code-Version"


class RequestHandler(BaseHTTPRequestHandler):
    """Reads one HTTP request on the journal's socket and sends it to its endpoint: GET /health, POST /cli,
    POST /hook and POST /stop; a request the server's code is older than is answered 409 and runs nothing,
    and the server releases its files at once so a new one can start while it finishes its open requests.
    Each request's timing starts with the sender's stamps from its Journal-Timing header, and once its answer
    is flushed one line goes to the timing log; a line that cannot be written is noted in server.log and never
    fails the request."""

    protocol_version = "HTTP/1.1"
    route: str | None = None
    line: str = ""
    status: int = 0
    exit_code: int | None = None

    def setup(self) -> None:
        super().setup()
        self.timing = Timing.started("server_accepted")
        self.sender_pid = peer_pid(self.connection)

    def parse_request(self) -> bool:
        if not self.timing.stamps:
            self.timing = Timing.started("server_accepted")
        parsed = super().parse_request()
        if parsed:
            self.timing = Timing.parsed(self.headers.get(TIMING_HEADER, "")).joined(self.timing)
            self.timing.stamp("server_received")
            self.route = self.path
        return parsed

    def handle_one_request(self) -> None:
        super().handle_one_request()
        if self.route is not None:
            self.timing.stamp("answered")
            self.write_timing_line()
        self.route, self.line, self.status, self.exit_code, self.timing = None, "", 0, None, Timing()

    def write_timing_line(self) -> None:
        context = self.journal_server().context
        try:
            TimingLog(context.home).write({"request_id": self.timing.request_id(self.sender_pid), "route": self.route, "line": self.line, "status": self.status,
                                          "exit_code": self.exit_code, "code_version": context.code_version.text[:12], "timing": self.timing.text()})
        except OSError as error:
            context.files.log_line(f"timing line not written: {error}")

    def journal_server(self) -> JournalServer:
        return server_instance(self.server, JournalServer)

    def do_GET(self) -> None:
        self.answered_safely(self.answer_get)

    def do_POST(self) -> None:
        self.answered_safely(self.answer_post)

    def answered_safely(self, answer: Callable[[], None]) -> None:
        try:
            answer()
        except Exception as error:
            self.journal_server().context.files.log_line("".join(traceback.format_exception(error)))
            self.answer_json(500, {"error": f"{type(error).__name__}: {error}"})

    def answer_get(self) -> None:
        if self.path == "/health":
            self.answer_json(200, asdict(HealthEndpoint(self.journal_server().context).answer()))
            return
        self.answer_json(404, {"error": f"no route {self.path}"})

    def answer_post(self) -> None:
        body = self.rfile.read(int(self.headers.get("Content-Length", "0") or "0"))
        self.timing.stamp("body_read")
        stale = self.journal_server().context.code_version.is_stale()
        self.timing.stamp("stale_checked")
        if stale:
            self.answer_json(409, {"error": "newer code: the server restarts, send the request again"}, closing=True)
            self.journal_server().release_files()
            return
        if self.path == "/viewer/key":
            self.answer_viewer_key(body)
            return
        if self.path == "/stop":
            self.answer_json(200, {"status": "stopping"}, closing=True)
            self.journal_server().request_stop()
            return
        route, _, query = self.path.partition("?")
        if route == "/hook":
            self.answer_hook(body, parse_qs(query).get("program", [""])[0])
            return
        if self.path != "/cli":
            self.answer_json(404, {"error": f"no route {self.path}"})
            return
        try:
            request = CliRequest.parsed(json.loads(body or b"{}"), self.sender_pid, self.timing)
        except (CliRequestError, CallerRequestError, json.JSONDecodeError) as error:
            self.answer_json(400, {"error": str(error)})
            return
        self.line = " ".join(request.argv[:2])
        self.answer_cli(request)

    def answer_viewer_key(self, body: bytes) -> None:
        try:
            data = json.loads(body or b"{}")
            request = CallerRequest.parsed({"variables": data.get("variables", {}), "folder": data.get("folder", ""), "pid": self.sender_pid}
                                           if is_mapping(data) else data)
        except (CallerRequestError, json.JSONDecodeError) as error:
            self.answer_json(400, {"error": str(error)})
            return
        context = self.journal_server().context
        try:
            viewer_key = ViewerKeyRoute(context.home, context.viewer.login).key(request)
            self.answer_json(200, {"key": viewer_key.key, "environment": viewer_key.environment})
        except Refusal as refusal:
            self.answer_json(403, {"error": refusal.reason})

    def answer_hook(self, body: bytes, program: str) -> None:
        self.timing.stamp("hook_body")
        try:
            endpoint = HookEndpoint(self.timing, self.journal_server().context)
            data = json.loads(body or b"{}")
            self.timing.stamp("hook_json")
            reply = endpoint.answer(data, program, dict(self.headers.items()))
        except (HookEventError, UnknownProgramError, json.JSONDecodeError) as error:
            self.answer_json(400, {"error": str(error)})
            return
        self.answer_json(200, reply.json())

    def answer_cli(self, request: CliRequest) -> None:
        self.status = 200
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Transfer-Encoding", "chunked")
        self.send_header("Trailer", EXIT_CODE_TRAILER)
        self.end_headers()
        try:
            context = self.journal_server().context
            code = CliEndpoint(context.home, ListenerWake(context.listener_thread)).answer(request, ChunkStream(self.send_chunk))
        except Exception as error:
            self.journal_server().context.files.log_line("".join(traceback.format_exception(error)))
            self.send_chunk(f"{type(error).__name__}: {error}\n".encode())
            code = ERROR_CODE
        self.timing.stamp("command_done")
        self.exit_code = code
        self.wfile.write(f"0\r\n{EXIT_CODE_TRAILER}: {code}\r\n\r\n".encode())
        self.wfile.flush()

    def send_chunk(self, data: bytes) -> None:
        self.wfile.write(f"{len(data):x}\r\n".encode() + data + b"\r\n")
        self.wfile.flush()

    def answer_json(self, status: int, answer: dict[str, object], closing: bool = False) -> None:
        body = json.dumps(answer).encode()
        self.status = status
        self.send_response(status)
        if closing or self.journal_server().stopping.is_set():
            self.close_connection = True
            self.send_header("Connection", "close")
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self) -> None:
        self.send_header(CODE_VERSION_HEADER, self.journal_server().context.code_version.text)
        super().end_headers()

    def address_string(self) -> str:
        return "unix"

    def log_request(self, code: int | str = "-", size: int | str = "-") -> None:
        pass

    def log_message(self, format: str, *args: object) -> None:
        self.journal_server().context.files.log_line(format % args)
