import http.client
import json
import socket
from collections.abc import Callable
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from threading import Thread
from unittest.mock import patch

from engine.caller.process_table import ProcessTable
from engine.database.reported_findings import ReportedFindings
from engine.execution.instant_pool_reading import InstantPoolReading
from engine.journal.journal_home import JournalHome
from engine.module.code_fingerprint import CodeFingerprint
from engine.module.journal_container import synced_database_container
from engine.module.module_finder import ModuleFinder
from engine.performance.timing import Timing
from engine.performance.timing_log import TimingLog
from engine.serving.server_files import ServerFiles
from engine.serving.server_limits import DRAIN_LIMIT_SECONDS
from engine.testing.fakes.fixed_process_table import FixedProcessTable
from engine.time.clock import Clock
from server.context.server_context import IDLE_CONNECTION_SECONDS, ServerContext
from server.door.journal_door import JournalDoor
from server.door.local_journal_door import LocalJournalDoor
from server.execution.session_starters import SessionStarters
from server.handover.code_folders import CodeFolders
from server.handover.code_version import CodeVersion
from server.hook.hook_database import HookDatabase
from server.request.journal_server import JournalServer
from server.request.request_handler import EXIT_CODE_TRAILER, RequestHandler
from server.tick.server_tunnel import ServerTunnel
from server.viewer.line_route import LineRoute
from server.viewer.phone_sessions import PhoneSessions
from server.viewer.share_sessions import ShareSessions
from server.viewer.viewer_endpoint import ViewerEndpoint
from server.viewer.viewer_listener import ViewerListener
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_routes import ViewerRoutes
from server.work.listeners.listener_thread import ListenerThread
from server.work.listeners.listener_wake_router import ListenerWakeRouter
from server.work.listeners.listener_work import ListenerWork
from server.work.rounds.journal_round import JournalRound
from server.work.rounds.kept_round_container import KeptRoundContainer

SYSTEM_CLOCK = Clock()
TIMEOUT_SECONDS = 10
TEST_HOOK_LIMIT_SECONDS = 0.5
# Longer than the hook limit, as the twenty seconds of a real stop are longer than its three and a half.
TEST_STOP_LIMIT_SECONDS = 2.0
TEST_INSTANT_CAPACITY = 1

ViewerFactory = Callable[[ViewerLogin, ViewerRoutes], ViewerEndpoint]
LineRouteFactory = Callable[[JournalHome, ListenerWakeRouter, ReportedFindings, ServerContext], LineRoute]


@dataclass(frozen=True)
class ServerAnswer:
    """What the server sent back to one request: its status, the body's text, and the exit code a /cli answer
    ends with."""

    status: int
    text: str
    exit_code: int | None
    code_version: str

    def json(self) -> object:
        return json.loads(self.text)


def local_viewer(login: ViewerLogin, routes: ViewerRoutes) -> ViewerEndpoint:
    return ViewerListener(login, routes, lambda: None)


def server_line_route(home: JournalHome, wakes: ListenerWakeRouter, reported: ReportedFindings, context: ServerContext) -> LineRoute:
    return LineRoute(home, wakes, reported, completion_callback=context.request_trace.completed)


# the real server on a journal home, on its own socket, with a fixed process table; it stops and frees its files at
# the end
@contextmanager
def running_server(home: JournalHome, code_folders: CodeFolders | None = None, listener_thread_started: bool = True, viewer_factory: ViewerFactory = local_viewer, journal_door: JournalDoor = LocalJournalDoor(), clock: Clock = SYSTEM_CLOCK, instant_capacity: int = TEST_INSTANT_CAPACITY, idle_connection_seconds: float = IDLE_CONNECTION_SECONDS, line_route_factory: LineRouteFactory = server_line_route):
    with patch.object(ProcessTable, "rows", FixedProcessTable([]).rows):
        files = ServerFiles(home)
        assert files.acquire_lock(), "a server already holds the lock of this journal"
        files.clear_leftover_socket()
        hook_database = HookDatabase(home, instant_capacity=instant_capacity)
        listener_round = JournalRound(home, "listener thread", ListenerWork(), KeptRoundContainer(home))
        listener_thread = ListenerThread(listener_round.run, listener_round.report, stop_callback=listener_round.close)
        wakes = ListenerWakeRouter.waking(listener_thread)
        phones = PhoneSessions(home, wakes)
        login = ViewerLogin(phones, ShareSessions(phones.journal_output, clock))
        reported = ReportedFindings()
        context = ServerContext(home, CodeVersion(CodeFingerprint(), code_folders or CodeFolders(ModuleFinder(home))), files, clock.timestamp(), wakes,
                                hook_database, viewer_factory(login, ViewerRoutes(home, wakes, login, reported, hook_database.viewer_tickets, clock)), ServerTunnel(home), reported, journal_door, TEST_HOOK_LIMIT_SECONDS, TEST_HOOK_LIMIT_SECONDS, TEST_STOP_LIMIT_SECONDS, idle_connection_seconds=idle_connection_seconds)
        context.request_trace.refresh(synced_database_container(home, hook_database.databases[0]))
        InstantPoolReading.shared(home).install(lambda: [entry.reading() for entry in hook_database.executions.read()], hook_database.instant_capacity)
        context.viewer.routes.line_route = line_route_factory(home, wakes, reported, context)
        server = JournalServer(str(files.socket), RequestHandler, context)
        if listener_thread_started:
            listener_thread.start()
        files.write_pid()
        thread = Thread(target=server.serve_requests, daemon=True)
        thread.start()
        context.viewer.start()
        try:
            yield server, files.socket, context
        finally:
            context.viewer.stop()
            listener_thread.stop()
            server.request_stop()
            thread.join(TIMEOUT_SECONDS)
            server.drain(DRAIN_LIMIT_SECONDS)
            context.request_trace.close()
            context.hook_database.close()
            SessionStarters.shared(home).close()
            InstantPoolReading.shared(home).remove()
            files.remove_server_files()
            server.server_close()
            files.release_lock()


def request_answer(socket_path: Path, method: str, route: str, body: object = None, headers: dict[str, str] | None = None) -> ServerAnswer:
    data = json.dumps(body).encode() if body is not None else b""
    header_lines = "".join(f"{name}: {value}\r\n" for name, value in (headers or {}).items())
    head = f"{method} {route} HTTP/1.1\r\nHost: journal\r\n{header_lines}Content-Length: {len(data)}\r\nConnection: close\r\n\r\n".encode()
    return read_answer(raw_answer(socket_path, head + data))


def raw_answer(socket_path: Path, raw_request: bytes) -> bytes:
    with socket.socket(socket.AF_UNIX) as connection:
        connection.settimeout(TIMEOUT_SECONDS)
        connection.connect(str(socket_path))
        connection.sendall(raw_request)
        raw = b""
        while received := connection.recv(65536):
            raw += received
    return raw


def read_answer(raw: bytes) -> ServerAnswer:
    head, _, remaining = raw.partition(b"\r\n\r\n")
    status = int(head.split(b" ", 2)[1])
    headers = {line.split(b":", 1)[0].strip().lower(): line.split(b":", 1)[1].strip() for line in head.split(b"\r\n")[1:]}
    if headers.get(b"transfer-encoding") != b"chunked":
        return ServerAnswer(status, remaining.decode(), None, headers.get(b"journal-code-version", b"").decode())
    text, exit_code = b"", None
    while remaining:
        size_line, _, remaining = remaining.partition(b"\r\n")
        size = int(size_line, 16)
        if size == 0:
            trailer = remaining.split(b"\r\n")[0].decode()
            exit_code = int(trailer.split(":", 1)[1]) if trailer.startswith(EXIT_CODE_TRAILER) else None
            break
        text, remaining = text + remaining[:size], remaining[size + 2:]
    return ServerAnswer(status, text.decode(), exit_code, headers.get(b"journal-code-version", b"").decode())


def viewer_answer(port: int, path: str, cookie: str, host: str, body: dict[str, object] | None = None) -> tuple[int, dict[str, str], str]:
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=TIMEOUT_SECONDS)
    headers = {"Host": host or f"127.0.0.1:{port}", **({"Cookie": cookie} if cookie else {})}
    try:
        connection.request("GET" if body is None else "POST", path, body=None if body is None else json.dumps(body), headers=headers)
        response = connection.getresponse()
        return response.status, dict(response.getheaders()), response.read().decode(errors="replace")
    finally:
        connection.close()


def expect_timing_lines(home: JournalHome, lines: list[tuple[str, list[str]]]) -> None:
    log_lines = [json.loads(line) for line in TimingLog(home).path.read_text().splitlines()]
    assert [(line["request_id"], [name for name, _ in Timing.parsed(line["timing"]).stamps]) for line in log_lines] == lines, log_lines
