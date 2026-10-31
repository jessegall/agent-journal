import json
from collections.abc import Callable
import traceback
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler

from core.base.caller.caller_request import CallerRequestError
from core.base.cli.console import ERROR_CODE
from server.endpoints.cli_endpoint import ChunkStream, CliEndpoint, CliRequest, CliRequestError
from server.endpoints.health_endpoint import HealthEndpoint
from server.journal_server import JournalServer
from server.listener_thread import ListenerWake
from server.peer_pid import peer_pid

EXIT_CODE_TRAILER = "Journal-Exit-Code"
CODE_VERSION_HEADER = "Journal-Code-Version"


class RequestHandler(BaseHTTPRequestHandler):
    """Reads one HTTP request on the journal's socket and sends it to its endpoint: GET /health, POST /cli and
    POST /stop; a request the server's code is older than is answered 409 and runs nothing, and the server
    releases its files at once so a new one can start while it finishes its open requests."""

    protocol_version = "HTTP/1.1"

    def journal_server(self) -> JournalServer:
        if not isinstance(self.server, JournalServer):
            raise TypeError(f"a request handler serves a JournalServer, not {type(self.server).__name__}")
        return self.server

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
        if self.journal_server().context.code_version.is_stale():
            self.answer_json(409, {"error": "newer code: the server restarts, send the request again"})
            self.journal_server().release_files()
            return
        if self.path == "/stop":
            self.answer_json(200, {"status": "stopping"})
            self.journal_server().request_stop()
            return
        if self.path != "/cli":
            self.answer_json(404, {"error": f"no route {self.path}"})
            return
        try:
            request = CliRequest.parsed(json.loads(body or b"{}"), peer_pid(self.connection))
        except (CliRequestError, CallerRequestError, json.JSONDecodeError) as error:
            self.answer_json(400, {"error": str(error)})
            return
        self.answer_cli(request)

    def answer_cli(self, request: CliRequest) -> None:
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
        self.wfile.write(f"0\r\n{EXIT_CODE_TRAILER}: {code}\r\n\r\n".encode())
        self.wfile.flush()

    def send_chunk(self, data: bytes) -> None:
        self.wfile.write(f"{len(data):x}\r\n".encode() + data + b"\r\n")
        self.wfile.flush()

    def answer_json(self, status: int, answer: dict[str, object]) -> None:
        body = json.dumps(answer).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self) -> None:
        self.send_header(CODE_VERSION_HEADER, self.journal_server().context.code_version.text)
        super().end_headers()

    def address_string(self) -> str:
        return "unix"

    def log_message(self, format: str, *args: object) -> None:
        self.journal_server().context.files.log_line(format % args)
