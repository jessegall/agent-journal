import json
from datetime import datetime, timezone
import os
import shlex
import socket
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from threading import Thread

from core.base.journal_home import JournalHome
from server.endpoints.cli_endpoint import CliEndpoint
from core.base.timestamp import Timestamp
from core.testing.story import Story
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from server.code_version import CodeFolders, CodeVersion
from server.journal_server import DRAIN_LIMIT_SECONDS, JournalServer, ServerContext
from server.request_handler import EXIT_CODE_TRAILER, RequestHandler
from server.server_files import ServerFiles

TIMEOUT_SECONDS = 10


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
        assert CliEndpoint(self.story.home).line_run.busy_timeout_seconds == seconds

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

    def expect_status(self, method: str, route: str, body: object, status: int) -> None:
        answer = request_answer(self.socket_path, method, route, body)
        assert answer.status == status, answer


@contextmanager
def server_story(story: Story, code_folders: CodeFolders | None = None):
    with started_server(story.home, code_folders) as socket_path:
        yield ServerStory(story, socket_path)


@contextmanager
def started_server(home: JournalHome, code_folders: CodeFolders | None = None):
    files = ServerFiles(home)
    assert files.acquire_lock(), "a server already holds the lock of this journal"
    files.clear_leftover_socket()
    server = JournalServer(str(files.socket), RequestHandler, ServerContext(home, CodeVersion(CodeFingerprint(), code_folders or CodeFolders(ModuleFinder(home))), files, Timestamp(datetime.now(timezone.utc))))
    files.write_pid()
    thread = Thread(target=server.serve_requests, daemon=True)
    thread.start()
    try:
        yield files.socket
    finally:
        server.request_stop()
        thread.join(TIMEOUT_SECONDS)
        server.drain(DRAIN_LIMIT_SECONDS)
        files.remove_server_files()
        server.server_close()
        files.release_lock()


def request_answer(socket_path: Path, method: str, route: str, body: object = None) -> ServerAnswer:
    data = json.dumps(body).encode() if body is not None else b""
    with socket.socket(socket.AF_UNIX) as connection:
        connection.settimeout(TIMEOUT_SECONDS)
        connection.connect(str(socket_path))
        connection.sendall(f"{method} {route} HTTP/1.1\r\nHost: journal\r\nContent-Length: {len(data)}\r\nConnection: close\r\n\r\n".encode() + data)
        raw = b""
        while received := connection.recv(65536):
            raw += received
    return answer_from(raw)


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
