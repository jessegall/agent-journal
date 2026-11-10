import json
from collections.abc import Callable
import traceback
from time import perf_counter
from urllib.parse import parse_qs
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler

from engine.caller.errors.caller_request_error import CallerRequestError
from engine.cli.console import ERROR_CODE
from engine.enums.log_level import LogLevel
from engine.time.timing import TIMING_HEADER, Timing
from engine.time.timing_log import TimingLog
from engine.caller.caller_request import CallerRequest
from engine.errors.refusal import Refusal
from engine.types.type_guards import is_mapping
from server.request.client_disconnected import client_disconnected
from server.hook.queue_request import QueueRequest
from engine.caller.caller_request import SESSION_VARIABLE
from server.viewer.viewer_key_route import ViewerKeyRoute
from server.endpoints.cli_endpoint import CliEndpoint
from engine.performance.performance_state import PerformanceState
from server.endpoints.chunk_stream import ChunkStream
from server.endpoints.cli_request import CliRequest
from server.errors.cli_request_error import CliRequestError
from server.endpoints.health_endpoint import HealthEndpoint
from server.endpoints.hook_endpoint import HookEndpoint
from engine.driver.errors.hook_event_error import HookEventError
from engine.provider.errors.unknown_program_error import UnknownProgramError
from server.request.server_instance import server_instance
from server.request.journal_server import JournalServer
from server.work.listener_wake import ListenerWake
from server.door.socket_peer import socket_peer
from server.handover.successor_start import SuccessorStart

EXIT_CODE_TRAILER = "Journal-Exit-Code"
CODE_VERSION_HEADER = "Journal-Code-Version"
HANDOVER_FAILED_STATUS = 422


class RequestHandler(BaseHTTPRequestHandler):
    """Reads one HTTP request on the journal's socket and sends it to its endpoint: GET /health, POST /cli,
    POST /hook, POST /stop and POST /handover; a request the server's code is older than is answered 409 and
    runs nothing,
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
        self.timing = Timing.started("server_accepted", PerformanceState(self.journal_server().context.home))
        self.peer = socket_peer(self.connection)
        self.journal_server().connection_idle(self.connection)

    @property
    def sender_pid(self) -> int:
        return self.peer.pid

    def parse_request(self) -> bool:
        self.journal_server().connection_busy()
        if not self.timing.stamps:
            self.timing = Timing.started("server_accepted", PerformanceState(self.journal_server().context.home))
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
        self.journal_server().connection_idle(self.connection)

    def write_timing_line(self) -> None:
        context = self.journal_server().context
        try:
            TimingLog(context.home).write({"request_id": self.timing.request_id(self.sender_pid), "route": self.route, "line": self.line, "status": self.status,
                                          "exit_code": self.exit_code, "code_version": context.code_version.text[:12], "timing": self.timing.text()})
        except OSError as error:
            context.files.log_line(f"timing line not written: {error}", LogLevel.WARNING)

    def journal_server(self) -> JournalServer:
        return server_instance(self.server, JournalServer)

    def do_GET(self) -> None:
        self.answered_safely(self.answer_get)

    def do_POST(self) -> None:
        self.answered_safely(self.answer_post)

    def answered_safely(self, answer: Callable[[], None]) -> None:
        try:
            route = self.path.partition("?")[0]
            if route in ("/hook", "/cli"):
                answer()
                return
            with self.journal_server().context.hook_database.queue.observing(QueueRequest.started("Client", f"{self.command} {self.path}")):
                answer()
        except Exception as error:
            if client_disconnected(error):
                self.close_connection = True
                return
            self.journal_server().context.files.log_line("".join(traceback.format_exception(error)), LogLevel.ERROR)
            self.answer_json(500, {"error": f"{type(error).__name__}: {error}"})

    def answer_get(self) -> None:
        if self.path == "/health":
            self.answer_json(200, asdict(HealthEndpoint(self.journal_server().context).answer()))
            return
        self.answer_json(404, {"error": f"no route {self.path}"})

    def answer_post(self) -> None:
        refusal = self.journal_server().context.door.refusal(self.path.partition("?")[0], self.peer)
        if refusal is not None:
            self.close_with_json(refusal.status, {"error": refusal.reason})
            return
        body = self.rfile.read(int(self.headers.get("Content-Length", "0") or "0"))
        self.timing.stamp("body_read")
        stale = self.journal_server().context.code_version.is_stale()
        self.timing.stamp("stale_checked")
        if stale:
            self.journal_server().context.files.mark_restart()
            self.close_with_json(409, {"error": "newer code: the server restarts, send the request again"})
            self.journal_server().release_files()
            return
        if self.path == "/viewer/key":
            self.answer_viewer_key(body)
            return
        if self.path == "/stop":
            self.journal_server().request_stop()
            self.close_with_json(200, {"status": "stopping"})
            return
        route, _, query = self.path.partition("?")
        if route == "/hook":
            self.answer_hook(body, parse_qs(query).get("program", [""])[0])
            return
        if route == "/handover":
            self.answer_handover(parse_qs(query).get("tag", [""])[0])
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

    def answer_handover(self, tag: str) -> None:
        server = self.journal_server()
        if not SuccessorStart(server.context.home, server.context.files, server.socket, server.context.viewer.socket).run(tag):
            self.answer_json(HANDOVER_FAILED_STATUS, {"error": f"code version {tag} failed its proof"})
            return
        server.begin_handover()
        self.close_with_json(200, {"status": "handing over"})

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
        try:
            self.answer_json(200, reply.json())
        except OSError as error:
            if client_disconnected(error):
                endpoint.answer_lost(reply)
                return
            raise

    def answer_cli(self, request: CliRequest) -> None:
        started_at = perf_counter()
        queued_ms = 0.0
        context = self.journal_server().context
        self.status = 200
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Transfer-Encoding", "chunked")
        self.send_header("Trailer", EXIT_CODE_TRAILER)
        self.end_headers()
        try:
            queued = QueueRequest.started("CLI", " ".join(request.argv), request.caller.variables.get(SESSION_VARIABLE, ""), "cli")
            queue = context.hook_database.queue
            turn = queue.observing(queued) if context.viewer.routes.priorities.is_unqueued(request.argv) else queue.cli_turn(queued)
            with turn:
                queued_ms = (perf_counter() - started_at) * 1000
                code = CliEndpoint(context.home, ListenerWake(context.listener_thread), context.reported_findings, queue, context.request_log.completed).answer(request, ChunkStream(self.send_chunk))
        except Exception as error:
            self.journal_server().context.files.log_line("".join(traceback.format_exception(error)), LogLevel.ERROR)
            self.send_chunk(f"{type(error).__name__}: {error}\n".encode())
            code = ERROR_CODE
        self.timing.stamp("command_done")
        self.exit_code = code
        self.wfile.write(f"0\r\n{EXIT_CODE_TRAILER}: {code}\r\n\r\n".encode())
        self.wfile.flush()
        context.request_log.record(request.argv, "cli", (perf_counter() - started_at) * 1000, queued_ms, code)

    def send_chunk(self, data: bytes) -> None:
        self.wfile.write(f"{len(data):x}\r\n".encode() + data + b"\r\n")
        self.wfile.flush()

    def answer_json(self, status: int, answer: dict[str, object]) -> None:
        if self.journal_server().stopping.is_set():
            self.close_with_json(status, answer)
            return
        self.send_json(status, answer)

    def close_with_json(self, status: int, answer: dict[str, object]) -> None:
        self.close_connection = True
        self.send_json(status, answer)

    def send_json(self, status: int, answer: dict[str, object]) -> None:
        body = json.dumps(answer).encode()
        self.status = status
        self.send_response(status)
        if self.close_connection:
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
