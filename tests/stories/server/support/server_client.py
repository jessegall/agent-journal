from collections.abc import Callable
from core.base.database.reported_findings import ReportedFindings
import http.client
import json
import os
import shlex
import subprocess
import socket
import time
from unittest.mock import patch
from engine.caller.process_table import ProcessTable
from engine.time.clock import Clock
from core.testing.fixed_process_table import FixedProcessTable
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from threading import Event, Thread
from urllib.parse import urlencode

from core.base.cli.console import ERROR_CODE
from engine.journal.journal_home import JournalHome
from engine.container.journal_container import synced_database_container
from server.endpoints.cli_endpoint import CliEndpoint
from server.endpoints.hook_endpoint import HookEndpoint
from engine.time.timing import TIMING_HEADER, Timing
from engine.time.timing_log import TimingLog
from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from tests.stories.server.support.story_line_route import StoryLineRoute
from core.testing.line_outcome import LineOutcome
from engine.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.skills.models.agent_skill import AgentSkill
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from server.code_version import CodeVersion
from server.code_folders import CodeFolders
from server.journal_door import JournalDoor
from server.local_journal_door import LocalJournalDoor
from server.journal_server import JournalServer
from core.base.serving.server_limits import DRAIN_LIMIT_SECONDS
from server.server_context import ServerContext
from server.hook.hook_database import HookDatabase
from server.hook.queue_priority import QueuePriority
from server.journal_round import JournalRound
from server.listener_thread import ListenerThread
from server.listener_wake import ListenerWake
from server.listener_work import ListenerWork
from server.request_handler import EXIT_CODE_TRAILER, RequestHandler
from core.base.serving.server_files import ServerFiles
from server.viewer.viewer_endpoint import ViewerEndpoint
from server.viewer.viewer_listener import ViewerListener
from server.viewer.phone_sessions import PhoneSessions
from server.viewer.share_sessions import ShareSessions
from server.server_tunnel import ServerTunnel
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_routes import ViewerRoutes
from scripts.timing_report import logged_timings, report

SYSTEM_CLOCK = Clock()
TIMEOUT_SECONDS = 10
POLL_SECONDS = 0.05
STORY_HOOK_LIMIT_SECONDS = 0.5
STORY_RUNNING_HOOKS_COUNT = 1
LOCKED_HOOK_WAIT_SECONDS = 1.0


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


class ServerStory:
    """A story's journal with a server running on it, and the checks of what the server answers."""

    def __init__(self, story: Story, socket_path: Path, context: ServerContext) -> None:
        self.story, self.socket_path, self.context = story, socket_path, context

    def expect_locked_hook_answer(self, body: object, text: str) -> None:
        with self.context.hook_database.used(QueuePriority.MAIN_AGENT_HOOK, LOCKED_HOOK_WAIT_SECONDS):
            self.expect_hook_answer("/hook", body, 200, text)

    def post_hook_disconnect(self, body: dict[str, object]) -> None:
        """Holds the hook in the queue until its client has closed, after the server took the connection, as a
        hook that gave up at its limit does, and waits until the server has answered it."""
        data = json.dumps(body).encode()
        finished = Event()
        dropped_answer = HookEndpoint.answer_lost

        def drop_record(endpoint, reply):
            try:
                dropped_answer(endpoint, reply)
            finally:
                finished.set()

        with patch.object(HookEndpoint, "answer_lost", drop_record):
            with self.context.hook_database.used(QueuePriority.MAIN_AGENT_HOOK, LOCKED_HOOK_WAIT_SECONDS), socket.socket(socket.AF_UNIX) as connection:
                connection.connect(str(self.socket_path))
                connection.sendall(f"POST /hook HTTP/1.1\r\nHost: journal\r\nContent-Length: {len(data)}\r\nConnection: close\r\n\r\n".encode() + data)
                queue = self.context.hook_database.queue
                with queue.changed:
                    assert queue.changed.wait_for(lambda: bool(queue.waiting_hooks), TIMEOUT_SECONDS)
            assert finished.wait(TIMEOUT_SECONDS), f"the server never completed the lost hook {body['firing']}"

    def expect_hook_line_soon(self, text: str, firing: str) -> None:
        body = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use", session="s-1", environment="main", firing=firing, role="main").body
        answer = request_answer(self.socket_path, "POST", "/hook", dict(body))
        assert text in answer.text, answer.text

    def hook_decision(self, body: dict[str, object], headers: dict[str, str]) -> tuple[object, object]:
        reply = request_answer(self.socket_path, "POST", "/hook?program=claude", body, headers).json()
        assert isinstance(reply, dict), reply
        return reply["refusal"], reply["lines"]

    def viewer_key(self, login_name: str) -> str:
        return self.login_key({"USER": login_name})

    def login_key(self, variables: dict[str, str]) -> str:
        answer = request_answer(self.socket_path, "POST", "/viewer/key", {"variables": variables, "folder": "/"}).json()
        assert isinstance(answer, dict) and isinstance(answer.get("key"), str), answer
        return answer["key"]

    def expect_viewer_key_environment(self, login_name: str, folder: str, environment: str) -> str:
        answer = request_answer(self.socket_path, "POST", "/viewer/key", {"variables": {"USER": login_name}, "folder": folder}).json()
        assert isinstance(answer, dict) and answer.get("environment") == environment, answer
        assert isinstance(answer["key"], str) and answer["key"], answer
        return answer["key"]

    def expect_viewer_key_refusal(self, body: object, status: int, text: str) -> None:
        answer = request_answer(self.socket_path, "POST", "/viewer/key", body)
        assert answer.status == status and text in answer.text, answer

    def cookie_name(self, base: str) -> str:
        return self.context.viewer.login.cookie_name(base)

    def viewer_port(self) -> int:
        answer = request_answer(self.socket_path, "GET", "/health").json()
        assert isinstance(answer, dict) and isinstance(answer["viewer_port"], int), answer
        return answer["viewer_port"]

    def expect_viewer_login(self, key: str) -> str:
        status, headers, _ = viewer_answer(self.viewer_port(), f"/?key={key}", "", "")
        cookie = headers.get("Set-Cookie", "")
        assert status == 303 and "HttpOnly" in cookie and "SameSite=Strict" in cookie, (status, headers)
        return cookie.split(";", 1)[0]

    def expect_viewer_login_target(self, key: str, query: str, location: str) -> None:
        self.expect_viewer_redirect(f"/?key={key}{query}", "", location)

    def expect_viewer_redirect(self, path: str, cookie: str, location: str) -> None:
        status, headers, _ = viewer_answer(self.viewer_port(), path, cookie, "")
        assert status == 303 and headers.get("Location") == location, (status, headers)

    def viewer_upload(self, path: str, cookie: str, data: bytes) -> tuple[int, str]:
        connection = http.client.HTTPConnection("127.0.0.1", self.viewer_port(), timeout=TIMEOUT_SECONDS)
        try:
            connection.request("POST", path, body=data, headers={"Host": f"127.0.0.1:{self.viewer_port()}", "Cookie": cookie, "Content-Type": "application/octet-stream"})
            response = connection.getresponse()
            return response.status, response.read().decode(errors="replace")
        finally:
            connection.close()

    def viewer_download(self, path: str, cookie: str) -> tuple[int, bytes, str]:
        connection = http.client.HTTPConnection("127.0.0.1", self.viewer_port(), timeout=TIMEOUT_SECONDS)
        try:
            connection.request("GET", path, headers={"Host": f"127.0.0.1:{self.viewer_port()}", **({"Cookie": cookie} if cookie else {})})
            response = connection.getresponse()
            return response.status, response.read(), response.getheader("Content-Type") or ""
        finally:
            connection.close()

    def expect_viewer_status(self, path: str, status: int, cookie: str = "", host: str = "", text: str = "") -> None:
        answered, headers, body = viewer_answer(self.viewer_port(), path, cookie, host)
        assert answered == status and text in body, (answered, headers, body)

    def expect_viewer_headers(self, path: str, cookie: str, headers: dict[str, str]) -> None:
        status, answered, _ = viewer_answer(self.viewer_port(), path, cookie, "")
        assert status == 200 and all(value in answered.get(name, "") for name, value in headers.items()), (status, answered)

    def expect_viewer_line(self, cookie: str, body: dict[str, object], status: int, text: str) -> None:
        answered, headers, answer = viewer_answer(self.viewer_port(), "/api/line", cookie, "", body)
        assert answered == status and text in answer, (answered, headers, answer)

    def viewer_line_value(self, cookie: str, body: dict[str, object]) -> dict[str, object]:
        self.story.steps.append(f"viewer line {json.dumps(body, sort_keys=True)}")
        status, _, answer = viewer_answer(self.viewer_port(), "/api/line", cookie, "", body)
        answered = json.loads(answer)
        assert status == 200 and answered["code"] == 0, (status, answer)
        return answered["value"]

    def expect_phone_paired(self, code: str) -> str:
        status, headers, body = viewer_answer(self.viewer_port(), "/viewer/pair", "", "", {"code": code})
        cookie = headers.get("Set-Cookie", "")
        assert status == 200 and "HttpOnly" in cookie and "SameSite=Strict" in cookie, (status, headers, body)
        return cookie.split(";", 1)[0]

    def expect_pairing_refusal(self, code: str, text: str) -> None:
        status, headers, body = viewer_answer(self.viewer_port(), "/viewer/pair", "", "", {"code": code})
        assert status == 400 and text in body and "Set-Cookie" not in headers, (status, headers, body)

    def viewer_event_ids(self, cookie: str, cursor_id: int, count: int) -> list[int]:
        port = self.viewer_port()
        connection = http.client.HTTPConnection("127.0.0.1", port, timeout=TIMEOUT_SECONDS)
        try:
            connection.request("GET", f"/api/events?cursor={cursor_id}&environment=main", headers={"Host": f"127.0.0.1:{port}", "Cookie": cookie})
            response = connection.getresponse()
            ids: list[int] = []
            while len(ids) < count:
                line = response.readline().decode()
                if line.startswith("id: "):
                    ids.append(int(line[4:]))
            return ids
        finally:
            connection.close()

    def expect_viewer_event_ids(self, cookie: str, cursor_id: int, count: int, ids: list[int]) -> None:
        assert self.viewer_event_ids(cookie, cursor_id, count) == ids

    @contextmanager
    def viewer_stream(self, cookie: str, cursor_id: int, patterns: list[str]):
        port = self.viewer_port()
        follows = [("follow", pattern) for pattern in patterns] or [("follow", "")]
        query = urlencode([("cursor", str(cursor_id)), ("environment", "main"), *follows])
        connection = http.client.HTTPConnection("127.0.0.1", port, timeout=TIMEOUT_SECONDS)
        try:
            connection.request("GET", f"/api/events?{query}", headers={"Host": f"127.0.0.1:{port}", "Cookie": cookie})
            response = connection.getresponse()
            assert response.status == 200, response.status
            yield response
        finally:
            connection.close()

    def expect_health(self) -> None:
        answer = request_answer(self.socket_path, "GET", "/health")
        health = answer.json()
        assert answer.status == 200 and isinstance(health, dict), answer
        assert (health["status"], health["pid"], health["code_version"]) == ("ok", os.getpid(), answer.code_version) and health["started_at"], answer

    def expect_direct_run_answer(self, line: str, folder: str = "/") -> None:
        direct = self.story.run(line)
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "variables": {}, "folder": folder})
        assert (answer.status, answer.exit_code, answer.text) == (200, direct.code, direct.output_text), (answer, direct)

    def expect_cli_exit(self, line: str, folder: str, code: int, text: str) -> None:
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": folder})
        assert answer.exit_code == code and text in answer.text, answer

    def expect_atomic_writes(self, lines: list[str]) -> None:
        with ThreadPoolExecutor(len(lines)) as pool:
            answers = list(pool.map(lambda line: request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": "/"}), lines))
        assert all(answer.exit_code == 0 for answer in answers), answers

    def expect_busy_timeout(self, seconds: float) -> None:
        idle_thread = ListenerThread(lambda: None, lambda error: None)
        assert CliEndpoint(self.story.home, ListenerWake(idle_thread), ReportedFindings()).line_run.busy_timeout_seconds == seconds

    def expect_stale_answer_released_files(self, line: str, task_listing: LineOutcome) -> None:
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": "/"})
        assert answer.status == 409 and "newer code" in answer.text, answer
        assert self.story.run("task list --environment main").output_text == task_listing.output_text
        files = ServerFiles(self.story.home)
        assert not self.socket_path.exists() and not files.pid_file.exists() and files.acquire_lock(), "the stale server still holds its files"
        files.release_lock()

    def expect_stop(self) -> None:
        answer = request_answer(self.socket_path, "POST", "/stop", None)
        assert answer.status == 200 and answer.json() == {"status": "stopping"}, answer

    def expect_raw_request_error(self, raw_request: bytes, error_name: str) -> None:
        answer = read_answer(raw_answer(self.socket_path, raw_request))
        assert answer.status == 500 and error_name in answer.text and answer.text.count("\n") <= 1, answer
        assert "Traceback" in ServerFiles(self.story.home).log.read_text()

    def expect_deadline_rollback(self, line: str, check_line: str, absent_line: str) -> None:
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": "/", "deadline_seconds": 0})
        assert answer.exit_code == ERROR_CODE and "deadline passed" in answer.text, answer
        assert absent_line not in self.story.run(check_line).output_text.splitlines(), self.story.run(check_line).output_text

    def run_as(self, line: str, session: str) -> ServerAnswer:
        return request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "variables": {"JOURNAL_AGENT_SESSION": session}, "folder": "/"})

    def expect_eventually(self, line: str, expected_line: str) -> None:
        deadline = time.monotonic() + TIMEOUT_SECONDS
        while time.monotonic() < deadline:
            if expected_line in self.story.run(line).output_text.splitlines():
                return
        raise AssertionError(f"{line} never printed {expected_line!r}: {self.story.run(line).output_text}")

    def expect_line(self, line: str, expected_line: str) -> None:
        assert expected_line in self.story.run(line).output_text.splitlines(), self.story.run(line).output_text

    def expect_hook_answer(self, route: str, body: object, status: int, text: str, headers: dict[str, str] | None = None) -> None:
        answer = request_answer(self.socket_path, "POST", route, body, headers or {})
        assert answer.status == status and (text in answer.text if text else answer.text == ""), answer

    def expect_status(self, method: str, route: str, body: object, status: int) -> None:
        answer = request_answer(self.socket_path, method, route, body)
        assert answer.status == status, answer

    def expect_answer_with_unwritable_timing_log(self, line: str) -> None:
        TimingLog(self.story.home).path.mkdir(parents=True)
        self.post_timed_line(line, "go_start=1")
        assert "timing line not written" in ServerFiles(self.story.home).log.read_text()

    def post_repeated_health(self) -> None:
        first_request, last_request = b"GET /health HTTP/1.1\r\nHost: journal\r\n\r\n", b"GET /health HTTP/1.1\r\nHost: journal\r\nConnection: close\r\n\r\n"
        assert raw_answer(self.socket_path, first_request + last_request).count(b"HTTP/1.1 200") == 2

    def post_timed_line(self, line: str, timing_text: str) -> None:
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": "/"}, {TIMING_HEADER: timing_text})
        assert answer.exit_code == 0, answer


def expect_timing_report_steps(home: JournalHome, route_line: str, steps: list[str]) -> None:
    rows = report(logged_timings(TimingLog(home).path.read_text().splitlines())).splitlines()
    assert rows[0] == f"{route_line}  (1 requests)" and [row.split("  ")[1].strip() for row in rows[2:]] == steps, rows


def expect_timing_lines(home: JournalHome, lines: list[tuple[str, list[str]]]) -> None:
    log_lines = [json.loads(line) for line in TimingLog(home).path.read_text().splitlines()]
    assert [(line["request_id"], [name for name, _ in Timing.parsed(line["timing"]).stamps]) for line in log_lines] == lines, log_lines


def without_start_skills(story: Story) -> None:
    story.run("setting make journal.core.skills.session-start '[]'")
    story.run_listeners()
    for row in tuple(story.container.get(Queries).query(AgentSkill).all_rows()):
        story.expect_success(f"agent-skill delete {row.id}")


ViewerFactory = Callable[[ViewerLogin, ViewerRoutes], ViewerEndpoint]


def local_viewer(login: ViewerLogin, routes: ViewerRoutes) -> ViewerEndpoint:
    return ViewerListener(login, routes)


@contextmanager
def server_story(story: Story, code_folders: CodeFolders | None = None, listener_thread_started: bool = True, viewer_factory: ViewerFactory = local_viewer, journal_door: JournalDoor = LocalJournalDoor()):
    without_start_skills(story)
    story.run("setting make journal.core.voices.avatar false")
    with started_server(story.home, code_folders, listener_thread_started, viewer_factory, journal_door, story.clock) as (socket_path, context):
        yield ServerStory(story, socket_path, context)


@contextmanager
def started_server(home: JournalHome, code_folders: CodeFolders | None = None, listener_thread_started: bool = True, viewer_factory: ViewerFactory = local_viewer, journal_door: JournalDoor = LocalJournalDoor(), clock: Clock = SYSTEM_CLOCK):
    with running_server(home, code_folders, listener_thread_started, viewer_factory, journal_door, clock) as (_, socket_path, context):
        yield socket_path, context


@contextmanager
def running_server(home: JournalHome, code_folders: CodeFolders | None = None, listener_thread_started: bool = True, viewer_factory: ViewerFactory = local_viewer, journal_door: JournalDoor = LocalJournalDoor(), clock: Clock = SYSTEM_CLOCK):
    with patch.object(ProcessTable, "rows", FixedProcessTable([]).rows):
        files = ServerFiles(home)
        assert files.acquire_lock(), "a server already holds the lock of this journal"
        files.clear_leftover_socket()
        hook_database = HookDatabase(home, STORY_RUNNING_HOOKS_COUNT)
        listener_round = JournalRound(home, "listener thread", ListenerWork(), queue=hook_database.queue)
        listener_thread = ListenerThread(listener_round.run, listener_round.report)
        phones = PhoneSessions(home, listener_thread)
        login = ViewerLogin(phones, ShareSessions(phones.journal_output, clock))
        reported = ReportedFindings()
        context = ServerContext(home, CodeVersion(CodeFingerprint(), code_folders or CodeFolders(ModuleFinder(home))), files, clock.timestamp(), listener_thread,
                                hook_database, viewer_factory(login, ViewerRoutes(home, listener_thread, login, reported, hook_database.queue, clock)), ServerTunnel(home), reported, journal_door, STORY_HOOK_LIMIT_SECONDS, STORY_HOOK_LIMIT_SECONDS)
        context.request_log.refresh(synced_database_container(home, hook_database.databases[0]))
        context.viewer.routes.line_route = StoryLineRoute(home, listener_thread, reported, completion_callback=context.request_log.completed)
        context.viewer.routes.line_route.line_run.request_queue = hook_database.queue
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
            context.request_log.close()
            context.hook_database.close()
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


def expect_equal_answers(raw: tuple[object, object], prepared: tuple[object, object]) -> None:
    assert raw[0] == prepared[0], f"the raw body was refused {raw[0]!r} and the prepared object {prepared[0]!r}"


def viewer_answer(port: int, path: str, cookie: str, host: str, body: dict[str, object] | None = None) -> tuple[int, dict[str, str], str]:
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=TIMEOUT_SECONDS)
    headers = {"Host": host or f"127.0.0.1:{port}", **({"Cookie": cookie} if cookie else {})}
    try:
        connection.request("GET" if body is None else "POST", path, body=None if body is None else json.dumps(body), headers=headers)
        response = connection.getresponse()
        return response.status, dict(response.getheaders()), response.read().decode(errors="replace")
    finally:
        connection.close()

