import json
from datetime import datetime, timezone
import os
import shlex
import socket
import time
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from threading import Thread

from core.base.cli.console import ERROR_CODE
from core.base.journal_home import JournalHome
from server.endpoints.cli_endpoint import CliEndpoint
from core.base.timestamp import Timestamp
from core.base.trail import TRAIL_HEADER, Trail
from core.base.trail_log import TrailLog
from core.testing.story import Story
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from server.code_version import CodeFolders, CodeVersion
from server.journal_server import DRAIN_LIMIT_SECONDS, JournalServer, ServerContext
from server.listener_thread import ListenerRound, ListenerThread, ListenerWake
from server.request_handler import EXIT_CODE_TRAILER, RequestHandler
from server.server_files import ServerFiles

TIMEOUT_SECONDS = 10
POLL_SECONDS = 0.05


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

    def __init__(self, story: Story, socket_path: Path) -> None:
        self.story, self.socket_path = story, socket_path

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

    def expect_writes_at_once(self, lines: list[str]) -> None:
        with ThreadPoolExecutor(len(lines)) as pool:
            answers = list(pool.map(lambda line: request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": "/"}), lines))
        assert all(answer.exit_code == 0 for answer in answers), answers

    def expect_busy_timeout(self, seconds: float) -> None:
        idle_thread = ListenerThread(lambda: None, lambda error: None)
        assert CliEndpoint(self.story.home, ListenerWake(idle_thread)).line_run.busy_timeout_seconds == seconds

    def expect_stale_answer_and_released_files(self, line: str) -> None:
        first_task_list = self.story.run("task list --environment main").output_text
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": "/"})
        assert answer.status == 409 and "newer code" in answer.text, answer
        assert self.story.run("task list --environment main").output_text == first_task_list
        files = ServerFiles(self.story.home)
        assert not self.socket_path.exists() and not files.pid_file.exists() and files.acquire_lock(), "the stale server still holds its files"
        files.release_lock()

    def expect_stop(self) -> None:
        answer = request_answer(self.socket_path, "POST", "/stop", None)
        assert answer.status == 200 and answer.json() == {"status": "stopping"}, answer

    def expect_raw_request_error(self, raw_request: bytes, error_name: str) -> None:
        answer = answer_from(raw_answer(self.socket_path, raw_request))
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
            time.sleep(POLL_SECONDS)
        raise AssertionError(f"{line} never printed {expected_line!r}: {self.story.run(line).output_text}")

    def expect_line(self, line: str, expected_line: str) -> None:
        assert expected_line in self.story.run(line).output_text.splitlines(), self.story.run(line).output_text

    def expect_hook_answer(self, route: str, body: object, status: int, text: str, headers: dict[str, str] | None = None) -> None:
        answer = request_answer(self.socket_path, "POST", route, body, headers or {})
        assert answer.status == status and (text in answer.text if text else answer.text == ""), answer

    def expect_status(self, method: str, route: str, body: object, status: int) -> None:
        answer = request_answer(self.socket_path, method, route, body)
        assert answer.status == status, answer

    def expect_answer_with_unwritable_trail_log(self, line: str) -> None:
        TrailLog(self.story.home).path.mkdir(parents=True)
        self.send_with_trail(line, "go_start=1")
        assert "trail line not written" in ServerFiles(self.story.home).log.read_text()

    def send_with_trail(self, line: str, trail_text: str) -> None:
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": "/"}, {TRAIL_HEADER: trail_text})
        assert answer.exit_code == 0, answer


def expect_trail_names(home: JournalHome, names: list[list[str]]) -> None:
    lines = [json.loads(line) for line in TrailLog(home).path.read_text().splitlines()]
    assert [[name for name, _ in Trail.parsed(line["trail"]).stamps] for line in lines] == names, lines


@contextmanager
def server_story(story: Story, code_folders: CodeFolders | None = None, listener_thread_started: bool = True):
    with started_server(story.home, code_folders, listener_thread_started) as socket_path:
        yield ServerStory(story, socket_path)


@contextmanager
def started_server(home: JournalHome, code_folders: CodeFolders | None = None, listener_thread_started: bool = True):
    files = ServerFiles(home)
    assert files.acquire_lock(), "a server already holds the lock of this journal"
    files.clear_leftover_socket()
    listener_round = ListenerRound(home)
    listener_thread = ListenerThread(listener_round.run, listener_round.report)
    context = ServerContext(home, CodeVersion(CodeFingerprint(), code_folders or CodeFolders(ModuleFinder(home))), files, Timestamp(datetime.now(timezone.utc)), listener_thread)
    server = JournalServer(str(files.socket), RequestHandler, context)
    if listener_thread_started:
        listener_thread.start()
    files.write_pid()
    thread = Thread(target=server.serve_requests, daemon=True)
    thread.start()
    try:
        yield files.socket
    finally:
        listener_thread.stop()
        server.request_stop()
        thread.join(TIMEOUT_SECONDS)
        server.drain(DRAIN_LIMIT_SECONDS)
        files.remove_server_files()
        server.server_close()
        files.release_lock()


def request_answer(socket_path: Path, method: str, route: str, body: object = None, headers: dict[str, str] | None = None) -> ServerAnswer:
    data = json.dumps(body).encode() if body is not None else b""
    header_lines = "".join(f"{name}: {value}\r\n" for name, value in (headers or {}).items())
    head = f"{method} {route} HTTP/1.1\r\nHost: journal\r\n{header_lines}Content-Length: {len(data)}\r\nConnection: close\r\n\r\n".encode()
    return answer_from(raw_answer(socket_path, head + data))


def raw_answer(socket_path: Path, raw_request: bytes) -> bytes:
    with socket.socket(socket.AF_UNIX) as connection:
        connection.settimeout(TIMEOUT_SECONDS)
        connection.connect(str(socket_path))
        connection.sendall(raw_request)
        raw = b""
        while received := connection.recv(65536):
            raw += received
    return raw


def answer_from(raw: bytes) -> ServerAnswer:
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
